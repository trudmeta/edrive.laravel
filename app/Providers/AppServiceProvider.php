<?php

namespace App\Providers;

use App\Http\Middleware\SetLocale;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if (!Str::startsWith($this->app->request->getRequestUri(), '/admin')) {
            app()->bind('isAdminPanel', function() {
                return false;
            });
            $this->app->bind(
                \Illuminate\Pagination\LengthAwarePaginator::class,
                \App\Extended\CustomLengthAwarePaginator::class
            );
        } else {
            app()->bind('isAdminPanel', function() {
                return true;
            });
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app('isAdminPanel')) {
            $kernel = $this->app->make(Kernel::class);
            $kernel->pushMiddleware(SetLocale::class);
        }

        Blade::directive('datetoday', function () {
            return "<?php echo \Carbon\Carbon::now()->isoFormat('dddd, LL'); ?>";
        });
    }
}
