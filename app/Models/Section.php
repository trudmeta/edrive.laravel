<?php

namespace App\Models;

use App\Models\Contracts\ImagableInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Support\Facades\Cache;

class Section extends BaseModel implements ImagableInterface
{
    use HasFactory;

    protected $fillable = ['title', 'content', 'page_id', 'position', 'sort'];

    public function category(): BelongsTo
    {
        return $this->BelongsTo(Category::class);
    }

    public function images(): morphToMany
    {
        return $this->morphToMany(Image::class, 'imagable');
    }

    public function pageable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Additional fields, section has sections
     * @return MorphMany
     */
    public function sections(): MorphMany
    {
        return $this->morphMany(Section::class, 'pageable');
    }


    public function updateCache(Model $section) {
        $page = $section->pageable;
        $page = get_class($page) == Section::class? $section->pageable->pageable : $page;//relation sections.sections
        if ($page && get_class($page) == Page::class && $page->exists) {
            $name = $page->route;
            Cache::forget($name);
            Cache::rememberForever($name, function () use($page) {
                return $page->load(['sections.images', 'sections.sections']);
            });
        }
    }

    public function addImage(Image $image): bool
    {
        if ($this->images()->syncWithPivotValues($image->id, ['sort' => 0, 'created_at' => now(), 'updated_at' => now()], true)) {
            return true;
        }
        return false;
    }

    public function removeImage(Image $image): bool
    {
        if ($this->images()->detach($image->id)) {
            return true;
        }
        return false;
    }

//    protected static function boot()
//    {
//        parent::boot();
//
//        static::saved(function(Model $section) {
//            $page = $section->pageable;
//            $page = get_class($page) == Section::class? $section->pageable->pageable : $page;//relation sections.sections
//            if ($page && get_class($page) == Page::class && $page->exists) {
//                $name = $page->route;
//                Cache::forget($name);
//                Cache::rememberForever($name, function () use($page) {
//                    return $page->load(['sections.images', 'sections.sections']);
//                });
//            }
//        });
//    }
}
