@php
    if ($equipment = $carValues->get('equipment')) {
        $carValues = $carValues->forget('equipment');
    }
@endphp
<div class="mb-4"><h5>@lang('Characteristics')</h5></div>

<div class="row mb-3">
    <div class="col col-attributes">
        @php
            $field_name = '';
            $field_lable = __("Add attribute");
            $field_placeholder = $field_lable;
        @endphp
        <div class="form-group form-group-create mb-3">
            {{ html()->label($field_lable) }}
            {{ html()->select('', $$model->category->attributes->pluck('title', 'id'))
                            ->placeholder($field_placeholder)
                            ->attribute('title', __("Add new attribute"))
                            ->class('form-control js-add-attribute') }}
        </div>
        @php
            $field_name = '';
            $field_lable = __("Values");
            $field_placeholder = __("Select");
            $required = "";
        @endphp
        @foreach($carValues as $value)
        @php
            $attribute = $value->attribute;
        @endphp
        <div class="form-group mb-3">
        {{ html()->label($attribute->title, $attribute->alias) }}
        {{ html()->select('values[]', $attribute->values->pluck('title', 'id'), $value->id)
                        ->placeholder($field_placeholder . ' ' . $attribute->title)
                        ->class('form-control')
                        ->id($attribute->alias)
                        ->attributes(["$required"]) }}
        </div>
        @endforeach

        @if ($equipment)
            <div class="form-group mb-3">
                @php
                    $field_name = '';
                    $field_lable = __("Values");
                    $field_placeholder = __("Select");
                    $required = "";
                    $attribute = $equipment->first()->attribute;
                @endphp

                {{ html()->label($attribute->title, 'duallistbox') }}

                {{ html()->multiselect('values', $attribute->values->pluck('title', 'id'), $equipment->pluck('id'))
                                ->id('duallistbox')
                                ->class('form-control duallistbox')
                                ->attributes(["$required"]) }}

            </div>
        @endif
    </div>
</div>