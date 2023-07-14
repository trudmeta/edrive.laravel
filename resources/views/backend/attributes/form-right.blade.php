<div class="row mb-3 pt-3 pb-3 border align-items-end">
    <div class="mb-2"><h5>@lang('New value')</h5></div>
    <div class="col-sm-5">
        <div class="form-group">
            @php
                $field_name = 'title';
                $field_lable = __("Title");
                $field_placeholder = $field_lable;
            @endphp

            {{ html()->label($field_lable, $field_name) }}
            {{ html()->text()->placeholder($field_placeholder)->class('form-control') }}
        </div>
    </div>
    <div class="col-sm-5">
        <div class="form-group">
            @php
                $field_name = 'alias';
                $field_lable = __("Alias");
                $field_placeholder = $field_lable;
            @endphp

            {{ html()->label($field_lable, $field_name) }}
            {{ html()->text()->placeholder($field_placeholder)->class('form-control') }}
        </div>
    </div>
    <div class="col-sm-2">
        <button type="button" class="btn btn-success js-add-value" data-toggle="tooltip" title="{{ __('Create value') }}">
            <i class="cil-plus"></i>
        </button>
    </div>
</div>

<div class="row mb-3">
    <div class="col col-values">

        <div class="form-group mb-3">
            @php
                $field_name = 'values';
                $field_lable = __("Values");
            @endphp

            {{ html()->label($field_lable, $field_name) }}

            {{ html()->multiselect('values', $$model->values->pluck('title', 'id'), $$model->values->pluck('id'))
                            ->class('form-control duallistbox') }}

        </div>

    </div>
</div>