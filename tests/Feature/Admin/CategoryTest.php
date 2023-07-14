<?php

namespace Tests\Feature\Admin;

use App\Models\Attribute;
use App\Models\Category;
use App\Models\Mark;
use App\Models\Scopes\StatusScope;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function setUp () :void
    {
        parent::setUp();
        $this->seed();
    }


    public function test_category_update(): void
    {
        $user = User::where('name', 'admin')->first();
        $category = Category::whereStatus(1)->first();

        $this->assertDatabaseHas('categories', [
            'alias' => $category->alias,
            "status" => 1,
        ]);

        //frontend, route site.cars
        $responseFrontend = $this->get(route('site.cars', $category));
        $responseFrontend->assertStatus(200);


        $marks = Mark::whereStatus(1)->get();
        $attributes = Attribute::whereStatus(1)->get();

        $response = $this
            ->actingAs($user)
            ->patch(route('backend.categories.update', $category->id), [
                "title" => $category->title,
                "alias" => $category->alias,
                "description" => $category->description,
                "status" => 0,
                "marks" => [
                    $marks->random()->id
                ],
                "attributes" => [
                    $attributes->random()->id
                ]
            ]);
        $response->assertRedirect(route('backend.categories.edit', $category->id));

        $category = Category::withoutGlobalScope(StatusScope::class)->where('alias', $category->alias)->first();

        $this->assertDatabaseHas('categories', [
            'alias' => $category->alias,
            "status" => 0,
        ]);

        //frontend, route site.cars
        $responseFrontend = $this->get(route('site.cars', $category));
        $responseFrontend->assertStatus(404);
    }
}
