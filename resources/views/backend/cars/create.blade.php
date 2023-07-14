@extends('backend.layouts.app')

@section('title')  @endsection

{{-- $models = cars --}}

@section('breadcrumbs')
<x-backend-breadcrumbs>
    <x-backend-breadcrumb-item route='{{ route("backend.$models.index") }}' icon=''>
        {{ Str::ucfirst($models) }}
    </x-backend-breadcrumb-item>
</x-backend-breadcrumbs>
@endsection

@section('content')
    <div class="card">
        <div class="card-body">
            <x-backend.section-header>
                <span title="action">{{ Str::ucfirst($models) }} <small class="text-muted">{{ request()->route()->getActionMethod() }}</small></span>

                <x-slot name="toolbar">
                    <x-backend.buttons.return-back />
                    <a href='{{ route("backend.$models.index") }}' class="btn btn-secondary" data-toggle="tooltip" title="Cars List"><span>@lang("List")</span></a>
                </x-slot>
            </x-backend.section-header>

            <hr>

            {{ html()->form('POST', route("backend.$models.store"))->class('form')->open() }}
            <div class="row mt-4">
                <div class="col-12 col-sm-6 col-left tabs-wrapper" x-data="{ activeTab:  0 }">

                    <div class="tabs-header mb-3">
                        <div class="tabs" id="tabs">
                            <div class="tab" @click="activeTab = 0" :class="{ 'active': activeTab === 0 }">
                                <h5 class="js-tab-h5">@lang('Basic data')</h5>
                            </div>
                            <div class="tab" @click="activeTab = 1" :class="{ 'active': activeTab === 1 }">
                                <h5 class="js-tab-h5">@lang('Meta data')</h5>
                            </div>
                        </div>
                    </div>
                    <div class="tab-content">
                        <div class="wrap" :class="{ 'active': activeTab === 0 }">
                            @include ("backend.$models.form-create")
                        </div>
                        <div class="wrap" :class="{ 'active': activeTab === 1 }">

                            <div class="row mb-3">
                                <div class="col">
                                    <div class="form-group">
                                        @php
                                            $field_name = 'h1';
                                             $field_lable = "H1";
                                             $field_placeholder = $field_lable;
                                        @endphp

                                        {{ html()->label($field_lable, $field_name) }}
                                        {{ html()->text($field_name)->placeholder($field_placeholder)->class('form-control') }}
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col">
                                    <div class="form-group">
                                        @php
                                            $field_name = 'keywords';
                                             $field_lable = "Keywords";
                                             $field_placeholder = $field_lable;
                                        @endphp

                                        {{ html()->label($field_lable, $field_name) }}
                                        {{ html()->text($field_name)->placeholder($field_placeholder)->class('form-control') }}
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-12">
                                    <div class="form-group">
                                        <?php
                                        $field_name = 'description';
                                        $field_lable = __("Description");
                                        $field_placeholder = $field_lable;
                                        $required = "required";
                                        ?>
                                        {{ html()->label($field_lable, $field_name) }}
                                        {{ html()->textarea($field_name)->placeholder($field_placeholder)->class('form-control js-description') }}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                <div class="col-12 col-sm-6 col-right">

                    @include ("backend.$models.form-right-create")

                </div>

            </div>

            <div class="row">
                <div class="col-4">
                    <div class="form-group">
                        {{ html()->submit($text = icon()." Save")->class('btn btn-success') }}
                    </div>
                </div>

                <div class="col-8">
                    <div class="float-end">
                        <a href='{{ route("backend.$models.index") }}' class="btn btn-warning" data-toggle="tooltip" title="{{__('labels.backend.cancel')}}"><span>Cancel</span></a>
                    </div>
                </div>
            </div>
            {{ html()->form()->close() }}

        </div>

        <div class="card-footer">
            <div class="row">
                <div class="col">
                    <small class="float-end text-muted">

                    </small>
                </div>
            </div>
        </div>
    </div>
@endsection


@push('after-styles')
    <!-- File Manager -->
    <link rel="stylesheet" href="{{ asset('vendor/laravel-filemanager/css/lfm.css') }}">

    <link href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.css" rel="stylesheet">
@endpush


@push ('js-scripts')
    <script type="module" src="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.js"></script>
    <script type="module" src="{{ asset('vendor/laravel-filemanager/js/stand-alone-button.js') }}"></script>

    <script>
        const attributesTypes = {{ Illuminate\Support\Js::from(\App\Models\Attribute::TYPES) }};
        const categoriesJson = {{ Illuminate\Support\Js::from($categories) }};
    </script>
@endpush