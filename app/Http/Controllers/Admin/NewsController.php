<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\NewsRequest;
use App\Models\Image;
use App\Models\News;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function __construct()
    {
        $this->models = 'news';
        $this->model = 'new';
        $this->eloquentModel = News::class;
        parent::__construct();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $models = $this->models;
        $$models = News::withCount('visitors')->paginate(settings('backend_per_page'));

        return view("backend.$models.index", compact("$models"));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $models = $this->models;

        return view("backend.$models.create");
    }

    /**
     * Store a newly created resource in storage.
     * @param NewsRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(NewsRequest $request)
    {
        $models = $this->models;
        $model = News::create($request->all());

        if ($request->has('imagesUrl')) {
            $images = [];
            foreach ($request->input('imagesUrl') as $imageUrl) {
                $url = trim(parse_url($imageUrl, PHP_URL_PATH), '/');
                $images[] = Image::firstOrCreate(['url' => $url]);
            }
            if (count($images) >= 1 && $images[0] instanceof Model) {
                $model->image()->associate($images[0])->save();
            }
        }

        return redirect()->route("backend.$models.edit", $model);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $models = $this->models;
        $model = $this->model;
        $$model = News::withCount('visitors')->findOrFail($id);

        return view("backend.$models.show", compact("$model"));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $models = $this->models;
        $model = $this->model;
        $$model = News::with('image')->findOrFail($id);

        return view("backend.$models.edit", compact("$model"));
    }

    /**
     * Update the specified resource in storage.
     * @param NewsRequest $request
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(NewsRequest $request, string $id)
    {
        $model = News::findOrFail($id);
        $model->update($request->all());

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $models = $this->models;

        $model = News::findOrFail($id);
        $model->delete();

        return redirect("admin/$models");
    }
}
