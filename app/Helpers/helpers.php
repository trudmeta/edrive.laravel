<?php


use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;


if (! function_exists('getTableColumns')) {
    /**
     * Gets all columns of the model
     *
     * Carbon Locale will be considered here
     * Example:
     * Friday, July 24, 2020
     */
    function getTableColumns(string $table)
    {
        $columns = DB::select('SHOW COLUMNS FROM '. $table);

        return $columns;
    }
}


if (! function_exists('showColumnValue')) {
    /**
     * Return formatted column values.
     *
     * @param  string  $model  Model Object
     * @param  string  $column  Column Name
     * @param  string  $relationColumn  Relation column Name
     * @return string Formatted Column Value
     */
    function showColumnValue($model, $column, string $relationColumn = 'title')
    {
        $column_name = $column->Field;
        $column_type = $column->Type;

        $value = $model->$column_name;

        if (! $value) {
            return $value;
        }

        if (is_array($value)) {
            $result = '';
            foreach ($value as $key => $res) {
                $result .= $key . '-' . $res .'; ';
            }
        } else {
            $result = $value;
        }

        //relation
        if (Str::contains($column_type, 'bigint') && $relationName = explode('_', $column_name)[0]) {
            if ($relationName && $relationName != 'id' && $relation = $model->$relationName) {
                $result = $value . ' - ' . $relation->$relationColumn;
            }
        }

        return $result;
    }
}


if (! function_exists('icon')) {
    /**
     * A short and easy way to show icon fonts
     */
    function icon($string = 'cil-save')
    {
        $return_string = "<i class='".$string."'></i>&nbsp;";

        return $return_string;
    }
}


if (! function_exists('fieldRequired')) {
    /**
     * Prepare the Column Name for Lables.
     */
    function fieldRequired($required)
    {
        $return_text = '';

        if ($required != '') {
            $return_text = '<span class="text-danger">*</span>';
        }

        return $return_text;
    }
}


if (! function_exists('settings')) {
    /**
     * @param null $name
     * @return \Illuminate\Database\Eloquent\Collection|string|null
     */
    function settings($name = null):\Illuminate\Database\Eloquent\Collection | string | null
    {
        $setting = null;

        if (!$settings = cache(\App\Models\Setting::SETTINGS)) {
            $settings = \App\Models\Setting::saveCache();
        }

        if (is_null($name)) {
            return $settings;
        }

        if ($settings && $name) {
            $setting = $settings->firstWhere('name', $name);
        }

        return optional($setting)->value;
    }
}