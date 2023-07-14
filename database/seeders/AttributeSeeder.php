<?php

namespace Database\Seeders;

use App\Models\Attribute;
use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AttributeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $attributeValuesArray = [
            'Пробег на заряде' => [
                'values' => ['100км','150км','200км','250км','400км','450км'],
                'type' => Attribute::TYPES[0]//usual
            ],
            'Топливо' => [
                'values' => ['Бензин','Дизель','Гибрид','Электро'],
                'type' => Attribute::TYPES[0]//usual
            ],
            'Привод' => [
                'values' => ['Передний','Задний','Полный'],
                'type' => Attribute::TYPES[0]
            ],
            'Тип двигателя' => [
                'values' => ['3.0L 6','2.0L 4','1.8L 4','1.5L 4','2.5L 4'],
                'type' => Attribute::TYPES[0]
            ],
            'Повреждение' => [
                'values' => ['Переднее','Заднее','Боковое','Трансмиссии','После града'],
                'type' => Attribute::TYPES[0]
            ],
            'Коробка передач' => [
                'values' => ['Вариатор','Механическая','Автомат'],
                'type' => Attribute::TYPES[0]
            ],
            'Цвет' => [
                'values' => ['Серый металлик','Гранатовый','Белый','Черный','Голубой','Серый','Красный'],
                'type' => Attribute::TYPES[0]
            ],
            'Мощность' => [
                'values' => ['177 л.с.', '180 л.с.', '200 л.с.', '190 л.с.', '181 л.с.'],
                'type' => Attribute::TYPES[0]
            ],
            'Комплектация' => [
                'values' => [
                    'Зарядный кабель',
                    'Рекуперативное торможение',
                    'Бесключевой доступ',
                    'Бортовой компьютер',
                    'Дисплей 17”'
                ],
                'type' => Attribute::TYPES[1]//multiselect
            ]
        ];
        foreach ($attributeValuesArray as $attribute => $valuesArray) {
            $attributes[] = [
                'title' => $attribute,
                'alias' => Str::slug($attribute),
                'type' => $valuesArray['type'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('attributes')->insert($attributes);
        $attributes = Attribute::get();


        foreach ($attributeValuesArray as $attribute => $valuesArray) {
            $attribute = $attributes->where('title', $attribute)->first();
            $attributeId = $attribute->id;

            foreach ($valuesArray['values'] as $value) {
                $values[] = [
                    'title' => $value,
                    'alias' => Str::slug($value),
                    'attribute_id' => $attributeId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        DB::table('values')->insert($values);

        //Attributes tied to the car category
        //Intermediate table
        $categoryAttributes = [
            'Электромобили' => [
                'Пробег на заряде', 'Привод', 'Тип двигателя', 'Коробка передач', 'Цвет', 'Мощность', 'Комплектация',
            ],
            'Заказ Авто из США' => [
                'Топливо', 'Привод', 'Тип двигателя', 'Повреждение', 'Коробка передач', 'Цвет', 'Мощность', 'Комплектация',
            ]
        ];
        $categories = Category::get();

        foreach ($categoryAttributes as $category => $attributesArray) {
            $categoryId = $categories->where('title', $category)->value('id');

            foreach ($attributesArray as $attribute) {
                $attributeId = $attributes->where('title', $attribute)->value('id');

                $attributeCategory[] = [
                    'attribute_id' => $attributeId,
                    'category_id' => $categoryId
                ];
            }
        }
        DB::table('attribute_category')->insert($attributeCategory);
    }
}
