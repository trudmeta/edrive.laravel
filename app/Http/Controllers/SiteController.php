<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Category;
use App\Models\Menu;
use App\Models\News;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

class SiteController extends Controller
{
    public function index()
    {
        return view('home', [
            'lastNews' => News::getLastNews()
        ]);
    }

    public function about()
    {
        return view('about');
    }

    public function testdrive()
    {
        return view('testdrive');
    }

    public function import()
    {
        return view('import');
    }

    public function contact()
    {
        return view('contact');
    }
}
