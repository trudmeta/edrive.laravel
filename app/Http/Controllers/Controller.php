<?php

namespace App\Http\Controllers;

use App\Events\FeedbackEvent;
use App\Models\Category;
use App\Models\Feedback;
use App\Models\Menu;
use App\Models\Page;
use App\Services\CarService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Str;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function __construct(protected CarService $carService)
    {
        if (app()->runningInConsole() && !app()->runningUnitTests()) return;

        $routeName = request()->route()->getName();
        View::share('routeName', $routeName);

        $path = 'css/criticals/' . Str::replaceFirst('site.', '', $routeName) . '.css';
        $criticalStyles = Storage::disk('assets')->exists($path) ?
            Storage::disk('assets')->get($path) : Storage::disk('assets')->get('css/criticals/home.css');
        View::share('criticalStyles', $criticalStyles);


        //Header menu
        $menu = Menu::getMenu();
        View::share('menus', $menu);


        $categories = Category::getCategories();
        View::share('categories', $categories);


        $this->carService->getTotal();


        //Pages (h1, keywords) with sections
        $pageSections = collect();
        if (Str::startsWith($routeName, 'site.page.')) {
            $pageSections = Cache::rememberForever($routeName, function() use ($routeName) {
                return Page::with(['sections.images', 'sections.sections'])->where('route', $routeName)->first();
            });
        }
        View::share('pageSections', $pageSections);
    }

    /**
     * Saving Feedback Messages
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function ajaxFeedback(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subject' => 'string|max:30',
            'email' => 'email',
            'name' => 'string|max:30',
            'phone' => 'string|max:25',
            'message' => 'string|max:300',
            'mark' => 'string|max:15',
            'year' => 'numeric|min:2000|max:2300',
            'budget' => 'numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->keys()
            ]);
        }

        $data = [];
        if ($request->has('name')) {
            $data['name'] = $request->input('name');
        }
        if ($request->has('email')) {
            $data['email'] = $request->input('email');
        }
        if ($request->has('phone')) {
            $data['phone'] = $request->input('phone');
        }
        if ($request->has('message')) {
            $data['message'] = htmlspecialchars($request->input('message'));
        }
        if ($request->has('subject')) {
            $data['data']['subject'] = $request->input('subject');
        }
        if ($request->has('mark')) {
            $data['data']['mark'] = $request->input('mark');
        }
        if ($request->has('year')) {
            $data['data']['year'] = $request->input('year');
        }
        if ($request->has('budget')) {
            $data['data']['budget'] = $request->input('budget');
        }
        $data['visitor'] = request()->ip();

        if ($feedback = Feedback::create($data)) {
            FeedbackEvent::dispatch($data);
        }

//        $messages = app()->make('mailer')->getSymfonyTransport()->messages();
//        if ($messages->isNotEmpty()) {
//            $message = $messages->first()->getOriginalMessage()->getHtmlBody();
//        }

        $response = [
            'message' => $feedback,
            'resetForm' => true,
            'closePopup' => true,
        ];
        if ($request->has('form') && $request->input('form') != 'header-contact' && $feedback) {
            $response['popupMessage'] = 'Message sent successfully';
        }
        return response()->json($response);
    }
}
