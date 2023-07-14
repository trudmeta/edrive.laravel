<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;

class Page extends BaseModel
{
    use HasFactory;

    protected $fillable = ['title', 'alias', 'h1', 'keywords', 'description'];

    public function sections(): MorphMany
    {
        return $this->morphMany(Section::class, 'pageable');
    }


    public static function updateCache(Model $model)
    {
        $name = $model->route;
        Cache::forget($name);
        Cache::rememberForever($name, function () use($model) {
            return $model->load(['sections.images', 'sections.sections']);
        });
    }

//    protected static function boot()
//    {
//        parent::boot();
//
//        static::updated(function(Model $page) {
//            $name = $page->route;
//            Cache::forget($name);
//            Cache::rememberForever($name, function () use($page) {
//                return $page->load(['sections.images', 'sections.sections']);
//            });
//        });
//    }
}
