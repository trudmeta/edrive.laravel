@extends('layouts.base')

@section('title'){{ $currentCategory->h1 }}@endsection

@section('content')

<x-breadcrumbs h1="{{ $currentCategory->title }}">
    <x-breadcrumb-item>{{ $currentCategory->title }}</x-breadcrumb-item>
</x-breadcrumbs>

<!--Start:options-->
<section class="options">
    <div class="container">
        <div class="wrapper">
            <!--Start: option-filter form -->
            <form action="{{ route('site.cars.filter', [$currentCategory]) }}" class="option-filter form" data-form="true" data-category="{{ $currentCategory->alias }}">
                <!--Start:top-->
                <div class="top grid grid--def-3 grid--def-justify-between">
                    <div class="gcell">
                        <div class="form__caption">Марка</div>
                        <div class="control-holder control-holder--text">
                            <select class="option--select-mark" name="mark">
                                <option @if(!isset($filterArgs['mark'])) selected @endif disabled>Выбрать марку</option>
                                @foreach($marks as $mark)
                                <option value="{{ $mark->alias }}" @if(isset($filterArgs['mark']) && $filterArgs['mark'] == $mark->alias) selected @endif>{{ $mark->title }}</option>
                                @endforeach
                            </select>
                            <div class="select-arrow"></div>
                            <span class="form__info">Ваше значение</span>
                        </div>
                    </div>
                    <div class="gcell">
                        <div class="form__caption">Модель</div>
                        <div class="control-holder control-holder--text">
                            <select class="option--select-model" name="model">
                                <option @if(!isset($filterArgs['model'])) selected @endif disabled>Выбрать модель</option>
                                @if (isset($filterArgs['model']))
                                <option value="{{ $filterArgs['model'] }}" @if(isset($filterArgs['model'])) selected @endif>{{ $filterArgs['model'] }}</option>
                                @endif
                            </select>
                            <div class="select-arrow"></div>
                            <span class="form__info">Ваше значение</span>
                        </div>
                    </div>
                    <div class="gcell price">
                        <div class="form__caption">Ценовой диапазон, $</div>
                        <div class="grid grid--items-center">
                            <div class="gcell control-holder control-holder--text start">
                                @php
                                $from = $minPrice;
                                if (isset($filterArgs['price']) && isset($filterArgs['price']['from'])) {
                                    $from = (int)$filterArgs['price']['from'];
                                }
                                @endphp
                                <input required type="text" class="option--price-start" name="price-from" value="{{ $from }}" data-from="{{ $minPrice }}" data-rule-digits="true">
                                <span class="form__info">Ваше значение</span>
                            </div>
                            <div class="gcell control-holder control-holder--text end">
                                @php
                                $to = $maxPrice;
                                if (isset($filterArgs['price']) && isset($filterArgs['price']['to'])) {
                                    $to = (int)$filterArgs['price']['to'];
                                }
                                @endphp
                                <input required type="text" class="option--price-end" name="price-to" value="{{ $to }}" data-to="{{ $maxPrice }}" data-rule-digits="true">
                                <span class="form__info">Ваше значение</span>
                            </div>
                            <div class="gcell control-holder control-holder--text range-slider">
                                <div class="slider-range-container">
                                    <div class="js-slider"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--End:top-->
                <!--Start:bottom-->
                <div class="bottom grid grid--justify-between grid--items-end grid--def-3">
                    <div class="gcell">
                        <div class="form__caption">Год производства</div>
                        <div class="b-from _def-left">
                            <div class="control-holder control-holder--text">
                                <select class="option--select-year-from" name="year-from">
                                    <option selected disabled>От</option>
                                    @foreach($years as $year)
                                    <option value="{{ $year }}" @if(isset($filterArgs['year']['from']) && $filterArgs['year']['from'] == $year) selected @endif>{{ $year }}</option>
                                    @endforeach
                                </select>
                                <div class="select-arrow"></div>
                                <span class="form__info">Ваше значение</span>
                            </div>
                        </div>
                        <div class="b-to _def-right">
                            <div class="control-holder control-holder--text">
                                <select class="option--select-year-to" name="year-to">
                                    <option selected disabled>До</option>
                                    @foreach($years as $year)
                                    <option value="{{ $year }}" @if(isset($filterArgs['year']['to']) && $filterArgs['year']['to'] == $year) selected @endif>{{ $year }}</option>
                                    @endforeach
                                </select>
                                <div class="select-arrow"></div>
                                <span class="form__info">Ваше значение</span>
                            </div>
                        </div>
                    </div>

                    <div class="gcell">
                        <div class="form__caption">Пробег</div>
                        <div class="b-from _def-left">
                            <div class="control-holder control-holder--text">
                                <select class="option--select-mileage-from" name="mileage-from">
                                    <option selected disabled>От</option>
                                    @foreach($mileages as $mileage)
                                    <option value="{{ $mileage }}" @if(isset($filterArgs['mileage']['from']) && $filterArgs['mileage']['from'] == $mileage) selected @endif>{{ $mileage }}</option>
                                    @endforeach
                                </select>
                                <div class="select-arrow"></div>
                                <span class="form__info">Ваше значение</span>
                            </div>
                        </div>
                        <div class="b-to _def-right">
                            <div class="control-holder control-holder--text">
                                <select class="option--select-mileage-to" name="mileage-to">
                                    <option selected disabled>До</option>
                                    @foreach($mileages as $mileage)
                                    <option value="{{ $mileage }}" @if(isset($filterArgs['mileage']['to']) && $filterArgs['mileage']['to'] == $mileage) selected @endif>{{ $mileage }}</option>
                                    @endforeach
                                </select>
                                <div class="select-arrow"></div>
                                <span class="form__info">Ваше значение</span>
                            </div>
                        </div>
                    </div>

                    <div class="gcell">
                        <button class="option-filter-btn-submit" type="submit">Подобрать авто</button>
                    </div>
                </div>
                <!--End:bottom-->
            </form>
            <!--End: option-filter form -->

            <div class="mobile-button">
                <a href="#mmenu-options" class="btn">Фильтр</a>
            </div>
        </div>
    </div>
</section>
<!--End:options-->

<!--Start:catalog-cars-->
<section class="catalog-cars">
    <div class="tab-sort">
        <div class="wrapper grid grid--justify-between">
            <div class="sort gcell">
                <label for="sort--select-single" class="form__label _md-left">Сортировать по:</label>
                <div class="control-holder control-holder--text _md-left">
                    @php
                        $sort = request()->has('sort')? request()->sort : '';
                        $type = request()->has('type')? request()->type : '';
                    @endphp
                    <select required id="sort--select-single" name="sort">
                        <option selected disabled>От</option>
                        <option value="price" data-type="asc" @if ($sort && $type && $sort == 'price' && $type == 'asc') selected @endif>
                            От дешевым к дорогим
                        </option>
                        <option value="price" data-type="desc" @if ($sort && $type && $sort == 'price' && $type == 'desc') selected @endif>
                            От дорогих к дешевым
                        </option>
                        <option value="created_at" data-type="asc" @if ($sort && $type && $sort == 'created_at' && $type == 'asc') selected @endif>
                            От старых к новым
                        </option>
                        <option value="created_at" data-type="desc" @if ($sort && $type && $sort == 'created_at' && $type == 'desc') selected @endif>
                            От новых к старым
                        </option>
                        <option value="title" data-type="asc" @if ($sort && $type && $sort == 'title' && $type == 'asc') selected @endif>
                            По названию от А до Я
                        </option>
                        <option value="title" data-type="desc" @if ($sort && $type && $sort == 'title' && $type == 'desc') selected @endif>
                            По названию от Я до А
                        </option>
                    </select>
                    <div class="select-arrow"></div>
                    <span class="form__info">Ваше значение</span>
                </div>
            </div>
            <div class="tabs gcell">
                @php
                    $route = 'site.cars';
                    $params = [$currentCategory];
                    if (!empty($currentMark)) {
                        array_push($params, $currentMark);
                        $route .= '.mark';
                    }
                @endphp
                <div class="tab @if (empty($available)) active @endif _sm-left" data-tab="all">
                    <a href="{{ route($route, $params) }}">Все <span>({{ $totalCount }})</span></a>
                </div>
                <div class="tab @if (!empty($available) && $available == 'available') active @endif _sm-left" data-tab="stock">
                    @php
                        $route .= '.available';
                        array_push($params, 'available')
                    @endphp
                    <a href="{{ route($route, $params) }}">В наличии <span>({{ $availableCount }})</span></a>
                </div>
                <div class="tab @if (!empty($available) && $available == 'notavailable') active @endif _sm-left" data-tab="order">
                    @php
                        array_pop($params);
                        array_push($params, 'notavailable')
                    @endphp
                    <a href="{{ route($route, $params) }}">Под заказ <span>({{ $notAvailableCount }})</span></a>
                </div>
            </div>
        </div>
    </div>
    <div class="catalog">
        <div class="wrapper">
            <nav id="menu-catalog" class="_md-left">
                <ul class="outer">
                    <li @if(empty($currentMark)) class="active" @endif><a href="{{ route('site.cars', $currentCategory) }}">{{ $currentCategory->title }}</a></li>
                    @php
                        $route = 'site.cars.mark';
                        if (!empty($available)) {
                            $route .= '.available';
                        }
                    @endphp
                    @foreach($marks as $mark)
                    <li @if (!empty($currentMark) && $currentMark->id == $mark->id) class="active" @endif>
                        <a href="{{ route($route, [$currentCategory, $mark, $available]) }}">{{ $mark->title }}</a>
                    </li>
                    @endforeach
                </ul>
            </nav>
            <!--Start:list-->
            <div class="list">
                <ul class="cat-item active" data-cat="all">
                    @foreach($cars as $car)
                    <li>
                        <div class="img">
                            <a href="{{ route('site.single.car', $car->alias) }}">
                                <img src="{{ asset($car->mainImage) }}" alt="">
                            </a>
                        </div>
                        <div class="desc">
                            <div class="desc-left">
                                <div class="top">
                                    <h3><a href="{{ route('site.single.car', $car->alias) }}">{{ $car->title }}</a></h3>
                                    <p>Самая полная комплектация. Музыка BOSE, 4 камеры. В наличии!!!</p>
                                </div>
                                <div class="desc-feature">
                                    <div class="year">
                                        <i><svg>
                                                <use xlink:href="{{ asset('svg/sprite.svg#ico11') }}" />
                                            </svg></i>
                                        <span>Год: <strong>{{ $car->year }}</strong></span>
                                    </div>
                                    <div class="milage">
                                        <i>
                                            <svg>
                                                <use xlink:href="{{ asset('svg/sprite.svg#ico12') }}" />
                                            </svg>
                                        </i>
                                        <span>Пробег: <strong>{{ $car->mileage }} km</strong></span>
                                    </div>
                                </div>
                            </div>
                            <div class="desc-right">
                                <div class="price">
                                    <strong>{{ $car->price }} $</strong>
                                    <p>{{ $car->exchange }} грн</p>
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
                        </div>
                    </li>
                    @endforeach
                </ul>
            </div>
            <!--End:list-->
        </div>
    </div>
</section>
<!--End:catalog-cars-->

{{ $cars->onEachSide(2)->links() }}

<!--Start:test-drive-->
<section class="test-drive">
    <div class="container">
        <h3>Запишитесь на Тест-Драйв</h3>
        <p>Почувствуйте все преимущества электромобилей</p>
        <a href="{{ route('site.page.testdrive') }}">Записаться на Тест-Драйв</a>
    </div>
</section>
<!--End:test-drive-->

<section class="advantage">
    <div class="container">
    @foreach($currentCategory->sections->where('position', 'advantage') as $section)
        {!! $section->content !!}
    @endforeach
    </div>
</section>

@include('widgets.contacts')

@include('widgets.mmenu-options')

<script>
    const marksJson = {{ Illuminate\Support\Js::from($categories->map->marks->flatten()->unique('alias')) }};
</script>

@endsection