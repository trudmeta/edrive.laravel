<section class="breadcrumb">
    <div class="breadcrumb__ecars">
        <div class="wrapper">
            <ul>
                <li><span><a href="/">Главная</a></span></li>
                @foreach($items as $item)
                    @php

                    @endphp
                    <li><span><a href="/">Главная</a></span></li>
                @endforeach
            </ul>
            <h1>{{ $currentCategory->h1 }}</h1>
        </div>
    </div>
</section>