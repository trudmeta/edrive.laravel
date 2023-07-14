<?php

namespace App\Http\Middleware;

use App\Models\Feedback;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminPanel
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if( $request->routeIs('backend.*')) {
//            if (!Auth::check()) {
//                return redirect()->route('login');
//            }

            \Menu::make('admin_sidebar', function ($menu) {

                $menu->add('<i class="cil-car-alt"></i> '.__('Cars'), [
                    'route' => 'backend.cars.index',
                    'class' => 'nav-item',
                ])
                    ->data([
                        'order' => 1,
                    ])
                    ->link->attr([
                        'class' => 'nav-link',
                    ]);

                $menu->add('<i class="cil-truck"></i> '.__('Marks'), [
                    'route' => 'backend.marks.index',
                    'class' => 'nav-item',
                ])
                    ->data([
                        'order' => 2,
                    ])
                    ->link->attr([
                        'class' => 'nav-link',
                    ]);

                $menu->add('<i class="cil-truck"></i> '.__('Car models'), [
                    'route' => 'backend.carmodels.index',
                    'class' => 'nav-item',
                ])
                    ->data([
                        'order' => 3,
                    ])
                    ->link->attr([
                        'class' => 'nav-link',
                    ]);

                $menu->add('<i class="cil-view-module"></i> '.__('Categories'), [
                    'route' => 'backend.categories.index',
                    'class' => 'nav-item',
                ])
                    ->data([
                        'order' => 4,
                    ])
                    ->link->attr([
                        'class' => 'nav-link',
                    ]);

                $menu->add('<i class="cil-notes"></i> '.__('Attributes'), [
                    'route' => 'backend.attributes.index',
                    'class' => 'nav-item',
                ])
                    ->data([
                        'order' => 5,
                    ])
                    ->link->attr([
                        'class' => 'nav-link',
                    ]);

                $menu->add('<i class="cil-menu"></i> '.__('Menu'), [
                    'route' => 'backend.menus.index',
                    'class' => 'nav-item',
                ])
                    ->data([
                        'order' => 6,
                    ])
                    ->link->attr([
                        'class' => 'nav-link',
                    ]);

                $menu->add('<i class="cil-spreadsheet"></i> '.__('Pages'), [
                    'route' => 'backend.pages.index',
                    'class' => 'nav-item',
                ])
                    ->data([
                        'order' => 7,
                    ])
                    ->link->attr([
                        'class' => 'nav-link',
                    ]);

                $menu->add('<i class="cil-newspaper"></i> '.__('News'), [
                    'route' => 'backend.news.index',
                    'class' => 'nav-item',
                ])
                    ->data([
                        'order' => 8,
                    ])
                    ->link->attr([
                        'class' => 'nav-link',
                    ]);

                $count = '';
                if ($feedbackCount = Feedback::whereStatus(0)->get()->count()) {
                    $count = '<span class="feedback-count">'.$feedbackCount.'</span>';
                }
                $menu->add('<span><i class="cil-fax"></i> '.__('Feedbacks').'</span>'.$count, [
                    'route' => 'backend.feedbacks.index',
                    'class' => 'nav-item',
                ])
                    ->data([
                        'order' => 8,
                    ])
                    ->link->attr([
                        'class' => 'nav-link d-flex justify-content-between',
                    ]);

                $menu->add('<i class="cil-settings"></i> '.__('Settings'), [
                    'route' => 'backend.settings',
                    'class' => 'nav-item',
                ])
                    ->data([
                        'order' => 9,
                    ])
                    ->link->attr([
                        'class' => 'nav-link',
                    ]);


            })->sortBy('order');
        }

        return $next($request);
    }
}
