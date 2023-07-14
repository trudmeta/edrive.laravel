<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    public function setUp () :void
    {
        parent::setUp();
        $this->seed();
    }

    /**
     * A basic feature test example.
     */
    public function test_dashboard(): void
    {
        $response = $this->get(route('backend.dashboard'));

        $response->assertStatus(302);
    }

    public function test_dashboard_enter(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->get(route('backend.dashboard'));

        $response->assertStatus(200);
    }
}
