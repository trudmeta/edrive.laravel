<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class PageRequest extends FormRequest
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
            'title' => 'required|string|max:50',
            'alias' => 'required|string|max:50',
            'h1' => 'nullable|string|max:50',
            'keywords' => 'nullable|string|max:50',
            'description' => 'nullable|string|max:100',
            'sections' => 'array',
            'sections.*' => 'array',
            'sections.*.title' => 'string|max:120',
            'sections.*.content' => 'string',
            'sections.*.position' => 'nullable',
            'sections.*.sort' => 'numeric',
            'sections.*.pageable_type' => 'required|string',
            'sections.*.pageable_id' => 'required|numeric',
        ];
    }
}
