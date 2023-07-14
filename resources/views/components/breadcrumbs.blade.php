@props(["class"=>"item", 'h1'=>''])

<section class="breadcrumb">
    <div {{ $attributes->merge(['class' => 'breadcrumb__' . $class]) }}>
        <div class="wrapper">
            <ul>
                <li><span><a href="/">Главная</a></span></li>
                {{ $slot }}
            </ul>
            @if($h1)<h1>{{ $h1 }}</h1>@endif
        </div>
    </div>
</section>