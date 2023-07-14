<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\CarModelRequest;
use App\Models\CarModel;
use App\Models\Mark;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class CarModelController extends Controller
{
    public function __construct()
    {
        $this->models = 'carmodels';
        $this->model = 'carModel';
        $this->eloquentModel = CarModel::class;
        parent::__construct();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $models = $this->models;
        $$models = CarModel::when(!empty(request()->input('mark')) ?? false, function(Builder $query) {
            if (is_numeric(request()->input('mark'))) {
                $query->whereRelation('mark', 'id', request()->input('mark'));
            }
        })
            ->paginate(settings('backend_per_page'));
        $marks = Mark::whereStatus(1)->get();

        return view("backend.$models.index", compact("$models", 'marks'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $models = $this->models;
        $marks = Mark::whereStatus(1)->get();

        return view("backend.$models.create", compact('marks'));
    }

    /**
     * Store a newly created resource in storage.
     * @param CarModelRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(CarModelRequest $request)
    {
        $models = $this->models;
        $model = CarModel::create($request->all());

        return redirect()->route("backend.$models.edit", $model);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $models = $this->models;
        $model = $this->model;
        $$model = CarModel::with('mark')->findOrFail($id);

        return view("backend.$models.show", compact("$model"));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $models = $this->models;
        $model = $this->model;
        $$model = CarModel::with('mark')->findOrFail($id);
        $marks = Mark::whereStatus(1)->get();

        return view("backend.$models.edit", compact("$model", 'marks'));
    }

    /**
     * Update the specified resource in storage.
     * @param CarModelRequest $request
     * @param string $id
     */
    public function update(CarModelRequest $request, string $id)
    {
        $model = CarModel::findOrFail($id);
        $model->update($request->all());

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $models = $this->models;

        $model = CarModel::findOrFail($id);

        if ($model->cars->count()) {
            return back()->withErrors([
                __('There is a car with this model!')
            ]);
        }
        $model->delete();

        return redirect("admin/$models");
    }
}
