<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Mark;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categoriesArray = [
            'Электромобили' => [
                'alias' => 'electromobili',
                'marks' => ['Tesla', 'Chevrolet', 'Honda', 'BMW', 'Ford', 'Volkswagen', 'Nissan', 'Mercedes-Benz', 'Kia']
            ],
            'Заказ Авто из США' => [
                'alias' => 'carimport',
                'marks' => ['Volkswagen', 'Honda', 'Nissan', 'BMW']
            ]
        ];
        foreach ($categoriesArray as $category => $data) {
            $categories[] = [
                'title' => $category,
                'alias' => $categoriesArray[$category]['alias'],
                'h1' => $category,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('categories')->insert($categories);

        $categories = Category::get();
        $marks = Mark::get();

        //Intermediate table
        foreach ($categories as $category) {
            foreach ($categoriesArray[$category->title]['marks'] as $mark) {
                $categoryMark[] = [
                    'category_id' => $category->id,
                    'mark_id' => $marks->where('title', $mark)->value('id'),
                ];
            }
        }
        DB::table('category_mark')->insert($categoryMark);
    }
}
