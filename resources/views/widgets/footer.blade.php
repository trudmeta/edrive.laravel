<footer>
    <div class="wrapper">
        <div class="top">
            <div class="left">
                <div class="subscribe">
                    <h5>Подпишитесь на новости и акции</h5>
                    <div class="js-form" data-form="true" id="footer-form">
                        <input type="email" placeholder="Ваш e-mail адрес" name="email" required>
                        <button class="js-form-submit">Подписаться</button>
                    </div>
                </div>
                <div class="networks">
                    <h5>Мы в социальных сетях</h5>
                    <ul>
                        <li>
                            <a href="#">
                                <i>
                                    <svg>
                                        <use xlink:href="{{ asset('svg/sprite.svg#facebook') }}" />
                                    </svg>
                                </i>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i>
                                    <svg>
                                        <use xlink:href="{{ asset('svg/sprite.svg#youtube') }}"/>
                                    </svg>
                                </i>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i>
                                    <img src="{{ asset('images/iconka.png') }}" alt="">
                                </i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="right">
                <ul class="outer">
                    <li>
                        <h5>Каталог</h5>
                        <ul>
                            @foreach($categories as $category)
                                <li><a href="{{ route('site.cars', $category) }}">{{ $category->title }}</a></li>
                            @endforeach
                            <li><a href="{{ route('site.page.testdrive') }}">Тест-Драйв</a></li>
                        </ul>
                    </li>
                    <li>
                        <h5>Информация</h5>
                        <ul>
                            @foreach ($menus as $menu)
                            <li><a href="/{{$menu->alias}}">{{$menu->title}}</a></li>
                            @endforeach
                        </ul>
                    </li>
                    <li class="footer-contacts">
                        <h5>Контакты</h5>
                        <ul>
                            <li><a href="tel:{{ preg_replace('/[()\s-]/', '', settings('phone_number')) }}">{{ settings('phone_number') }}</a></li>
                            <li><a href="tel:{{ preg_replace('/[()\s-]/', '', settings('phone_number2')) }}">{{ settings('phone_number2') }}</a></li>
                            <li><a href="{{ route('site.page.contact') }}">{{ settings('address') }}</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <div class="bottom">
            <p>{{ settings('copyright') }}</p>
            <a href="#" target="_blank">
                <i>
                    <svg>
                        <use xlink:href="{{ asset('svg/sprite.svg#wezom-logo') }}" />
                    </svg>
                </i>
                Агентство
            </a>
        </div>
    </div>
</footer>