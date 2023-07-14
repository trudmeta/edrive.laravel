@props(["route"=>"", "icon"=>"", "title"=>"", "type"=>""])

@if($route)
<li class="breadcrumb-item">
    <a href='{{$route}}'>
        <i class="{{ $icon }}"></i>
        {{ $slot }}
    </a>
</li>
@else
<li class="breadcrumb-item active">
    <span>
        @if($icon)<i class="{{ $icon }}"></i>@endif
        {{ $slot }}
    </span>
</li>
@endif
