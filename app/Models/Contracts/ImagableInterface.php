<?php


namespace App\Models\Contracts;


use App\Models\Image;

interface ImagableInterface
{
    /**
     * Adds an image to the database if it is new and binds to the model
     * @param Image $image
     * @return bool
     */
    public function addImage(Image $image): bool;

    /**
     * Removes an image from the model
     * @param Image $image
     * @return bool
     */
    public function removeImage(Image $image): bool;
}