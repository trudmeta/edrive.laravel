<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menuArray = [
            [
                'title' => 'О компании',
                'alias' => 'about'
            ],
            [
                'title' => 'Импорт авто из США',
                'alias' => 'import'
            ],
            [
                'title' => 'Новости',
                'alias' => 'news'
            ],
            [
                'title' => 'Контакты',
                'alias' => 'contacts'
            ],
        ];
        $menus = [];

        foreach ($menuArray as $menu) {
            $menus[] = [
                'title' => $menu['title'],
                'alias' => $menu['alias'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('menus')->insert($menus);
    }
}
