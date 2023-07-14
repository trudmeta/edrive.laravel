<div class="form-group mb-3 {{ $errors->has($setting->name) ? ' has-error' : '' }}">
    <label for="{{ $setting->name }}" class='form-label'> <strong>{{ $setting->label }}</strong> ({{ $setting->name }})</label>
    <input type="{{ $setting->type }}"
           name="{{ $setting->name }}"
           value="{{ old($setting->value, $setting->value) }}"
           class="form-control w-25 {{ $errors->has($setting->name) ? ' is-invalid' : '' }}"
           id="{{ $setting->name }}"
           placeholder="{{ $setting->label }}">

    @if ($errors->has($setting->name)) <small class="invalid-feedback">{{ $errors->first($setting->name) }}</small> @endif
</div>