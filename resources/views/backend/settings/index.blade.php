@extends('backend.layouts.app')

@section('title') @endsection

@section('breadcrumbs')
<x-backend-breadcrumbs>
    <x-backend-breadcrumb-item type="active" icon=''>{{ Str::ucfirst($models) }}</x-backend-breadcrumb-item>
</x-backend-breadcrumbs>
@endsection

@section('content')
<div class="card">
    <div class="card-body">

        <x-backend.section-header>
            <span title="action">{{ Str::ucfirst($models) }} <small class="text-muted">{{ request()->route()->getActionMethod() }}</small></span>
        </x-backend.section-header>

        <hr>

        {{ html()->modelForm('POST', route("backend.$models.store"))->class('form')->open() }}
        <div class="row mt-4">
            <div class="col-12 col-sm-6 col-left tabs-wrapper" x-data="{ activeTab:  0 }">
                <div class="tabs-header mb-3">
                    <div class="tabs" id="tabs">
                        @foreach($tabs as $key => $tab)
                        <div class="tab" @click="activeTab = {{ $key }}" :class="{ 'active': activeTab === {{ $key }} }">
                            <h5 class="js-tab-h5">{{ __($tab) }}</h5>
                        </div>
                        @endforeach
                    </div>
                </div>
                <div class="tab-content">
                    @foreach($tabs as $key => $tab)
                    <div class="wrap" :class="{ 'active': activeTab === {{ $key }} }">
                        @foreach($settings->where('tab', $tab) as $key => $setting)
                        <div class="row mb-3">
                            <div class="col">
                                @include('backend.settings.fields.'.$setting->type)
                            </div>
                        </div>
                        @endforeach
                    </div>
                    @endforeach
                </div>
            </div>

        </div>

        <div class="row">
            <div class="col-4">
                <div class="form-group">
                    {{ html()->submit($text = icon()." Save")->class('btn btn-success') }}
                </div>
            </div>
        </div>
        {{ html()->form()->close() }}

    </div>
    <div class="card-footer">
        <div class="row">

        </div>
    </div>
</div>
@endsection


@push('after-styles')
    <link rel="stylesheet" href="{{ asset('vendor/laravel-filemanager/css/lfm.css') }}">
    <link rel="stylesheet" href="{{ asset('vendor/summernote/summernote-lite.min.css') }}">
    {{--    <link href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.css" rel="stylesheet">--}}
@endpush


@push ('js-scripts')
    {{--    <script type="module" src="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.js"></script>--}}
    <script type="module" src="{{ asset('vendor/laravel-filemanager/js/stand-alone-button.js') }}"></script>
    <script src="{{ asset('vendor/summernote/summernote-lite.min.js') }}"></script>
@endpush