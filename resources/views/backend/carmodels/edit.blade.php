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

        <div class="row mt-4">
            <div class="col">
                {{ html()->modelForm($$model, 'PATCH', route("backend.$models.update", $$model->id))->class('form')->open() }}

                @include ("backend.$models.form")

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
        </div>
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