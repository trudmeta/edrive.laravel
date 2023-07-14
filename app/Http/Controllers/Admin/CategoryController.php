<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\CategoryRequest;
use App\Models\Attribute;
use App\Models\Category;
use App\Models\Mark;
use App\Models\Section;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct()
    {
        $this->models = 'categories';
        $this->model = 'category';
        $this->eloquentModel = Category::class;
        parent::__construct();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $models = $this->models;
        $$models = Category::paginate(settings('backend_per_page'));

        return view("backend.$models.index", compact( "$models"));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $models = $this->models;
        $marks = Mark::whereStatus(1)->get();
        $attributes = Attribute::whereStatus(1)->get();

        return view("backend.$models.create", compact('marks', 'attributes'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request)
    {
        $models = $this->models;
        $model = Category::create($request->all());
        $request->has('marks') && $model->marks()->sync($request->get('marks'));
        $request->has('attributes') && $model->attributes()->sync($request->get('attributes'));
        $request->has('sections') && $model->sections()->createMany($request->get('sections'));

        return redirect()->route("backend.$models.edit", $model);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $models = $this->models;
        $model = $this->model;
        $$model = Category::with(['marks'])->findOrFail($id);

        return view("backend.$models.show", compact("$model"));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $models = $this->models;
        $model = $this->model;
        $$model = Category::with(['marks', 'attributes', 'sections'])->findOrFail($id);
        $marks = Mark::whereStatus(1)->get();
        $attributes = Attribute::whereStatus(1)->get();

        return view("backend.$models.edit", compact("$model", 'marks', 'attributes'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, string $id)
    {
        $models = $this->models;
        $category = Category::findOrFail($id);
        $category->update($request->all());
        $category->marks()->sync($request->get('marks'));
        $category->attributes()->sync($request->get('attributes'));

        if ($request->has('sections')) {
            $sections = $request->input('sections');
            $ids = collect($sections)->pluck('id')->whereNotNull();
            $category->sections()->whereNotIn('id', $ids)->delete();
            foreach ($sections as $section) {
                $category->sections()->updateOrCreate(['id' => $section['id']], $section);
            }
        }

//        return back();
        return redirect()->route("backend.$models.edit", $category->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $models = $this->models;

        $category = Category::findOrFail($id);

        if ($category->cars->count()) {
            return back()->withErrors([
                __('There are cars in this category!')
            ]);
        }

        $category->sections()->delete();
        $category->delete();

        return redirect("admin/$models");
    }
}
