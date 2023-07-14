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
        Schema::create('imagables', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('image_id');
            $table->morphs('imagable');
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();

            $table->foreign('image_id')->references('id')->on('images')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('imagables');
    }
};
