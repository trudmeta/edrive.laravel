<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CarModel extends BaseModel
{
    use HasFactory;

    protected $table = 'car_models';

    protected $fillable = ['title', 'alias', 'mark_id', 'status'];

    public function mark(): BelongsTo
    {
        return $this->BelongsTo(Mark::class);
    }

    public function cars(): hasMany
    {
        return $this->hasMany(Car::class, 'model_id');
    }
}
