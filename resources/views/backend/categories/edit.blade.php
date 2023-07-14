@extends('backend.layouts.app')

@section('title')  @endsection

@section('breadcrumbs')
<x-backend-breadcrumbs>
    <x-backend-breadcrumb-item route='{{ route("backend.$models.index") }}' icon=''>
        {{ Str::ucfirst($models) }}
    </x-backend-breadcrumb-item>
    <x-backend-breadcrumb-item type="active">{{ $$model->title }}</x-backend-breadcrumb-item>
</x-backend-breadcrumbs>
@endsection

@section('content')
<div class="card">
    <div class="card-body">
        <x-backend.section-header>
            <span title="action">{{ Str::ucfirst($models) }} <small class="text-muted">{{ request()->route()->getActionMethod() }}</small></span>
            <x-slot name="toolbar">
                <x-buttons.create route='{{ route("backend.$models.create") }}' icon='cil-plus' title="{{__('Create')}} {{ $models }}" />

                <x-backend.buttons.return-back />
                <a href='{{ route("backend.$models.index") }}' class="btn btn-secondary" data-toggle="tooltip" title="{{ Str::ucfirst($models) }} List"><span>@lang("List")</span></a>
                <x-buttons.show route='{{ route("backend.$models.show", $$model) }}' title="{{__('Edit')}} name" class="ms-1" icon="cil-screen-desktop" />
            </x-slot>
        </x-backend.section-header>

        <hr>

        {{ html()->modelForm($$model, 'PATCH', route("backend.$models.update", $$model))->class('form')->open() }}
            {{ html()->hidden('category_id', $$model->id) }}

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
                            @include ("backend.$models.form", [$model])
                        </div>

                        <div class="wrap" :class="{ 'active': activeTab === 1 }">
                            <div class="row mb-3">
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

                        <script>
                            const sectionsJson = {{ Illuminate\Support\Js::from($$model->sections) }};
                            sectionsJson.map(section => {
                                section.id_rand = randId();
                                return section;
                            });

                            function randId() {
                                return (Math.random() * 100).toFixed(0);
                            }

                            function addRemove() {
                                return {
                                    index: sectionsJson.length-1,
                                    title: '',
                                    content: '',
                                    position: '',
                                    sort: '',
                                    sections: sectionsJson,
                                    add() {
                                        this.index = ++this.index;
                                        this.sections = [].concat(this.sections, {
                                            id_rand: randId(),
                                            title: this.title,
                                            content: this.content,
                                            position: this.position,
                                            sort: this.sort,
                                        });
                                        this.title = '';
                                        this.content = '';
                                        this.position = '';
                                        this.sort = '';
                                    }
                                }
                            }
                        </script>
                        <div class="wrap wrap-sections" :class="{ 'active': activeTab === 2 }" x-data="addRemove()">
                            <div class="row mb-3 section section-init border">
                                <div class="col-12">
                                    <h4>@lang('New section')</h4>
                                    <div class="form-group mt-2 mb-3">
                                        <label>Title</label>
                                        <input type="text" class="form-control" x-model="title">
                                    </div>
                                    <div class="form-group mb-3">
                                        <label>Content</label>
                                        <textarea class="form-control" rows="4"
                                                  x-model="content">
                                            </textarea>
                                    </div>
                                    <div class="form-group mb-3">
                                        <label>Position</label>
                                        <input type="text" class="form-control" x-model="position">
                                    </div>
                                    <div class="form-group mb-3">
                                        <label>Sort</label>
                                        <input type="number" min="0" class="form-control d-block w-100" x-model="sort">
                                    </div>
                                    <div class="mb-3">
                                        <div class="form-group">
                                            <button class="btn btn-sm btn-success" @click.stop.prevent="add()">{{ __('Add section') }}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <template x-for="(section, index) in Object.values(sections)" :key="index">
                                <div class="row mb-3 section border" :class="'section-'+index">
                                    <input type="hidden" :name="'sections['+index+'][id]'" :value="section.id">
                                    <div class="col-12">
                                        <div class="form-group mt-2 mb-3">
                                            <label>Title</label>
                                            <input type="text" class="form-control" :name="'sections['+index+'][title]'" x-model="section.title">
                                        </div>
                                        <div class="form-group mb-3">
                                            <label>Content</label>
                                            <textarea class="form-control" rows="4" :name="'sections['+index+'][content]'"
                                                      x-model="section.content"
                                            >
                                            </textarea>
                                        </div>
                                        <div class="form-group mb-3">
                                            <label>Position</label>
                                            <input type="text" class="form-control" :name="'sections['+index+'][position]'" x-model="section.position">
                                        </div>
                                        <div class="form-group mb-3">
                                            <label>Sort</label>
                                            <input type="number" min="0" class="form-control d-block w-100" :name="'sections['+index+'][sort]'" x-model="section.sort">
                                        </div>
                                        <div class="mb-3">
                                            <div class="form-group">
                                                <button class="btn btn-sm btn-danger" @click.stop.prevent="sections = sections.filter(s => s.id_rand !== section.id_rand);index--;console.log(sections);">{{ __('Remove section') }}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>

                        </div>

                    </div>{{-- tab-content--}}

                </div>


                <div class="col-12 col-sm-6 col-right">

                    @include ("backend.$models.form-right", [$model])

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
                    Updated: {{ $$model->updated_at->diffForHumans() }},
                    Created at: {{ $$model->created_at->isoFormat('LLLL') }}
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
    <script type="module" src="{{ asset('vendor/summernote/summernote-lite.min.js') }}"></script>
@endpush