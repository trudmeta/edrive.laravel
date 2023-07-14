<?php


namespace App\Traits;

use Illuminate\Pagination\Paginator;


Trait PaginateTrait
{
    public static function scopePaginateUri($query, $items, $page)
    {
        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });

        return $query->paginate($items);
    }
}