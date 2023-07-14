<?php

namespace App\Http\Controllers\Admin;

use App\Models\Image;
use App\Services\CarService;
use App\Services\Helper;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\View;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    protected string $models;
    protected string $model;
    protected string $eloquentModel;

    public function __construct()
    {
        if (!empty($this->models)) {
            View::share('models', $this->models);
        }
        if (!empty($this->model)) {
            View::share('model', $this->model);
        }
        if (!empty($this->eloquentModel)) {
            View::share('eloquentModel', $this->eloquentModel);
        }
    }

    /**
     * @param $name
     * @return mixed
     */
    public function __get($name)
    {
        if ($name === 'carService') {
            return app(CarService::class);
        }
    }

    /**
     * Adds an image to the database if it is new and binds to the model
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function ajaxImageAdd(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'eloquentModel' => ['required', 'regex:/^App\\\\Models\\\\[a-zA-Z]{1,10}/i'],
            'models' => 'required|string|max:10',
            'modelId' => 'required|numeric|exists:'.$request->get('models').',id',
            'url' => 'required|url',
        ]);

        $response = ['message' => 'error'];

        $url = trim(parse_url($validated['url'], PHP_URL_PATH), '/');
        $model = $validated['eloquentModel'];

        if (class_exists($model)) {
            $$model = $model::findOrFail($validated['modelId']);
            $image = Image::firstOrCreate(['url' => $url]);

            if ($$model->addImage($image)) {
                $response = ['image' => $image];
            }

        }

        return response()->json($response);
    }

    public function ajaxImageDelete(Request $request)
    {
        $validated = $request->validate([
            'eloquentModel' => ['required', 'regex:/^App\\\\Models\\\\[a-zA-Z]{1,10}/i'],
            'models' => 'required|string|max:10',
            'modelId' => 'required|numeric|exists:'.$request->get('models').',id',
            'imageId' => 'required|numeric|exists:images,id',
        ]);

        $response = ['message' => 'error'];

        $model = $validated['eloquentModel'];

        if (class_exists($model)) {
            $$model = $model::findOrFail($validated['modelId']);
            $image = Image::findOrFail($validated['imageId']);

            if ($$model->removeImage($image)) {
                $response = ['message' => 'ok'];
            }

        }

        return response()->json($response);
    }
}
