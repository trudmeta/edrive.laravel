<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class Category extends BaseModel
{
    use HasFactory;

    protected $fillable = ['title', 'alias', 'h1', 'keywords', 'description', 'status'];
    const CATEGORIES = 'categories';
    private static $categories;

    public function cars(): HasMany
    {
        return $this->HasMany(Car::class);
    }

    public function marks(): BelongsToMany
    {
        return $this->belongsToMany(Mark::class);
    }

    public function attributes(): BelongsToMany
    {
        return $this->belongsToMany(Attribute::class);
    }

    public function sections(): MorphMany
    {
        return $this->morphMany(Section::class, 'pageable');
    }


    public static function getCategories(): Collection
    {
        self::$categories = Cache::rememberForever(Category::CATEGORIES, function() {
            return Category::with(['marks' => function (Builder $query) {
                $query->whereStatus(1);
            }, 'marks.car.images', 'sections', 'marks.carModels'])->get();
        });

        return self::$categories;
    }


    public function resolveRouteBinding($value, $field = 'alias')
    {
        return Cache::rememberForever('category.'.$field.'.'.$value, function() use ($value, $field) {
            if (self::$categories && $category = self::$categories->where($field, $value)->first()) {
                return $category;
            }
            return $this->with('sections')->where($field, $value)->firstOrFail();
        });
    }

    protected static function boot()
    {
        parent::boot();

        static::deleted(function(Model $model) {

            self::updateCacheArray();
            self::updateCache($model);

        });

        static::saved(function(Model $model) {

            self::updateCacheArray();
            self::updateCache($model);

        });
    }

    private static function updateCache(Model $model)
    {
        Cache::forget('category.alias.'.$model->alias);//resolveRouteBinding
        Cache::forget(Category::CATEGORIES);
        Category::getCategories();
    }
}
