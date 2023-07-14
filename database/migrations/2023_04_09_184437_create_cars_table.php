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
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('model_id');
            $table->unsignedBigInteger('category_id');
            $table->string('title');
            $table->string('alias')->unique();
            $table->float('price', 8, 2);
            $table->year('year')->nullable();
            $table->mediumInteger('mileage')->default(0);
            $table->boolean('available')->default(true);//in stock
            $table->boolean('status')->default(true);//not show
            $table->string('artikul')->nullable();
            $table->string('h1')->nullable();
            $table->text('keywords')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index('price');
            $table->index('year');
            $table->index('mileage');

            $table->foreign('model_id')->references('id')->on('car_models');
            $table->foreign('category_id')->references('id')->on('categories');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
