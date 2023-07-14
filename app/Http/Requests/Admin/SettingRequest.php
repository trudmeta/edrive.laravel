<?php

namespace App\Http\Requests\Admin;

use Closure;
use Illuminate\Foundation\Http\FormRequest;

class SettingRequest extends FormRequest
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
            'frontend_per_page' => 'numeric|max:50',
            'frontend_news_per_page' => 'numeric|max:50',
            'backend_per_page' => 'numeric|max:50',
            'phone_number' => 'required|string|max:20',
            'phone_number2' => 'required|string|max:20',
            'address' => 'required|string|max:70',
            'email_for_contacts' => 'required|string|max:30',
            'video_presentation' => 'required|string|max:100',
            'copyright' => 'required|string|max:100',
            'mail_feedback' => 'string|max:200',
        ];
    }
}
