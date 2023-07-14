@extends('layouts.base')

@section('title'){{ $car->h1 }}@endsection

@section('content')

<!--Start:Breadcrumb-->
<section class="breadcrumb">
    <div class="breadcrumb__model">
        <div class="wrapper grid grid--column grid--sm-row grid--justify-between">
            <div class="item-title gcell">
                <ul class="_clear">
                    <li><span><a href="/">Главная</a></span></li>
                    <li><span><a href="{{ route('site.cars', $car->category) }}">{{ $car->category->title }}</a></span></li>
                    <li><span><a href="{{ route('site.cars.mark', [$car->category, $car->mark->alias]) }}">{{ $car->mark->title }}</a></span></li>
                    <li><span>{{ $car->title }}</span></li>
                </ul>
                <h1>{{ $car->title }}</h1>
            </div>
            <div class="bread-price gcell gcell--def-nogrow">
                <strong>{{ $car->price }} $</strong>
                <p>{{ $car->exchange }} грн</p>
            </div>
        </div>
    </div>
</section>
<!--End:Breadcrumb-->

<!--Start:item-slider-->
<section class="item-slider">
    <div class="wrapper">
        <div class="item-slider-wrapper">
            <div class="js-item-slider" id="js-item-slider">
                @if(!$car->images->isEmpty())
                @foreach($car->images as $image)
                    <div><a href="/{{ $image->url }}"><img src="/{{ $image->url }}" alt=""></a></div>
                @endforeach
                @else
                    <div><a href="{{ asset($car->mainImage) }}"><img src="{{ asset($car->mainImage) }}" alt=""></a></div>
                @endif
            </div>
            <div class="js-item-slider-nav">
                @foreach($car->images as $image)
                <div><img src="/{{ $image->url }}" alt=""></div>
                @endforeach
            </div>
        </div>

        <!--Start:widget-->
        <div id="item-widget">
            <div class="grid title grid--sm-2">
                <div class="gcell">
                    <h5>{{ $car->title }}</h5>
                </div>
                <div class="gcell">
                    <p>{{ $car->artikul }}</p>
                </div>
            </div>
            <div class="bottom">
                <div class="desc">
                    <div class="year">
                        <i><svg>
                                <use xlink:href="{{ asset('svg/sprite.svg#ico11') }}" />
                            </svg></i>
                        <span>Год: <strong>{{ $car->year }}</strong></span>
                    </div>
                    <div class="mileage">
                        <i>
                            <svg>
                                <use xlink:href="{{ asset('svg/sprite.svg#ico12') }}" />
                            </svg>
                        </i>
                        <span>Пробег: <strong>{{ $car->mileage }} km</strong></span>
                    </div>
                    @php
                        if ($equipment = $values->get('equipment')) {
                            $values = $values->forget('equipment');
                        }
                        $icons = [
                            1 => 'ico12',
                            5 => 'ico5',
                            6 => 'ico17',
                            7 => 'ico16',
                            8 => 'ico13',
                        ];
                    @endphp
                    @foreach($values as $value)
                        @php
                            $attribute = $value->attribute;
                            $icon = isset($icons[$attribute->id])? $icons[$attribute->id] : $icons[5];
                        @endphp
                        <div class="{{ $attribute->alias }}">
                            <i>
                                <svg>
                                    <use xlink:href="{{ asset('svg/sprite.svg#'.$icon) }}" />
                                </svg>
                            </i>
                            <span>{{ $attribute->title }}: <strong>{{ $value->title }}</strong></span>
                        </div>
                    @endforeach
                    <div class="stock">
                        <i>
                            <svg>
                                <use xlink:href="{{ asset('svg/sprite.svg#ico14') }}" />
                            </svg>
                        </i>
                        <span>@if ($car->available)В наличии@elseПод заказ@endif</span>
                    </div>
                </div>

                <div class="item-buttons">

                    <button data-url="hidden/options-item.php" data-param='{"key1":"value-1"}' class="button js-mfp-ajax item-option-btn">
                        <span>
                            <span>Хочу купить</span>
                        </span>
                    </button>					<a href="#mmenu-options" class="item-option-link">Хочу купить</a>
                    <a href="testdrive.html" class="td">Записаться на Тест-Драйв</a>
                    <a href="#equipment" class="equip"><span>Показать комплектацию</span></a>
                </div>
            </div>
        </div>
        <!--End:widget-->

        <div class="clearfix"></div>
        @if (!empty($equipment))
        <!--Start: equipment-->
        <div id="equipment" class="equipment item-desc">
            <h4>Комплектация</h4>
            <div class="content">
                <ul class="list-equipment">
                    <li class="_lg-left">
                        <ul>
                            @foreach($equipment as $value)
                            <li><i>
                                    <svg>
                                        <use xlink:href="svg/sprite.svg#ico14" />
                                    </svg>
                                </i>
                                <p>{{ $value->title }}</p>
                            </li>
                            @endforeach
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <!--End: equipment-->
        @endif

        @if (!empty($car->description))
        <!--Start: description-->
        <div class="description">
            <h4>Описание</h4>
            <div class="content">
                <p>{{ $car->description }}</p>
            </div>
        </div>
        <!--End: description-->
        @endif
    </div>
</section>
<!--End:item-slider-->

<!--Start:test-drive-->
<section class="test-drive item">
    <div class="container">
        <h3>Запишитесь на Тест-Драйв</h3>
        <p>Почувствуйте все преимущества электромобилей</p>
        <a href="testdrive.html">Записаться на Тест-Драйв</a>
    </div>
</section>
<!--End:test-drive-->

@php
    $similars = $car->mark->cars->where('category_id', $car->category->id)->where('id', '!=', $car->id)->take(4);
@endphp
@if($similars->isNotEmpty())
<!--Start:items-similar-->
<section class="items-similar">
    <div class="wrapper">
        <h2 class="line">Похожие предложения</h2>

        <ul class="grid grid--def-4 grid--md-2 grid--def-justify-start grid--column grid--md-row">
            @foreach($similars as $similarCar)
            <li class="gcell">
                <div class="img"><a href="{{ route('site.single.car', $similarCar->alias) }}"><img src="{{ asset($similarCar->mainImage) }}" alt=""></a></div>
                <div class="title">
                    <h3><a href="{{ route('site.single.car', $similarCar->alias) }}">{{ $similarCar->title }}</a></h3>
                    <div class="price">
                        <strong>{{ $similarCar->price }} $</strong>
                        <p>2 511 028 грн</p>
                    </div>
                </div>
                <div class="desc-feature">
                    <div class="year">
                        <i><svg>
                                <use xlink:href="svg/sprite.svg#ico11" />
                            </svg></i>
                        <span>Год: <strong>{{ $similarCar->year }}</strong></span>
                    </div>
                    <div class="milage">
                        <i>
                            <svg>
                                <use xlink:href="svg/sprite.svg#ico12" />
                            </svg>
                        </i>
                        <span>Пробег: <strong>{{ $similarCar->mileage }} km</strong></span>
                    </div>
                    <div class="stock">
                        <i>
                            <svg>
                                <use xlink:href="{{ asset('svg/sprite.svg#ico14') }}" />
                            </svg>
                        </i>
                        <span>@if ($car->available)В наличии@elseПод заказ@endif</span>
                    </div>
                </div>
            </li>
            @endforeach
        </ul>
    </div>
</section>
<!--End:items-similar-->
@endif

@include('widgets.contacts')


@endsection