@extends('layouts.base')

@section('content')

<x-breadcrumbs h1="Доставка автомобилей из США">
    <x-breadcrumb-item>ИМПОРТ АВТО ИЗ США</x-breadcrumb-item>
</x-breadcrumbs>

<section class="section">
    <div class="section__1 usa">
        <div class="container">
            @php
                $section = $pageSections->sections->where('position', 'header')->first();
            @endphp
            <h6 class="_h6">{{ $section->content }}</h6>
            <div class="grid grid--def-2">
                <div class="gcell img">
                    @if($section->images->isNotEmpty())
                        <img class="b-lazy" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="{{ asset($section->images->first()->url) }}" alt="">
                    @endif
                </div>
                <div class="gcell">
                    <div class="desc">
                        @php
                            $section = $pageSections->sections->where('position', 'profitable')->first();
                        @endphp
                        {!! $section->content !!}
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!--End: about-1 -->

<!--Start: stage -->
<section class="stage waypoint" id="stage" data-offset="70%">
    <div class="wrapper">
        <h3>этапы заказа</h3>
        <ul class="grid">
            <li class="gcell">
                <div class="img grid grid--justify-center grid--items-center">
                    <svg class="outer" viewBox="-15 -15 250 250">
                        <defs>
                            <linearGradient id="linearGradient853">
                                <stop offset="0" style="stop-color:#0070d8" />
                                <stop offset="0.5" style="stop-color:#2cdbf1" />
                                <stop offset="1" style="stop-color:#83eb8a" />
                            </linearGradient>
                        </defs>
                        <ellipse ry="124" rx="124" cy="110" cx="110" style="fill:none;stroke:url(#linearGradient853);stroke-width:3;" />
                    </svg>
                    <i class="gcell">
                        <svg>
                            <use xlink:href="svg/sprite.svg#test" />
                        </svg>
                    </i>
                </div>
                @php
                    $section = $pageSections->sections->where('position', 'stage1')->first();
                @endphp
                {!! $section->content !!}
            </li>
            <li class="gcell">
                <div class="img grid grid--justify-center grid--items-center">
                    <svg class="outer" viewBox="-15 -15 250 250">
                        <defs>
                            <linearGradient id="linearGradient853">
                                <stop offset="0" style="stop-color:#0070d8" />
                                <stop offset="0.5" style="stop-color:#2cdbf1" />
                                <stop offset="1" style="stop-color:#83eb8a" />
                            </linearGradient>
                        </defs>
                        <ellipse ry="124" rx="124" cy="110" cx="110" style="fill:none;stroke:url(#linearGradient853);stroke-width:3;" />
                    </svg>
                    <i class="gcell">
                        <svg>
                            <use xlink:href="svg/sprite.svg#ico23" />
                        </svg>
                    </i>
                </div>
                @php
                    $section = $pageSections->sections->where('position', 'stage2')->first();
                @endphp
                {!! $section->content !!}
            </li>
            <li class="gcell">
                <div class="img grid grid--justify-center grid--items-center">
                    <svg class="outer" viewBox="-15 -15 250 250">
                        <defs>
                            <linearGradient id="linearGradient853">
                                <stop offset="0" style="stop-color:#0070d8" />
                                <stop offset="0.5" style="stop-color:#2cdbf1" />
                                <stop offset="1" style="stop-color:#83eb8a" />
                            </linearGradient>
                        </defs>
                        <ellipse ry="124" rx="124" cy="110" cx="110" style="fill:none;stroke:url(#linearGradient853);stroke-width:3;" />
                    </svg>
                    <i class="gcell">
                        <svg>
                            <use xlink:href="svg/sprite.svg#ico24" />
                        </svg>
                    </i>
                </div>
                @php
                    $section = $pageSections->sections->where('position', 'stage3')->first();
                @endphp
                {!! $section->content !!}
            </li>
            <li class="gcell">
                <div class="img grid grid--justify-center grid--items-center">
                    <svg class="outer" viewBox="-15 -15 250 250">
                        <defs>
                            <linearGradient id="linearGradient853">
                                <stop offset="0" style="stop-color:#0070d8" />
                                <stop offset="0.5" style="stop-color:#2cdbf1" />
                                <stop offset="1" style="stop-color:#83eb8a" />
                            </linearGradient>
                        </defs>
                        <ellipse ry="124" rx="124" cy="110" cx="110" style="fill:none;stroke:url(#linearGradient853);stroke-width:3;" />
                    </svg>
                    <i class="gcell">
                        <svg>
                            <use xlink:href="svg/sprite.svg#ico25" />
                        </svg>
                    </i>
                </div>
                @php
                    $section = $pageSections->sections->where('position', 'stage4')->first();
                @endphp
                {!! $section->content !!}
            </li>
        </ul>
    </div>
</section>
<!--End: stage -->

<!--Start: advantage-usa -->
<section class="advantage-usa">
    <div class="wrapper">
        <h2 class="line">Преимущества покупки авто из США</h2>
        <ul class="grid grid--def-row grid--md-2 grid--def-4 grid--justify-between grid--column">
            <li class="gcell">
                <i>
                    <svg>
                        <use xlink:href="svg/sprite.svg#ico7" />
                    </svg>
                </i>
                <h5>Стоимость</h5>
                @php
                    $section = $pageSections->sections->where('position', 'advantage1')->first();
                @endphp
                {!! $section->content !!}
            </li>
            <li class="gcell">
                <i>
                    <svg>
                        <use xlink:href="svg/sprite.svg#ico8" />
                    </svg>
                </i>
                <h5>Качество сборки</h5>
                @php
                    $section = $pageSections->sections->where('position', 'advantage2')->first();
                @endphp
                {!! $section->content !!}
            </li>
            <li class="gcell">
                <i>
                    <svg>
                        <use xlink:href="svg/sprite.svg#ico8" />
                    </svg>
                </i>
                <h5>Сохранность авто</h5>
                @php
                    $section = $pageSections->sections->where('position', 'advantage2')->first();
                @endphp
                {!! $section->content !!}
            </li>
        </ul>
    </div>
</section>
<!--End: advantage-usa -->

<!--Start: application -->
<section class="application">
    <div class="application__usa">
        <div class="wrapper">
            <h2>Заявка на автомобиль</h2>
            <div class="form-wrapper">
                <div class="form js-form" data-ajax="{{ route('site.ajax.feedback') }}" data-form="true">
                    <input type="hidden" data-name="form" value="import">
                    <div class="form__group">
                        <div class="form__caption">Марка *</div>
                        <div class="control-holder control-holder--text">
                            @php
                                $marks = $categories->map->marks->flatten()->pluck('title', 'alias')->unique();
                            @endphp
                            <select required class="option--select-mark" data-name="mark" name="mark">
                                <option disabled selected>Выбрать марку</option>
                                @foreach($marks as $key => $mark)
                                    <option value="{{ $key }}">{{ $mark }}</option>
                                @endforeach
                            </select>
                            <div class="select-arrow"></div>
                            <span class="form__info">Ваше значение</span>
                        </div>
                    </div>
                    <div class="form__group year-budget">
                        <div class="_left">
                            <div class="form__caption">Год производства, от</div>
                            <div class="control-holder control-holder--text">
                                <input required type="text" data-name="year" name="year-from" data-rule-digits="true">
                                <span class="form__info">Ваше значение</span>
                            </div>
                        </div>
                        <div class="_right">
                            <div class="form__caption">Примерный бюджет, $</div>
                            <div class="control-holder control-holder--text">
                                <input required type="text" data-name="budget" name="budget" data-rule-digits="true">
                                <span class="form__info">Ваше значение</span>
                            </div>
                        </div>
                    </div>
                    <div class="form__group">
                        <div class="form__caption">Ваше имя и фамилия *</div>
                        <div class="control-holder control-holder--text">
                            <input required type="text" data-name="name" name="name" data-rule-word="true"
                                   placeholder="Имя и фамилия">
                            <span class="form__info">Ваше имя</span>
                        </div>
                    </div>
                    <div class="form__group">
                        <div class="form__caption">Ваш телефон *</div>
                        <div class="control-holder control-holder--text">
                            <input required type="tel" data-name="phone" name="phone"
                                   data-rule-phoneua="true" class="js-inputmask" placeholder="+3 8 (0__) ___ - __ - __">
                            <span class="form__info">Ваше телефон</span>
                        </div>
                    </div>
                    <div class="form__group">
                        <div class="form__caption">Ваш E-mail *</div>
                        <div class="control-holder control-holder--text">
                            <input type="email" placeholder="E-mail" data-name="email" name="email" required>
                            <span class="form__info">Ваша почта</span>
                        </div>
                    </div>

                    <div class="submit">
                        <button class="button js-form-submit">
                            <span>
                                <span>Отправить заявку</span>
                            </span>
                        </button>
                    </div>
                </div>
                <div class="bg"></div>
            </div>
        </div>
    </div>
</section>
<!--End: application -->

<!--Start: section-2 -->
<section class="section">
    <div class="section__2 section__usa">
        <div class="container">
            <div class="grid grid--def-2">
                <div class="gcell img">
                    <img class="b-lazy" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="images/pic-2.jpg" alt="">
                </div>
                <div class="gcell">
                    <div class="desc">
                        @php
                            $section = $pageSections->sections->where('position', 'platforms')->first();
                        @endphp
                        {!! $section->content !!}
                        <ul class="grid grid--2">
                            <li class="gcell">
                                <a href="#"><img src="{{ asset('images/pic-3.jpg') }}" alt=""></a>
                            </li>
                            <li class="gcell">
                                <a href="#"><img src="{{ asset('images/pic-4.jpg') }}" alt=""></a>
                            </li>
                            <li class="gcell">
                                <a href="#"><img src="{{ asset('images/pic-5.jpg') }}" alt=""></a>
                            </li>
                            <li class="gcell">
                                <a href="#"><img src="{{ asset('images/pic-6.jpg') }}" alt=""></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!--End: section-2 -->

<!--Start:seo-electro-->
<section class="seo-electro">
    <div class="seo-electro__usa">
        <div class="wrapper">
            @php
                $section = $pageSections->sections->where('position', 'testdrive')->first();
            @endphp
            {!! $section->content !!}
        </div>
    </div>
</section>
<!--End:seo-electro-->

@include('widgets.contacts')

@endsection