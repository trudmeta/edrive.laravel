<?php

namespace Database\Seeders;

use App\Models\Car;
use App\Models\Image;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $imagesCollection = collect(Storage::disk('assets')->allFiles('/images/catalog'));

        foreach ($imagesCollection as $image){
            $images[] = [
                'url' => $image,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('images')->insert($images);

        $images = Image::get();
        $cars = Car::get();

        foreach ($cars as $car) {
            $rand = rand(1, $images->count());
            $car->images()->syncWithPivotValues($images->random($rand)->map->id, ['sort' => 0, 'created_at' => now(), 'updated_at' => now()]);
        }
    }
}
