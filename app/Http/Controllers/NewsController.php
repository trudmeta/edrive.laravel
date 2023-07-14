<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Visitor;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class NewsController extends Controller
{
    public function news(int $pageN = 1)
    {
        return view('news', [
            'news' => News::getNewsByPage($pageN),
        ]);
    }

    public function onenews(News $news)
    {
        return view('onenews', [
            'news' => $news,
            'lastNews' => News::getLastNews($news->alias)
        ]);
    }

    public function ajaxVisitors(Request $request)
    {
        $validated = $request->validate([
            'news_id' => 'required|exists:news,id',
        ]);
        $visitor = Visitor::where([
            'visitor' => request()->ip(),
            'news_id' => $validated['news_id']
        ])->first();

        if (!$visitor) {
            Visitor::create([
                'visitor' => request()->ip(),
                'news_id' => $validated['news_id'],
                'created_at' => now(),
            ]);
        }
    }
}
