<header class="header header-sticky mb-4">
    <div class="container-fluid">
        <button class="header-toggler header-toggler-side px-md-0 me-md-3" type="button">
            <i class="cil-hamburger-menu"></i>
        </button>
        <button class="js-button-switch button-switch switch" type="button">
            <span class="arrow"></span>
        </button>
        <ul class="header-nav d-none d-md-flex">
            <li class="nav-item"><a class="nav-link" href="{{ route('site.page.home') }}" target="_blank">{{ config('app.name') }}&nbsp;<i class="fa-solid fa-arrow-up-right-from-square"></i></a></li>
        </ul>
        <ul class="header-nav ms-auto">
            <li class="nav-item dropdown">
                <a class="nav-link" data-coreui-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                    <i class="fa-regular fa-bell"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-end pt-0">
                    <div class="dropdown-header bg-light py-2">
                    </div>
                </div>
            </li>
        </ul>

        <ul class="header-nav ms-3">
           <li class="nav-item dropdown">
                <a class="nav-link py-0" data-coreui-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                    <div style="position:relative;background-color: rgba(0, 0, 21, 0.7);padding: 2px;border-radius: 5px">
                        <img class="sidebar-brand-full" src="{{asset("svg/logo.svg")}}" height="30" alt="{{ config('app.name') }}">
                    </div>
                </a>
                <div class="dropdown-menu dropdown-menu-end pt-0">
                    <a class="dropdown-item" href="/" target="_blank">
                        {{ config('app.name') }}
                    </a>

                    <a class="dropdown-item" href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                        <i class="fa-solid fa-right-from-bracket me-2"></i>&nbsp;
                        @lang('Logout')
                    </a>
                    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;"> @csrf </form>

                </div>
            </li>
        </ul>
    </div>

    <div class="header-divider"></div>

    <div class="container-fluid">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb my-0 ms-2">
                @yield('breadcrumbs')
            </ol>
        </nav>
        <div class="d-flex flex-row float-end">
            <div class="">@datetoday</div>
        </div>
    </div>
</header>