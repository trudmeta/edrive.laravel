<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute as CastsAttribute;

class Feedback extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'email', 'phone', 'message', 'data', 'visitor', 'status'];

    protected function data(): CastsAttribute
    {
        return CastsAttribute::make(
            get: fn ($value) => json_decode($value, true),
            set: fn ($value) => json_encode($value),
        );
    }
}
