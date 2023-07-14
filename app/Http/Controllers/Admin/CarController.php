<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\CarRequest;
use App\Models\Attribute;
use App\Models\Car;
use App\Models\CarModel;
use App\Models\Category;
use App\Models\Image;
use App\Models\Mark;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CarController extends Controller
{
    public function __construct()
    {
        $this->models = 'cars';
        $this->model = 'car';
        $this->eloquentModel = Car::class;
        parent::__construct();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $models = $this->models;
        $$models = $this->carService->getCarsAll(['perPage' => settings('backend_per_page'), 'paginate' => true]);
        $categories = Category::whereStatus(1)->get();

        return view("backend.$models.index", compact("$models", 'categories'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $models = $this->models;
        $categories = Category::with(['attributes.values', 'marks.carModels'])->whereStatus(1)->get();

        return view("backend.$models.create", compact('categories'));
    }

    /**
     * Store a newly created resource in storage.
     * @param CarRequest $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Foundation\Application|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function store(CarRequest $request)
    {
        $models = $this->models;

        if (empty($request->input('alias'))) {
            $request->merge(['alias' => Str::slug($request->get('title'))]);
        }

        $car = Car::create($request->all());

        $car->values()->attach($request->get('values'));

        if ($request->has('imagesUrl')) {
            $images = [];
            foreach ($request->input('imagesUrl') as $imageUrl) {
                $url = trim(parse_url($imageUrl, PHP_URL_PATH), '/');
                $images[] = Image::firstOrCreate(['url' => $url]);
            }
            if ($images) {
                $car->images()->attach(collect($images)->pluck('id'), ['sort' => 0, 'created_at' => now(), 'updated_at' => now()]);
            }
        }

        return redirect()->route("backend.$models.edit", $car);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $models = $this->models;
        $model = $this->model;
        $$model = Car::with(['mark', 'carModel', 'category', 'values.attribute'])->findOrFail($id);

        return view("backend.$models.show", compact("$model"));
    }

    /**
     * Show the form for editing the specified resource.
     * @param string $id
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|\Illuminate\Foundation\Application
     */
    public function edit(string $id)
    {
        $models = $this->models;
        $model = $this->model;
        $$model = Car::with(['mark', 'carModel', 'category', 'values.attribute', 'images'])->findOrFail($id);
        $carValues = $$model->getValuesSortedAttribute();
        $categories = Category::with(['attributes.values', 'marks.carModels'])->whereStatus(1)->get();

        return view("backend.$models.edit", compact("$model", 'carValues', 'categories'));
    }

    /**
     * Update the specified resource in storage.
     * @param CarRequest $request
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(CarRequest $request, string $id)
    {
        $car = Car::findOrFail($id);
        $car->update($request->all());
        $car->values()->sync($request->get('values'));

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $models = $this->models;

        $car = Car::findOrFail($id);

        $car->images()->delete();
        $car->delete();

        return redirect("admin/$models");
    }
}
