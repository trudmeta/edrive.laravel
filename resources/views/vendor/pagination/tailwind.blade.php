@if ($paginator->hasPages())
<div class="pagination-wrapper">
    <div class="pagination-wrapper__ecars">
        <div class="wrapper">
            <div class="pagination">
                <div class="buttons-group buttons-group--center">
                    @if (!$paginator->onFirstPage())
                    <a href="{{ $paginator->previousPageUrl() }}" class="button button--only-icon">
                        <span>
                            <svg><use xlink:href="{{ asset('svg/sprite.svg#arrow-left') }}" /></svg>
                            <span>12</span>
                        </span>
                    </a>
                    @endif
                    @foreach ($elements as $element)
                        @if (is_string($element))
                        <span class="dots">
                            <span>{{ $element }}</span>
                        </span>
                        @endif
                        @if (is_array($element))
                            @foreach ($element as $page => $url)
                                @if ($page == $paginator->currentPage())
                                <span class="button is-active">
                                    <span>
                                        <span>{{ $page }}</span>
                                    </span>
                                </span>
                                @else
                                <a href="{{ $url }}" class="button">
                                    <span>
                                        <span>{{ $page }}</span>
                                    </span>
                                </a>
                                @endif
                            @endforeach
                        @endif
                    @endforeach
                    @if ($paginator->hasMorePages())
                    <a href="{{ $paginator->nextPageUrl() }}" class="button button--only-icon">
                        <span>
                            <svg><use xlink:href="{{ asset('svg/sprite.svg#arrow-right') }}" /></svg>
                            <span>12</span>
                        </span>
                    </a>
                    @endif
                </div>
            </div>
            <!-- pagination -->
        </div>
    </div>
</div>
@endif
