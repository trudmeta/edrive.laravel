<?php

namespace Tests\Unit;

use App\Models\Menu;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class FeatureTest extends TestCase
{
    use RefreshDatabase;

    public function setUp () :void
    {
        parent::setUp();
        $this->seed();
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function test_that_true_is_true()
    {
        $this->assertTrue(true);
    }

    /**
     * Update cache after menu update
     */
    public function test_menu_update_and_cache_update(): void
    {
        Cache::remember('menu', 10, function() {
            return Menu::whereStatus(1)->get();
        });
        $menuCache = cache('menu');
        $this->assertTrue($menuCache->contains('alias', 'about'));
        $menu = Menu::where('alias', 'about')->first();
        $menu->update(['alias' => 'about2']);

        $menuCache = cache('menu');
        $this->assertFalse($menuCache->contains('alias', 'about'));
        $this->assertTrue($menuCache->contains('alias', 'about2'));
    }
}
