<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CategoryRequest extends FormRequest
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
            'description' => 'nullable|string',
            'status' => 'boolean',
            'marks' => 'required|array',
            'marks.*' => 'required|exists:marks,id',
            'attributes' => 'required|array',
            'attributes.*' => 'required|exists:attributes,id',
            'sections' => 'array',
            'sections.*' => 'array',
            'sections.*.title' => 'string|max:50',
            'sections.*.content' => 'string',
            'sections.*.position' => 'string|max:30',
            'sections.*.sort' => 'numeric',
        ];
    }
}
