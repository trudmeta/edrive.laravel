<nav id="mmenu-options" data-phone1="{{ settings('phone_number') }}" data-phone2="{{ settings('phone_number2') }}">
	<form action="{{ route('site.cars.filter', [$currentCategory]) }}" class="option-filter form" data-form="true" data-category="{{ $currentCategory->alias }}">
        <ul class="mm-listview" style="width: 100%;">
            <li>
			<span>
				<div class="form__caption">Марка</div>
				<div class="control-holder control-holder--text">
					<select class="option--select-mark" name="mark">
						<option @if(!isset($filterArgs['mark'])) selected @endif disabled>Выбрать марку</option>
						@foreach($marks as $mark)
						<option value="{{ $mark->alias }}" @if(isset($filterArgs['mark']) && $filterArgs['mark'] == $mark->alias) selected @endif>{{ $mark->title }}</option>
						@endforeach
					</select>
					<div class="select-arrow"></div>
					<span class="form__info">Ваше значение</span>
				</div>
			</span>
            </li>
            <li>
			<span>
				<div class="form__caption">Модель</div>
				<div class="control-holder control-holder--text">
					<select class="option--select-model" name="model">
						<option @if(!isset($filterArgs['model'])) selected @endif disabled>Выбрать модель</option>
						@if (isset($filterArgs['model']))
						<option value="{{ $filterArgs['model'] }}" @if(isset($filterArgs['model'])) selected @endif>{{ $filterArgs['model'] }}</option>
						@endif
					</select>
					<div class="select-arrow"></div>
					<span class="form__info">Ваше значение</span>
				</div>
			</span>
            </li>
            <li>
			<span class="gcell price">
				<div class="form__caption">Ценовой диапазон, $</div>
				<div class="control-holder control-holder--text start">
					@php
						$from = $minPrice;
                        if (isset($filterArgs['price']) && isset($filterArgs['price']['from'])) {
                            $from = (int)$filterArgs['price']['from'];
                        }
					@endphp
					<input required type="text" class="option--price-start" name="price-from" value="{{ $from }}" data-from="{{ $minPrice }}" data-rule-digits="true">
					<span class="form__info">Ваше значение</span>
				</div>
				<div class="control-holder control-holder--text end">
					@php
						$to = $maxPrice;
                        if (isset($filterArgs['price']) && isset($filterArgs['price']['to'])) {
                            $to = (int)$filterArgs['price']['to'];
                        }
					@endphp
					<input required type="text" class="option--price-end" name="price-to" value="{{ $to }}" data-to="{{ $maxPrice }}" data-rule-digits="true">
					<span class="form__info">Ваше значение</span>
				</div>
				<div class="control-holder control-holder--text range-slider">
					<div class="slider-range-container">
						<div class="js-slider"></div>
					</div>
				</div>
			</span>
            </li>
            <li>
			<span>
				<div class="form__caption">Год производства</div>
				<div class="control-holder control-holder--text">
					<select class="option--select-year-from" name="year-from">
						<option selected disabled>От</option>
						@foreach($years as $year)
						<option value="{{ $year }}" @if(isset($filterArgs['year']['from']) && $filterArgs['year']['from'] == $year) selected @endif>{{ $year }}</option>
						@endforeach
					</select>
					<div class="select-arrow"></div>
					<span class="form__info">Ваше значение</span>
				</div>
			</span>
            </li>
            <li>
			<span>
				<div class="control-holder control-holder--text">
					<select class="option--select-year-to" name="year-to">
						<option selected disabled>До</option>
						@foreach($years as $year)
							<option value="{{ $year }}" @if(isset($filterArgs['year']['to']) && $filterArgs['year']['to'] == $year) selected @endif>{{ $year }}</option>
						@endforeach
					</select>
					<div class="select-arrow"></div>
					<span class="form__info">Ваше значение</span>
				</div>
			</span>
            </li>
            <li>
			<span>
				<div class="form__caption">Пробег</div>
				<div class="b-from _def-left">
					<div class="control-holder control-holder--text">
						<select class="option--select-mileage-from" name="mileage-from">
							<option selected disabled>От</option>
							@foreach($mileages as $mileage)
								<option value="{{ $mileage }}" @if(isset($filterArgs['mileage']['from']) && $filterArgs['mileage']['from'] == $mileage) selected @endif>{{ $mileage }}</option>
							@endforeach
						</select>
						<div class="select-arrow"></div>
						<span class="form__info">Ваше значение</span>
					</div>
				</div>
			</span>
            </li>
            <li>
			<span>
				<div class="control-holder control-holder--text">
					<select class="option--select-mileage-to" name="mileage-to">
						<option selected disabled>До</option>
						@foreach($mileages as $mileage)
							<option value="{{ $mileage }}" @if(isset($filterArgs['mileage']['to']) && $filterArgs['mileage']['to'] == $mileage) selected @endif>{{ $mileage }}</option>
						@endforeach
					</select>
					<div class="select-arrow"></div>
					<span class="form__info">Ваше значение</span>
				</div>
			</span>
            </li>
            <li>
			<span>
				<button type="submit" class="mmenu-option-btn option-filter-btn-submit">Подобрать авто</button>
			</span>
            </li>
        </ul>
	</form>
</nav>
