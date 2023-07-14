@extends('backend.layouts.app')

@section('title')  @endsection

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
                    <a href='{{ route("backend.$models.index") }}' class="btn btn-secondary" data-toggle="tooltip" title="{{ Str::ucfirst($models) }} List"><span>@lang("List")</span></a>
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
                            <div class="tab" @click="activeTab = 2" :class="{ 'active': activeTab === 2 }">
                                {{-- route 'site.cars.*, specific content'--}}
                                <h5 class="js-tab-h5">@lang('Sections')</h5>
                            </div>
                        </div>
                    </div>
                    <div class="tab-content">
                        <div class="wrap" :class="{ 'active': activeTab === 0 }">
                            @include ("backend.$models.form-create", [$model])
                        </div>

                        <div class="wrap wrap-meta" :class="{ 'active': activeTab === 1 }">
                            <div class="row mb-3">
                                <div class="col-12">
                                    <div class="form-group">
                                        <?php
                                        $field_name = 'description';
                                        $field_lable = __("Description");
                                        $field_placeholder = $field_lable;
                                        ?>
                                        {{ html()->label($field_lable, $field_name) }}
                                        {{ html()->textarea($field_name)->placeholder($field_placeholder)->class('form-control js-description') }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="wrap wrap-sections" :class="{ 'active': activeTab === 2 }" x-data="{data: [], currentIndex: 0}">
                            <div class="row mb-3">
                                <div class="form-group">
                                    <button class="btn btn-success" @click.prevent="data.push({id: currentIndex});currentIndex++">{{ __('Add section') }}</button>
                                </div>
                            </div>
                            <template x-for="(item, index) in data" :key="item.id">
                                <div class="row mb-3 section border">
                                    <div class="col-12">
                                        <div class="form-group mt-2 mb-3">
                                            <label>Title</label>
                                            <input type="text" class="form-control" :name="'sections['+index+'][title]'" >
                                        </div>
                                        <div class="form-group mb-3">
                                            <label>Content</label>
                                            <textarea class="form-control js-description" :name="'sections['+index+'][content]'"
                                                      :id="'section_'+index"
                                            >
                                            </textarea>
                                        </div>
                                        <div class="form-group mb-3">
                                            <label>Position</label>
                                            <input type="text" class="form-control" :name="'sections['+index+'][position]'">
                                        </div>
                                        <div class="form-group mb-3">
                                            <label>Sort</label>
                                            <input type="number" min="0" class="form-control d-block w-100" :name="'sections['+index+'][sort]'" :value="index">
                                        </div>
                                        <div class="mb-3">
                                            <div class="form-group">
                                                <button class="btn btn-sm btn-danger" @click.prevent="data.splice(data.indexOf(item), 1);">{{ __('Remove section') }}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>

                        </div>

                    </div>{{-- tab-content--}}

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
    <link rel="stylesheet" href="{{ asset('vendor/summernote/summernote-lite.min.css') }}">
{{--    <link href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.css" rel="stylesheet">--}}
@endpush


@push ('js-scripts')
{{--    <script type="module" src="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.js"></script>--}}
    <script type="module" src="{{ asset('vendor/laravel-filemanager/js/stand-alone-button.js') }}"></script>
    <script src="{{ asset('vendor/summernote/summernote-lite.min.js') }}"></script>
@endpush