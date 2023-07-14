<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * title - html tag title
     * name - news title
     * content - news content
     * view - number of views
     */
    public function up(): void
    {
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('alias')->unique();
            $table->text('content');
            $table->string('title');
            $table->string('h1')->nullable();
            $table->text('keywords')->nullable();
            $table->text('description')->nullable();
            $table->unsignedBigInteger('image_id')->nullable();
            $table->boolean('status')->default(true);
            $table->unsignedSmallInteger('created_by')->unsigned()->nullable();
            $table->unsignedSmallInteger('updated_by')->unsigned()->nullable();
            $table->timestamps();

            $table->foreign('image_id')->references('id')->on('images');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
