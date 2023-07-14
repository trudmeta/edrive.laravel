<!DOCTYPE html>
<html lang="" dir="ltr" class="no-js">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>@yield('title', optional($pageSections)->title ?? config('app.name'))</title>

    <!-- Touch -->
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="address=no">
    <meta name="HandheldFriendly" content="True">
    <meta name="MobileOptimized" content="320">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="180x180" href="{{asset('/favicons/apple-touch-icon.png')}}">
    <link rel="icon" type="image/png" href="{{asset('/favicons/favicon-32x32.png')}}" sizes="32x32">
    <link rel="icon" type="image/png" href="{{asset('/favicons/favicon-194x194.png')}}" sizes="194x194">
    <link rel="icon" type="image/png" href="{{asset('/favicons/android-chrome-192x192.png')}}" sizes="192x192">
    <link rel="icon" type="image/png" href="{{asset('/favicons/favicon-16x16.png')}}" sizes="16x16">
    <link rel="manifest" href="{{asset('/favicons/manifest.json')}}">
    <link rel="mask-icon" href="{{asset('/favicons/safari-pinned-tab.svg')}}" color="#da532c">
    <meta name="apple-mobile-web-app-title" content="ProjectName">
    <meta name="application-name" content="ProjectName">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="msapplication-TileImage" content="favicons/mstile-144x144.png">
    <meta name="msapplication-config" content="favicons/browserconfig.xml">
    <meta name="theme-color" content="#ffffff">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <style>{{ $criticalStyles }}</style>

    <script>var MEDIA_FONT_PATH = '/';</script>

    <script>!function(a,b){"function"==typeof define&&define.amd?define([],function(){return a.svg4everybody=b()}):"object"==typeof exports?module.exports=b():a.svg4everybody=b()}(this,function(){function a(a,b){if(b){var c=document.createDocumentFragment(),d=!a.getAttribute("viewBox")&&b.getAttribute("viewBox");d&&a.setAttribute("viewBox",d);for(var e=b.cloneNode(!0);e.childNodes.length;)c.appendChild(e.firstChild);a.appendChild(c)}}function b(b){b.onreadystatechange=function(){if(4===b.readyState){var c=b._cachedDocument;c||(c=b._cachedDocument=document.implementation.createHTMLDocument(""),c.body.innerHTML=b.responseText,b._cachedTarget={}),b._embeds.splice(0).map(function(d){var e=b._cachedTarget[d.id];e||(e=b._cachedTarget[d.id]=c.getElementById(d.id)),a(d.svg,e)})}},b.onreadystatechange()}function c(c){function d(){for(var c=0;c<l.length;){var g=l[c],h=g.parentNode;if(h&&/svg/i.test(h.nodeName)){var i=g.getAttribute("xlink:href");if(e&&(!f.validate||f.validate(i,h,g))){h.removeChild(g);var m=i.split("#"),n=m.shift(),o=m.join("#");if(n.length){var p=j[n];p||(p=j[n]=new XMLHttpRequest,p.open("GET",n),p.send(),p._embeds=[]),p._embeds.push({svg:h,id:o}),b(p)}else a(h,document.getElementById(o))}}else++c}k(d,67)}var e,f=Object(c),g=/\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/,h=/\bAppleWebKit\/(\d+)\b/,i=/\bEdge\/12\.(\d+)\b/;e="polyfill"in f?f.polyfill:g.test(navigator.userAgent)||(navigator.userAgent.match(i)||[])[1]<10547||(navigator.userAgent.match(h)||[])[1]<537;var j={},k=window.requestAnimationFrame||setTimeout,l=document.getElementsByTagName("use");e&&d()}return c});</script>
    <script>document.addEventListener("DOMContentLoaded", function() { svg4everybody({}); });</script>
</head>
<body>
<div class="view-wrapper">

    <div class="view-container">

        @include('widgets.header')

        @yield('content')

    </div>

    @include('widgets.footer')

    @include('widgets.mmenu')

</div>

<link rel="stylesheet" href="{{ asset('css/styles.css') }}">
<script type="module" src="{{ asset('js/app.js') }}"></script>

{{--@vite(['resources/scss/styles.scss', 'resources/js/app.js'])--}}

@include('widgets.contacts-form', ['id' => 'contact-form', 'class' => 'mfp-hide', 'form' => 'header-contact'])
@include('widgets.popup-message', ['id' => 'success_popup', 'class' => 'mfp-hide'])

@stack('js-scripts')

</body>
</html>