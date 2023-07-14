@extends('layouts.base')

@section('content')

<section class="breadcrumb application">
    <div class="breadcrumb__testdrive application__testdrive">
        <div class="wrapper">
            <ul>
                <li><span><a href="/">Главная</a></span></li>
                <li>
                    <span>Тест-Драйв</span>
                </li>
            </ul>
            <h1>Записаться на Тест-Драйв</h1>
            @php
                $section = $pageSections->sections->where('position', 'header')->first();
            @endphp
            {!! $section->content !!}

            <div class="form-wrapper">
                <div class="form js-form" data-ajax="{{ route('site.ajax.feedback') }}" data-form="true">
                    <input type="hidden" data-name="form" value="testdrive">
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

                    <div class="submit">
                        <button class="button js-form-submit">
                            <span>
                                <span>Записаться на Тест-Драйв</span>
                            </span>
                        </button>
                    </div>
                    <p>Наш консультант свяжется с Вами и уточнит дату<br>
                        и время прохождения Тест-Драйва</p>
                </div>
                <div class="bg"></div>
            </div>
        </div>
    </div>
</section>
<!--End:Breadcrumb-->

<!--Start: testdrive-content-->
<div class="testdrive-content">
    <div class="wrapper">
        @php
            $section = $pageSections->sections->where('position', 'testdrive')->first();
        @endphp
        {!! $section->content !!}
    </div>
</div>

@endsection