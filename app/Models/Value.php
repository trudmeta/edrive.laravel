<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Value extends BaseModel
{
    use HasFactory;

    protected $fillable = ['title', 'alias', 'attribute_id'];

    public function attribute(): BelongsTo
    {
        return $this->BelongsTo(Attribute::class);
    }

    public function car(): BelongsTo
    {
        return $this->BelongsTo(Car::class);
    }


    protected static function boot()
    {
        parent::boot();

        static::deleted(function(Model $model) {

            self::updateCacheArray();

        });
    }
}
