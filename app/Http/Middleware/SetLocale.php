<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (! session()->has('locale')) {
            session()->put('locale', config('app.locale'));
        }

        app()->setLocale(session()->get('locale'));

        return $next($request);
    }
}
