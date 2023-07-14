<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute as CastsAttribute;
use Illuminate\Support\Facades\Cache;

class Setting extends BaseModel
{
    use HasFactory;

    const TYPES = ['text', 'number', 'email', 'textarea'];
    const SETTINGS = 'settings';

    protected $fillable = ['label', 'name', 'value', 'type', 'tab', 'created_by', 'updated_by'];

    protected function value(): CastsAttribute
    {
        return CastsAttribute::make(
            get: function(string $value){
                    if ($this->name == 'copyright') {
                        $value = preg_replace('/(.*)([0-9]{4})(.*)/', '${1}'.now()->year."$3", $value);
                    }
                    return $value;
                },
        );
    }

    public static function saveCache()
    {
        $settings = Setting::get();
        cache([Setting::SETTINGS => $settings]);
        return $settings;
    }
}
