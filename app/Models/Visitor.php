<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class Visitor extends Model
{
    use HasFactory;

    protected $fillable = ['visitor', 'news_id', 'created_at'];

    public $timestamps = false;

    public function news(): BelongsTo
    {
        return $this->BelongsTo(News::class);
    }


    protected static function boot()
    {
        parent::boot();

        static::saved(function(Model $model) {

            //Number of views
            $news = News::findOrFail($model->news_id);
            $alias = $news->alias;
            $cachedNews = cache(News::NEWS) ?? collect();
            foreach ($cachedNews as $page => $newsPaginated) {
                foreach ($newsPaginated as $key => $news) {
                    if ($news->alias == $alias) {
                        unset($cachedNews[$page][$key]);
                        $news->visitors_count++;
                        $cachedNews[$page][$key] = $news;
                        Cache::forever(News::NEWS, $cachedNews);
                        return true;
                    }
                }
            }





            if ($cachedNews->count() && $cachedNews->has($news->alias)) {
                $news = $cachedNews->get($news->alias);
                $news->visitors_count++;
                $cachedNews->put($news->alias, $news);
                cache(['news' => $cachedNews]);
            }
        });
    }
}
