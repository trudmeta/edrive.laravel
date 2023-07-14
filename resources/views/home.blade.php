@extends('layouts.base')

@section('content')

<section class="slider">
    <div class="widget">
        <div class="js-slider-container">
            @foreach($pageSections->sections->where('position', 'slider') as $section)
            <div class="item">
                <img src="{{ asset($section->images->first()->url) }}" alt="">
                <div class="slider-text">
                    <h3>{{ $section->title }}</h3>
                    <p>{{ $section->content }}</p>
                    @if (!empty($section->sections))
                    <a href="{{ $section->sections->where('title', 'url')->first()->content }}">Подробнее
                        <i>
                            <svg><use xlink:href="{{ asset('svg/sprite.svg#arrow-btn') }}" /></svg>
                        </i>
                    </a>
                    @endif
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>

@if (!empty($categories))
<section class="cars-electric">
    <div class="wrapper">
        <div class="tabs-wrapper">
            <div class="tabs" id="tabs">
                @foreach($categories as $category)
                <div class="tab @if ($loop->first){{ 'active' }}@endif" data-tab="{{ $category->alias }}">
                    <h5 class="js-tab-h5">{{ $category->title }}</h5>
                </div>
                @endforeach
            </div>
        </div>
        <div class="tab-content">
            @foreach($categories as $category)
            <div class="wrap cars-wrap @if ($loop->first){{ 'active' }}@endif"  data-tab="{{ $category->alias }}">
                <p>{{ $pageSections->sections->where('position', 'tabs')->where('sort', $loop->index)->first()->content }}</p>
                <div class="js-tab-slider cars">
                    @foreach($category->marks as $mark)
                        <div><a href="{{ route('site.cars.mark', [$category, $mark]) }}">
                                <img src="{{ asset($mark->car->images->first()->url) }}" alt="#">
                            </a></div>
                    @endforeach
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>
@endif

<section class="test-drive">
    <div class="container">
        <h3>Запишитесь на Тест-Драйв</h3>
        <p>Почувствуйте все преимущества электромобилей</p>
        <a href="{{ route('site.page.testdrive') }}">Записаться на Тест-Драйв</a>
    </div>
</section>

<section class="choose-auto">
    <div class="wrapper">
        <div class="top">
            @php
                $waypoints = $pageSections->sections->where('position', 'waypoint');
                $title = $waypoints->shift();
            @endphp
            <h2 class="line">{{ $title->title }}</h2>
            <p>{{ $title->content }}</p>
        </div>
        <div class="bottom waypoint" id="choose-bottom" data-offset="65%">
            <ul>
                @foreach($waypoints as $section)
                <li><span>
                        <svg>
                            <use xlink:href="svg/sprite.svg#ico{{ $loop->iteration }}" />
                        </svg>
                    </span><p>{{ $section->content }}</p></li>
                @endforeach
            </ul>
            <div class="fon"></div>
        </div>
    </div>
    <div class="bg"></div>
</section>

<section class="why">
    <div class="container">
        <h2>Почему выбирают E-Drive</h2>
        <!--table-->
        <div class="table">
            <div class="row">
                <div class="cell">
                    <div class="left">
                        <img class="b-lazy" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="images/why-1.jpg" alt="">
                    </div>
                    <div class="right">
                        <h3>Автомобили в наличии и под заказ</h3>
                        <div class="desc">
                            <p>Мы предлагаем самые популярные модели автотранспорта с аукционов США и любой точки Америки. Мы поможем подобрать и купить автомобиль на аукционах США, доставить его по территории Америки до порта, далее провести таможенную очистку на территории Украины, направить в сертификации и быстрой постановке на учет.
                                Аукционы США на которых покупаются авто: IAAI, Copart, Manheim, Adessa, Cars. Марки авто на Ваш вкус и выбор: Audi, Toyota, Kia, Hyundai, Ford, BMW, Mercedes, Honda, Mazda, Nissan, VolksWagen, Fiat, Dodge, Cadillac, Lexus, Jeep, Chevrolet и много других, так как рынок авто в США самый большой в Мире.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="cell">
                    <div class="left">
                        <img class="b-lazy" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="images/why-2.jpg" alt="">
                    </div>
                    <div class="right">
                        <h3>Сервисная гарантия и поддержка</h3>
                        <div class="desc">
                            <p>Автомобили всех наших клиентов подключены к дорожному ассистансу (вызов эвакуатора 24/7 в течении часа*)</p>
                        </div>
                        <div class="bottom">
                            <h4>Мы не только предлагаем купить электромобиль, но и всесторонне поддерживаем клиентов:</h4>
                            <ul class="circle">
                                <li>
                                    <p>ускоряем процесс купли-продажи, регистрацию и страхование электрокара </p>
                                    <p>КАСКО и ГО. КАСКО – от 1% в год</p>
                                </li>
                                <li>
                                    <p>Все общественные зарядки для наших клиентов в Украине бесплатные</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="cell">
                    <div class="left">
                        <img class="b-lazy" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="images/why-3.jpg" alt="">
                    </div>
                    <div class="right">
                        <h3>Кроме электромобилей предлагаем самые популярные виды мобильного электротранспорта</h3>
                        <div class="desc">
                            <p>Как стать быстрым и мобильным, а также научиться получать максимум удовольствия от прогулок по городу?
                                Для этого мы предлагаем наиболее популярные модели индивидуального электротранспорта, такие как: сегвеи, гироскутеры, моноколеса, электросамокаты, электроскейты.
                                Закажите электротранспорт онлайн.</p>
                        </div>
                        <div class="bottom">
                            <a href="#">Перейти в каталог
                                <i>
                                    <svg>
                                        <use xlink:href="svg/sprite.svg#arrow-btn" />
                                    </svg>
                                </i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div><!--table end-->
    </div>
</section>

<!--Start:calculator-->
<!-- data-perliter - текущая цена за литр бензина -->
<!-- data-to - стоимость ТО  -->
<section class="calculator">
    <div class="container">
        <div class="wrapper">
            <h2>Калькулятор выгоды электромобилей</h2>
            <div class="calc">
                <div class="left" id="gasoline" data-perliter="{{ settings('price_per_liter_of_gasoline') ?? 51 }}" data-to="2500">
                    <h3>Бензиновое авто</h3>
                    <p>Средний расход<br>
                        подобного авто С класса 10 л на 100 км</p>
                    <strong><span id="js-liter">1800</span> л * <span id="per-liter"></span> грн = <span class="js-res-liter"></span> грн</strong>
                    <p>За этот период проходит 2 ТО</p>
                    <strong>2 * <span id="per-to"></span> = <span class="per-to-res"></span> грн</strong>
                    <p>Сумма затрат в год</p>
                    <strong><span class="js-res-liter"></span> + <span class="per-to-res"></span> = <span id="result-gas"></span> грн</strong>
                    <p class="last">~ 2 тыс. долларов</p>
                </div>
                <div class="right electric">
                    <h3>Электромобиль</h3>
                    <p>Полная зарядка 6 часов, потребление 3 кВт</p>
                    <strong>(6 ч * 3 кВт) * 1 грн = 18 грн</strong>
                    <p>Полного заряда хватает на 150 км, заряд от обычной розетки с заземлением 220. В итоге 1 км стоит</p>
                    <strong>18 грн / 150 км = 0,12 грн</strong>
                    <p>Сумма затрат в год</p>
                    <strong><span id="js-electro-km">18 000</span> км * 0,12 = <span id="js-result"></span> грн</strong>
                </div>
                <div class="clearfix"></div>
                <div id="calc-slider">
                    <div class="top">
                        <h3>Проезжая в день</h3>
                        <div id="js-slider-range"></div>
                    </div>
                    <div class="bottom">
                        <h4>Вы экономите в год</h4>
                        <strong><span id="js-economy">50 340</span> грн</strong>
                        <p>3 года эксплуатации электромобиля окупает 50% его стоимости + к экономии денежной, Вы заботитесь об экологии планеты.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="b-lazy fon" data-src="{{ asset('images/slider-fon.jpg') }}"></div>
</section>
<!--End:calculator-->

<!--Start:reviews-->
<section class="reviews">
    <div class="container">
        <div class="left video">
{{--            <a href="https://www.youtube.com/watch?v=E7GlJVSMCk4" class="js-youtube-btn"></a>--}}
            <a href="{{ settings('video_presentation') }}" class="js-youtube-btn"></a>
            <h5> Видео &nbsp;<br>презентация</h5>
        </div>
        <div class="right review">
            <div class="review-slider">
                @foreach($pageSections->sections->where('position', 'reviews') as $section)
                <div class="item">
                    <div class="review-wrap">
                        <div class="wrap">
                            <p>{{ $section->content }}</p>
                            <svg>
                                <use xlink:href="svg/sprite.svg#ico27" />
                            </svg>
                        </div>
                        <div class="author">{{ $section->title }}</div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </div>
    <div class="popup">
        <div class="youtube"></div>
    </div>
</section>
<!--End:reviews-->

<!--Start:news-->
<section class="news">
    <div class="news__item wrapper">
        <h2 class="line">Новости и обзоры</h2>
        <ul>
            @foreach($lastNews as $news)
            <li>
                <div class="img"><a href="{{ route('site.onenews', [$news->alias]) }}"><img class="b-lazy" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="{{ asset($news->image->url) }}" alt=""></a></div>
                <h3><a href="{{ route('site.onenews', [$news->alias]) }}">{{ $news->name }}</a></h3>
                <p><a href="{{ route('site.onenews', [$news->alias]) }}">Прочитать подробнее ></a></p>
            </li>
            @endforeach
        </ul>
    </div>
</section>
<!--End:news-->

@endsection