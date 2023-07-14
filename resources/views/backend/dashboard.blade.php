@extends('backend.layouts.app')

@section('title') @lang("Dashboard") @endsection

@section('breadcrumbs')
    <x-backend-breadcrumbs />
@endsection

@section('content')
    <div class="card mb-4 ">
        <div class="card-body">

            <x-backend.section-header>
                @lang("Welcome to", ['name'=>config('app.name')])

                <x-slot name="subtitle">
                    @datetoday
                </x-slot>

            </x-backend.section-header>

            <hr>

        </div>
    </div>
    <!-- / card -->

    @include("backend.includes.dashboard_demo_data")

@endsection