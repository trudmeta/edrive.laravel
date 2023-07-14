@extends('backend.layouts.app')

@section('title') @endsection

@section('breadcrumbs')
<x-backend-breadcrumbs>
    <x-backend-breadcrumb-item route='{{route("backend.$models.index")}}' icon=''>
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
                <x-backend.buttons.return-back />
                <a href='{{ route("backend.$models.index") }}' class="btn btn-secondary" data-toggle="tooltip" title="{{ Str::ucfirst($models) }} List"><span>List</span></a>
            </x-slot>
        </x-backend.section-header>

        <hr>

        <div class="row mt-4">
            <div class="col-12 col-sm-6">
                <div><h5>@lang('Basic data')</h5></div>
                <table class="table table-responsive-sm table-hover table-bordered">
                    <?php
                    $all_columns = getTableColumns($$model->getTable());
                    ?>
                    <thead>
                    <tr>
                        <th scope="col">
                            <strong>
                                {{ __('Name') }}
                            </strong>
                        </th>
                        <th scope="col">
                            <strong>
                                @lang('Value')
                            </strong>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($all_columns as $column)
                        @php
                            $columnName = $column->Field;
                        @endphp
                        <tr>
                            <td>
                                <strong>
                                    {{ $columnName }}
                                </strong>
                            </td>
                            <td>
                                {{ showColumnValue($$model, $column) }}
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>

            </div>
            <div class="col-12 col-sm-6"></div>
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