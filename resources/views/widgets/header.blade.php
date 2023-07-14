<header class="view-header">
    <div class="view-top">
        <div class="wrapper">
            <nav class="nav-left">
                <ul>
                    @foreach ($menus as $menu)
                        <li><a href="/{{$menu->alias}}">{{$menu->title}}</a></li>
                    @endforeach
                </ul>
            </nav>

            <nav class="nav-right">
                <ul>
                    <li><i>
                            <svg>
                                <use xlink:href="{{asset('/svg/sprite.svg#ico9')}}"/>
                            </svg>
                        </i><a href="tel:{{ preg_replace('/[()\s-]/', '', settings('phone_number')) }}">{{ settings('phone_number') }}</a></li>
                    <li><i>
                            <svg>
                                <use xlink:href="{{ asset('/svg/sprite.svg#ico9') }}"/>
                            </svg>
                        </i><a href="tel:{{ preg_replace('/[()\s-]/', '', settings('phone_number2')) }}">{{ settings('phone_number2') }}</a></li>
                    <li><i>
                            <svg>
                                <use xlink:href="{{ asset('/svg/sprite.svg#ico10') }}"/>
                            </svg>
                        </i><a href="#">{{ settings('address') }}</a></li>
                    <li>
                        <button data-mfp-src="#contact-form"
{{--                                class="button js-mfp-ajax"--}}
{{--                                data-url="/hidden/js-form-contact.php"--}}
                                class="button js-mfp-inline">
                            <span>
                                <span>Бесплатная консультация</span>
                            </span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>

    <div class="view-bottom" id="view-bottom">
        <div class="wrapper">
            <a href="#mmenu" id="btn-mmenu"><span></span></a>
            <a href="/" class="logo"><i></i></a>
            <nav class="cars-nav">
                @if (!empty($categories))
                <ul>
                    @foreach($categories as $category)
                    <li class="item-drop">
                        <a class="dropdown" href="{{ route('site.cars', $category) }}">{{ $category->title }}</a>
                        <ul class="drop" id="mm-electromob-mmenu">
                            @foreach($category->marks as $mark)
                            <li>
                                <div class="hover"><img src="{{ asset('images/hover/' . $mark->alias) . '.png' }}" alt=""></div>
                                <a href="{{ route('site.cars.mark', [$category, $mark->alias]) }}">
                                    <div class="img"><img src="{{ asset($mark->car->images->first()->url) }}" alt="#"></div>
                                    <h4>{{ $mark->title }}<span>({{ cache('site.totalCount.'.$category->alias.'.'.$mark->alias) }})</span></h4>
                                </a>
                            </li>
                            @endforeach
                        </ul>
                        <i>
                            <svg>
                                <use xlink:href="{{ asset('svg/sprite.svg#arrow-down') }}" />
                            </svg>
                        </i>
                    </li>
                    @endforeach
                    <li class="testdrive">
                        <a href="{{ route('site.page.testdrive') }}">Тест-Драйв</a>
                        <i>
                            <svg>
                                <use xlink:href="{{ asset('svg/sprite.svg#test') }}" />
                            </svg>
                        </i>
                    </li>
                </ul>
                @endif
            </nav>
            <div class="btn-consult">
                <button data-url="hidden/js-form.php" data-param='{"key1":"value-1"}' class="button js-mfp-ajax">
                    <span>
                        <svg><use xlink:href="{{ asset('svg/sprite.svg#phone') }}" /></svg>
                        <span>Lorem</span>
                    </span>
                </button>
            </div>
        </div>

    </div>
</header>