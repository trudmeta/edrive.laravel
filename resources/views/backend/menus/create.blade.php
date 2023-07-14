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

        <div class="row mt-4">
            <div class="col">
                {{ html()->form('POST', route("backend.$models.store"))->class('form')->open() }}

                @include ("backend.$models.form-create")

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

            </div>
        </div>
    </div>
</div>

@endsection