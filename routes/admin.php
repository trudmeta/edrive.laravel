<?php

use App\Http\Controllers\Admin\AttributeController;
use App\Http\Controllers\Admin\CarController;
use App\Http\Controllers\Admin\CarModelController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\Controller;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FeedbackController;
use App\Http\Controllers\Admin\MarkController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\SettingController;
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

Route::prefix('admin')->name('backend.')->group(function () {

    Route::get('/', [DashboardController::class, 'index'])->name('home');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('/cars', CarController::class);
    Route::resource('/marks', MarkController::class);
    Route::resource('/categories', CategoryController::class);
    Route::resource('/carmodels', CarModelController::class);
    Route::resource('/attributes', AttributeController::class);
    Route::resource('/menus', MenuController::class);
    Route::resource('/news', NewsController::class);
    Route::get('/settings', [SettingController::class, 'index'])->name('settings');
    Route::post('/settings', [SettingController::class, 'store'])->name('settings.store');
    Route::resource('/pages', PageController::class)->except([
        'create', 'store', 'destroy'
    ]);
    Route::resource('/feedbacks', FeedbackController::class)->only([
        'index', 'show', 'destroy'
    ]);

    Route::post('/ajaxImageAdd', [Controller::class, 'ajaxImageAdd'])->name('site.ajax.image.add');
    Route::post('/ajaxImageDelete', [Controller::class, 'ajaxImageDelete'])->name('site.ajax.image.delete');

    Route::group(['prefix' => 'laravel-filemanager', 'middleware' => ['web', 'auth']], function () {
        \UniSharp\LaravelFilemanager\Lfm::routes();
    });

});