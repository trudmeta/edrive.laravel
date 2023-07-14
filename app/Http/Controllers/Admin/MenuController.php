<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\MenuRequest;
use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function __construct()
    {
        $this->models = 'menus';
        $this->model = 'menu';
        $this->eloquentModel = Menu::class;
        parent::__construct();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $models = $this->models;
        $$models = Menu::paginate(settings('backend_per_page'));

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
     * @param MenuRequest $request
     */
    public function store(MenuRequest $request)
    {
        $models = $this->models;
        $model = Menu::create($request->all());

        return redirect()->route("backend.$models.edit", $model);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $models = $this->models;
        $model = $this->model;
        $$model = Menu::findOrFail($id);

        return view("backend.$models.show", compact("$model"));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $models = $this->models;
        $model = $this->model;
        $$model = Menu::findOrFail($id);

        return view("backend.$models.edit", compact("$model"));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $model = Menu::findOrFail($id);
        $model->update($request->all());

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $models = $this->models;

        $model = Menu::findOrFail($id);
        $model->delete();

        return redirect("admin/$models");
    }
}
