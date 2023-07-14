<?php


namespace App\Extended;


use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\UrlWindow;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class CustomLengthAwarePaginator extends LengthAwarePaginator
{
    /**
     * Get the URL for a given page number.
     * Overwrited parent class method
     *
     *
     * @param  int  $page
     * @return string
     */
    public function url($page)
    {
        if ($page <= 0) {
            $page = 1;
        }

        $parameters = request()->query();

        if (count($this->query) > 0) {
            $parameters = array_merge($this->query, $parameters);
        }

        $path = $this->path();
        if (preg_match('|^(.+?)(/page/)([0-9]+)|i', $path)) {
            $path =  preg_replace('|^(.+?)(/page/)([0-9]+)|i', '${1}${2}'.$page, $path);
        } else {
            $path =  preg_replace(['|^([^?]+)([^/])$|i', '|^([^?]+)([/])$|i'], ['${1}${2}/page/'.$page, '${1}${2}page/'.$page], $path);
        }

        if($parameters) {
            $path .= (Str::contains($this->path, '?') ? '&' : '?') . Arr::query($parameters);
        }

        $path .= $this->buildFragment();

        return $path;
    }
}