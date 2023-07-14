<?php

namespace App\Http\Controllers\Admin;

use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function __construct()
    {
        $this->models = 'feedbacks';
        $this->model = 'feedback';
        $this->eloquentModel = Feedback::class;
        parent::__construct();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $models = $this->models;
        $$models = Feedback::paginate(settings('backend_per_page'));

        return view("backend.$models.index", compact( "$models"));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $models = $this->models;
        $model = $this->model;
        $$model = Feedback::findOrFail($id);
        if (!$$model->status) {
            $$model->status = 1;
            $$model->save();
        }

        return view("backend.$models.show", compact("$model"));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $models = $this->models;

        $model = Feedback::findOrFail($id);
        $model->delete();

        return redirect("admin/$models");
    }
}
