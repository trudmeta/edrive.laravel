<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\SiteController;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
require __DIR__.'/auth.php';


Route::get('/', [SiteController::class, 'index'])->name('site.page.home');

Route::get('/testdrive', [SiteController::class, 'testdrive'])->name('site.page.testdrive');
Route::get('/about', [SiteController::class, 'about'])->name('site.page.about');
Route::get('/import', [SiteController::class, 'import'])->name('site.page.import');
Route::get('/news/{page?}/{pageN?}', [NewsController::class, 'news'])->name('site.page.news')
    ->whereIn('page', ['page', null])
    ->where('pageN', '[0-9]*');

Route::get('/news/{news:alias}', [NewsController::class, 'onenews'])->name('site.onenews');
Route::get('/contacts', [SiteController::class, 'contact'])->name('site.page.contact');

Route::get('/{category:alias}/{page?}/{pageN?}', [CarController::class, 'cars'])->name('site.cars')
    ->whereIn('category', ['electromobili', 'carimport'])
    ->whereIn('page', ['page', null])
    ->where('pageN', '[0-9]*');

Route::get('/{category:alias}/{available}/{page?}/{pageN?}', [CarController::class, 'carsAvailable'])->name('site.cars.available')
    ->whereIn('category', ['electromobili', 'carimport'])
    ->whereIn('available', ['available', 'notavailable'])
    ->whereIn('page', ['page', null])
    ->where('pageN', '[0-9]*');

Route::get('/{category:alias}/{mark:alias}/{page?}/{pageN?}', [CarController::class, 'carsMark'])->name('site.cars.mark')
    ->whereIn('category', ['electromobili', 'carimport'])
    ->whereIn('page', ['page', null])
    ->where('pageN', '[0-9]*');

Route::get('/{category:alias}/{mark:alias}/{available}/{page?}/{pageN?}', [CarController::class, 'carsMarkAvailable'])->name('site.cars.mark.available')
    ->whereIn('category', ['electromobili', 'carimport'])
    ->whereIn('available', ['available', 'notavailable', null])
    ->whereIn('page', ['page', null])
    ->where('pageN', '[0-9]*');

Route::get('/{category:alias}/filter/{params?}', [CarController::class, 'filter'])->name('site.cars.filter')
    ->whereIn('category', ['electromobili', 'carimport'])
    ->where('params', '.*');

Route::get('/cars/{car:alias}', [CarController::class, 'car'])->name('site.single.car');

Route::post('/ajaxFilter', [CarController::class, 'ajaxFilter'])->name('site.ajax.filter');
Route::post('/ajaxVisitors', [NewsController::class, 'ajaxVisitors'])->name('site.ajax.visitors');
Route::post('/ajaxFeedback', [Controller::class, 'ajaxFeedback'])->name('site.ajax.feedback')->middleware('throttle:ip_address');
