<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Menu extends BaseModel
{
    use HasFactory;

    protected $fillable = ['title', 'alias', 'sort', 'status'];

    const MENU = 'menu';

    public static function getMenu(): Collection
    {
        return Cache::rememberForever(self::MENU, function () {
            return Menu::whereStatus(1)
                ->latest()
                ->limit(4)->get();
        });
    }

    protected static function boot()
    {
        parent::boot();

        //$menu = Cache::rememberForever('menu' ...
        static::saved(function(Model $model) {
            Cache::forget(self::MENU);
            self::getMenu();
        });
    }
}
