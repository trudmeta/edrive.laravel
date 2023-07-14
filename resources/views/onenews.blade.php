@extends('layouts.base')

@section('title'){{ $news->title }}@endsection

@section('content')


<x-breadcrumbs h1="{{ $news->h1 }}" class="news">
    <x-breadcrumb-item route="{{ route('site.page.news') }}">@lang('News')</x-breadcrumb-item>
    <x-breadcrumb-item >{{ $news->name }}</x-breadcrumb-item>
</x-breadcrumbs>


<section class="news-item" data-news_id="{{ $news->id }}">
    <div class="wrapper">
        <div class="date">
            <span class="datetime">
                <i>
                    <svg>
                        <use xlink:href="svg/sprite.svg#ico18" />
                    </svg>
                </i>
                <span><time datetime="2017-03-10">{{ $news->updated_at->format('Y.m.d') }}</time></span>
            </span>
            <span class="views">
                <i>
                    <svg>
                        <use xlink:href="svg/sprite.svg#ico19" />
                    </svg>
                </i>
                <span title="@lang('Views')">{{ $news->visitors_count + 1 }}</span>
            </span>
        </div>

        <div class="wrapper-item">
            <div class="img"><img src="{{ asset($news->mainImage) }}" alt=""></div>
            <div class="system">
                {!! $news->content !!}
            </div>
        </div>
        <div class="networks">
            <span>Понравилась статья,<br>
                поделитесь с друзьями:</span>
            <ul>
                <li><a href="#"><i>
                            <svg>
                                <use xlink:href="{{ asset('svg/sprite.svg#facebook') }}"/>
                            </svg>
                        </i></a></li>
                <li><a href="#"><i>
                            <svg>
                                <use xlink:href="{{ asset('svg/sprite.svg#ico20') }}"/>
                            </svg>
                        </i></a></li>
                <li><a href="#"><i>
                            <svg>
                                <use xlink:href="{{ asset('svg/sprite.svg#youtube') }}"/>
                            </svg>
                        </i></a></li>
                <li><a href="#"><i>
                            <svg>
                                <use xlink:href="{{ asset('svg/sprite.svg#ico21') }}"/>
                            </svg>
                        </i></a></li>
                <li><a href="#"><i>
                            <svg>
                                <use xlink:href="{{ asset('svg/sprite.svg#ico22') }}"/>
                            </svg>
                        </i></a></li>
                <li><a href="#"><i>
                            <svg>
                                <use xlink:href="{{ asset('svg/sprite.svg#ico15') }}"/>
                            </svg>
                        </i></a></li>
            </ul>
        </div>
    </div>
</section>

<section class="news">
    <div class="news__single wrapper">
        <h2 class="line">Почитайте также</h2>
        <ul>
            @foreach($lastNews as $news)
            <li>
                <div class="img"><a href="{{ route('site.onenews', [$news->alias]) }}"><img class="b-lazy" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="{{ asset($news->image->url) }}" alt=""></a></div>
                <h3><a href="{{ route('site.onenews', [$news->alias]) }}">{{ $news->name }}</a></h3>
                <p><a href="{{ route('site.onenews', [$news->alias]) }}">Прочитать подробнее ></a></p>
            </li>
            @endforeach
        </ul>
    </div>
</section>

@endsection

@push ('js-scripts')
    <script>
        //Visitor counter
        let xhr = new XMLHttpRequest();
        const news = document.querySelector(".news-item");
        let data = {
            news_id: news.dataset.news_id
        }
        xhr.open('POST', "/ajaxVisitors", true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
        xhr.setRequestHeader('X-CSRF-TOKEN', document.querySelector('meta[name="csrf-token"]').content)
        xhr.send(JSON.stringify(data));
    </script>
@endpush