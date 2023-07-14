<?php

namespace App\Models;

use AmrShawky\LaravelCurrency\Facade\Currency;
use App\Models\Contracts\ImagableInterface;
use App\Traits\PaginateTrait;
use Illuminate\Database\Eloquent\Casts\Attribute as CastsAttribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class Car extends BaseModel implements ImagableInterface
{
    use HasFactory, PaginateTrait;

    protected $fillable = ['model_id', 'category_id', 'title', 'alias', 'price', 'year', 'mileage', 'available', 'status', 'artikul', 'h1', 'keywords', 'description'];

    public function category(): BelongsTo
    {
        return $this->BelongsTo(Category::class);
    }

    public function mark(): HasOneThrough
    {
        return $this->hasOneThrough(Mark::class, CarModel::class, 'id', 'id', 'model_id', 'mark_id');
    }

    public function carModel(): BelongsTo
    {
        return $this->BelongsTo(CarModel::class, 'model_id');
    }

    public function values(): BelongsToMany
    {
        return $this->BelongsToMany(Value::class);
    }

    public function images(): morphToMany
    {
        return $this->morphToMany(Image::class, 'imagable');
    }

    public function getMainImageAttribute()
    {
        return !$this->images->isEmpty()? $this->images[0]->url : '/images/no-image.png';
    }

    /**
     * In admin panel, showColumnValue
     * @return mixed
     */
    protected function getModelAttribute()
    {
        return $this->carModel;
    }

    /**
     * Adding a multiselect (html multiple select) to the App\Models\Value collection
     * @param array $with
     * @return mixed|Value
     */
    public function getValuesSortedAttribute()
    {
        $values = $this->values->loadMissing('attribute');
        $multiples = $values->filter(function($value) {
            return $value->attribute->type == Attribute::TYPES[1];//multiselect
        });
        $values = $values->diff($multiples);
        if ($multiples->count()) {
            $values->put('equipment', $multiples);
        }
        return $values;
    }

    public function exchange(): CastsAttribute
    {
        $price = $this->price;
        $exchange = Currency::convert()
            ->from('USD')
            ->to('UAH')
            ->round(2)
            ->amount($price)
            ->get();

        return CastsAttribute::make(get: fn() => $exchange);
    }


    public function resolveRouteBinding($value, $field = 'alias')
    {
        return Cache::rememberForever('car.'.$field.'.'.$value, function() use ($value, $field) {
            return $this->with(['images', 'mark.cars.images', 'category', 'values.attribute'])->where($field, $value)->firstOrFail();
        });
    }

    protected static function boot()
    {
        parent::boot();

        static::deleted(function(Model $model) {

            self::updateCacheArray();
            static::updateCache($model);

        });

        static::saved(function(Model $model) {

            self::updateCacheArray();
            static::updateCache($model);

        });
    }

    private static function updateCache(Model $model)
    {
        Cache::forget('car.alias.'.$model->alias);//resolveRouteBinding
        Cache::forget(Category::CATEGORIES);
        Category::getCategories();
    }

    public function addImage(Image $image): bool
    {
        if ($this->images()->syncWithPivotValues($image->id, ['sort' => 0, 'created_at' => now(), 'updated_at' => now()], false)) {
            return true;
        }
        return false;
    }

    public function removeImage(Image $image): bool
    {
        if ($this->images()->detach($image->id)) {
            return true;
        }
        return false;
    }
}
