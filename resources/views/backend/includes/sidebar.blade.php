<div class="sidebar sidebar-dark sidebar-fixed" id="sidebar">
    <div class="sidebar-brand d-none d-md-flex">
        <a href="{{route("backend.dashboard")}}">
            <img class="sidebar-brand-full" src="{{asset("svg/logo.svg")}}" height="46" alt="{{ config('app.name') }}">
            <img class="sidebar-brand-narrow" src="{{asset("svg/logo.svg")}}" height="46" alt="{{ config('app.name') }}">
        </a>
    </div>

    @isset($admin_sidebar)
    {!! $admin_sidebar->asUl( ['class' => 'sidebar-nav', 'data-coreui'=>'navigation', 'data-simplebar'], ['class' => 'nav-group-items'] ) !!}
    @endif

    <div class="sidebar-nav d-none">
        @php
            $links = $admin_sidebar->all()->mapWithKeys(function($link, $key) {
                return [
                    $link->link->path['route']? route($link->link->path['route']) : $key => preg_replace('/(.*<\/i>)([A-Za-z\s]+)(.*)/', '$2', $link->nickname)
                ];
            });
        @endphp
        <x-backend.drawers :links="$links"></x-backend.drawers>
    </div>

    <button class="sidebar-toggler" type="button" data-coreui-toggle="unfoldable"></button>
</div>