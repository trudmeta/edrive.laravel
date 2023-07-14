<?php

namespace Tests\Feature\Admin;

use App\Models\Mark;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class CarTest extends TestCase
{
    use DatabaseMigrations;

    public function setUp () :void
    {
        parent::setUp();
        $this->seed();
    }

    /**
     * A basic feature test example.
     */
    public function test_car_create(): void
    {
        $user = User::where('name', 'admin')->first();

        $this->assertDatabaseMissing('cars', [
            'title' => 'testing',
        ]);

        $car = null;
        app('events')->listen('eloquent.saved: App\Models\Car', function (Model $model) use (&$car) {
            $car = $model;
        });

        $mark = Mark::first();
        $response = $this
            ->actingAs($user)
            ->post(route('backend.cars.store'), [
                "title" => "testing",
                "alias" => "testing",
                "mark_id" => $mark->id,
                "model_id" => $mark->carModels->value('id'),
                "category_id" => $mark->categories->value('id'),
                "price" => "50000",
                "year" => "2023",
                "mileage" => "0",
                "available" => 1,
                "status" => 1,
                "artikul" => 'asdfasdfasdg',
                "h1" => null,
                "keywords" => null,
                "description" => null,
                "values" => [

                ]
            ]);

        $this->assertDatabaseHas('cars', [
            'alias' => 'testing',
        ]);
        $response->assertRedirect(route('backend.cars.edit', $car));
    }


    public function test_car_create_with_error(): void
    {
        $user = User::where('name', 'admin')->first();

        $this->assertDatabaseMissing('cars', [
            'title' => 'testing2',
        ]);

        $mark = Mark::first();
        $response = $this
            ->actingAs($user)
            ->post(route('backend.cars.store'), [
                "title" => "testing2",
                "alias" => "testing2",
                "mark_id" => $mark->id,
                "model_id" => $mark->carModels->value('id'),
                "category_id" => $mark->categories->value('id'),
                "price" => "50000",
                "year" => "2023",
                "mileage" => "0",
                "available" => 1,
                "status" => 1,
                "artikul" => 'asdfasdfasdgfsf',
                "h1" => null,
                "keywords" => null,
                "description" => null,
                "values" => [
                    null,//error
                ]
            ]);

        $this->assertDatabaseMissing('cars', [
            'alias' => 'testing2',
        ]);
        $response->assertSessionHasErrors();
    }
}
