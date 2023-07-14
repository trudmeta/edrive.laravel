<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'label' => 'Frontend per page',
                'name' => Str::snake('Frontend per page'),
                'value' => 4,
                'type' => Setting::TYPES[1],
                'tab' => 'basic',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'label' => 'Frontend news per page',
                'name' => Str::snake('Frontend news per page'),
                'value' => 3,
                'type' => Setting::TYPES[1],
                'tab' => 'basic',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'label' => 'Backend per page',
                'name' => Str::snake('Backend per page'),
                'value' => 4,
                'type' => Setting::TYPES[1],
                'tab' => 'basic',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'label' => 'Price per liter of gasoline',
                'name' => Str::snake('Price per liter of gasoline'),
                'value' => 50,
                'type' => Setting::TYPES[1],
                'tab' => 'basic',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'label' => 'Phone number',
                'name' => Str::snake('Phone number'),
                'value' => '+38(095) 123-45-67',
                'type' => Setting::TYPES[0],
                'tab' => 'statics',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'label' => 'Phone number2',
                'name' => Str::snake('Phone number2'),
                'value' => '+38(095) 765-43-21',
                'type' => Setting::TYPES[0],
                'tab' => 'statics',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'label' => 'Address',
                'name' => Str::snake('Address'),
                'value' => 'Одесса, проспект Небесной Сотни',
                'type' => Setting::TYPES[0],
                'tab' => 'statics',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'label' => 'Email for contacts',
                'name' => Str::snake('Email for contacts'),
                'value' => 'admin@gmail.com',
                'type' => Setting::TYPES[2],
                'tab' => 'statics',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
//            [
//                'label' => 'Administrator Email',
//                'name' => Str::snake('Administrator Email'),
//                'value' => 'admin@gmail.com',
//                'type' => Setting::TYPES[2],
//                'tab' => 'email',
//                'created_by' => 1,
//                'updated_by' => 1,
//                'created_at' => now(),
//                'updated_at' => now(),
//            ],
            [
                'label' => 'Video presentation',
                'name' => Str::snake('Video presentation'),
//                'value' => 'https://youtu.be/5ZHohtMUtHA',
                'value' => 'https://www.youtube.com/watch?v=5ZHohtMUtHA',
                'type' => Setting::TYPES[0],
                'tab' => 'statics',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'label' => 'Copyright',
                'name' => Str::snake('Copyright'),
                'value' => '© ' . now()->year .' E-Drive. Продажа электромобилей в Киеве и Украине',
                'type' => Setting::TYPES[0],
                'tab' => 'statics',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'label' => 'Mail feedback',
                'name' => Str::snake('Mail feedback'),
                'value' => '<h4>Hello</h4><p>This is a test message</p>',
                'type' => Setting::TYPES[3],
                'tab' => 'additional',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        Setting::insert($settings);
    }
}
