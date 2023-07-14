<div class="form-group mb-3 {{ $errors->has($setting->name) ? ' has-error' : '' }}">
    <label for="{{ $setting->name }}" class='form-label'> <strong>{{ $setting->label }}</strong> ({{ $setting->name }})</label>
    <textarea
            name="{{ $setting->name }}"
            class="form-control js-description {{ $errors->has($setting->name) ? ' is-invalid' : '' }}"
            id="{{ $setting->name }}"
            placeholder="{{ $setting->label }}" rows="6">{{ $setting->value }}</textarea>

    @if ($errors->has($setting->name)) <small class="invalid-feedback">{{ $errors->first($setting->name) }}</small> @endif
</div>