<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\CarModel;
use App\Models\Category;
use App\Services\CarService;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CarController extends Controller
{
    /**
     * Method handles 3 routes:
     *  site.cars, site.cars.available, site.cars.filter
     * @param array $filterArgs - site.cars.filter route data
     * @return View
     */
    public function cars(Category $category, int $pageN = 1, string $available = '', array $filterArgs = []): View
    {
        $marks = $this->carService->getMarks($category);

        $cars = $this->carService->getCars(compact('category', 'pageN', 'available', 'filterArgs'));

        return view('cars', [
            'currentCategory' => $category,
            'cars' => $cars,
            'marks' => $marks,
            'available' => $available,
            'filterArgs' => $filterArgs,
        ] + $this->carService->getCarsData($category));
    }

    /**
     * site.cars.available route
     * @return View
     */
    public function carsAvailable(Category $category, string $available = '', int $pageN = 1): View
    {
        return $this->cars($category, $pageN, $available);
    }

    /**
     * site.cars.mark route
     * @return View
     */
    public function carsMark(Category $category, string $mark, int $pageN = 1, string $available = '', array $filterArgs = []): View
    {
        $marks = $this->carService->getMarks($category);

        if ($mark) {
            if (!$mark = $marks->where('alias', $mark)->first()) {
                throw (new ModelNotFoundException)->setModel(get_class($marks->first()));
            }
        }

        $cars = $this->carService->getCars(compact('category', 'mark', 'pageN', 'available', 'filterArgs'));

        return view('cars', [
                'currentCategory' => $category,
                'currentMark' => $mark,
                'cars' => $cars,
                'marks' => $marks,
                'available' => $available,
                'filterArgs' => $filterArgs,
            ] + $this->carService->getCarsData($category, $mark));
    }

    /**
     * site.cars.mark.available route
     * @return View
     */
    public function carsMarkAvailable(Category $category, string $mark, string $available = '', int $pageN = 1): View
    {
        return $this->carsMark($category, $mark, $pageN, $available);
    }

    /**
     * site.cars.filter route
     * @return View|RedirectResponse
     */
    public function filter(Request $request, Category $category): View|RedirectResponse
    {
        $segments = $request->segments();

        $page = 1;
        if ($key = array_search('page', $segments)) {
            if (isset($segments[$key+1])) {
                $page = (int)$segments[$key+1];
                unset($segments[$key]);
                unset($segments[$key+1]);
            }
        }

        $args = [];
        foreach ($segments as $key => $segment) {
            if ($key == 0 || $key == 1) continue;

            $segment = trim($segment);
            //mark-tesla/price-from-15000/price-to-45000
            if (preg_match('/^([^-]+)-(from|to)-([0-9]*)$/',$segment, $params)) {
                $args[$params[1]][$params[2]] = (int)$params[3];
            } elseif (preg_match('/^([^-]+)-(?!from|to)(.{2,20})$/',$segment, $params)) {
                $args[$params[1]] = $params[2];
            }
        }
        if (empty($args)) {
            return redirect()->route('site.cars', $category);
        }

//        $validator = Validator::make($args, [
//            'mark' => 'string|max:20',
//            'model' => 'string|max:20',
//            'price' => 'array',
//            'price.*' => 'required|integer',
//            'year' => 'array',
//            'year.*' => 'required|integer',
//            'mileage' => 'array',
//            'mileage.*' => 'required|integer',
//        ]);
//        $validator->setException((new ValidationException($validator))->redirectTo(route('site.cars', $category)));
//        $args = $validator->validated();

        if (isset($args['mark'])) {
            return $this->carsMark($category, $args['mark'], $page, '', $args);
        } else {
            return $this->cars($category, $page, '', $args);
        }
    }

    /**
     * site.single.car route
     * @return View
     */
    public function car(Car $car): View
    {
        return view('single-car', [
            'car' => $car,
            'values' => $car->valuesSorted,
        ]);
    }

    public function ajaxFilter(Request $request)
    {
        $validated = $request->validate([
            'mark' => 'required|string|max:20',
        ]);

        $carModels = CarModel::whereRelation('mark', 'alias', $validated['mark'])->get();

        return response()->json($carModels->map->only(['title', 'alias']));
    }
}
