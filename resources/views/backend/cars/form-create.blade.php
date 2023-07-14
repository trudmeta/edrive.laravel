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
            $field_name = 'alias';
            $field_lable = __("Alias");
            $field_placeholder = $field_lable;
            $required = "";
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
            $field_name = 'mark_id';
            $field_lable = __("Mark");
            $field_placeholder = __("Select");
            $required = "";
            @endphp

            {{ html()->label($field_lable, $field_name) }}
            {{ html()->select($field_name)
                            ->placeholder($field_placeholder . ' ' . $field_lable)
                            ->class('form-control js-marks-create') }}
        </div>
    </div>
</div>
<div class="row mb-3">
    <div class="col">
        <div class="form-group">
            @php
            $field_name = 'model_id';
            $field_lable = __("Model");
            $field_placeholder = __("Select");
            @endphp

            {{ html()->label($field_lable, $field_name) }}
            {{ html()->select($field_name)
                            ->placeholder($field_placeholder . ' ' . $field_lable)
                            ->class('form-control js-models-create') }}
        </div>
    </div>
</div>
<div class="row mb-3">
    <div class="col">
        <div class="form-group">
            @php
            $field_name = 'category_id';
            $field_lable = __("Category");
            $field_placeholder = __("Select");
            @endphp

            {{ html()->label($field_lable, $field_name) }}
            {{ html()->select($field_name, $categories->pluck('title', 'id'))
                            ->placeholder($field_placeholder . ' ' . $field_lable)
                            ->class('form-control js-category-create') }}
        </div>
    </div>
</div>
<div class="row mb-3">
    <div class="col">
        <div class="form-group">
            @php
                $field_name = 'artikul';
                $field_lable = __("Artikul");
                $field_placeholder = $field_lable;
                $required = "required";
            @endphp

            {{ html()->label($field_lable, $field_name) }}
            {{ html()->text($field_name)->placeholder($field_placeholder)->class('form-control')->attributes(["$required"]) }}
        </div>
    </div>
</div>
<div class="row mb-3">
    <div class="col-sm-4 col-md-12 col-lg-4 mb-3 mb-sm-0">
        <div class="form-group">
            @php
            $field_name = 'price';
            $field_lable = 'Price';
            $field_placeholder = $field_lable;
            @endphp

            {{ html()->label($field_lable, $field_name) }}
            {{ html()->text($field_name)->placeholder($field_placeholder)->class('form-control') }}
        </div>
    </div>
    <div class="col-sm-4 col-md-12 col-lg-4 mb-3 mb-sm-0">
        <div class="form-group">
            @php
            $field_name = 'year';
            $field_lable = 'Year';
            $field_placeholder = $field_lable;
            @endphp

            {{ html()->label($field_lable, $field_name) }}
            {{ html()->text($field_name)->placeholder($field_placeholder)->class('form-control') }}
        </div>
    </div>
    <div class="col-sm-4 col-md-12 col-lg-4 mb-3 mb-sm-0">
        <div class="form-group">
            @php
            $field_name = 'mileage';
             $field_lable = 'Mileage';
             $field_placeholder = $field_lable;
            @endphp

            {{ html()->label($field_lable, $field_name) }}
            {{ html()->text($field_name)->placeholder($field_placeholder)->class('form-control')->value(0) }}
        </div>
    </div>
</div>
<div class="row mb-5">
    <div class="col d-flex justify-content-center flex-column align-items-center align-items-sm-stretch flex-sm-row justify-content-sm-between align-content-center mt-3">
        <div class="form-group">
            @php
                $field_name = 'available';
                $field_lable = __("Available");
                $field_placeholder = $field_lable;
            @endphp

            {{ html()->label($field_lable)->attribute('title', __('Available or on order')) }}
            <div>
                {{ html()->radio($field_name)->value(1)->checked(true)->id('availableYes') }}
                {{ html()->label("Yes", 'availableYes')->class('me-3') }}
                {{ html()->radio($field_name)->value(0)->id('availableNo') }}
                {{ html()->label("No", 'availableNo') }}
            </div>
        </div>
        <div class="form-group">
            @php
                $field_name = 'status';
                $field_lable = __("Status");
                $field_placeholder = $field_lable;
            @endphp

            {{ html()->label($field_lable)->attribute('title', __('Show?')) }}
            <div>
                {{ html()->radio($field_name)->value(1)->checked(true)->id('statusYes') }}
                {{ html()->label("Yes", 'statusYes')->class('me-3') }}
                {{ html()->radio($field_name)->value(0)->id('statusNo') }}
                {{ html()->label("No", 'statusNo') }}
            </div>
        </div>
    </div>
</div>

<div class="row mb-3 js-preview" id="preview"></div>

<div class="row mb-3 new-image">
    <div class="col">
        <div class="form-group mb-3">
            <div class="js-image-template d-none">@include('backend.includes.image')</div>

            <div class="input-group-append">
                <button class="btn btn-info js-button-image"
                        type="button"
                        id="button-image"
                        data-preview="preview">
                    <i class="fas fa-folder-open"></i>@lang("Image")
                </button>
            </div>
        </div>
    </div>
</div>