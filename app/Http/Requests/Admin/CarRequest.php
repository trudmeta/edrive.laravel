<?php

namespace App\Http\Requests\Admin;

use App\Models\Attribute;
use App\Models\Car;
use App\Models\Mark;
use App\Models\Value;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CarRequest extends FormRequest
{
    /**
     * App\Models\Attribute ids
     * @var array|mixed
     */
    private $attrs = [];

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $request = $this->request;
        $car_id = '';
        if (!empty($request->get('car_id')) && $car = Car::findOrFail($request->get('car_id'))) {
            $car_id = $car->id;
        }
        return [
            'title' => 'required|string|max:30',
            'alias' => 'required|string|max:30|unique:cars,alias,'.$car_id,
            'mark_id' => [
                'required',
                'exists:marks,id',
                function (string $attribute, mixed $value, Closure $fail) {
                    //marks associated with the category
                    $request = $this->request;
                    $mark = Mark::where('id', $request->get('mark_id'))->first();
                    if (!$request->get('category_id') || !$mark->categories->pluck('id')->contains((int)$request->get('category_id'))) {
                        $fail("The {$attribute} is invalid!");
                    }
                },
            ],
            'model_id' => 'required|exists:car_models,id',
            'category_id' => 'required|exists:categories,id',
            'price' => 'numeric',
            'year' => 'numeric',
            'mileage' => 'numeric',
            'available' => 'boolean',
            'status' => 'boolean',
            'artikul' => 'required|string|min:5|max:20|unique:cars,artikul,'.$car_id,
            'h1' => 'nullable|string',
            'keywords' => 'nullable|string',
            'description' => 'nullable|string',
            'values' => 'array',
            'values.*' => [
                'integer',
                function (string $attribute, mixed $val, Closure $fail) {
                    if (!$val) {
                        $fail("Attributes {$attribute} attribute cannot be empty!");
                        return false;
                    }
                    $val = (int)$val;
                    //attributes associated with the category
                    $request = $this->request;
                    $value = Value::with('attribute')->findOrFail($val);
                    $valueAttribute = $value->attribute;
                    if (in_array($valueAttribute->id, $this->attrs)) {
                        if ($valueAttribute->type != Attribute::TYPES[1]) {//multiselect
                            $fail("Attributes {$attribute} must not be repeated!");
                        }
                    } else {
                        $this->attrs[] = $valueAttribute->id;
                    }

                    if (!$valueAttribute->categories->pluck('id')->contains((int)$request->get('category_id'))) {
                        $fail("The {$valueAttribute->alias} does not match category!");
                    }
                },
            ],
            'images_url' => 'array',
            'images_url.*' => 'url'
        ];
    }
}
