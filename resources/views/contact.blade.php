@extends('layouts.base')

@section('content')

<x-breadcrumbs h1="Контактная информация">
    <x-breadcrumb-item>Контактная информация</x-breadcrumb-item>
</x-breadcrumbs>

<div class="container">
    @php
        $section = $pageSections->sections->where('position', 'header')->first();
    @endphp
    <h6 class="_h6">{{ $section->content }}</h6>
</div>

@include('widgets.contacts')

<section class="map">
    <div class="map__contacts">
        <div class="container">
            <h2 class="line">Мы на карте</h2>
            <p>Наш магазин находится по адресу: {{ settings('address') }}</p>
            <!-- data-zoom - зум карты -->
            <!-- data-address - адресс компании -->
            @php
                $longitude = $pageSections->sections->where('position', 'longitude')->first()->content;
                $latitude = $pageSections->sections->where('position', 'latitude')->first()->content;
            @endphp
            <div class="map-container" data-long="{{ $longitude }}" data-latd="{{ $latitude }}" data-zoom="11" data-address="{{ settings('address') }}">
                <div id="map-wrapper"></div>
            </div>
        </div>
    </div>
</section>

@endsection

@push ('js-scripts')
    <script defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDRBWujbbes17nOlBPAt7Juc53KR4XQGss&callback=wHTML.initMapContacts"></script>
@endpush