'use strict';

import jQuery from 'jquery';


//wHTML initialization (wHTML.prototype) and B2FAPI are from the wezom build tool

var validationTranslate = {
	required: "Это поле необходимо заполнить!",
	required_checker: "Этот параметр - обязателен!",
	required_select: "Этот параметр - обязателен!",

	password: "Укажите корректный пароль!",
	remote: "Пожалуйста, введите правильное значение!",
	email: "Пожалуйста, введите корректный адрес электронной почты!",
	url: "Пожалуйста, введите корректный URL!",
	date: "Пожалуйста, введите корректную дату!",
	dateISO: "Пожалуйста, введите корректную дату в формате ISO!",
	number: "Пожалуйста, введите число!",
	digits: "Пожалуйста, вводите только цифры!",
	creditcard: "Пожалуйста, введите правильный номер кредитной карты!",
	equalTo: "Пожалуйста, введите такое же значение ещё раз!",

	maxlength: "Пожалуйста, введите не более {0} символов!",
	maxlength_checker: "Пожалуйста, выберите не более {0} параметров!",
	maxlength_select: "Пожалуйста, выберите не более {0} пунктов!",

	minlength: "Пожалуйста, введите не менее {0} символов!",
	minlength_checker: "Пожалуйста, выберите не менее {0} параметров!",
	minlength_select: "Пожалуйста, выберите не менее {0} пунктов!",

	rangelength: "Пожалуйста, введите значение длиной от {0} до {1} символов!",
	rangelength_checker: "Пожалуйста, выберите от {0} до {1} параметров!",
	rangelength_select: "Пожалуйста, выберите от {0} до {1} пунктов!",

	range: "Пожалуйста, укажите значение от {0} до {1}!",
	max: "Пожалуйста, укажите значение, меньше или равное {0}!",
	min: "Пожалуйста, укажите значение, больше или равное {0}!",

	filetype: "Допустимые расширения файлов: {0}!",
	filesize: "Максимальный объем {0}KB!",
	filesizeEach: "Максимальный объем каждого файла {0}KB!",

	pattern: "Укажите значение соответствующее маске {0}!",
	word: "Введите корректное словесное значение!",
	login: "Введите корректный логин!",
	phoneUA: "Некорректный формат украинского номера",
	phone: "Введите коректный номер телефона"
};


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (window, $) {

	/**
  * @namespace jQueryExtends
  */
	/**
  * Поиск на странице или получение с даты нужного элемента.
  *
  * Сперва, смотрим в дата объект на определенное свойство.
  * 	Если здесь пусто - ищем элемент по указанному селектору в заданом направлении.
  * 	При нахождении, записываем его в дата объект, чтобы
  * 	при следующих обращениях - получить быстрее и без поисков.
  *
  * !!! Если в обращении элементов большего одного,
  *  то метод выполниться только для первого
  *
  *
  * @sourcecode jQueryExtends:getMyElements
  * @memberof   jQueryExtends
  * @param      {string}     dataKey - ключ свойства из data объекта элемента.
  * @param      {Selector}   [selector] - селектор поиска
  * @param      {string}     [direction="document"] - направление где искать - `[closest, perent, children, find, prev, next, siblings]`
  * @param      {boolean}    [notSelf] - позволяет не учитывать себя (текущий `this`) при поиске элементов в `document` по такому же селектору, как у текущего элемента
  * @return     {Element}
  */
	$.fn.getMyElements = function (dataKey, selector, direction, notSelf) {

		direction = direction || 'document';
		var $element = this.eq(0);
		var keyIsSelector = typeof dataKey == 'string';
		var $target = keyIsSelector ? $element.data(dataKey) : undefined;

		// debug
		// if ( $target ) {
		// 	console.log( 'get from data -> ', dataKey );
		// } else {
		// 	console.log( 'look -> ', direction );
		// }

		if (undefined === $target) {
			if (direction === 'document') {
				$target = $(selector);
				if ($target.length && notSelf) {
					$target = $target.not($element);
				}
			} else {
				$target = $element[direction](selector);
			}
			$element.data(dataKey, $target);
		}

		if (!$target.length) {
			// console.log( selector + ' не найден!' );
			$element.data(dataKey, undefined);
		}

		return $target;
	};
	/**
  * Замена в элементе, в основном текстового, контента
  *  из его дата атрибутов.
  *
  * Удобно использовать при замене множества элементов,
  *  у которых должен свой свой индивидуальный текст,
  *  либо если этот текст зхависит от действий пользователя
  *
  * Пример - загрузка файлов. При смене инпута (file)
  *  можем узнать имя файла (если один)
  *  или их количество (при множественном выборе).
  *  Также мы можем узнать общий объем файлов и вывести все
  *  в удобный нам элемент, плюс простилизоват его.
  *
  *
  * @sourcecode jQueryExtends:changeMyText
  * @memberof   jQueryExtends
  * @requires   {@link wHelpers.replaceFromArray }
  * @param      {string}     [prop="default"] - Ключ свойтсва с которого нужно взять текст для замены
  * @param      {Array}      [replaceArray=[]] - Массив значений с которых следует сделать замену паттернов
  * @return     {undefined}
  */
	$.fn.changeMyText = function (prop, replaceArray) {

		return this.each(function (index, el) {
			var $element = $(el);
			var textData = $element.data('text');

			if ((typeof textData === 'undefined' ? 'undefined' : _typeof(textData)) !== 'object') {
				console.warn($element, 'Не имеет данных с тектом -> data-text=\'{"key": "value"}\'');
				return true;
			}

			replaceArray = replaceArray || [];
			prop = prop || 'default';
			var value = textData[prop];

			if (typeof value !== 'string') {
				console.warn($element, 'Не имеет свойтва "' + prop + '"');
				return true;
			}

			if (replaceArray.length) {
				value = _helpers.replaceFromArray(value, replaceArray);
			}

			$element.html(value);
		});
	};

	/**
  * @namespace wHTML
  */
	var _self,
	    wHTML = function wHTML() {
		_self = this;

		// если wHTML уже существует
		// к примеру, из-за асинхроности, объявлен ранее в programmer
		if (window.wHTML) {
			// копируем методы
			for (var key in window.wHTML) {
				_self[key] = window.wHTML[key];
			}
		}

		if (undefined === _self.formValidationOnSubmit) {
			/**
    * Событие, при успешной валидации формы.
    * Будет замененно при программировании.
    *
    * @sourcecode  wHTML:formValidationOnSubmit
    * @memberof    wHTML
    *
    * @fires   wHTML#formValidationAfterSubmit
    * @event   wHTML#formValidationOnSubmit
    *
    * @param   {Element}   $form - текущая форма, `jQuery element`
    *
    * @return  {undefined}
    */
			_self.formValidationOnSubmit = function ($form) {
				// отправка на сервак
				// ...
				// в ответе
				var response = {};
				_self.formValidationAfterSubmit($form, response);
			};
		}
	};

	/**
  * @namespace wHelpers
  */
	var _helpers,
	    wHelpers = function wHelpers() {
		_helpers = this;
	};

	// methods
	// ========================================
	//include _whtml/inputmask.js
	/**
  * Инициализация `inline` метода плагина `magnific-popup`
  * @see  {@link http://dimsemenov.com/plugins/magnific-popup/documentation.html#inline-type}
  *
  * @sourcecode wHTML:mfpInline
  * @memberof   wHTML
  * @param      {string}   [selector='.js-mfp-inline'] - пользовательский css селектор для поиска и инита
  * @return     {undefined}
  */
	wHTML.prototype.mfpInline = function (selector) {
		selector = selector || '.js-mfp-inline';
		$(selector).each(function (index, el) {
			var $el = $(el);
			var customConfig = $el.data('mfpCustomConfig') || {};

			var currentConfig = $.extend(true, customConfig, {
				type: 'inline',
				closeBtnInside: true,
				removalDelay: 300,
				mainClass: 'zoom-in'
			});

			$el.magnificPopup(currentConfig);
		});
	};

	/**
  * Инициализация `ajax` метода плагина `magnific-popup`
  * @see  {@link http://dimsemenov.com/plugins/magnific-popup/documentation.html#ajax-type}
  *
  * @sourcecode wHTML:mfpAjax
  * @memberof   wHTML
  * @requires   {@link wHTML.inputMask }
  * @requires   {@link wHTML.tableWrapper }
  * @requires   {@link wHTML.viewTextImages }
  * @requires   {@link wHTML.viewTextMedia }
  * @requires   {@link wHTML.formValidation }
  * @param      {string}    [selector='.js-mfp-ajax'] - пользовательский css селектор для поиска и инита
  * @return     {undefined}
  */
	wHTML.prototype.mfpAjax = function (selector) {
		selector = selector || '.js-mfp-ajax';
		$('body').magnificPopup({
			type: 'ajax',
			delegate: selector,
			removalDelay: 300,
			mainClass: 'zoom-in',
			callbacks: {

				elementParse: function elementParse(item) {
					var itemData = item.el.data('param') || {};
					var itemUrl = item.el.data('url');
					var itemType = item.el.data('type') || 'POST';

					this.st.ajax.settings = {
						url: itemUrl,
						type: itemType.toUpperCase(),
						data: itemData
					};
				},

				ajaxContentAdded: function ajaxContentAdded() {
					var $content = this.content || [];
					if ($content.length) {
						// _self.inputMask( $content );
						_self.initRange($content);
						_self.tableWrapper($content);
						_self.viewTextImages($content);
						_self.viewTextMedia($content);
					}

					_self.formValidation($content);
				}
			}
		});
	};

	/**
  * Активация jquery.mmenu боковое меню, на мобилках
  */
	wHTML.prototype.mmenu = function (selector) {
		var width = $(window).width(),
		    $mmenu = $('#mmenu'),

		//$btnMmenu = $('#btn-mmenu'),
		$mmenuOptions = $('#mmenu-options');
		if (width < 1024) {
			if ($mmenu.length) {
				let phone1 = $mmenuOptions.data('phone1');
				let phone2 = $mmenuOptions.data('phone2');
				let options = {
					counters: true,
					"extensions": ["pagedim-black"],
				};
				if (phone1 && phone2) {
					options["navbars"] = [{
						"position": "bottom",
						"content": [
							'<a href="tel:+'+phone1.replace(/[()\s-+]/g, '')+'"> <i> <svg> <use xlink:href="' + MEDIA_FONT_PATH + 'svg/sprite.svg#ico9" /> </svg> </i>'+phone1+' </a>',
							'<a href="tel:+'+phone2.replace(/[()\s-+]/g, '')+'"> <i> <svg> <use xlink:href="' + MEDIA_FONT_PATH + 'svg/sprite.svg#ico9" /> </svg> </i>'+phone2+' </a>'
						]
					}]
				}
				$mmenu.mmenu(options);
			}

			//Боковое меню опций на странице товара
			if ($mmenuOptions.length) {
				let options = {
					"extensions": ["pagedim-black"],
					"offCanvas": {
						"position": "right"
					}
				};
				$mmenuOptions.mmenu(options);
			}
			var API_options = $mmenuOptions.data("mmenu");
			$('.mmenu-option-btn').on('click', function (e) {
				API_options.close();
			});
		}
	};

	/**
  * Инициализация slick-слайдеров
  */
	wHTML.prototype.slick = function () {
		//Header slider
		$('.js-slider-container').slick({
			lazyLoad: 'progressive',
			speed: 1500,
			autoplay: true,
			autoplaySpeed: 3000,
			prevArrow: '<button type="button" class="slick-prev"><i><svg><use xlink:href="' + MEDIA_FONT_PATH + 'svg/sprite.svg#arrow-left" /></svg></i></button>',
			nextArrow: '<button type="button" class="slick-next"><i><svg><use xlink:href="' + MEDIA_FONT_PATH + 'svg/sprite.svg#arrow-right" /></svg></i></button>',
			fade: true
		});

		//Презентация
		$('.review-slider').slick({
			dots: false,
			prevArrow: '<button type="button" class="slick-prev"><i><svg> <use xlink:href="' + MEDIA_FONT_PATH + 'svg/sprite.svg#arrow-left" /> </svg></i></button>',
			nextArrow: '<button type="button" class="slick-next"><i><svg> <use xlink:href="' + MEDIA_FONT_PATH + 'svg/sprite.svg#arrow-right" /> </svg></i></button>'
		});

		//Слайдер товара
		$('.js-item-slider').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			fade: true,
			prevArrow: '<button type="button" class="slick-prev"><i><svg> <use xlink:href="' + MEDIA_FONT_PATH + 'svg/sprite.svg#arrow-left" /> </svg></i></button>',
			nextArrow: '<button type="button" class="slick-next"><i><svg> <use xlink:href="' + MEDIA_FONT_PATH + 'svg/sprite.svg#arrow-right" /> </svg></i></button>',
			asNavFor: '.js-item-slider-nav'
		});
		$('.js-item-slider-nav').slick({
			slidesToShow: 7,
			slidesToScroll: 1,
			asNavFor: '.js-item-slider',
			dots: false,
			focusOnSelect: true
		});
	};

	/**
  * Виджет на странице товара
  */
	wHTML.prototype.itemWidgetFunc = function (scroll) {
		wHTML.viewBottom = $('#view-bottom');
		wHTML.itemWidget = $('#item-widget');
		wHTML.jsItemSlider = $('#js-item-slider');
		var $widget = wHTML.itemWidget;

		//обновление высоты, смещения от начала экрана
		if ($widget && $widget.length) {
			wHTML.wgTopPos = wHTML.jsItemSlider.offset().top - 90;
			wHTML.wgheight = wHTML.itemWidget.outerHeight(true);
			wHTML.endContentTop = parseInt($('.test-drive').offset().top);
			wHTML.viewBottomHeight = wHTML.viewBottom.outerHeight(true);

			//Фиксация виджета при скроллинге, в зависимости от значения скролла
			if (scroll >= wHTML.wgTopPos && scroll < parseInt(wHTML.endContentTop) - parseInt(wHTML.wgheight) - 15 - parseInt(wHTML.viewBottomHeight)) {
				!$widget.hasClass('widget-fixed') && $widget.removeClass('widget-abs').addClass('widget-fixed');
			} else if (scroll >= parseInt(wHTML.endContentTop) - parseInt(wHTML.wgheight) - 15 - parseInt(wHTML.viewBottomHeight)) {
				$widget.removeClass('widget-fixed').addClass('widget-abs');
			} else {
				$widget.removeClass('widget-fixed widget-abs');
			}
		}
	};

	/**
  * Оформление таблиц при вертикальном скроле
  *
  * @sourcecode wHTML:tableWrapper
  * @memberof   wHTML
  * @param      {Element}     [$context] - родительский элемен
  * @return     {undefined}
  */
	wHTML.prototype.tableWrapper = function ($context) {

		var selector = '.js-table-wrapper';
		var $tableWrappers = $(selector, $context);
		if (!$tableWrappers.length) {
			return;
		}

		$tableWrappers.each(function (index, el) {
			var $tableWrapper = $(el);

			if ($tableWrapper.data('scroll-inited')) {
				return true;
			}
			$tableWrapper.data('scroll-inited', true);

			var $tableHolder = $tableWrapper.children(selector + '__holder');
			var $table = $tableHolder.children(selector + '__table');
			checkScrolledTable($tableWrapper, $tableHolder, $table);

			var timer = null;

			$tableHolder.on('scroll', function () {
				checkScrolledTable($tableWrapper, $tableHolder, $table);
			});

			$(window).on('resize', function () {
				clearTimeout(timer);
				timer = setTimeout(function () {
					checkScrolledTable($tableWrapper, $tableHolder, $table);
				}, 10);
			});
		});
	};

	/**
  * Проверка таблицы и ее враппераб, смотрим:
  *  влезает таблица в контейнер?
  *  таблица прокручена?
  *  прокрученна до конца?
  *
  * @sourcecode  checkScrolledTable
  * @private
  *
  * @param  {Element}  $wrapper
  * @param  {Element}  $holder
  * @param  {Element}  $table
  *
  * @return  {undefined}
  */
	function checkScrolledTable($wrapper, $holder, $table) {

		var holderWidth = $holder.innerWidth();
		var holderScroll = $holder.scrollLeft();
		var holderScrollOffset = $holder.scrollLeft() + holderWidth + 10;
		var tableWidth = $table.innerWidth();

		var doClassLeft = 'removeClass';
		var doClassRight = 'removeClass';

		if (holderScroll > 20) {
			doClassLeft = 'addClass';
		}

		if (tableWidth > holderWidth && tableWidth > holderScrollOffset) {
			doClassRight = 'addClass';
		}

		$wrapper[doClassLeft]('table-wrapper--outside-left');
		$wrapper[doClassRight]('table-wrapper--outside-right');
	}

	// viewTextMedia
	var ignore_class = 'ignore';
	var wrapper_class = 'media-wrapper';
	var holder_class = wrapper_class + '__holder';
	var _getRatio = function _getRatio(element) {
		var ratio = parseFloat((+element.offsetHeight / +element.offsetWidth * 100).toFixed(2));
		if (isNaN(ratio)) {
			// страховка 16:9
			ratio = 56.25;
		}
		return ratio + '';
	};

	/**
  * Поиск и оформление `iframe`, `video` и `table`
  * 	элементов в контентовом тексте
  *
  * @sourcecode wHTML:viewTextMedia
  * @memberof   wHTML
  * @param      {Element}    [$context] - родительский элемен
  * @return     {undefined}
  */
	wHTML.prototype.viewTextMedia = function ($context) {

		var $textElements = $('.view-text', $context);
		if (!$textElements.length) {
			return;
		}

		$textElements.each(function (index, text) {
			var $text = $(text);
			var $media = $text.find('iframe').add($text.find('video'));

			$media.each(function (index, el) {
				var $el = $(el);
				if ($el.hasClass(ignore_class) || $el.parent().hasClass(holder_class)) {
					return;
				}

				var ratio = _getRatio(el);
				var ratio_class = holder_class + ' ' + holder_class + '--' + ratio.replace('.', '-');
				var max_width = el.offsetWidth;

				$el.unwrap('p').wrap('' + '<div class="' + wrapper_class + '" style="max-width:' + max_width + 'px;">' + '<div class="' + ratio_class + '" style="padding-top:' + ratio + '%;"></div>' + '</div>');
			});

			var $tables = $text.children('table');
			$tables.each(function (index, el) {
				$(el).addClass('table-wrapp__table js-table-wrapper__table').wrap('<div class="table-wrapper js-table-wrapper"><div class="table-wrapper__holder js-table-wrapper__holder"></div></div>');
			});

			_self.tableWrapper($text);
		});
	};

	/**
  * Поиск и оформление изображений в контентовом тексте
  *  более подробно читай описание `setTextImageClassSizes`
  *
  * Нужно больше иследовать
  *  как может вести себя текстовый редактор,
  *  какие "комбинации" кода могут быть.
  *  В этом основная проблема - что код может быть разным.
  *
  * Поэтому нужно больше тестов и возможно ограничить
  *  сам редактор при работе.
  *
  *
  * @sourcecode wHTML:viewTextImages
  * @memberof   wHTML
  * @requires   {@link wHelpers:replaceFromArray }
  * @param      {Element}    [$context] - родительский элемен
  * @return     {undefined}
  */
	wHTML.prototype.viewTextImages = function ($context) {

		var $textElements = $('.view-text', $context);
		if (!$textElements.length) {
			return;
		}

		var cssContetClass = 'content-image';
		var cssContetSelector = '.' + cssContetClass;

		$textElements.each(function (index, text) {
			var $text = $(text);
			if ($text.hasClass('js-ignore-content-images')) {
				return true;
			}

			var $images = $text.find('img');

			$images.each(function (index, img) {
				var $img = $(img);
				if ($img.parent(cssContetSelector).length) {
					return true;
				}

				var $img = $(this);

				var width = img.getAttribute('width') || '';
				if (width.length) {
					width = width.replace(/px/, '');
					if (/%/.test(width)) {
						width = width.replace(/%/, '');
						var parentWigth = $img.parent().width();
						width = parentWigth / 100 * parseFloat(width);
					}
					width = parseInt(width);
				} else {
					width = $img.width();
				}

				var classes = [cssContetClass];
				setTextImageClassSizes(classes, cssContetClass, 'width', width);

				var title = img.title;
				var inlineStyle = img.style.cssText;
				if (inlineStyle.length) {
					inlineStyle = ' style="' + inlineStyle + '"';
				}

				$img.addClass(classes.join(' '));
			});
		});
	};

	/**
  * Устанавливает классы для изображения.
  *
  * Меряем ширину изображения по отрезкам в 100px
  *  [100-199, 200-299, 300-399, и тд.]
  *  При проверка ставим классы в зависимости от проверяемой величны.
  *
  * К примеру, есть у нас изображение с ширной 453px,
  *  то наша картинка получает классы:
  *
  * - _ .content-image--width-100-and-more _
  * - _ .content-image--width-200-and-more _
  * - _ .content-image--width-300-and-more _
  * - _ .content-image--width-400-and-more _
  *
  * Набор таких классов даст возможность предугадать
  *  на каком брейкпоинте и какое изображение адаптировать
  *
  * К примеру на медиа запросе в min-width 640px
  * все изображения в котнтенвом блоке с шириной 500 и больше - убрать флоаты
  *
  * ```
  *  .content-image {
  * 		&--width-500-and-more {
  * 		    include media( 640px ) {
  * 		    	display: block;
  *				float: none !important;
  *				margin-left: auto !important;
  *				margin-right: auto !important;
  * 			}
  * 		}
  *  }
  *
  * ```
  *
  * @sourcecode setTextImageClassSizes
  * @private
  * @param      {Array}   classes  The classes
  * @param      {string}  prefix   The prefix
  * @param      {string}  side     The side
  * @param      {number}  value    The value
  * @return     {undefined}
  */
	function setTextImageClassSizes(classes, prefix, side, value) {
		var classMore = prefix + '--%s-and-more';

		for (var i = 1; i <= 20; i++) {
			var size = i * 100;
			var nextSize = size + 99;
			var modificator = side + '-' + size;

			if (value < size) {
				break;
			}
			if (value > size) {
				classes.push(_helpers.replaceFromArray(classMore, modificator));
			}
		}
	}
	/**
  * google map api на странице about и contacts
  */
	wHTML.prototype.initMap = function () {

		var $mapContainer = $('.map-container'),
		    lng = $mapContainer.attr('data-long'),
		    lat = $mapContainer.attr('data-latd'),
		    zoom = parseInt($mapContainer.attr('data-zoom')),
		    json = $mapContainer.attr('data-json');

		var map = new google.maps.Map(document.getElementById('map-wrapper'), {
			zoom: zoom,
			scrollwheel: false,
			center: new google.maps.LatLng(lat, lng),
			// mapTypeControl: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		var infowindow = new google.maps.InfoWindow(),
		    geocoder = new google.maps.Geocoder();
		// var service = new google.maps.places.PlacesService(map);

		//Загрузка координат конкретного маркера из json-файла
		$.getJSON(json, function (data) {
			$.each(data.locations, function (i, value) {
				var myLatlng = new google.maps.LatLng(value.lat, value.lng),
				    marker = new google.maps.Marker({
					position: myLatlng,
					map: map,
					icon: value.icon
				});
				google.maps.event.addListener(marker, 'click', function (marker, i) {
					return function () {
						var myLatLng = new google.maps.LatLng(value.lat, value.lng);
						geocoder.geocode({
							'latLng': myLatLng
						}, function (results, status) {
							if (status == google.maps.GeocoderStatus.OK) {
								if (results[0]) {
									infowindow.setContent(results[0].formatted_address);
									infowindow.open(map, marker);
								}
							}
						});
					};
				}(marker, i));
			});
		});
	};

	wHTML.prototype.initMapContacts = function () {
		var $mapContainer = $('.map-container'),
		    lng = $mapContainer.attr('data-long'),
		    lat = $mapContainer.attr('data-latd'),
		    zoom = parseInt($mapContainer.attr('data-zoom')),
		    address = $mapContainer.attr('data-address'),
		    markerSize = { x: 22, y: 40 };

		google.maps.Marker.prototype.setLabel = function (label) {
			this.label = new MarkerLabel({
				map: this.map,
				marker: this,
				text: label
			});
			this.label.bindTo('position', this, 'position');
		};

		var MarkerLabel = function MarkerLabel(options) {
			this.setValues(options);
			this.span = document.createElement('span');
			this.span.className = 'map-marker-label';
		};

		MarkerLabel.prototype = $.extend(new google.maps.OverlayView(), {
			onAdd: function onAdd() {
				this.getPanes().overlayImage.appendChild(this.span);
				var self = this;
			},
			draw: function draw() {
				var text = String(this.get('text'));
				var position = this.getProjection().fromLatLngToDivPixel(this.get('position'));
				this.span.innerHTML = text;
				this.span.style.left = position.x - markerSize.x + text.length * 2 + 10 + 'px';
				this.span.style.top = position.y - markerSize.y + 40 + 'px';
			}
		});
		var myLatLng = new google.maps.LatLng(lat, lng),
		    gmap = new google.maps.Map(document.getElementById('map-wrapper'), {
			zoom: zoom,
			center: myLatLng,
			scrollwheel: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		var myMarker = new google.maps.Marker({
			map: gmap,
			position: myLatLng,
			label: address
		});
	};
	//
	// formValidationConfig
	// флаги
	var is_validation_extended = false,
	    is_validation_translated = false,


	// игнор элементов по селектору
	form_ignore_selectos = ':hidden',


	// классы
	form_class = 'js-form',
	form_selector = '.' + form_class,
	form_class__submit = 'js-form-submit',
	form_selector__submit = '.' + form_class__submit,
	form_class__reset = 'js-form-reset',
	form_selector__reset = '.' + form_class__reset,
	form_selector__input_file = 'input[type="file"]',
	form_selector__js_file = '.js-form-file',
	form_selector__js_file__input = form_selector__js_file + '__input',
	form_selector__js_file__result = form_selector__js_file + '__result',
	form_class__control_holder = 'control-holder',
	form_selector__control_holder = '.' + form_class__control_holder,
	form_class__valid = 'form--valid',
	form_class__no_valid = 'form--no-valid',
	form_class__error = 'has-error',
	form_class__success = 'has-success';

	/**
  * Расширяем конфигурацию плагина `jquery-validate`
  *
  * @sourcecode wHTML:formValidationConfig
  * @memberof   wHTML
  * @tutorial   workwith-jquery-validate
  * @return     {undefined}
  */
	wHTML.prototype.formValidationConfig = function () {
		// если плагин еще не расширялся
		if (is_validation_extended) {
			return;
		}

		// расширяем валидатор
		// параметры по умолчанию
		$.extend($.validator.defaults, {
			// переписываем дефолтные значения
			errorClass: form_class__error,
			validClass: form_class__success,
			controlHolder: form_selector__control_holder,
			inputFile: form_selector__input_file,
			ignore: form_ignore_selectos,

			// метод подсветки ошибок
			highlight: function highlight(element, errorClass, validClass) {
				var $el;
				if (element.type === "radio") {
					$el = this.findByName(element.name);
				} else {
					var $el = $(element);
				}

				$el.add($el.closest(form_selector__control_holder)).addClass(errorClass).removeClass(validClass);
			},

			// метод отключения подсветки ошибок
			unhighlight: function unhighlight(element, errorClass, validClass) {
				var $el;
				if (element.type === "radio") {
					$el = this.findByName(element.name);
				} else {
					var $el = $(element);
				}

				$el.add($el.closest(form_selector__control_holder)).removeClass(errorClass).addClass(validClass);
			},

			// обработчик ошибок
			invalidHandler: function invalidHandler(form, validator) {
				$(this).addClass(form_class__no_valid).data('validator').focusInvalid();
			},

			// обработчик сабмита
			submitHandler: function submitHandler(form) {
				var $currentForm = $(form);
				$currentForm.removeClass(form_class__no_valid).addClass(form_class__valid);
				_self.formValidationOnSubmit($currentForm);
			}
		});

		// фикс вывода пользовательских сообщений
		$.extend($.validator.prototype, {
			defaultMessage: function defaultMessage(element, rule) {
				var method = rule.method;
				// WezomFix
				var method_name = _formGetMethodMsgName(element, method);
				var message = this.findDefined(this.customMessage(element.name, method), this.customDataMessage(element, method),
				// title is never undefined, so handle empty string as undefined
				!this.settings.ignoreTitle && element.title || undefined, $.validator.messages[method_name], "<strong>Warning: No message defined for " + element.name + "</strong>"),
				    theregex = /\$?\{(\d+)\}/g;
				if (typeof message === "function") {
					message = message.call(this, rule.parameters, element);
				} else if (theregex.test(message)) {
					message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
				}

				return message;
			}
		});

		// добавляем пользовательские правила
		$.extend($.validator.methods, {

			email: function email(value, element) {
				return this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9]{2,}(?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(value);
			},

			password: function password(value, element) {
				return this.optional(element) || /^\S.*$/.test(value);
			},

			filesize: function filesize(value, element, param) {
				var kb = 0;
				for (var i = 0; i < element.files.length; i++) {
					kb += element.files[i].size;
				}
				return this.optional(element) || kb / 1024 <= param;
			},

			filesizeEach: function filesizeEach(value, element, param) {
				var flag = true;
				for (var i = 0; i < element.files.length; i++) {
					if (element.files[i].size / 1024 > param) {
						flag = false;
						break;
					}
				}
				return this.optional(element) || flag;
			},

			filetype: function filetype(value, element, param) {
				var result;
				param = typeof param === "string" ? param.replace(/,/g, "|") : "png|jpe?g|doc|pdf|gif|zip|rar|tar|html|swf|txt|xls|docx|xlsx|odt";
				if (element.multiple) {
					var files = element.files;
					for (var i = 0; i < files.length; i++) {
						var value = files[i].name;
						result = this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
						if (result === null) {
							break;
						}
					}
				} else {
					var result = this.optional(element) || value.match(new RegExp("\\.(" + param + ")$", "i"));
				}
				return result;
			},

			or: function or(value, element, param) {
				var $module = $(element).parents('.js-form');
				return $module.find('.' + param + ':filled').length;
			},

			word: function word(value, element) {
				return this.optional(element) || /^[a-zA-Zа-яА-ЯіІїЇєёЁЄґҐĄąĆćĘęŁłŃńÓóŚśŹźŻż\'\`\- ]*$/.test(value);
			},

			login: function login(value, element) {
				return this.optional(element) || /^[0-9a-zA-Zа-яА-ЯіІїЇєЄёЁґҐ][0-9a-zA-Zа-яА-ЯіІїЇєЄґҐĄąĆćĘęŁłŃńÓóŚśŹźŻż\-\._]+$/.test(value);
			},

			phoneUA: function phoneUA(value, element, param) {
				return this.optional(element) || /^(((\+?)(38))\s?)?(([0-9]{3})|(\([0-9]{3}\)))(\-|\s)?(([0-9]{3})(\-|\s)?([0-9]{2})(\-|\s)?([0-9]{2})|([0-9]{2})(\-|\s)?([0-9]{2})(\-|\s)?([0-9]{3})|([0-9]{2})(\-|\s)?([0-9]{3})(\-|\s)?([0-9]{2}))$/.test(value);
			},

			phone: function phone(value, element, param) {
				return this.optional(element) || /^(((\+?)(\d{1,3}))\s?)?(([0-9]{0,4})|(\([0-9]{3}\)))(\-|\s)?(([0-9]{3})(\-|\s)?([0-9]{2})(\-|\s)?([0-9]{2})|([0-9]{2})(\-|\s)?([0-9]{2})(\-|\s)?([0-9]{3})|([0-9]{2})(\-|\s)?([0-9]{3})(\-|\s)?([0-9]{2}))$/.test(value);
			},

			validTrue: function validTrue(value, element, param) {
				if ($(element).data('valid') === true) {
					return true;
				} else {
					return false;
				}
			}
		});

		// переопределяем методы для работы с дивами
		$.extend($.validator.prototype, {
			init: function init() {
				this.labelContainer = $(this.settings.errorLabelContainer);
				this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
				this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
				this.submitted = {};
				this.valueCache = {};
				this.pendingRequest = 0;
				this.pending = {};
				this.invalid = {};
				this.reset();

				var groups = this.groups = {},
				    rules;
				$.each(this.settings.groups, function (key, value) {
					if (typeof value === "string") {
						value = value.split(/\s/);
					}
					$.each(value, function (index, name) {
						groups[name] = key;
					});
				});
				rules = this.settings.rules;
				$.each(rules, function (key, value) {
					rules[key] = $.validator.normalizeRule(value);
				});

				function delegate2(event) {
					// WezomFix
					var validator, form, eventType;
					form = this.form;

					if (!form) {
						form = $(this).closest("div[data-form='true']").get(0);
					}
					validator = $.data(form, "validator");
					eventType = "on" + event.type.replace(/^validate/, "");
					/*this.settings = validator.settings;
     if (this.settings[eventType] && !this.is(this.settings.ignore)) {
     	this.settings[eventType].call(validator, this[0], event);
     }*/
					var settings = validator.settings;
					if (settings[eventType] && !$(this).is(settings.ignore)) {
						settings[eventType].call(validator, this, event);
					}
				}

				$(this.currentForm).on("focusin.validate focusout.validate keyup.validate", ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], " + "[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], " + "[type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], " + "[type='radio'], [type='checkbox']", delegate2)
				// Support: Chrome, oldIE
				// "select" is provided as event.target when clicking a option
				.on("click.validate", "select, option, [type='radio'], [type='checkbox']", delegate2);

				if (this.settings.invalidHandler) {
					$(this.currentForm).on("invalid-form.validate", this.settings.invalidHandler);
				}

				// Add aria-required to any Static/Data/Class required fields before first validation
				// Screen readers require this attribute to be present before the initial submission http://www.w3.org/TR/WCAG-TECHS/ARIA2.html
				$(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required", "true");
			}
		});

		// переписываем ститческое правило для работы с дивами
		$.validator.staticRules = function (element) {
			// WezomFix
			if (element.form) {
				validator = $.data(element.form, "validator");
			} else {
				validator = $.data($(element).closest("div[data-form='true']").get(0), "validator");
			}

			var rules = {},

			//validator = $.data(element.form, "validator");
			validator = validator; // WezomFix

			if (validator.settings.rules) {
				rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
			}
			return rules;
		};

		// включаем флаг, что уже расширили плагин
		is_validation_extended = true;

		// если плагин уже бл переведен или глобального объекта переводву нету - выходим
		if (is_validation_translated || window.validationTranslate === undefined) {
			return false;
		}
		// иначе делаем перевод
		var translateMessages = {};
		for (var key in validationTranslate) {
			var value = validationTranslate[key];
			switch (key) {
				case 'maxlength':
				case 'maxlength_checker':
				case 'maxlength_select':

				case 'minlength':
				case 'minlength_checker':
				case 'minlength_select':

				case 'rangelength':
				case 'rangelength_checker':
				case 'rangelength_select':

				case 'range':
				case 'min':
				case 'max':

				case 'filetype':
				case 'filesize':
				case 'filesizeEach':
				case 'pattern':
					translateMessages[key] = $.validator.format(value);
					break;
				default:
					translateMessages[key] = value;
			}
		}
		$.extend($.validator.messages, translateMessages);

		// включаем флаг, что уже перевели плагин
		is_validation_translated = true;
	};

	$.extend($.fn, {

		// http://jqueryvalidation.org/rules/

		rules: function rules(command, argument) {

			var element = this[0],
			    settings,
			    staticRules,
			    existingRules,
			    data,
			    param,
			    filtered;

			// If nothing is selected, return empty object; can't chain anyway

			if (element == null) {

				return;
			}

			if (command) {

				settings = $.data(element.form, "validator").settings;

				staticRules = settings.rules;

				existingRules = $.validator.staticRules(element);

				switch (command) {

					case "add":

						$.extend(existingRules, $.validator.normalizeRule(argument));

						// Remove messages from rules, but allow them to be set separately

						delete existingRules.messages;

						staticRules[element.name] = existingRules;

						if (argument.messages) {

							settings.messages[element.name] = $.extend(settings.messages[element.name], argument.messages);
						}

						break;

					case "remove":

						if (!argument) {

							delete staticRules[element.name];

							return existingRules;
						}

						filtered = {};

						$.each(argument.split(/\s/), function (index, method) {

							filtered[method] = existingRules[method];

							delete existingRules[method];

							if (method === "required") {

								$(element).removeAttr("aria-required");
							}
						});

						return filtered;

				}
			}

			data = $.validator.normalizeRules($.extend({}, $.validator.classRules(element), $.validator.attributeRules(element), $.validator.dataRules(element), $.validator.staticRules(element)), element);

			// Make sure required is at front

			if (data.required) {

				param = data.required;

				delete data.required;

				data = $.extend({ required: param }, data);

				$(element).attr("aria-required", "true");
			}

			// Make sure remote is at back

			if (data.remote) {

				param = data.remote;

				delete data.remote;

				data = $.extend(data, { remote: param });
			}

			return data;
		}

	});

	/**
  * Инициализация плагина `jquery-validate`
  *
  * @sourcecode wHTML:formValidation
  * @memberof   wHTML
  * @fires      wHTML#formOnSubmit
  * @param      {Element}    [$context] - родительский элемен
  * @return     {undefined}
  */
	wHTML.prototype.formValidation = function ($context) {

		var $forms = $(form_selector, $context);
		if (!$forms.length) {
			return;
		}

		// раширяем при первом ините
		_self.formValidationConfig();

		$forms.each(function (index, el) {
			var $form = $(el);
			var validator = $form.data('validator');

			// если форма инитилась -> выходим
			if (undefined !== validator) {
				return;
			}

			// если элемент `form`
			if ($form.is('form')) {
				$form.on('submit', function (event) {
					return false;
				});
			}

			// конфиг для каждой формы
			var validateConfig = {};

			// если нужна последовательная подсветка ошибок, а не всех сразу
			// добавь к форме data-errors-by-step="true"
			if ($form.data('errors-by-step') === true) {
				_formErrorsByStep(validateConfig);
			}

			// инитим плагин
			$form.validate(validateConfig);

			// если форма - блок
			if ($form.is('div')) {
				$form
				// сабмит
				.on('click', form_selector__submit, function (event) {
					$form.submit();
				})
				// ресет
				.on('click', form_selector__reset, function (event) {
					_self.formValidationReset($form);
				});
			}

			// файл
			$form.on('change', form_selector__input_file, function (event) {
				var $this = $(this);
				var $jsFile = $this.closest(form_selector__js_file);

				if ($jsFile.length) {
					_self.formJsChangeFile($this, $jsFile);
				} else {
					_self.formValidationValid($this);
				}
			});
		});
	};
	/**
  * Принудительная валидация элемента
  *
  * @sourcecode wHTML:formValidationValid
  * @memberof   wHTML
  * @requires   {@link jQueryExtends.getMyElements }
  * @param      {Element}   $element  текущий элемент
  * @return     {boolean}
  */
	wHTML.prototype.formValidationValid = function ($element) {
		var element = $element[0];
		var $form = $element.getMyElements('$myForm', form_selector, 'closest');

		return $form.data('validator').element(element);
	};

	/**
  * Сброс формы-дива
  *
  * @sourcecode wHTML:formValidationReset
  * @memberof   wHTML
  * @requires   {@link jQueryExtends.getMyElements }
  * @requires   {@link jQueryExtends.changeMyText }
  * @param      {Element}   $form - текущая форма
  * @return     {undefined}
  */
	wHTML.prototype.formValidationReset = function ($form) {
		var form = $form[0];
		var formValidator = $form.data('validator');
		var settings = formValidator.settings;

		formValidator.resetForm();

		_formResetInputs(settings, $form.find('input'));
		_formResetInputs(settings, $form.find('textarea'));
		_formResetSelects(settings, $form.find('select'));

		var $jsFiles = $form.getMyElements('$jsFiles', form_selector__js_file__result, 'find');

		$jsFiles.each(function (index, el) {
			$(this).changeMyText();
		});

		$form.removeClass(form_class__valid).removeClass(form_class__no_valid);
	};

	/**
  * Событие, после успешной валидации формы и отправки данных.
  *
  * @sourcecode wHTML:formValidationAfterSubmit
  * @memberof   wHTML
  * @event      wHTML#formValidationAfterSubmit
  * @param      {Element}   $form - текущая форма, `jQuery element`
  * @param      {Object}    response - ответ по текущей форме
  * @return     {undefined}
  */
	wHTML.prototype.formValidationAfterSubmit = function ($form, response) {

		if (!response || response.message === 'error') {
			closePopup();
		}
		// пример очистки
		if (response.resetForm) {
			this.formValidationReset($form);
		}

		// пример закрытия магнифика
		closePopup();

		function closePopup() {
			if (response.closePopup) {
				var mfpInstance = $.magnificPopup && $.magnificPopup.instance || {};
				if (mfpInstance.isOpen) {
					$.magnificPopup.close();
				} else {
					if (typeof response.popupMessage !== 'undefined') {
						let $popup = $('#success_popup');
						$popup.find('.js-popup-body').html(response.popupMessage)
						$.magnificPopup.open({
							items: {
								src: $popup
							},
							callbacks: {
								open: function(){
									setTimeout(function() {
										$.magnificPopup.close();
									}, 2000)
								}
							},
							type: 'inline',
							removalDelay: 300,
							mainClass: 'zoom-in',
						});
					}
				}
			}
		}

		console.info('HTML => Форма отправлена', response);
	};
	/**
  * JS подхват перед загрузкой фалов.
  *  Метод используеться для кастоных кнопок
  *  аля "upload file".
  *  Основная задача:
  *
  * - Определить прошел ли файл валидацию
  * - Есть ли файлы (валидацию может пройти и пустой `input[file]`, если он не `required`)
  * - Получить нужные данные для показа - имя / размер / количество и тд
  * - Вывести полченную инфу на элемент
  *
  * Выводим при помощи вспомогательных методов
  *  (смотри requires'ы и их описания)
  *
  *
  * @sourcecode wHTML:formJsChangeFile
  * @memberof   wHTML
  * @requires   {@link jQueryExtends.getMyElements }
  * @requires   {@link jQueryExtends.changeMyText }
  * @requires   {@link wHelpers.setThousands }
  * @param      {Element}   $element  input[type="file"]
  * @param      {Element}   $jsFile   родительский блок
  * @return     {undefined}
  */
	wHTML.prototype.formJsChangeFile = function ($element, $jsFile) {

		var isValid = _self.formValidationValid($element);
		var $inputResult = $jsFile.getMyElements('$inputResult', form_selector__js_file__result, 'find');

		if (!isValid) {
			$inputResult.changeMyText();
			return false;
		}

		var fileList = $element[0].files;
		if (!fileList.length) {
			$inputResult.changeMyText();
			return false;
		}

		var names = [];
		var sizes = 0;
		for (var i = 0; i < fileList.length; i++) {
			var file = fileList[i];
			names.push(file.name);
			sizes += file.size;
		}

		sizes = (sizes / 1024).toFixed(2);
		sizes = _helpers.setThousands(sizes) + 'kb';

		if (names.length > 1) {
			names = names.length;
		} else {
			names = names[0];
			names = '<span class="_ellipsis" title="' + names + '">' + names + '</span>';
		}

		$inputResult.changeMyText('changed', [names, sizes]);
	};

	/** @private */
	function _formGetTypeName(type) {
		var type_name;
		switch (type) {
			case 'select-one':
			case 'select-multiple':
				type_name = '_select';
				break;
			case 'radio':
			case 'checkbox':
				type_name = '_checker';
				break;
			default:
				type_name = '';
		}
		return type_name;
	}

	/** @private */
	function _formGetMethodMsgName(element, method) {
		var method_name;
		switch (method) {
			case 'required':
			case 'maxlength':
			case 'minlength':
			case 'rangelength':
				method_name = method + _formGetTypeName(element.type);
				break;
			default:
				method_name = method;
		}
		return method_name;
	}

	/** @private */
	function _formErrorsByStep(validateConfig) {
		validateConfig.showErrors = function (errorMap, errorList) {
			if (errorList.length) {
				var firstError = errorList.shift();
				var newErrorList = [];
				newErrorList.push(firstError);
				this.errorList = newErrorList;
			}
			this.defaultShowErrors();
		};
	}

	/** @private */
	function _formResetInputs(settings, elements) {
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			var $element = $(element);

			if ($element.hasClass('js-form-element-noreset')) {
				continue;
			}

			switch (element.type) {
				case 'submit':
				case 'reset':
				case 'button':
				case 'image':
					break;

				case 'radio':
				case 'checkbox':
					element.checked = element.defaultChecked;
					$element.trigger('change');
					break;

				case 'file':
					element.outerHTML = element.outerHTML;
					$element.trigger('change');
					break;

				default:
					element.value = element.defaultValue;
					$element.trigger('change');
			}
		}
	}

	/** @private */
	function _formResetSelects(settings, elements) {
		for (var i = 0; i < elements.length; i++) {
			[].forEach.call(elements[i].options, function (element) {
				element.selected = element.defaultSelected;
			});
		}
	}

	/**
  * Всплывающее окно с опциями на странице товара
  */
	wHTML.prototype.initRange = function ($context) {
		let $start = $(".option--price-start");
		let $end = $(".option--price-end");
		if (!$start.length) return;

		let from = ($start.val()).toString().trim();
		from = from && parseInt(from, 10) || 0;
		let to = ($end.val()).toString().trim();
		to = parseInt(to, 10) || 0;
		let start = ($start.data('from')).toString().trim();
		start = start && parseInt(start, 10) || 0;
		let end = ($end.data('to')).toString().trim();
		end = parseInt(end, 10) || 0;

		$(".js-slider").slider({
			range: true,
			min: start,
			max: end,
			values: [from, to],
			paddingMin: 20,
			paddingMax: 20,
			slide: function slide(event, ui) {
				$start.val(ui.values[0]);
				$end.val(ui.values[1]);
			}
		});
	};

	//
	/**
  * Замена значений в строке по паттерну из массива.
  *
  * Паттерн в строке один, с определенным количеством повторений
  * 	Каждый элемент из массива заменить свой паттерн по порядковому номеру
  *
  * К примеру _replaceFromArray( '%s мыла %s', ['Мама', 'раму'] )
  * 	вернет - 'Мама мыла раму'
  *
  *
  * @sourcecode wHelpers:replaceFromArray
  * @memberof   wHelpers
  * @param      {string}   replacingString - Строка в которой будем менять
  * @param      {Array}    values - массив значений
  * @param      {string}   [pattern="%s"] - паттерн для поиска
  * @return     {string}   Заменненая строка
  */
	wHelpers.prototype.replaceFromArray = function (replacingString, values, pattern) {

		pattern = pattern || '%s';
		if (!Array.isArray(values)) {
			values = [values];
		}

		for (var i = 0; i < values.length; i++) {
			var value = values[i];
			replacingString = replacingString.replace(pattern, value);
		}

		return replacingString;
	};

	/**
  * Установка пробелов между тысячами:
  *
  * ```
  *  153      ->  153
  *  7000     ->  7 000
  *  8500.50  ->  8 500.50
  *  7530.00  ->  7 530
  *  1000000  ->  1 000 000
  *
  * ```
  *
  * @sourcecode wHelpers:setThousands
  * @memberof   wHelpers
  * @param      {string|number}  numberText - число для формата
  * @param      {string}         [newSeparator="."] - новый разделитель, при необходимости
  * @param      {string}         [separator="."] - разделитель дробей
  * @return     {string}
  */
	wHelpers.prototype.setThousands = function (numberText, newSeparator, separator) {

		newSeparator = newSeparator || '.';
		separator = separator || '.';
		numberText = '' + numberText;
		numberText = numberText.split(separator);

		var numberPenny = numberText[1] || '';
		var numberValue = numberText[0];

		var thousandsValue = [];
		var counter = 0;

		for (var i = numberValue.length - 1; i >= 0; i--) {
			var num = numberValue[i];
			thousandsValue.push(num);

			if (++counter === 3 && i) {
				thousandsValue.push(' ');
				counter = 0;
			}
		}

		thousandsValue = thousandsValue.reverse().join('');
		if (numberPenny.length) {
			return [thousandsValue, numberPenny].join(newSeparator);
		}
		return thousandsValue;
	};

	window.wHTML = new wHTML();
	window.wHelpers = new wHelpers();
})(window, jQuery);

var bLazy = new Blazy();

jQuery(document).ready(function ($) {
	// magnific-popup
	wHTML.mfpInline();
	wHTML.mfpAjax();

	// forms
	// wHTML.inputMask();
	wHTML.formValidation();

	// text
	wHTML.viewTextMedia();
	wHTML.tableWrapper();

	wHTML.initRange();

	wHTML.width = $(window).width();
	wHTML.viewBottom = $('#view-bottom');

	//Боковое меню на мобильных устройствах
	wHTML.mmenu();
	//Инициализация slick-слайдеров
	wHTML.slick();

	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});

	//Tabs
	function tabSliderStart($slider) {
		$slider.slick({
			lazyLoad: 'progressive',
			infinite: true,
			slidesToShow: 6,
			slidesToScroll: 3,
			adaptiveHeight: true,
			prevArrow: '<button type="button" class="slick-prev"><i><svg> <use xlink:href="' + MEDIA_FONT_PATH + 'svg/sprite.svg#arrow-left" /> </svg></i></button>',
			nextArrow: '<button type="button" class="slick-next"><i><svg> <use xlink:href="' + MEDIA_FONT_PATH + 'svg/sprite.svg#arrow-right" /> </svg></i></button>',
			dots: true,
			responsive: [{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					infinite: true
				}
			}, {
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2
				}
			}, {
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}]
		});
		return $slider;
	}
	tabSliderStart($('.js-tab-slider.cars'));

	//Табы на главной странице
	$('.js-tab-h5').on('click', function (e) {
		var $target = $(e.target),
		    $tab = $target.closest('.tab'),
		    dataTab = $tab.attr('data-tab'),
		    $tabContent = $('.tab-content'),
		    $wrap = $tabContent.find('.wrap'),
		    $activeWrap = $tabContent.find('[data-tab="' + dataTab + '"]');
		if (!$tab.hasClass('active')) {
			$('#tabs').find('.tab').toggleClass('active');
			$wrap.toggleClass('active');
			$wrap.find('.js-tab-slider.slick-initialized').slick('unslick');
			tabSliderStart($activeWrap.find('.js-tab-slider')).slick('setPosition');
		}
	});

	//Отключение стрелок слайдера на мобилках
	if (Modernizr.touchevents) {
		$('.js-slider-container, .js-tab-slider').find('button').hide();
	}

	//функция пересчёта значения калькулятора
	function updateCalc(value) {
		var month = value * 30,
		    year = month * 12,
		    priceLiter = wHTML.priceLiter,
		    liter = year / 10,
		    perTO = parseInt(wHTML.priceTO),
		    perLiter = liter * priceLiter,
		    gasoline = perLiter + perTO * 2,
		    perElectro = 0.12,
		    result = parseInt(year * perElectro),
		    economy = gasoline - result;
		$('#js-liter').html(liter);
		$('.js-res-liter').html(wHelpers.setThousands(perLiter));
		$('#result-gas').html(wHelpers.setThousands(gasoline));
		$('#js-electro-km').html(wHelpers.setThousands(year));
		$('#js-result').html(wHelpers.setThousands(result));
		$('#js-economy').html(wHelpers.setThousands(economy));
		$('.js-month-value').html(wHelpers.setThousands(month));
		$('.js-year-value').html(wHelpers.setThousands(year));
	}
	$('#js-slider-range').slider({
		min: 1,
		max: 200,
		value: 50,
		create: function create() {
			$('#calc-slider').find('.ui-slider-handle').append('<span id="js-marker"><i id="js-left-res" class="side-res"><p class="month">~<em class="js-month-value">1500</em> км в месяц</p><p class="year">~<em class="js-year-value">18 000</em> км в год</p></i> <span id="js-calc-current"></span> <i id="js-right-res" class="side-res active"><p class="month">~<em class="js-month-value">1500</em> км в месяц</p><p class="year">~<em class="js-year-value">18 000</em> км в год</p></i></span>');
			wHTML.sliderMarker = $("#js-marker");
			wHTML.sliderHandleOutput = $("#js-calc-current");
			wHTML.sliderHandleOutput.html($(this).slider("value") + '&nbsp;км');
			wHTML.sliderLeftRes = $("#js-left-res");
			wHTML.sliderRightRes = $("#js-right-res");
			wHTML.sliderSideRes = $("#js-marker").find(".side-res");
			wHTML.priceLiter = $('#gasoline').attr('data-perliter');
			wHTML.priceTO = $('#gasoline').attr('data-to');
			$('#per-liter').html(wHTML.priceLiter);
			$('#per-to').html(wHTML.priceTO);
			$('.per-to-res').html(wHTML.priceTO * 2);

			var value = $(this).slider('value');

			updateCalc(value);
		},
		slide: function slide(event, ui) {
			var $marker = wHTML.sliderMarker,
			    value = ui.value;

			updateCalc(value);

			wHTML.sliderHandleOutput.html(ui.value + '&nbsp;км');
			if (value >= 100) {
				!$marker.hasClass('_m100') && $marker.addClass('_m100');
				if (!wHTML.sliderLeftRes.hasClass('active')) {
					wHTML.sliderSideRes.toggleClass('active');
				}
			} else if (value < 100) {
				$marker.hasClass('_m100') && $marker.removeClass('_m100');
				if (!wHTML.sliderRightRes.hasClass('active')) {
					wHTML.sliderSideRes.toggleClass('active');
				}
				if (value < 10) {
					$marker.addClass('_m10');
				} else {
					$marker.removeClass('_m10');
				}
			} else {
				$marker.attr('class', 'marker');
			}
		}
	});

	$('.js-item-slider').find('a').magnificPopup({
		type: 'image',
		gallery: {
			enabled: true
		}
	});

	//Виджет - переход к комплектации
	$('#item-widget').find('.equip').on('click', function (e) {
		var equipmentTop = $('#equipment').offset().top;
		$('html,body').animate({
			scrollTop: parseInt(equipmentTop) - 50
		});
		e.preventDefault();
	});

	//анимация при скролле
	var waypoint = {};
	$('.waypoint').each(function () {
		var $this = $(this);
		waypoint[$this.index()] = $this.waypoint(function (direction) {
			$this.addClass('viewed');
			waypoint[$this.index()][0].destroy();
		}, {
			offset: $this.attr('data-offset')
		});
	});

	//Youtube на главной странице
	$('.js-youtube-btn').magnificPopup({
		disableOn: 700,
		type: 'iframe',
		mainClass: 'mfp-zoom-in',
		removalDelay: 160,
		preloader: false,
		fixedContentPos: true
	});

	//на карте вспомогательный блок
	$('#legend').on('click', function (e) {
		$(this).siblings('ul').slideToggle(300);
	});


	//filter
	$('.option--select-mark').on('change', function() {
		if (!this.value) return;

		let value = this.value;
		if (typeof marksJson !== 'undefined') {

			let mark = marksJson.find(mark => mark.alias === this.value);
			if (mark && typeof mark.car_models !== 'undefined') {

				let $select = $('.option--select-model');
				$select.empty();
				$select.append($("<option selected disabled>Выбрать модель</option>"));
				$.each(mark.car_models, function(key, value) {
					$select.append($("<option></option>")
						.attr("value", value['alias']).text(value['title']));
				});

			} else {
				ajaxFilter()
			}

		} else {
			ajaxFilter()
		}

		function ajaxFilter() {
			$.ajax({
				url: '/ajaxFilter',
				method: 'POST',
				data: {mark: value},
				success:function(response) {

					let $select = $('.option--select-model');
					$select.empty();
					$select.append($("<option selected disabled>Выбрать модель</option>"));
					response && typeof response == 'object' && $.each(response, function(key, value) {
						$select.append($("<option></option>")
							.attr("value", value['alias']).text(value['title']));
					});

				},
				error: function(response) {}
			});
		}
	});
	$('.option-filter-btn-submit').on('click', function(e) {
		e.preventDefault();

		let $btn = $(e.target);
		let $form = $btn.closest('.option-filter');
		let data = $form.serializeArray();
		let category = $form.closest('.option-filter').data('category');
		let url = document.location.origin + '/' + category + '/filter';

		Object.entries(data).forEach(function([key, val]) {
			url += '/'+val['name']+'-'+val['value'];
		});
		document.location.href = url;
	});

	//sorting
	$('#sort--select-single').on('change', function(e) {
		let $option = $(this).find("option:selected");
		let value = $option.val();
		let type = $option.data('type');
		if (!value || !type || !/^(price|created_at|title)$/.test(value) || !/^(asc|desc)$/.test(type)) return;

		document.location.href = document.location.origin + document.location.pathname + '?sort=' + value + '&type=' + type;
	});


	$(window).on('load', function () {
		wHTML.viewBottom = $('#view-bottom');
		wHTML.itemWidget = $('#item-widget');
		var scroll = $('body').scrollTop(),
			$viewBottom = wHTML.viewBottom ? wHTML.viewBottom : $('#view-bottom');

		// content-image
		wHTML.viewTextImages();

		if (wHTML.width >= 1024) {
			wHTML.itemWidgetFunc(scroll);

			//фиксирование верхнего меню в header
			if (scroll > 40) {
				!$viewBottom.hasClass('vb-fixed') && $viewBottom.addClass('vb-fixed');
			} else {
				$viewBottom.removeClass('vb-fixed');
			}
		}
	});

	$(window).on('scroll', function () {
		var width = wHTML.width;
		if (width >= 1024) {
			// $.throttle( 250, function(){
			//     console.log('scroll');
			// } );
			var $this = $(this),
				scroll = $this.scrollTop(),
				$viewBottom = wHTML.viewBottom ? wHTML.viewBottom : $('#view-bottom');
			if (scroll > 40) {
				!$viewBottom.hasClass('vb-fixed') && $viewBottom.addClass('vb-fixed');
			} else {
				$viewBottom.removeClass('vb-fixed');
			}

			//Фиксация виджета на странице товара
			wHTML.itemWidgetFunc(scroll);
		}
	});

	$(window).on('resize', function () {
		wHTML.width = $(window).width();
		wHTML.mmenu();
		//Обновление данных виджета: высота, отступ сверху, установка класса фиксации виджета
		if (wHTML.width >= 1024) {
			wHTML.itemWidgetFunc($('body').scrollTop());
		} else {
			wHTML.itemWidget && wHTML.itemWidget.is('.widget-fixed, .widget-abs') && wHTML.itemWidget.removeClass('widget-fixed widget-abs');
		}
	});

});