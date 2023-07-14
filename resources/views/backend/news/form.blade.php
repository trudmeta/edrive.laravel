<div class="mb-4"><h5>@lang('Basic data')</h5></div>

<div class="row mb-3">
    <div class="col">
        <div class="form-group">
            @php
                $field_name = 'name';
                $field_lable = 'Name';
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
                $field_name = 'alias';
                $field_lable = __("Alias");
                $field_placeholder = $field_lable;
                $required = "required";
            @endphp

            {{ html()->label($field_lable, $field_name) }}
            {{ html()->text($field_name)->placeholder($field_placeholder)->class('form-control')->attributes(["$required"]) }}
        </div>
    </div>
</div>
<div class="row mb-3">
    <div class="col-12">
        <div class="form-group">
            <?php
            $field_name = 'content';
            $field_lable = __("Content");
            $field_placeholder = $field_lable;
            ?>
            {{ html()->label($field_lable, $field_name) }}
            {{ html()->textarea($field_name)->placeholder($field_placeholder)->class('form-control js-description') }}
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
                {{ html()->radio($field_name)->value(1)->checked(old('status', $$model->status === 1))->id('statusYes') }}
                {{ html()->label("Yes", 'statusYes')->class('me-3') }}
                {{ html()->radio($field_name)->value(0)->checked(old('status', $$model->status === 0))->id('statusNo') }}
                {{ html()->label("No", 'statusNo') }}
            </div>
        </div>
    </div>
</div>
<div class="row mb-3 js-preview js-preview-one" id="preview">
    @if($$model->image)
    <div class="col-sm-6 col-lg-4 mb-3 images-wrapper">
        <div class="card card-image h-100">
            <div class="card-body">
                <img src="{{ asset($$model->image->url) }}" alt="">
                <div class="button-layer">
                    <a href="{{ asset($$model->image->url) }}" class="btn btn-success js-popup" title="@lang('show')">
                        <i class="cil-zoom"></i>
                    </a>

                    <button class="btn btn-danger js-image-delete" data-image-id="{{ $$model->image->id }}" title="@lang('delete')">
                        <i class="cil-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
    @endif
</div>
<div class="row mb-3 new-image">
    <div class="col">
        <div class="form-group mb-3">
            <div class="js-image-template d-none">@include('backend.includes.image')</div>

            <div class="input-group-append">
                <button class="btn btn-info js-button-image" type="button" id="button-image" data-folder="file" data-preview="preview"><i class="fas fa-folder-open"></i>@lang("Image")</button>
            </div>
        </div>
    </div>
</div>