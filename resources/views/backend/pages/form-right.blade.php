@foreach($sections as $section)
<div class="row mb-3 form">
    <div class="col">
        <input type="hidden" name="sections[{{ $section->id }}][id]" value="{{ $section->id }}">
        <input class="js-eloquentModel" type="hidden" name="sections[{{ $section->id }}][eloquentModel]" value="App\Models\Section">
        <input class="js-models" type="hidden" name="sections[{{ $section->id }}][models]" value="sections">
        <input class="js-model_id" type="hidden" name="sections[{{ $section->id }}][id]" value="{{ $section->id }}">
        <input type="hidden" name="sections[{{ $section->id }}][pageable_type]" value="{{ $section->pageable_type }}">
        <input type="hidden" name="sections[{{ $section->id }}][pageable_id]" value="{{ $section->pageable_id }}">
        <div class="form-group mb-2">
            <?php
            $field_name = 'sections['.$section->id.'][title]';
            $field_lable = __("Title");
            $field_placeholder = $field_lable;
            ?>
            <label for="{{ $field_name }}">{{ $field_lable }}</label>
            <input class="form-control" type="text" name="{{ $field_name }}" id="{{ $field_name }}" value="{{ $section->title }}" placeholder="{{ $field_lable }}" required="">
        </div>
        <div class="form-group mb-2">
            <?php
            $field_name = 'sections['.$section->id.'][content]';
            $field_lable = __("Content");
            $field_placeholder = $field_lable;
            ?>
            <label for="{{ $field_name }}">{{ $field_lable }}</label>
            <textarea class="form-control js-description" name="{{ $field_name }}" id="{{ $field_name }}" placeholder="{{ $field_lable }}">{{ $section->content }}</textarea>
        </div>
        <div class="form-group mb-2">
            <h6>{{ __("Position") }}</h6>
            <h6 title="position" class="fw-bold">{{ $section->position }}</h6>
        </div>
        <div class="form-group mb-2">
            <?php
            $field_name = 'sections['.$section->id.'][sort]';
            $field_lable = __("Sort");
            $field_placeholder = $field_lable;
            ?>
            <label for="{{ $field_name }}">{{ $field_lable }}</label>
            <input class="form-control" type="number" name="{{ $field_name }}" min="0" id="{{ $field_name }}" value="{{ $section->sort }}" placeholder="{{ $field_lable }}">
        </div>
        <div class="form-group mb-2">
            <h6 title="pageable_type">{{ $section->pageable_type }}</h6>
        </div>
        <div class="row mb-2 js-preview js-preview-one" id="preview_{{$section->id}}">
        @if($section->images->isNotEmpty())
            @foreach($section->images as $image)
            <div class="col mb-3 images-wrapper">
                <div class="card card-image h-100" style="max-height: 250px">
                    <div class="card-body">
                        <img src="{{ asset($image->url) }}" alt="">
                        <div class="button-layer">
                            <a href="{{ asset($image->url) }}" class="btn btn-success js-popup" title="@lang('show')">
                                <i class="cil-zoom"></i>
                            </a>

                            <button class="btn btn-danger js-image-delete" data-image-id="{{ $image->id }}" title="@lang('delete')">
                                <i class="cil-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            @endforeach
        @endif
        </div>

        <div class="row mb-3 new-image">
            <div class="col">
                <div class="form-group mb-3">
                    <div class="js-image-template d-none">@include('backend.includes.image')</div>

                    <div class="input-group-append">
                        <button class="btn btn-info js-button-image" type="button" data-folder="file" data-preview="preview_{{$section->id}}"><i class="fas fa-folder-open"></i>@lang("Image")</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@if(!empty($section->sections))
    @include ("backend.$models.form-right", ['sections' => $section->sections])
@endif
@endforeach
<hr>
