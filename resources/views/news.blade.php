@extends('layouts.base')

@section('content')

<x-breadcrumbs h1="{{ __('News and market reviews') }}">
    <x-breadcrumb-item>@lang('News')</x-breadcrumb-item>
</x-breadcrumbs>

<!--Start:news-->
<section class="news">
    <div class="news__item wrapper">
        <h2>Новости и обзоры</h2>
        <ul>
            @foreach($news as $new)
                <li>
                    <div class="img"><a href="{{ route('site.onenews', [$new->alias]) }}"><img class="b-lazy" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="{{ asset($new->mainImage) }}" alt=""></a></div>
                    <h3><a href="{{ route('site.onenews', [$new->alias]) }}">{{ $new->name }}</a></h3>
                    <p><a href="{{ route('site.onenews', [$new->alias]) }}">Прочитать подробнее ></a></p>
                </li>
            @endforeach
        </ul>
    </div>
</section>

{{ $news->onEachSide(2)->links() }}
<!--End:news-->

@include('widgets.contacts')

@endsection