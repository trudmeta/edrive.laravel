<div class="mb-4"><h5>@lang('Meta data')</h5></div>

<div class="row mb-3">
    <div class="col">
        <div class="form-group">
            @php
                $field_name = 'title';
                $field_lable = __("Title");
                $field_placeholder = $field_lable;
                $required = "required";
            @endphp

            {{ html()->label($field_lable, $field_name) }}
            {{ html()->text($field_name)->placeholder($field_placeholder)->class('form-control')->attributes(["$required"]) }}
        </div>
    </div>
</div>
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