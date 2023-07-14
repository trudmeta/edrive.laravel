<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Attribute extends BaseModel
{
    use HasFactory;

    const TYPES = ['usual', 'multiselect'];

    protected $fillable = ['title', 'alias', 'type', 'status'];

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function values(): HasMany
    {
        return $this->HasMany(Value::class);
    }


    protected static function boot()
    {
        parent::boot();

        static::deleted(function(Model $model) {

            self::updateCacheArray();

        });
    }
}
