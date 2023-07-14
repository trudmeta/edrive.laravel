<?php

namespace App\Models;

use App\Models\Scopes\StatusScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class BaseModel extends Model
{
    use HasFactory;

    protected static function booted(): void
    {
        if (!app('isAdminPanel')) {
            static::addGlobalScope(new StatusScope());
        }
    }

    /**
     * Clear all cache from siteCacheArray created by carService,
     * that has a prefix 'site.*, car.*' (pagination, count marks, single car)
     */
    public static function updateCacheArray()
    {
        //siteCacheArray created in EventServiceProvider
        $siteCacheArray = cache('siteCacheArray') ?? [];
        foreach ($siteCacheArray as $key => $cache) {
            if (cache()->has($cache) && (Str::startsWith($cache, 'site.') || Str::startsWith($cache, 'car.'))) {
                cache()->forget($cache);
                unset($siteCacheArray[$key]);
            }
        }
        cache(['siteCacheArray' => $siteCacheArray]);
    }
}
