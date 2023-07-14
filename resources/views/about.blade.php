@extends('layouts.base')

@section('content')

<x-breadcrumbs h1="E-Drive">
    <x-breadcrumb-item>@lang('About')</x-breadcrumb-item>
</x-breadcrumbs>

<section class="section">
    <div class="section__1">
        <div class="container">
            @php
                $section = $pageSections->sections->where('position', 'header')->first();
            @endphp
            <h6 class="_h6">{{ $section->content }}</h6>
            <div class="grid grid--def-2">
                <div class="gcell img">
                    @if($section->images->isNotEmpty())
                    <img class="b-lazy" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="{{ asset($section->images->first()->url) }}" alt="">
                    @endif
                </div>
                <div class="gcell">
                    <div class="desc">
                        @php
                            $section = $pageSections->sections->where('position', 'in_stock')->first();
                        @endphp
                        {!! $section->content !!}
                        <ul>
                            <li>
                                <i>
                                    <svg>
                                        <use xlink:href="{{ asset('svg/sprite.svg#ico7') }}" />
                                    </svg>
                                </i>
                                @php
                                    $section = $pageSections->sections->where('position', 'testdrive')->first();
                                @endphp
                                <h5>{{ $section->title }}</h5>
                                {!! $section->content !!}
                            </li>
                            <li>
                                <i>
                                    <svg>
                                        <use xlink:href="{{ asset('svg/sprite.svg#ico8') }}" />
                                    </svg>
                                </i>
                                @php
                                    $section = $pageSections->sections->where('position', 'econom')->first();
                                @endphp
                                <h5>{{ $section->title }}</h5>
                                {!! $section->content !!}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!--End: about-1 -->

<!--Start: map -->
<section class="map">
    <div class="map__charge">
        <div class="container">
            @php
                $section = $pageSections->sections->where('position', 'map')->first();
            @endphp
            <h2 class="line">{{ $section->title }}</h2>
            <h6 class="_h6">{!! $section->content !!}</h6>
            <!-- data-zoom - зум карты -->
            <div class="map-container" data-long="32.0956122" data-latd="48.9880453" data-zoom="7" data-json="{{ asset('json/map_points.json') }}">
                <div id="map-wrapper"></div>
                <div class="map-legend">
                    <h6 id="legend">legend</h6>
                    <ul>
                        <li>
                            <img src="{{ asset('images/marker1.png') }}" alt="">
                            <p>Public Stations</p>
                            <span>Installed by business or government</span>
                        </li>
                        <li>
                            <img src="{{ asset('images/marker2.png') }}" alt="">
                            <p>High Power Stations</p>
                            <span>DC fast charge or SuperChargers</span>
                        </li>
                        <li>
                            <img src="{{ asset('images/marker3.png') }}" alt="">
                            <p>In-Use Stations</p>
                            <span>Currently in-use</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>
<!--End: map -->

<!--Start: about-2 -->
<section class="section">
    <div class="section__2">
        <div class="container">
            <div class="grid grid--def-2">
                @php
                    $section = $pageSections->sections->where('position', 'service')->first();
                @endphp
                <div class="gcell img">
                    <img class="b-lazy" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="{{ asset($section->images->first()->url) }}" alt="">
                </div>
                <div class="gcell">
                    <div class="desc">{!! $section->content !!}</div>
                </div>
            </div>
            <div class="grid grid--def-2">
                @php
                    $section = $pageSections->sections->where('position', 'service2')->first();
                @endphp
                <div class="gcell img">
                    <img class="b-lazy" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="{{ asset($section->images->first()->url) }}" alt="">
                </div>
                <div class="gcell">
                    <div class="desc">{!! $section->content !!}</div>
                </div>
            </div>
        </div>
    </div>
</section>

@include('widgets.contacts')

@endsection


@push ('js-scripts')
    <script defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDRBWujbbes17nOlBPAt7Juc53KR4XQGss&callback=wHTML.initMap"></script>
@endpush
