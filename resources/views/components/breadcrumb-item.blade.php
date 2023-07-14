@props(["route"=>""])

@if($route)
    <li>
        <a href='{{$route}}'>
            {{ $slot }}
        </a>
    </li>
@else
    <li>
        <span>{{ $slot }}</span>
    </li>
@endif
