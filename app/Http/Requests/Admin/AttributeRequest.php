<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AttributeRequest extends FormRequest
{
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
        return [
            'title' => 'required|string|max:30',
            'alias' => 'required|string|max:30',
            'type' => 'required|string|max:20',
            'status' => 'boolean',
            'values' => 'required|array',
            'values.*' => ['required', 'regex:/^([0-9]*$)|(^[A-Za-zА-Яа-яё]{1,20}\.[a-z]{1,20})$/i'],
        ];
    }
}
