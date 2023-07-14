<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\PageRequest;
use App\Models\Page;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

class PageController extends Controller
{
    public function __construct()
    {
        $this->models = 'pages';
        $this->model = 'page';
        $this->eloquentModel = Page::class;
        parent::__construct();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $models = $this->models;

        //Check if pages exist for all routes site.page.*
        $routes = collect(Route::getRoutes())->map(function ($route) {
            return $route->named('site.page.*')? $route->getName() : false;
        })->filter()->values();
        $pageRoutes = Page::pluck('route');

        if ($diffRoutes = $routes->diff($pageRoutes)->toArray()) {

            foreach ($diffRoutes as $route) {
                $title = Str::replaceFirst('site.page.','', $route);
                $alias = $title;
                $pages[] = [
                    'title' => $title,
                    'alias' => $alias,
                    'h1' => $title,
                    'route' => $route,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            Page::insert($pages);
        }


        $$models = Page::paginate(settings('backend_per_page'));

        return view("backend.$models.index", compact("$models"));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $models = $this->models;
        $model = $this->model;
        $$model = Page::with('sections')->findOrFail($id);

        return view("backend.$models.show", compact("$model"));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $models = $this->models;
        $model = $this->model;
        $$model = Page::with(['sections.images', 'sections.sections'])->findOrFail($id);

        return view("backend.$models.edit", compact("$model"));
    }

    /**
     * Update the specified resource in storage.
     * @param PageRequest $request
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(PageRequest $request, string $id)
    {
        $model = Page::findOrFail($id);
        $model->update($request->all());

        if ($request->has('sections')) {
            $sections = $request->input('sections');
            $ids = collect($sections)->keys()->whereNotNull();
            $model->sections()->whereNotIn('id', $ids)->delete();

            $index = 0;
            foreach ($sections as $id => $section) {
                if ($section['pageable_type'] == Page::class) {
                    //relation page.sections
                    $model->sections()->updateOrCreate(['id' => $section['id']], $section);

                } elseif ($section['pageable_type'] == Section::class) {
                    //relation sections.sections
                    $parentSection = Section::findOrFail($section['pageable_id']);
                    $parentSection->sections()->updateOrCreate(['id' => $section['id']], $section);
                }
                $index++;
                if ($index == count($sections)) {
                    Event::dispatch('page.updated', $model);
                }
            }
        }

        return back();
    }
}
