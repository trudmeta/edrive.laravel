<nav id="mmenu">
    <ul>
        @foreach($categories as $category)
        <li>
            <a href="{{ route('site.cars', $category) }}">{{ $category->title }}</a>
            <ul id="{{ $category->alias }}">
                @foreach($category->marks as $mark)
                <li>
                    <a href="{{ route('site.cars.mark', [$category, $mark->alias]) }}">
                        {{ $mark->title }} <span>({{ cache('site.totalCount.'.$category->alias.'.'.$mark->alias) }})</span>
                    </a>
                </li>
                @endforeach
            </ul>
        </li>
        @endforeach
        <li class="testdrive">
            <a href="{{ route('site.page.testdrive') }}">Тест-Драйв</a>
        </li>
        <li>
            <a href="{{ route('site.page.about') }}">О компании</a>
        </li>
        <li>
            <a href="{{ route('site.page.import') }}">Импорт авто из США</a>
        </li>
        <li>
            <a href="{{ route('site.page.news') }}">Новости</a>
        </li>
        <li>
            <a href="{{ route('site.page.contact') }}">Контакты</a>
        </li>
    </ul>
</nav>