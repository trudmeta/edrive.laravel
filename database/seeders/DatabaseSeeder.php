<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\CarModel;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            MarkSeeder::class,
            CarModelSeeder::class,
            CategorySeeder::class,
            AttributeSeeder::class,
            CarSeeder::class,
            MenuSeeder::class,
            ImageSeeder::class,
            PageSeeder::class,
            NewsSeeder::class,
            SettingSeeder::class,
        ]);
    }
}
