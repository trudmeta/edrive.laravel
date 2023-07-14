@props(["models"=>"", "icon"=>"cil-settings", "title", "small"=>"", "class"=>""])

<div class="d-flex flex-column flex-sm-row justify-content-between align-items-center align-content-center">
    @php
        $field_name = 'search';
        $field_lable = __("Search");
        $field_placeholder = $field_lable;
    @endphp
    {{ html()->label($field_lable, $field_name)->class('me-2 mb-2 mb-sm-0') }}
    {{ html()->text($field_name, request()->search ?? '')->class('js-search h-100 mb-2 mb-sm-0') }}
    <x-buttons.edit route='{{ route("backend.$models.index") }}' title="{{__('Search')}} name" class="ms-1 mb-2 mb-sm-0 js-search-btn" icon="cil-search" />
</div>