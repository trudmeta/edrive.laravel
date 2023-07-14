<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use function PHPUnit\Framework\isNan;
use function PHPUnit\Framework\isNull;

class Pagination
{
    /**
     * Setting up pagination.
     * Removes some controller parameters
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $route = $request->route();
        $parameters = $route->parameters();

        if (array_key_exists('page', $parameters) && array_key_exists('pageN', $parameters)) {
            $route->forgetParameter('page');
        }

        return $next($request);
    }
}
