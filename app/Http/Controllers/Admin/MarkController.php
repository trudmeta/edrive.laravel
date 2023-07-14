<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\MarkRequest;
use App\Models\Mark;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MarkController extends Controller
{
    public function __construct()
    {
        $this->models = 'marks';
        $this->model = 'mark';
        $this->eloquentModel = Mark::class;
        parent::__construct();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $models = $this->models;
        $$models = Mark::paginate(settings('backend_per_page'));

        return view("backend.$models.index", compact( "$models"));
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
     */
    public function store(Request $request)
    {
        $models = $this->models;
        $model = Mark::create($request->all());

        return redirect()->route("backend.$models.edit", $model);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $models = $this->models;
        $model = $this->model;
        $$model = Mark::with('carModels')->findOrFail($id);

        return view("backend.$models.show", compact( "$model"));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $models = $this->models;
        $model = $this->model;
        $$model = Mark::findOrFail($id);

        return view("backend.$models.edit", compact("$model"));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MarkRequest $request, string $id)
    {
        $model = Mark::findOrFail($id);
        $model->update($request->all());

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $models = $this->models;

        $mark = Mark::findOrFail($id);
        if ($mark->cars->count()) {
            return back()->withErrors("There are still cars");
        }
        $mark->carModels()->delete();
        $mark->delete();

        return redirect("admin/$models");
    }
}
