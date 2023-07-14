<div class="hidden-wrapper hidden-wrapper--md head-form-wrapper @if(isset($class)) {{ $class }}@endif" @if(isset($id)) id="{{ $id }}"@endif>
    <div class="form js-form form-head" data-ajax="{{ route('site.ajax.feedback') }}" data-form="true">
        <h3 class="title">Бесплатная консультация</h3>
        @php
            $form = !empty($form)? $form : 'contact';
        @endphp
        <input type="hidden" data-name="form" value="{{ $form }}">
        <div class="grid grid--1 grid--lg-2 grid--space-def">
            <div class="gcell">
                <div class="form__group">
                    <div class="control-holder control-holder--text">
                        <select required name="form_contacts-subject" data-name="subject">
                            <option selected disabled>Выбрать тему консультации</option>
                            @foreach($categories as $category)
                                <option value="{{ $category->alias }}">{{ $category->title }}</option>
                            @endforeach
                            <option value="others">Другое</option>
                        </select>
                        <div class="select-arrow"></div>
                        <span class="form__info">Ваше значение</span>
                    </div>
                </div>
            </div>
            <div class="gcell">
                <div class="form__group">
                    <div class="control-holder control-holder--text">
                        <input required type="email" name="form_contacts-email"
                               data-name="email"
                               class="js-inputmask" placeholder="Ваш email *">
                        <span class="form__info">Ваш email *</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid grid--1 grid--lg-2 grid--space-def">
            <div class="gcell">
                <div class="form__group">
                    <div class="control-holder control-holder--text">
                        <input required type="text" name="form_contacts-name" data-name="name" data-rule-word="true" placeholder="Ваше имя *">
                        <span class="form__info">Ваше значение</span>
                    </div>
                </div>
            </div>
            <div class="gcell">
                <div class="form__group">
                    <div class="control-holder control-holder--text">
                        <input required type="tel" name="form_contacts-phone"
                               data-name="phone"
                               data-rule-phoneua="true" class="js-inputmask" placeholder="Номер телефона">
                        <span class="form__info">Ваше телефон</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="form__group">
            <div class="control-holder control-holder--text">
                    <textarea required
                              data-name="message"
                              name="form_contacts-textarea"
                              placeholder="Ваше сообщение"
                              rows="4">
                    </textarea>
                <span class="form__info">Ваше сообщение</span>
            </div>
        </div>
        <div class="grid grid--1 grid--sm-2 submit">
            <div class="gcell">
                <div class="form__caption">Наш консультант перезвонит вам в<br> течении часа</div>
            </div>
            <div class="gcell _text-right">
                <button class="button js-form-submit">
                <span>
                    <span>Отправить</span>
                </span>
                </button>
            </div>
        </div>
    </div>
</div>