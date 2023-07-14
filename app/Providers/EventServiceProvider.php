<?php

namespace App\Providers;

use App\Events\FeedbackEvent;
use App\Listeners\FeedbackListener;
use App\Models\Setting;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Cache\Events\KeyWritten;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        FeedbackEvent::class => [
            FeedbackListener::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        parent::boot();

        //Stores cache names for later cleanup when deleting/updating a model in a model event
        Event::listen(KeyWritten::class, function ($event) {
            if ($event->key == 'siteCacheArray') return;

            $siteCacheArray = cache('siteCacheArray') ?? [];
            if (!in_array($event->key, $siteCacheArray)) {
                $siteCacheArray[] = $event->key;
                cache(['siteCacheArray' => $siteCacheArray]);
            }
        });


        if (app('isAdminPanel')) {
            //update settings and cache
            Event::listen('settings.updated', function($model) {
                Cache::forget(Setting::SETTINGS);
                Setting::saveCache();
                $model::updateCacheArray();
            });

            //update page cache
            Event::listen('page.updated', function($model) {
                $model::updateCache($model);
            });
        }
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
