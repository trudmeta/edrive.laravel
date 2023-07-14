<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\AttributeRequest;
use App\Models\Attribute;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttributeController extends Controller
{
    public function __construct()
    {
        $this->models = 'attributes';
        $this->model = 'attribute';
        $this->eloquentModel = Attribute::class;
        parent::__construct();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $models = $this->models;
        $$models = Attribute::paginate(settings('backend_per_page'));

        return view("backend.$models.index", compact("$models"));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $models = $this->models;
        $attributeTypes = collect(Attribute::TYPES)->mapWithKeys(fn($type) => [$type => $type]);

        return view("backend.$models.create", compact('attributeTypes'));
    }

    /**
     * Store a newly created resource in storage.
     * @param AttributeRequest $request
     */
    public function store(AttributeRequest $request)
    {
        $models = $this->models;
        $model = Attribute::create($request->all());

        $values = collect($request->input('values'));

        $newValues = $values->map(function($value) {
            $val = explode('.', $value);
            return [
                'title' => $val[0],
                'alias' => $val[1],
            ];
        });

        $model->values()->createMany($newValues);

        return redirect()->route("backend.$models.edit", $model);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $models = $this->models;
        $model = $this->model;
        $$model = Attribute::with('values')->findOrFail($id);

        return view("backend.$models.show", compact("$model"));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $models = $this->models;
        $model = $this->model;
        $$model = Attribute::with('values')->findOrFail($id);
        $attributeTypes = collect(Attribute::TYPES)->mapWithKeys(fn($type) => [$type => $type]);

        return view("backend.$models.edit", compact("$model", 'attributeTypes'));
    }

    /**
     * Update the specified resource in storage.
     * @param AttributeRequest $request
     * @param string $id
     */
    public function update(AttributeRequest $request, string $id)
    {
        $models = $this->models;
        $model = Attribute::findOrFail($id);
        $model->update($request->all());

        if ($request->has('values')) {
            $values = collect($request->input('values'));
            $ids = $values->filter(fn($value) => is_numeric($value));

            $newValues = $values->diff($ids)->map(function($value) use ($model) {
                $val = explode('.', $value);
                return [
                    'title' => $val[0],
                    'alias' => $val[1],
                ];
            });
            $model->values()->whereNotIn('id', $ids)->delete();

            $model->values()->createMany($newValues);
        }

        return redirect()->route("backend.$models.edit", $model->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $models = $this->models;

        $attribute = Attribute::findOrFail($id);

        $attribute->values()->delete();
        $attribute->delete();

        return redirect("admin/$models");
    }
}
