<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Image extends BaseModel
{
    use HasFactory;

    protected $fillable = ['url'];

    public function cars(): MorphToMany
    {
        return $this->morphedByMany(Car::class, 'imagable');
    }

    public function sections(): MorphToMany
    {
        return $this->morphedByMany(Section::class, 'imagable');
    }

    public function news(): hasOne
    {
        return $this->hasOne(News::class);
    }
}
