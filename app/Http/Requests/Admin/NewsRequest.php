<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class NewsRequest extends FormRequest
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
            'name' => 'required|string|max:100',
            'alias' => 'required|string|max:100',
            'content' => 'required|string|max:3000',
            'title' => 'required|string|max:100',
            'h1' => 'nullable|string|max:100',
            'keywords' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:100',
            'status' => 'boolean',
            'images_url' => 'array',
            'images_url.*' => 'url'
        ];
    }
}
