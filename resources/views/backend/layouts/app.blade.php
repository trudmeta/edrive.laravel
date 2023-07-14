<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="ltr">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="apple-touch-icon" sizes="180x180" href="{{asset('/favicons/apple-touch-icon.png')}}">
    <link rel="icon" type="image/png" href="{{asset('/favicons/favicon-32x32.png')}}" sizes="32x32">
    <link rel="icon" type="image/png" href="{{asset('/favicons/favicon-194x194.png')}}" sizes="194x194">
    <link rel="icon" type="image/png" href="{{asset('/favicons/android-chrome-192x192.png')}}" sizes="192x192">
    <link rel="icon" type="image/png" href="{{asset('/favicons/favicon-16x16.png')}}" sizes="16x16">
    <link rel="manifest" href="{{asset('/favicons/manifest.json')}}">
    <link rel="mask-icon" href="{{asset('/favicons/safari-pinned-tab.svg')}}" color="#da532c">
    <meta name="keyword" content="">
    <meta name="description" content="">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('title') | {{ config('app.name') }}</title>

    <link href="{{ asset('css/vendor/magnific-popup.css') }}" rel="stylesheet" />

    <script src="{{ asset('js/vendor/jquery.js') }}"></script>
    <script src="{{ asset('js/vendor/jquery.magnific-popup.min.js') }}"></script>
{{--    <script defer src="{{ asset('js/vendor/alpinejs.min.js') }}"></script>--}}
    <script defer src="{{ asset('js/vendor/alpinejs.js') }}"></script>
    <link rel="stylesheet" href="{{ asset('css/styles-backend.css') }}">
{{--    @vite('resources/scss/backend/styles-backend.scss')--}}

    @stack('after-styles')

</head>

<body>
    <!-- Sidebar -->
    @include('backend.includes.sidebar')
    <!-- /Sidebar -->

    <div class="wrapper d-flex flex-column min-vh-100 bg-light">
        <!-- Header -->
        @include('backend.includes.header')
        <!-- /Header -->

        <div class="body flex-grow-1 px-3">
            <div class="container-lg">

                <!-- Errors block -->
                @include('backend.includes.errors')
                <!-- / Errors block -->

                <!-- Main content block -->
                @yield('content')
                <!-- / Main content block -->

            </div>
        </div>

        <!-- Footer block -->
        @include('backend.includes.footer')
        <!-- / Footer block -->

    </div>

    @stack('js-scripts')
    <!-- / Scripts -->
    <script type="module" src="{{ asset('js/app-backend.js') }}"></script>
{{--    @vite('resources/js/app-backend.js')--}}

</body>

</html>