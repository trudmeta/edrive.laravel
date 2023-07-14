{{--https://codepen.io/jh3y/pen/ExNQxKV--}}
@props(['links' => []])

<div class="chest">
    <div class="chest__panel chest__panel--back"></div>
    <div class="chest__panel chest__panel--top"></div>
    <div class="chest__panel chest__panel--bottom"></div>
    <div class="chest__panel chest__panel--right"></div>
    <div class="chest__panel chest__panel--left"></div>
    @foreach($links as $link => $value)
    <div class="chest__drawer drawer" data-position="{{ $loop->index }}">
        <details>
            <summary></summary>
        </details>
        <div class="drawer__structure">
            <a href="{{ $link }}" class="drawer__panel drawer__panel--back"><span>{{ $value }}</span></a>
            <a href="{{ $link }}" class="drawer__panel drawer__panel--bottom"></a>
            <a href="{{ $link }}" class="drawer__panel drawer__panel--right"></a>
            <a href="{{ $link }}" class="drawer__panel drawer__panel--left"></a>
            <div class="drawer__panel drawer__panel--front"></div>
        </div>
    </div>
    @endforeach
</div>


<style>
    .chest,
    .chest *,
    .chest *:after,
    .chest *:before {
        box-sizing: border-box;
        transform-style: preserve-3d;
        will-change: transform;
    }
    :root {
        --count: {{ count($links) }};
        --drawer: 50;
        --bg: #bcccdc;
        --hover: 0.05;
        --default: 0.01;
        --limit: 0.9;
        --height: calc(var(--count) * var(--drawer));
        --width: 20;
        --depth: 15;
        --frame: 1;
        --handle: #ccc;
        --hue: 10;
        --saturation: 0%;
        --drawer-one: #fafafa;
        --drawer-two: #e6e6e6;
        --drawer-three: #f2f2f2;
        --unit-one: hsl(var(--hue), var(--saturation), 50%);
        --unit-two: hsl(var(--hue), var(--saturation), 40%);
        --unit-three: hsl(var(--hue), var(--saturation), 20%);
        --unit-four: hsl(var(--hue), var(--saturation), 15%);
        --transition: 0.2s;
    }
    .chest {
        height: calc((var(--height) + 6) * 1px);
        transform: translate3d(0, 0, 50vmin) rotateX(-32deg) rotateY(40deg);
        width: calc(var(--width) * 1vmin);
        color: #1c1717;
        position: relative;
        min-height: calc((var(--height) + 6) * 1px);
        z-index: 1;
    }
    .chest__panel {
        position: absolute;
        z-index: 0;
    }
    .chest__panel--back {
        background: var(--unit-two);
    }
    .chest__panel--back,
    .chest__panel--front {
        height: 100%;
        width: 100%;
        transform: translate3d(0, 0, calc(var(--depth) * var(--coefficient)));
    }
    .chest__panel--front-frame {
        height: 100%;
        width: 100%;
        border: calc(var(--frame) * 1vmin) solid var(--unit-one);
        border-bottom-width: calc(var(--frame) * 2vmin);
        transform: translate3d(0, 0, 0);
    }
    .chest__panel--front-frame:after,
    .chest__panel--front-frame:before {
        content: '';
        background: var(--unit-one);
        height: calc(var(--frame) * 1.5vmin);
        width: calc(var(--width) * 1vmin);
        position: absolute;
        transform: translate(-50%, -50%);
        left: 50%;
    }
    .chest__panel--front-frame:after {
        top: calc(100 / 3 * 1.01%);
    }
    .chest__panel--front-frame:before {
        top: calc(100 / 3 * 2.01%);
    }
    .chest__panel--front {
        --coefficient: 0.5vmin;
    }
    .chest__panel--back {
        --coefficient: -0.5vmin;
    }
    .chest__panel--left,
    .chest__panel--right {
        height: 100%;
        left: 50%;
        width: calc(var(--depth) * 1vmin);
        background: var(--unit-three);
        transform: translate(-50%, 0) rotateY(90deg) translate3d(0, 0, calc(var(--width) * var(--coefficient)));
    }
    .chest__panel--right {
        width: calc((var(--depth) * 1vmin) + 2px);
        --coefficient: 0.5vmin;
    }
    .chest__panel--left {
        --coefficient: -0.5vmin;
    }
    .chest__panel--top,
    .chest__panel--bottom {
        height: calc(var(--depth) * 1vmin);
        width: calc(var(--width) * 1vmin);
        background: var(--unit-two);
    }
    .chest__panel--top {
        top: 0;
        width: calc((var(--width) * 1vmin) + 0.1vmin);
        height: calc((var(--depth) * 1vmin) + 0.1vmin);
        left: 50%;
        transform: translate(-50%, -50%) rotateX(-90deg);
    }
    .chest__panel--bottom {
        bottom: 0;
        transform: translate(0, 50%) rotateX(-90deg);
    }
    .chest__drawer {
        --drawer-height: var(--drawer);
        position: absolute;
        top: var(--top, 0);
        left: 50%;
        /*height: calc(var(--drawer-height) * 1vmin);*/
        height: calc(var(--drawer-height) * 1px);
        width: calc((var(--width) - (2 * var(--frame))) * 1vmin);
        transform: translate3d(-50%, 0, calc((var(--depth) * 0.5vmin) + 0.01vmin));
        z-index: 5;
    }
    @for($i=0; $i < count($links); $i++)
    .chest__drawer[data-position="{{ $i }}"] {
        --index: {{ $i }};
        --top: calc(({{ $i }} * var(--drawer-height) * 1px) + 2px);
    }
    @endfor
    .drawer__structure {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
    .drawer__panel {
        position: absolute;
        z-index: 5;
    }
    .drawer__panel span {
        top: 0;
    }
    .drawer__panel--left,
    .drawer__panel--right {
        width: calc(var(--depth) * 1vmin);
        height: 65%;
        background: var(--drawer-two);
        bottom: 1%;
    }
    .drawer__panel--left {
        left: 0;
        transform-origin: 0 50%;
        transform: rotateY(90deg);
    }
    .drawer__panel--right {
        right: 0;
        transform-origin: 100% 50%;
        transform: rotateY(-90deg);
    }
    .drawer__panel--front {
        height: calc((var(--drawer-height) + (0.6 * var(--frame))) * 1px);
        width: calc((var(--width) - (0.6 * var(--frame))) * 1vmin);
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 1px);
        background: var(--unit-four);
    }
    .drawer__panel--bottom,
    .drawer__panel--back {
        width: calc(100% - (2vmin * var(--frame)));
        width: 100%;
    }
    .drawer__panel--bottom {
        height: calc(var(--depth) * 1vmin);
        background: var(--drawer-three);
        bottom: 5%;
        left: 50%;
        transform-origin: 50% 100%;
        transform: translate(-50%, 0) rotateX(90deg);
    }
    .drawer__panel--back {
        height: calc((var(--drawer-height) + (0.6 * var(--frame))) * 1px);
        background: var(--drawer-one);
        bottom: 1%;
        left: 50%;
        transform: translate3d(-50%, 0, calc(var(--depth) * -1vmin));
        text-align: center;
        line-height: calc(var(--drawer-height) * 1px);
        font-size: 3vmin;
        font-family: sans-serif;
        font-weight: bold;
    }
    @media (min-height: 800px) {
        .drawer__panel--back {
            font-size: 1rem;
        }
    }
    .letter {
        color: hsl(var(--hue), 80%, 50%);
        display: inline-block;
        -webkit-animation: wave calc(var(--open) * 1s) calc(var(--delay) * -0.1s) infinite ease-in-out;
        animation: wave calc(var(--open) * 1s) calc(var(--delay) * -0.1s) infinite ease-in-out;
    }
    .letter:nth-of-type(1) {
        --hue: 15;
        --delay: 0;
    }
    .letter:nth-of-type(2) {
        --hue: 35;
        --delay: 1;
    }
    .letter:nth-of-type(3) {
        --hue: 45;
        --delay: 2;
    }
    .letter:nth-of-type(4) {
        --hue: 90;
        --delay: 3;
    }
    .letter:nth-of-type(5) {
        --hue: 180;
        --delay: 4;
    }
    .letter:nth-of-type(6) {
        --hue: 260;
        --delay: 5;
    }
    .letter:nth-of-type(7) {
        --hue: 320;
        --delay: 6;
    }
    details {
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        cursor: pointer;
        outline: transparent;
    }
    details:hover:not([open]),
    details:hover:not([open]) + .drawer__structure {
        --open: var(--hover);
    }
    details,
    .drawer__structure {
        transition: transform var(--transition);
        transform: translate3d(0, 0, calc((var(--open, var(--default)) * var(--depth)) * 1vmin));
    }
    details[open],
    .drawer__structure[open],
    details[open] + .drawer__structure,
    .drawer__structure[open] + .drawer__structure {
        --open: var(--limit);
    }
    summary {
        outline: transparent;
        height: 100%;
        width: 100%;
    }
    summary::-webkit-details-marker {
        display: none;
    }
    summary:after {
        content: '';
        position: absolute;
        background: linear-gradient(var(--handle), var(--handle)) 50% 15%/40% 8% no-repeat, transparent;
        height: 110%;
        width: 110%;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0.5vmin);
    }
    @-webkit-keyframes wave {
        0%, 100% {
            transform: translate3d(0, 10%, 1px);
        }
        50% {
            transform: translate3d(0, -10%, 1px);
        }
    }
    @keyframes wave {
        0%, 100% {
            transform: translate3d(0, 10%, 1px);
        }
        50% {
            transform: translate3d(0, -10%, 1px);
        }
    }
</style>