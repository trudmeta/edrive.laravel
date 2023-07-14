<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MarkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $titles = ['Tesla', 'Chevrolet', 'Honda', 'BMW', 'Ford', 'Volkswagen', 'Nissan', 'Mercedes-Benz', 'Kia'];

        foreach ($titles as $title) {
            $marks[] = [
                'title' => $title,
                'alias' => Str::slug($title),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('marks')->insert($marks);
    }
}
