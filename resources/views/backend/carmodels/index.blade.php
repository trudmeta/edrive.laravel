@extends('backend.layouts.app')

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

            <x-slot name="toolbar">
                <x-buttons.create route='{{ route("backend.$models.create") }}' icon='cil-plus' title="{{__('Create')}} {{ $models }}" />
            </x-slot>
        </x-backend.section-header>

        <div class="row mt-4">
            <div class="col">
                <table id="datatable" class="table table-bordered table-hover table-responsive-sm">
                    <thead>
                        <tr>
                            <th>
                                #
                            </th>
                            <th>
                                Title
                            </th>
                            <th>
                                {{ html()->select('category', $marks->pluck('title', 'id'), request()->input('mark'))
                                                ->placeholder('Select mark')
                                                ->attribute('data-model', 'mark')
                                                ->class('form-control js-select-change-model') }}
                            </th>
                            <th>
                                Created
                            </th>
                            <th class="text-end">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        @foreach($$models as $model)
                        <tr>
                            <td>
                                {{ $model->id }}
                            </td>
                            <td>
                                <strong><a href='{{ route("backend.$models.edit", $model->id) }}'>{{ $model->title }}</a></strong>
                                <br>
                                <small class="text-muted">Updated At: {{ $model->updated_at->diffForHumans() }}</small>
                            </td>
                            <td>
                                <a href="{{ route("backend.marks.edit", $model->mark->id) }}">{{ $model->mark->title }}</a>
                            </td>
                            <td>
                                {{ $model->created_at }}
                            </td>
                            <td class="text-end">
                                <a href='{{ route("backend.$models.edit", $model->id) }}' class='btn btn-sm btn-primary mt-1' data-toggle="tooltip" title="Edit"><i class="cil-settings"></i></a>
                                <a href='{{ route("backend.$models.show", $model->id) }}' class='btn btn-sm btn-success mt-1' data-toggle="tooltip" title="Show"><i class="cil-screen-desktop"></i></a>
                                <form method="POST" action="{{ route("backend.$models.destroy", $model->id) }}" class="btn-form-delete">
                                    {{ method_field('DELETE') }}
                                    {{ csrf_field() }}
                                    <button class="btn btn-sm btn-danger mt-1"  type="submit" data-toggle="confirmation-singleton" title="@lang('Delete?')">
                                        <i class="cil-trash"></i>
                                    </button>
                                </form>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
                {{ $$models->appends(request()->all())->links() }}
            </div>
        </div>
    </div>
    <div class="card-footer">
        <div class="row">
            <div class="col-7">
                <div class="float-left">
                    Total - {{ $$models->total() }}
                </div>
            </div>
            <div class="col-5">
                <div class="float-end">

                </div>
            </div>
        </div>
    </div>
</div>
@endsection