<div class="row mb-3">
    <div class="col col-attributes">

        <div class="form-group mb-3">
            @php
                $field_name = 'marks';
                $field_lable = __("Marks");
            @endphp

            {{ html()->label($field_lable, $field_name) }}

            {{ html()->multiselect('marks', $marks->pluck('title', 'id'))
                            ->class('form-control duallistbox') }}

        </div>


        <div class="form-group mb-3">
            @php
                $field_name = 'attributes';
                $field_lable = __("Attributes");
            @endphp

            {{ html()->label($field_lable, $field_name) }}

            {{ html()->multiselect('attributes', $attributes->pluck('title', 'id'))
                            ->class('form-control duallistbox') }}

        </div>
    </div>
</div>