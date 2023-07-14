<?php

namespace App\Models;

use App\Models\Contracts\ImagableInterface;
use App\Traits\PaginateTrait;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Casts\Attribute as CastsAttribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class News extends BaseModel implements ImagableInterface
{
    use HasFactory, PaginateTrait;

    protected $fillable = ['name', 'alias', 'content', 'title', 'h1', 'keywords', 'description', 'image_id', 'status', 'created_by'];

    const NEWS = 'news';

    public function image(): belongsTo
    {
        return $this->belongsTo(Image::class);
    }

    public function visitors(): HasMany
    {
        return $this->HasMany(Visitor::class);
    }

    public function author(): CastsAttribute
    {
        $user = User::findOrFail($this->created_by);

        return CastsAttribute::make(get: fn() => $user->name);
    }

    public function getMainImageAttribute()
    {
        return $this->image? $this->image->url : '/images/no-image.png';
    }

    /**
     * News from cache with pagination
     * @param int $pageN
     * @return LengthAwarePaginator
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     */
    public static function getNewsByPage(int $pageN = 1): LengthAwarePaginator
    {
        $cachedNews = cache(static::NEWS) ?? collect();
        $perPage = settings('frontend_news_per_page');
        if ($cachedNews->has($pageN) && $news = $cachedNews->get($pageN)) {
            if (($news->count() >= $perPage) ||
                ($news->count() >= 1 && $news->count() < $perPage) && $news->onLastPage()) {
                return $cachedNews->get($pageN);
            }
        }

        $news = News::with('image')
            ->withCount('visitors')
            ->latest()
            ->paginateUri(settings('frontend_news_per_page'), $pageN);

        if ($news->count()) {
            $cachedNews->put($pageN, $news);
            Cache::forever(static::NEWS, $cachedNews);
        }
        return $news;
    }

    /**
     * Gets the latest news from the cache
     * @param string|null $alias
     * @return Collection
     */
    public static function getLastNews(string $alias = null): Collection
    {
        $cachedNews = cache(static::NEWS) ?? collect();
        $news = collect($cachedNews->map->items())->flatten()->unique()->filter(function($news) use ($alias){
            if ($alias && $news->alias == $alias) return false;
            return true;
        });
        if ($news->count() >= 3) {
            return $news->sortBy('updated_by')->take(3);
        }


        $news = News::whereStatus(1)
            ->with('image')
            ->latest()
            ->when($alias, function(Builder $query) use ($alias) {
                $query->whereNot('alias', $alias);
            })
            ->limit(3)->get();

        return $news;
    }


    public function resolveRouteBinding($alias, $field = 'alias')
    {
        $cachedNews = cache(static::NEWS) ?? collect();
        $news = collect($cachedNews->map->items())->flatten()->filter(function($news) use ($alias) {
            return $news->alias == $alias;
        });
        if ($news->count()) {
            return $news->first();
        }

        return $this->with('image')->withCount('visitors')->where($field, $alias)->firstOrFail();
    }

    protected static function boot()
    {
        parent::boot();

        static::deleted(function(Model $model) {

            static::updateCache($model);

        });

        static::creating(function(Model $model) {

            if (empty($model->created_by) && auth()->check()) {
                $user = auth()->user();
                $model->created_by = $user->id;
            }

        });

        static::created(function(Model $model) {

            static::updateCache($model);

        });

        static::saving(function(Model $model) {

            $cachedNews = cache(static::NEWS) ?? collect();
            $alias = $model->alias;
            foreach ($cachedNews as $page => $newsPaginated) {
                foreach ($newsPaginated as $key => $news) {
                    if ($news->alias == $alias) {
                        unset($cachedNews[$page][$key]);
                        $model->load('image');
                        $model->loadCount('visitors');
                        $cachedNews[$page][$key] = $model;
                        Cache::forever(static::NEWS, $cachedNews);
                        return true;
                    }
                }
            }
            if (empty($model->updated_by) && auth()->check()) {
                $user = auth()->user();
                $model->updated_by = $user->id;
            }

        });
    }

    private static function updateCache(Model $model)
    {
        Cache::forget(static::NEWS);
        app()->bind(
            \Illuminate\Pagination\LengthAwarePaginator::class,
            \App\Extended\CustomLengthAwarePaginator::class
        );
        Paginator::currentPathResolver(fn () => route('site.page.news'));
        News::getNewsByPage(1);
    }

    public function addImage(Image $image): bool
    {
        if ($this->update(['image_id' => $image->id])) {
            return true;
        }
        return false;
    }

    public function removeImage(Image $image): bool
    {
        if ($this->update(['image_id' => null])) {
            return true;
        }
        return false;
    }
}
