<?php


namespace App\Services;


use App\Models\Car;
use App\Models\Category;
use App\Models\Mark;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class CarService
{
    public function __construct(private Helper $helper)
    {}

    /**
     * Cars from cache
     * @return mixed
     */
    public function getCars(array $args)
    {
        $args = $this->addGetParamsFromRequest($args);

        $cacheCarsName = $this->helper->prepareName(['cars', $args]);
        $args = $this->argsPrepare($args, [
            'perPage' => $args['perPage'] ?? settings('frontend_per_page'),
            'status' => 1,
            'with' => ['images'],
        ]);

        return Cache::rememberForever($cacheCarsName, function() use ($args) {

            return $this->getCarsAll($args);

        });
    }

    private function addGetParamsFromRequest(array $args)
    {
        if (!isset($args['sort_by']) && !isset($args['sort_order']) &&
            isset(request()->sort) && preg_match('/^(price|created_at|title)$/', request()->sort) && preg_match('/^(asc|desc)$/', request()->type)) {
            $args['sort_by'] = request()->sort;
            $args['sort_order'] = request()->type;
        }
        if (isset(request()->search)) {
            $args['search'] = htmlspecialchars(request()->search);
        }
        if (isset(request()->category) && is_numeric(request()->category)) {
            $args['category'] = request()->category;
        }
        return $args;
    }

    /**
     * @param $category
     * @param $mark
     * @param $pageN
     * @param $available
     * @param $filterArgs
     * @param null $status
     * @param boolean $paginate
     * @return mixed
     */
    public function getCarsAll(array $args = [])
    {
        $args = $this->addGetParamsFromRequest($args);
        $args = $this->argsPrepare($args, [
            'perPage' => $args['perPage'] ?? settings('frontend_per_page'),
            'pageN' => $args['pageN'] ?? 1,
            'sort_by' => 'id',
            'sort_order' => 'DESC',
            'with' => ['images', 'values', 'category'],
            'paginate' => true,
        ]);

        $cars = Car::when(isset($args['category']) ?? false, function(Builder $query) use ($args) {
                if ($args['category'] instanceof Model) {
                    $query->whereRelation('category', 'alias', $args['category']->alias);
                } elseif (is_numeric($args['category'])) {
                    $query->where('category_id', $args['category']);
                }
            })
            ->when(isset($args['mark']) && $args['mark'] instanceof Model ?? false, function(Builder $query) use ($args) {
                $query->whereRelation('mark', 'marks.id', $args['mark']->id);
            })
            ->when(isset($args['available']) && $args['available'] == 'available' ?? false, function(Builder $query) {
                $query->where('available', 1);
            })
            ->when(isset($args['available']) && $args['available'] == 'notavailable' ?? false, function(Builder $query) {
                $query->where('available', 0);
            })
            ->when(isset($args['filterArgs']) ?? false, function(Builder $query) use ($args) {
                $this->filter($query, $args['filterArgs']);
            })
            ->when(isset($args['status']) && is_numeric($args['status']) ?? false, function(Builder $query) use ($args) {
                $query->whereStatus($args['status']);
            })
            ->when(isset($args['with']) ?? false, function(Builder $query) use ($args) {
                $query->with($args['with']);
            })
            ->when(isset($args['search']) ?? false, function(Builder $query) use ($args) {
                $query->where('id', 'LIKE', "%".$args['search']."%")
                    ->orWhere('title', 'LIKE', "%".$args['search']."%")
                    ->orWhere('alias', 'LIKE', "%".$args['search']."%")
                    ->orWhere('description', 'LIKE', "%".$args['search']."%")
                    ->orWhere('created_at', 'LIKE', "%".$args['search']."%")
                    ->orWhere('updated_at', 'LIKE', "%".$args['search']."%");
            })
            ->orderBy($args['sort_by'], $args['sort_order']);


        if (isset($args['paginate']) && $args['paginate']) {
            if (app()->bound(\Illuminate\Pagination\LengthAwarePaginator::class)) {
                $cars = $cars->paginateUri($args['perPage'], $args['pageN']);
            } else {
                $cars = $cars->paginate($args['perPage']);
            }
        }

        return $cars;
    }

    public function filter(Builder $builder, array $args): Builder
    {
        $builder
            ->when(($args['model']) ?? false, function (Builder $query) use ($args) {
                $query->whereRelation('carModel', 'alias', $args['model']);
            })
            ->when(($args['price']) ?? false, function (Builder $query) use ($args) {
                if (isset($args['price']['from'])) {
                    $query->where('price', '>=', $args['price']['from']);
                }
                if (isset($args['price']['to'])) {
                    $query->where('price', '<=', $args['price']['to']);
                }
            })->when(($args['year']) ?? false, function (Builder $query) use ($args) {
                if (isset($args['year']['from'])) {
                    $query->where('year', '>=', $args['year']['from']);
                }
                if (isset($args['year']['to'])) {
                    $query->where('year', '<=', $args['year']['to']);
                }
            })->when(($args['mileage']) ?? false, function (Builder $query) use ($args) {
                if (isset($args['mileage']['from'])) {
                    $query->where('mileage', '>=', $args['mileage']['from']);
                }
                if (isset($args['mileage']['to'])) {
                    $query->where('mileage', '<=', $args['mileage']['to']);
                }
            });

        return $builder;
    }

    /**
     * Gets additional data (count) for 5 routes:
     *   site.cars, site.cars.available, site.cars.mark, site.cars.mark.available, site.filter
     * @param Category $category
     * @param Mark $mark
     * @return array
     */
    public function getCarsData(Category $category, Mark $mark = null): array
    {
        $data = [];

        $totalCount = $this->getTotal($category, $mark);

        $availableCountName = $this->helper->prepareName(['availableCount', $category, $mark]);
        $availableCount = Cache::rememberForever($availableCountName, function() use($category, $mark) {
            $query = Car::where('category_id', $category->id)->where('available', 1);
            if ($mark) {//site.cars.mark route
                $query->whereRelation('mark', 'marks.id', $mark->id);
            }
            return $query->count();
        });
        $notAvailableCountName = $this->helper->prepareName(['notavailableCount', $category, $mark]);
        $notAvailableCount = Cache::rememberForever($notAvailableCountName, function() use($category, $mark) {
            $query = Car::where('category_id', $category->id)->where('available', 0);
            if ($mark) {//site.cars.mark route
                $query->whereRelation('mark', 'marks.id', $mark->id);
            }
            return $query->count();
        });
        $data['totalCount'] = $totalCount;
        $data['availableCount'] = $availableCount;
        $data['notAvailableCount'] = $notAvailableCount;


        $yearsName = $this->helper->prepareName(['years', $category, $mark]);
        $years = Cache::rememberForever($yearsName, function() use($category, $mark) {
            $query = Car::distinct('year')->where('category_id', $category->id);
            if ($mark) {//site.cars.mark route
                $query->whereRelation('mark', 'marks.id', $mark->id);
            }
            return $query->pluck('year')->sort()->values()->toArray();
        });
        $data['years'] = $years;


        $minPriceName = $this->helper->prepareName(['minPrice', $category]);
        $minPrice = Cache::rememberForever($minPriceName, function() use($category) {

            return Car::where('category_id', $category->id)->whereStatus(1)->min('price');

        });
        $maxPriceName = $this->helper->prepareName(['maxPrice', $category]);
        $maxPrice = Cache::rememberForever($maxPriceName, function() use($category) {

            return Car::where('category_id', $category->id)->whereStatus(1)->max('price');

        });
        $data['minPrice'] = $minPrice;
        $data['maxPrice'] = $maxPrice;


        $mileageName = $this->helper->prepareName(['mileage', $category, $mark]);
        $mileages = Cache::rememberForever($mileageName, function() use($category, $mark) {
            $query = Car::distinct('mileage')->where('category_id', $category->id);
            if ($mark) {//site.cars.mark route
                $query->whereRelation('mark', 'marks.id', $mark->id);
            }
            return $query->pluck('mileage')->sort()->values()->toArray();
        });
        $data['mileages'] = $mileages;

        return $data;
    }

    public function getTotal(Category $category = null, Mark $mark = null): int
    {
        $total = 0;

        $categories = $category? collect()->add($category) : cache(Category::CATEGORIES);
        foreach ($categories as $cat) {
            if (!cache('site.totalCount.'.$cat->alias)) {
                $this->getTotalCount($cat);

                foreach ($cat->marks as $marks) {
                    $this->getTotalCount($cat, $marks);
                }
            }
        }

        return $category? $this->getTotalCount($category, $mark) : $total;
    }

    /**
     * Gets the number of cars from the category or mark
     * @param Category $category
     * @param Mark|null $mark
     * @return int
     */
    private function getTotalCount(Category $category, Mark $mark = null): int
    {
        $totalCountName = $this->helper->prepareName(['totalCount', $category, $mark]);
        return Cache::rememberForever($totalCountName, function() use($category, $mark) {
            $query = Car::where('category_id', $category->id);
            if ($mark) {//site.cars.mark route
                $query->whereRelation('mark', 'marks.id', $mark->id);
            }
            return $query->count();
        });
    }

    public function getMarks(Category $category)
    {
        return Cache::rememberForever($this->helper->prepareName(['marks', 'category', $category->alias]), function() use ($category) {
            if ($category = cache(Category::CATEGORIES)? cache(Category::CATEGORIES)->where('id', $category->id)->first() : []) {
                return $category->marks;
            }
            return Mark::whereRelation('categories', 'categories.id', $category->id)->get();
        });
    }


    public function argsPrepare(array $args = [], array $default = [] )
    {
        foreach ($default as $key => $value) {
            if (!isset($args[$key]))
                $args[$key] = $value;
        }

        return $args;
    }
}