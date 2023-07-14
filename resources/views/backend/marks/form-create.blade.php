<div class="row mb-3">
    <div class="col-5">
        <div class="form-group">
            <?php
            $field_name = 'title';
            $field_lable = __("Title");
            $field_placeholder = $field_lable;
            $required = "required";
            ?>
            {{ html()->label($field_lable, $field_name) }} {!! fieldRequired($required) !!}
            {{ html()->text($field_name)->placeholder($field_placeholder)->class('form-control')->attributes(["$required"]) }}
        </div>
    </div>

    <div class="col">
        <div class="form-group">
            <?php
            $field_name = 'alias';
            $field_lable = __("Alias");
            $field_placeholder = $field_lable;
            $required = "required";
            ?>
            {{ html()->label($field_lable, $field_name) }} {!! fieldRequired($required) !!}
            {{ html()->text($field_name)->placeholder($field_placeholder)->class('form-control')->attributes(["$required"]) }}
        </div>
    </div>
</div>
<div class="row mb-5">
    <div class="col">
        <div class="form-group">
            @php
                $field_name = 'status';
                $field_lable = __("Status");
                $field_placeholder = $field_lable;
            @endphp

            {{ html()->label($field_lable) }}
            <div>
                {{ html()->radio($field_name)->value(1)->checked(true)->id('statusYes') }}
                {{ html()->label("Yes", 'statusYes')->class('me-3') }}
                {{ html()->radio($field_name)->value(0)->id('statusNo') }}
                {{ html()->label("No", 'statusNo') }}
            </div>
        </div>
    </div>
</div>