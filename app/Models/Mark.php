<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class Mark extends BaseModel
{
    use HasFactory;

    protected $fillable = ['title', 'alias', 'status'];

    public function carModels(): HasMany
    {
        return $this->HasMany(CarModel::class);
    }

    public function cars(): HasManyThrough
    {
        return $this->hasManyThrough(Car::class, CarModel::class, 'mark_id', 'model_id', 'id', 'id');
    }

    public function car(): HasOneThrough
    {
        return $this->HasOneThrough(Car::class, CarModel::class, 'mark_id', 'model_id', 'id', 'id');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }


    protected static function boot()
    {
        parent::boot();

        static::deleted(function(Model $model) {

            self::updateCacheArray();
            static::updateCache($model);

        });

        static::saved(function(Model $model) {

            self::updateCacheArray();
            static::updateCache($model);

        });
    }

    private static function updateCache(Model $model)
    {
        Cache::forget(Category::CATEGORIES);
        Category::getCategories();
    }
}
