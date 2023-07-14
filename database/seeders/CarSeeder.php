<?php

namespace Database\Seeders;

use App\Models\Attribute;
use App\Models\Car;
use App\Models\Category;
use App\Models\Mark;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
//        DB::enableQueryLog();
        $categories = Category::with('marks.carModels')->get();

        foreach($categories as $category) {
            $prefix = $category->alias == 'electromobili'? 'electro-' : '';
            foreach($category->marks as $mark) {
                foreach ($mark->carModels as $model) {
                    $name = $mark->title . ' ' . $model->title;
                    $cars[] = [
                        'title' => $name,
                        'alias' => $prefix . Str::slug($name),
                        'model_id' => $model->id,
                        'category_id' => $category->id,
                        'description' => rand(0,1)? fake()->realText(100) : '',
                        'price' => collect(['23000','15000','18000','30000','45000','35000'])->random(),
                        'year' => fake()->year(),
                        'mileage' => collect([0, 150, 0, 1800])->random(),
                        'available' => collect([1, 1, 0, 1])->random(),
                        'artikul' => Str::random(15),
                        'h1' => $name,
                        'created_at' => now(),
                        'updated_at' => now()
                    ];
                }
            }
        }
        DB::table('cars')->insert($cars);

        //Car attribute values
        Car::with('category.attributes.values')->get()->each(function($car) {

            $attributes = $car->category->attributes;

            foreach($attributes as $attribute){

                $attributeValues = $attribute->values;
                if ($attribute->type == Attribute::TYPES[0]) {
                    $value = $attributeValues->random();
                } elseif ($attribute->type == Attribute::TYPES[1]) {
                    $rand = rand(0, $attributeValues->count());
                    $value = $attributeValues->random($rand);
                }

                if ($value) {
                    $car->values()->attach($value);
                }

            }
        });
//        dump(DB::getQueryLog());
    }
}
