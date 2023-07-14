<?php

namespace Tests\Feature;

use App\Models\Car;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class SiteControllerTest extends TestCase
{
    use RefreshDatabase;

    public function setUp () :void
    {
        parent::setUp();
        $this->seed();
    }

    /**
     * All frontend routes, except site.cars.filter, pagination
     */
    public function test_the_application_returns_a_successful_response_for_all_routes(): void
    {
        $routes = collect(Route::getRoutes())->map(function ($route) {
            return $route->named('site.*')? $route: false;
        })->filter();

        foreach ($routes as $route) {
            $routeName = $route->getName();
            if ($routeName == 'site.cars.filter' || str_contains($routeName, 'ajax')) continue;

            $params = [];//action parameters

            // Route - /{category:alias}/{mark:alias}
            if ($bindings = $route->bindingFields()) {
                foreach ($bindings as $bindClass => $bind) {
                    if (class_exists($class = "App\\Models\\" . ucfirst($bindClass))) {
                        $model = $class::whereStatus(1)->first();
                        if ($model && $bind == 'alias') {
                            $params[$bindClass] = $model->alias;
                        }
                    }
                }
            }

            //remaining parameters from route, /{category:alias}/{mark:alias}/{available}/{page?}/{pageN?}
            $parameters = $route->wheres;
            foreach ($parameters as $key => $parameter) {
                if (in_array($key, ['page', 'pageN', 'params', 'filterArgs']) || isset($params[$key])) continue;

                $values = explode('|', $parameter);
                $params[$key] = $values[0];
            }

            $response = $this->get(route($routeName, $params));
            $response->assertStatus(200);
        }
    }

    public function test_site_cars_filter_route()
    {
        $category = Category::whereStatus(1)->first();
        $car = Car::with('mark')->whereStatus(1)->whereRelation('category', 'id', $category->id)->first();
        $response = $this->get(route('site.cars.filter', [$category, 'price-from-'.$car->price]));
        $response->assertStatus(200);
    }

    public function test_site_cars_pagination()
    {
        $category = Category::whereStatus(1)->first();
        $response = $this->get(route('site.cars', [$category, 'page', 2]));
        $response->assertStatus(200);
    }

    /**
     * Car deleted event and check category cache with cars
     * Route - site.cars
     */
    public function test_category_cache()
    {
        $category = Category::with('cars')->where('alias', 'electromobili')->whereStatus(1)->first();
        $response = $this->get(route('site.cars', $category));
        $response->assertStatus(200);

        $categoryCache = cache(Category::CATEGORIES);
        $category = $categoryCache->where('title', $category->title)->first();
        $this->assertModelExists($category);

        $car = $category->cars->first();
        $this->assertModelExists($car);
        $this->assertDatabaseHas('cars', [
            'id' => $car->id,
        ]);

        $car->delete();
        $this->assertModelMissing($car);

        $categoryCache = cache(Category::CATEGORIES);
        $category = $categoryCache->where('title', $category->title)->first();
        $this->assertModelExists($category);
        $oldcar = $category->cars->where('title', $car->title)->first();
        $this->assertNull($oldcar);
    }

    /**
     * Car deleted event
     * Route - site.cars
     * Url - /electromobili
     */
    public function test_cars_cache()
    {
        $category = Category::where('alias', 'electromobili')->whereStatus(1)->first();
        $response = $this->get(route('site.cars', $category));
        $response->assertStatus(200);

        $carsCache = cache('site.cars.electromobili.1');
        $this->assertNotNull($carsCache);

        $car = $carsCache->first();
        $this->assertModelExists($car);
        $car->delete();
        $this->assertModelMissing($car);

        $carsCache = cache('site.cars.electromobili.1');
        $this->assertNull($carsCache);


        $response = $this->get(route('site.cars', $category));
        $response->assertStatus(200);

        $carsCache = cache('site.cars.electromobili.1');
        $this->assertNotNull($carsCache);
        $this->assertNotNull($car);

        $oldcar = $carsCache->where('title', $car->title)->first();
        $this->assertNull($oldcar);
    }
}
