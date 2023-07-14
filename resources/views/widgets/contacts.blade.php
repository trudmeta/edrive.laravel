<section class="contacts">
    <div class="container">
        @include('widgets.contacts-form')

        <div class="contact">
            <div>
                <p>
                    <i>
                        <svg>
                            <use xlink:href="{{ asset('svg/sprite.svg#ico9') }}" />
                        </svg>
                    </i>
                    <a href="tel:{{ preg_replace('/[()\s-]/', '', settings('phone_number')) }}">{{ settings('phone_number') }}</a></p>
                <p>
                    <a href="tel:{{ preg_replace('/[()\s-]/', '', settings('phone_number2')) }}">{{ settings('phone_number2') }}</a>
                </p>
                <p><i>
                        <svg>
                            <use xlink:href="{{ asset('svg/sprite.svg#ico15') }}" />
                        </svg>
                    </i><a href="mailto:{{ settings('email_for_contacts') }}">{{ settings('email_for_contacts') }}</a></p>
            </div>
        </div>
    </div>
</section>