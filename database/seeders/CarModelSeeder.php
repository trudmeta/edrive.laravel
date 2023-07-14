<?php

namespace Database\Seeders;

use App\Models\Mark;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CarModelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $titles = [
            'Chevrolet' => ['Aveo HB', 'Bolt-Ev', 'Menlo'],
            'Honda' => ['CR-V', 'Accord', 'Kona-Encino', 'Lafesta-Ev'],
            'BMW' => ['iX', 'X7', 'M50'],
            'Ford' => ['Explorer'],
            'Volkswagen' => ['Polo', 'Teramont'],
            'Nissan' => ['GT-R', 'Patrol', 'Sentra', 'Ariya', 'Sylphy-S'],
            'Mercedes-Benz' => ['GLA', 'S-class'],
            'Tesla' => ['Roadster', 'Semi', 'Model 3', 'Model X'],
            'Kia' => ['Picanto']
        ];
        $marks = Mark::get();

        foreach ($marks as $mark) {
            $markId = $mark->id;
            $markTitle = $mark->title;
            foreach ($titles[$markTitle] as $model) {
                $carModels[] = [
                    'title' => $model,
                    'alias' => Str::slug($model),
                    'mark_id' => $markId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        DB::table('car_models')->insert($carModels);
    }
}
