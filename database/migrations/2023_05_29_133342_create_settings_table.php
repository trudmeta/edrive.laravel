<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('label')->nullable();
            $table->string('name')->nullable();
            $table->text('value')->nullable();
            $table->char('type', 20)->default('text');
            $table->text('tab')->default('basic');//settings tabs (dropdowns)

            $table->unsignedSmallInteger('created_by')->unsigned()->nullable();
            $table->unsignedSmallInteger('updated_by')->unsigned()->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
