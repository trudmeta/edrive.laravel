<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\SettingRequest;
use App\Models\BaseModel;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;

class SettingController extends Controller
{
    public function __construct()
    {
        $this->models = 'settings';
        parent::__construct();
    }

    public function index()
    {
        $models = $this->models;
        $settings = settings();
        $tabs = $settings->pluck('tab')->unique();

        return view("backend.$models.index", compact('settings', 'tabs'));
    }

    public function store(SettingRequest $request)
    {
        $params = $request->except(['_token', 'files']);
        $index = 0;

        foreach ($params as $name => $setting) {
            $model = Setting::where('name', $name)->firstOrFail();
            $model->update(['value' => $setting]);
            $index++;
            if ($index == count($params)) {
                Event::dispatch('settings.updated', $model);
            }
        }

        return back()->with('status', __('Settings has been saved.'));
    }
}
