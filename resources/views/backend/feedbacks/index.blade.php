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
                                @lang('Name')
                            </th>
                            <th>
                                @lang('Phone')
                            </th>
                            <th>
                                IP
                            </th>
                            <th>
                                @lang('Created')
                            </th>
                            <th>
                                @lang('Status')
                            </th>
                            <th class="text-end">
                                @lang('Action')
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
                                {{ $model->name }}
                            </td>
                            <td>
                                {{ $model->phone }}
                            </td>
                            <td>
                                {{ $model->visitor }}
                            </td>
                            <td>
                                {{ $model->created_at->diffForHumans() }}
                            </td>
                            <td>
                                {{ $model->status }}
                            </td>
                            <td class="text-end">
                                <a href='{{ route("backend.$models.show", $model->id) }}' class='btn btn-sm btn-success mt-1' data-toggle="tooltip" title="Show "><i class="cil-screen-desktop"></i></a>
                                <form method="POST" action="{{ route("backend.$models.destroy", $model->id) }}" class="btn-form-delete">
                                    {{ method_field('DELETE') }}
                                    {{ csrf_field() }}
                                    <button class="btn btn-sm btn-danger mt-1"  type="submit" data-toggle="confirmation-singleton" title="Delete">
                                        <i class="cil-trash"></i>
                                    </button>
                                </form>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
                {{ $$models->links() }}
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