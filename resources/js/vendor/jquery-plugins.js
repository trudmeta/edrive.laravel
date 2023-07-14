import jQuery from 'jquery';
// window.jQuery = window.$ = jQuery


//originally was used a different code assembler umd
// (function( factory ) {
// 	if ( typeof define === "function" && define.amd ) {
// 		define( ["jquery"], factory );
// 	} else if (typeof module === "object" && module.exports) {
// 		module.exports = factory( require( "jquery" ) );
// 	} else {
// 		factory( jQuery );
// 	}
// }(function( $ ) {
//
// }));


/*!
 * jQuery Validation Plugin v1.16.0
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2016 Jörn Zaefferer
 * Released under the MIT license
 */
(function($) {

$.extend( $.fn, {
		// http://jqueryvalidation.org/validate/
		validate: function( options ) {

			// If nothing is selected, return nothing; can't chain anyway
			if ( !this.length ) {
				if ( options && options.debug && window.console ) {
					console.warn( "Nothing selected, can't validate, returning nothing." );
				}
				return;
			}

			// Check if a validator for this form was already created
			var validator = $.data( this[ 0 ], "validator" );
			if ( validator ) {
				return validator;
			}

			// Add novalidate tag if HTML5.
			this.attr( "novalidate", "novalidate" );

			validator = new $.validator( options, this[ 0 ] );
			$.data( this[ 0 ], "validator", validator );

			if ( validator.settings.onsubmit ) {

				this.on( "click.validate", ":submit", function( event ) {
					if ( validator.settings.submitHandler ) {
						validator.submitButton = event.target;
					}

					// Allow suppressing validation by adding a cancel class to the submit button
					if ( $( this ).hasClass( "cancel" ) ) {
						validator.cancelSubmit = true;
					}

					// Allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
					if ( $( this ).attr( "formnovalidate" ) !== undefined ) {
						validator.cancelSubmit = true;
					}
				} );

				// Validate the form on submit
				this.on( "submit.validate", function( event ) {
					if ( validator.settings.debug ) {

						// Prevent form submit to be able to see console output
						event.preventDefault();
					}
					function handle() {
						var hidden, result;
						if ( validator.settings.submitHandler ) {
							if ( validator.submitButton ) {

								// Insert a hidden input as a replacement for the missing submit button
								hidden = $( "<input type='hidden'/>" )
									.attr( "name", validator.submitButton.name )
									.val( $( validator.submitButton ).val() )
									.appendTo( validator.currentForm );
							}
							result = validator.settings.submitHandler.call( validator, validator.currentForm, event );
							if ( validator.submitButton ) {

								// And clean up afterwards; thanks to no-block-scope, hidden can be referenced
								hidden.remove();
							}
							if ( result !== undefined ) {
								return result;
							}
							return false;
						}
						return true;
					}

					// Prevent submit for invalid forms or custom submit handlers
					if ( validator.cancelSubmit ) {
						validator.cancelSubmit = false;
						return handle();
					}
					if ( validator.form() ) {
						if ( validator.pendingRequest ) {
							validator.formSubmitted = true;
							return false;
						}
						return handle();
					} else {
						validator.focusInvalid();
						return false;
					}
				} );
			}

			return validator;
		},

		// http://jqueryvalidation.org/valid/
		valid: function() {
			var valid, validator, errorList;

			if ( $( this[ 0 ] ).is( "form" ) ) {
				valid = this.validate().form();
			} else {
				errorList = [];
				valid = true;
				validator = $( this[ 0 ].form ).validate();
				this.each( function() {
					valid = validator.element( this ) && valid;
					if ( !valid ) {
						errorList = errorList.concat( validator.errorList );
					}
				} );
				validator.errorList = errorList;
			}
			return valid;
		},

		// http://jqueryvalidation.org/rules/
		rules: function( command, argument ) {
			var element = this[ 0 ],
				settings, staticRules, existingRules, data, param, filtered;

			// If nothing is selected, return empty object; can't chain anyway
			if ( element == null || element.form == null ) {
				return;
			}

			if ( command ) {
				settings = $.data( element.form, "validator" ).settings;
				staticRules = settings.rules;
				existingRules = $.validator.staticRules( element );
				switch ( command ) {
					case "add":
						$.extend( existingRules, $.validator.normalizeRule( argument ) );

						// Remove messages from rules, but allow them to be set separately
						delete existingRules.messages;
						staticRules[ element.name ] = existingRules;
						if ( argument.messages ) {
							settings.messages[ element.name ] = $.extend( settings.messages[ element.name ], argument.messages );
						}
						break;
					case "remove":
						if ( !argument ) {
							delete staticRules[ element.name ];
							return existingRules;
						}
						filtered = {};
						$.each( argument.split( /\s/ ), function( index, method ) {
							filtered[ method ] = existingRules[ method ];
							delete existingRules[ method ];
							if ( method === "required" ) {
								$( element ).removeAttr( "aria-required" );
							}
						} );
						return filtered;
				}
			}

			data = $.validator.normalizeRules(
				$.extend(
					{},
					$.validator.classRules( element ),
					$.validator.attributeRules( element ),
					$.validator.dataRules( element ),
					$.validator.staticRules( element )
				), element );

			// Make sure required is at front
			if ( data.required ) {
				param = data.required;
				delete data.required;
				data = $.extend( { required: param }, data );
				$( element ).attr( "aria-required", "true" );
			}

			// Make sure remote is at back
			if ( data.remote ) {
				param = data.remote;
				delete data.remote;
				data = $.extend( data, { remote: param } );
			}

			return data;
		}
	} );

// Custom selectors
	$.extend( $.expr.pseudos || $.expr[ ":" ], {		// '|| $.expr[ ":" ]' here enables backwards compatibility to jQuery 1.7. Can be removed when dropping jQ 1.7.x support

		// http://jqueryvalidation.org/blank-selector/
		blank: function( a ) {
			return !$.trim( "" + $( a ).val() );
		},

		// http://jqueryvalidation.org/filled-selector/
		filled: function( a ) {
			var val = $( a ).val();
			return val !== null && !!$.trim( "" + val );
		},

		// http://jqueryvalidation.org/unchecked-selector/
		unchecked: function( a ) {
			return !$( a ).prop( "checked" );
		}
	} );

// Constructor for validator
	$.validator = function( options, form ) {
		this.settings = $.extend( true, {}, $.validator.defaults, options );
		this.currentForm = form;
		this.init();
	};

// http://jqueryvalidation.org/jQuery.validator.format/
	$.validator.format = function( source, params ) {
		if ( arguments.length === 1 ) {
			return function() {
				var args = $.makeArray( arguments );
				args.unshift( source );
				return $.validator.format.apply( this, args );
			};
		}
		if ( params === undefined ) {
			return source;
		}
		if ( arguments.length > 2 && params.constructor !== Array  ) {
			params = $.makeArray( arguments ).slice( 1 );
		}
		if ( params.constructor !== Array ) {
			params = [ params ];
		}
		$.each( params, function( i, n ) {
			source = source.replace( new RegExp( "\\{" + i + "\\}", "g" ), function() {
				return n;
			} );
		} );
		return source;
	};

	$.extend( $.validator, {

		defaults: {
			messages: {},
			groups: {},
			rules: {},
			errorClass: "error",
			pendingClass: "pending",
			validClass: "valid",
			errorElement: "label",
			focusCleanup: false,
			focusInvalid: true,
			errorContainer: $( [] ),
			errorLabelContainer: $( [] ),
			onsubmit: true,
			ignore: ":hidden",
			ignoreTitle: false,
			onfocusin: function( element ) {
				this.lastActive = element;

				// Hide error label and remove error class on focus if enabled
				if ( this.settings.focusCleanup ) {
					if ( this.settings.unhighlight ) {
						this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
					}
					this.hideThese( this.errorsFor( element ) );
				}
			},
			onfocusout: function( element ) {
				if ( !this.checkable( element ) && ( element.name in this.submitted || !this.optional( element ) ) ) {
					this.element( element );
				}
			},
			onkeyup: function( element, event ) {

				// Avoid revalidate the field when pressing one of the following keys
				// Shift       => 16
				// Ctrl        => 17
				// Alt         => 18
				// Caps lock   => 20
				// End         => 35
				// Home        => 36
				// Left arrow  => 37
				// Up arrow    => 38
				// Right arrow => 39
				// Down arrow  => 40
				// Insert      => 45
				// Num lock    => 144
				// AltGr key   => 225
				var excludedKeys = [
					16, 17, 18, 20, 35, 36, 37,
					38, 39, 40, 45, 144, 225
				];

				if ( event.which === 9 && this.elementValue( element ) === "" || $.inArray( event.keyCode, excludedKeys ) !== -1 ) {
					return;
				} else if ( element.name in this.submitted || element.name in this.invalid ) {
					this.element( element );
				}
			},
			onclick: function( element ) {

				// Click on selects, radiobuttons and checkboxes
				if ( element.name in this.submitted ) {
					this.element( element );

					// Or option elements, check parent select in that case
				} else if ( element.parentNode.name in this.submitted ) {
					this.element( element.parentNode );
				}
			},
			highlight: function( element, errorClass, validClass ) {
				if ( element.type === "radio" ) {
					this.findByName( element.name ).addClass( errorClass ).removeClass( validClass );
				} else {
					$( element ).addClass( errorClass ).removeClass( validClass );
				}
			},
			unhighlight: function( element, errorClass, validClass ) {
				if ( element.type === "radio" ) {
					this.findByName( element.name ).removeClass( errorClass ).addClass( validClass );
				} else {
					$( element ).removeClass( errorClass ).addClass( validClass );
				}
			}
		},

		// http://jqueryvalidation.org/jQuery.validator.setDefaults/
		setDefaults: function( settings ) {
			$.extend( $.validator.defaults, settings );
		},

		messages: {
			required: "This field is required.",
			remote: "Please fix this field.",
			email: "Please enter a valid email address.",
			url: "Please enter a valid URL.",
			date: "Please enter a valid date.",
			dateISO: "Please enter a valid date (ISO).",
			number: "Please enter a valid number.",
			digits: "Please enter only digits.",
			equalTo: "Please enter the same value again.",
			maxlength: $.validator.format( "Please enter no more than {0} characters." ),
			minlength: $.validator.format( "Please enter at least {0} characters." ),
			rangelength: $.validator.format( "Please enter a value between {0} and {1} characters long." ),
			range: $.validator.format( "Please enter a value between {0} and {1}." ),
			max: $.validator.format( "Please enter a value less than or equal to {0}." ),
			min: $.validator.format( "Please enter a value greater than or equal to {0}." ),
			step: $.validator.format( "Please enter a multiple of {0}." )
		},

		autoCreateRanges: false,

		prototype: {

			init: function() {
				this.labelContainer = $( this.settings.errorLabelContainer );
				this.errorContext = this.labelContainer.length && this.labelContainer || $( this.currentForm );
				this.containers = $( this.settings.errorContainer ).add( this.settings.errorLabelContainer );
				this.submitted = {};
				this.valueCache = {};
				this.pendingRequest = 0;
				this.pending = {};
				this.invalid = {};
				this.reset();

				var groups = ( this.groups = {} ),
					rules;
				$.each( this.settings.groups, function( key, value ) {
					if ( typeof value === "string" ) {
						value = value.split( /\s/ );
					}
					$.each( value, function( index, name ) {
						groups[ name ] = key;
					} );
				} );
				rules = this.settings.rules;
				$.each( rules, function( key, value ) {
					rules[ key ] = $.validator.normalizeRule( value );
				} );

				function delegate( event ) {

					// Set form expando on contenteditable
					if ( !this.form && this.hasAttribute( "contenteditable" ) ) {
						this.form = $( this ).closest( "form" )[ 0 ];
					}

					var validator = $.data( this.form, "validator" ),
						eventType = "on" + event.type.replace( /^validate/, "" ),
						settings = validator.settings;
					if ( settings[ eventType ] && !$( this ).is( settings.ignore ) ) {
						settings[ eventType ].call( validator, this, event );
					}
				}

				$( this.currentForm )
					.on( "focusin.validate focusout.validate keyup.validate",
						":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], " +
						"[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], " +
						"[type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], " +
						"[type='radio'], [type='checkbox'], [contenteditable], [type='button']", delegate )

					// Support: Chrome, oldIE
					// "select" is provided as event.target when clicking a option
					.on( "click.validate", "select, option, [type='radio'], [type='checkbox']", delegate );

				if ( this.settings.invalidHandler ) {
					$( this.currentForm ).on( "invalid-form.validate", this.settings.invalidHandler );
				}

				// Add aria-required to any Static/Data/Class required fields before first validation
				// Screen readers require this attribute to be present before the initial submission http://www.w3.org/TR/WCAG-TECHS/ARIA2.html
				$( this.currentForm ).find( "[required], [data-rule-required], .required" ).attr( "aria-required", "true" );
			},

			// http://jqueryvalidation.org/Validator.form/
			form: function() {
				this.checkForm();
				$.extend( this.submitted, this.errorMap );
				this.invalid = $.extend( {}, this.errorMap );
				if ( !this.valid() ) {
					$( this.currentForm ).triggerHandler( "invalid-form", [ this ] );
				}
				this.showErrors();
				return this.valid();
			},

			checkForm: function() {
				this.prepareForm();
				for ( var i = 0, elements = ( this.currentElements = this.elements() ); elements[ i ]; i++ ) {
					this.check( elements[ i ] );
				}
				return this.valid();
			},

			// http://jqueryvalidation.org/Validator.element/
			element: function( element ) {
				var cleanElement = this.clean( element ),
					checkElement = this.validationTargetFor( cleanElement ),
					v = this,
					result = true,
					rs, group;

				if ( checkElement === undefined ) {
					delete this.invalid[ cleanElement.name ];
				} else {
					this.prepareElement( checkElement );
					this.currentElements = $( checkElement );

					// If this element is grouped, then validate all group elements already
					// containing a value
					group = this.groups[ checkElement.name ];
					if ( group ) {
						$.each( this.groups, function( name, testgroup ) {
							if ( testgroup === group && name !== checkElement.name ) {
								cleanElement = v.validationTargetFor( v.clean( v.findByName( name ) ) );
								if ( cleanElement && cleanElement.name in v.invalid ) {
									v.currentElements.push( cleanElement );
									result = v.check( cleanElement ) && result;
								}
							}
						} );
					}

					rs = this.check( checkElement ) !== false;
					result = result && rs;
					if ( rs ) {
						this.invalid[ checkElement.name ] = false;
					} else {
						this.invalid[ checkElement.name ] = true;
					}

					if ( !this.numberOfInvalids() ) {

						// Hide error containers on last error
						this.toHide = this.toHide.add( this.containers );
					}
					this.showErrors();

					// Add aria-invalid status for screen readers
					$( element ).attr( "aria-invalid", !rs );
				}

				return result;
			},

			// http://jqueryvalidation.org/Validator.showErrors/
			showErrors: function( errors ) {
				if ( errors ) {
					var validator = this;

					// Add items to error list and map
					$.extend( this.errorMap, errors );
					this.errorList = $.map( this.errorMap, function( message, name ) {
						return {
							message: message,
							element: validator.findByName( name )[ 0 ]
						};
					} );

					// Remove items from success list
					this.successList = $.grep( this.successList, function( element ) {
						return !( element.name in errors );
					} );
				}
				if ( this.settings.showErrors ) {
					this.settings.showErrors.call( this, this.errorMap, this.errorList );
				} else {
					this.defaultShowErrors();
				}
			},

			// http://jqueryvalidation.org/Validator.resetForm/
			resetForm: function() {
				if ( $.fn.resetForm ) {
					$( this.currentForm ).resetForm();
				}
				this.invalid = {};
				this.submitted = {};
				this.prepareForm();
				this.hideErrors();
				var elements = this.elements()
					.removeData( "previousValue" )
					.removeAttr( "aria-invalid" );

				this.resetElements( elements );
			},

			resetElements: function( elements ) {
				var i;

				if ( this.settings.unhighlight ) {
					for ( i = 0; elements[ i ]; i++ ) {
						this.settings.unhighlight.call( this, elements[ i ],
							this.settings.errorClass, "" );
						this.findByName( elements[ i ].name ).removeClass( this.settings.validClass );
					}
				} else {
					elements
						.removeClass( this.settings.errorClass )
						.removeClass( this.settings.validClass );
				}
			},

			numberOfInvalids: function() {
				return this.objectLength( this.invalid );
			},

			objectLength: function( obj ) {
				/* jshint unused: false */
				var count = 0,
					i;
				for ( i in obj ) {
					if ( obj[ i ] ) {
						count++;
					}
				}
				return count;
			},

			hideErrors: function() {
				this.hideThese( this.toHide );
			},

			hideThese: function( errors ) {
				errors.not( this.containers ).text( "" );
				this.addWrapper( errors ).hide();
			},

			valid: function() {
				return this.size() === 0;
			},

			size: function() {
				return this.errorList.length;
			},

			focusInvalid: function() {
				if ( this.settings.focusInvalid ) {
					try {
						$( this.findLastActive() || this.errorList.length && this.errorList[ 0 ].element || [] )
							.filter( ":visible" )
							.focus()

							// Manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
							.trigger( "focusin" );
					} catch ( e ) {

						// Ignore IE throwing errors when focusing hidden elements
					}
				}
			},

			findLastActive: function() {
				var lastActive = this.lastActive;
				return lastActive && $.grep( this.errorList, function( n ) {
					return n.element.name === lastActive.name;
				} ).length === 1 && lastActive;
			},

			elements: function() {
				var validator = this,
					rulesCache = {};

				// Select all valid inputs inside the form (no submit or reset buttons)
				return $( this.currentForm )
					.find( "input, select, textarea, [contenteditable]" )
					.not( ":submit, :reset, :image, :disabled" )
					.not( this.settings.ignore )
					.filter( function() {
						var name = this.name || $( this ).attr( "name" ); // For contenteditable
						if ( !name && validator.settings.debug && window.console ) {
							console.error( "%o has no name assigned", this );
						}

						// Set form expando on contenteditable
						if ( this.hasAttribute( "contenteditable" ) ) {
							this.form = $( this ).closest( "form" )[ 0 ];
						}

						// Select only the first element for each name, and only those with rules specified
						if ( name in rulesCache || !validator.objectLength( $( this ).rules() ) ) {
							return false;
						}

						rulesCache[ name ] = true;
						return true;
					} );
			},

			clean: function( selector ) {
				return $( selector )[ 0 ];
			},

			errors: function() {
				var errorClass = this.settings.errorClass.split( " " ).join( "." );
				return $( this.settings.errorElement + "." + errorClass, this.errorContext );
			},

			resetInternals: function() {
				this.successList = [];
				this.errorList = [];
				this.errorMap = {};
				this.toShow = $( [] );
				this.toHide = $( [] );
			},

			reset: function() {
				this.resetInternals();
				this.currentElements = $( [] );
			},

			prepareForm: function() {
				this.reset();
				this.toHide = this.errors().add( this.containers );
			},

			prepareElement: function( element ) {
				this.reset();
				this.toHide = this.errorsFor( element );
			},

			elementValue: function( element ) {
				var $element = $( element ),
					type = element.type,
					val, idx;

				if ( type === "radio" || type === "checkbox" ) {
					return this.findByName( element.name ).filter( ":checked" ).val();
				} else if ( type === "number" && typeof element.validity !== "undefined" ) {
					return element.validity.badInput ? "NaN" : $element.val();
				}

				if ( element.hasAttribute( "contenteditable" ) ) {
					val = $element.text();
				} else {
					val = $element.val();
				}

				if ( type === "file" ) {

					// Modern browser (chrome & safari)
					if ( val.substr( 0, 12 ) === "C:\\fakepath\\" ) {
						return val.substr( 12 );
					}

					// Legacy browsers
					// Unix-based path
					idx = val.lastIndexOf( "/" );
					if ( idx >= 0 ) {
						return val.substr( idx + 1 );
					}

					// Windows-based path
					idx = val.lastIndexOf( "\\" );
					if ( idx >= 0 ) {
						return val.substr( idx + 1 );
					}

					// Just the file name
					return val;
				}

				if ( typeof val === "string" ) {
					return val.replace( /\r/g, "" );
				}
				return val;
			},

			check: function( element ) {
				element = this.validationTargetFor( this.clean( element ) );

				var rules = $( element ).rules(),
					rulesCount = $.map( rules, function( n, i ) {
						return i;
					} ).length,
					dependencyMismatch = false,
					val = this.elementValue( element ),
					result, method, rule;

				// If a normalizer is defined for this element, then
				// call it to retreive the changed value instead
				// of using the real one.
				// Note that `this` in the normalizer is `element`.
				if ( typeof rules.normalizer === "function" ) {
					val = rules.normalizer.call( element, val );

					if ( typeof val !== "string" ) {
						throw new TypeError( "The normalizer should return a string value." );
					}

					// Delete the normalizer from rules to avoid treating
					// it as a pre-defined method.
					delete rules.normalizer;
				}

				for ( method in rules ) {
					rule = { method: method, parameters: rules[ method ] };
					try {
						result = $.validator.methods[ method ].call( this, val, element, rule.parameters );

						// If a method indicates that the field is optional and therefore valid,
						// don't mark it as valid when there are no other rules
						if ( result === "dependency-mismatch" && rulesCount === 1 ) {
							dependencyMismatch = true;
							continue;
						}
						dependencyMismatch = false;

						if ( result === "pending" ) {
							this.toHide = this.toHide.not( this.errorsFor( element ) );
							return;
						}

						if ( !result ) {
							this.formatAndAdd( element, rule );
							return false;
						}
					} catch ( e ) {
						if ( this.settings.debug && window.console ) {
							console.log( "Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e );
						}
						if ( e instanceof TypeError ) {
							e.message += ".  Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.";
						}

						throw e;
					}
				}
				if ( dependencyMismatch ) {
					return;
				}
				if ( this.objectLength( rules ) ) {
					this.successList.push( element );
				}
				return true;
			},

			// Return the custom message for the given element and validation method
			// specified in the element's HTML5 data attribute
			// return the generic message if present and no method specific message is present
			customDataMessage: function( element, method ) {
				return $( element ).data( "msg" + method.charAt( 0 ).toUpperCase() +
					method.substring( 1 ).toLowerCase() ) || $( element ).data( "msg" );
			},

			// Return the custom message for the given element name and validation method
			customMessage: function( name, method ) {
				var m = this.settings.messages[ name ];
				return m && ( m.constructor === String ? m : m[ method ] );
			},

			// Return the first defined argument, allowing empty strings
			findDefined: function() {
				for ( var i = 0; i < arguments.length; i++ ) {
					if ( arguments[ i ] !== undefined ) {
						return arguments[ i ];
					}
				}
				return undefined;
			},

			// The second parameter 'rule' used to be a string, and extended to an object literal
			// of the following form:
			// rule = {
			//     method: "method name",
			//     parameters: "the given method parameters"
			// }
			//
			// The old behavior still supported, kept to maintain backward compatibility with
			// old code, and will be removed in the next major release.
			defaultMessage: function( element, rule ) {
				if ( typeof rule === "string" ) {
					rule = { method: rule };
				}

				var message = this.findDefined(
					this.customMessage( element.name, rule.method ),
					this.customDataMessage( element, rule.method ),

					// 'title' is never undefined, so handle empty string as undefined
					!this.settings.ignoreTitle && element.title || undefined,
					$.validator.messages[ rule.method ],
					"<strong>Warning: No message defined for " + element.name + "</strong>"
					),
					theregex = /\$?\{(\d+)\}/g;
				if ( typeof message === "function" ) {
					message = message.call( this, rule.parameters, element );
				} else if ( theregex.test( message ) ) {
					message = $.validator.format( message.replace( theregex, "{$1}" ), rule.parameters );
				}

				return message;
			},

			formatAndAdd: function( element, rule ) {
				var message = this.defaultMessage( element, rule );

				this.errorList.push( {
					message: message,
					element: element,
					method: rule.method
				} );

				this.errorMap[ element.name ] = message;
				this.submitted[ element.name ] = message;
			},

			addWrapper: function( toToggle ) {
				if ( this.settings.wrapper ) {
					toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
				}
				return toToggle;
			},

			defaultShowErrors: function() {
				var i, elements, error;
				for ( i = 0; this.errorList[ i ]; i++ ) {
					error = this.errorList[ i ];
					if ( this.settings.highlight ) {
						this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
					}
					this.showLabel( error.element, error.message );
				}
				if ( this.errorList.length ) {
					this.toShow = this.toShow.add( this.containers );
				}
				if ( this.settings.success ) {
					for ( i = 0; this.successList[ i ]; i++ ) {
						this.showLabel( this.successList[ i ] );
					}
				}
				if ( this.settings.unhighlight ) {
					for ( i = 0, elements = this.validElements(); elements[ i ]; i++ ) {
						this.settings.unhighlight.call( this, elements[ i ], this.settings.errorClass, this.settings.validClass );
					}
				}
				this.toHide = this.toHide.not( this.toShow );
				this.hideErrors();
				this.addWrapper( this.toShow ).show();
			},

			validElements: function() {
				return this.currentElements.not( this.invalidElements() );
			},

			invalidElements: function() {
				return $( this.errorList ).map( function() {
					return this.element;
				} );
			},

			showLabel: function( element, message ) {
				var place, group, errorID, v,
					error = this.errorsFor( element ),
					elementID = this.idOrName( element ),
					describedBy = $( element ).attr( "aria-describedby" );

				if ( error.length ) {

					// Refresh error/success class
					error.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );

					// Replace message on existing label
					error.html( message );
				} else {

					// Create error element
					error = $( "<" + this.settings.errorElement + ">" )
						.attr( "id", elementID + "-error" )
						.addClass( this.settings.errorClass )
						.html( message || "" );

					// Maintain reference to the element to be placed into the DOM
					place = error;
					if ( this.settings.wrapper ) {

						// Make sure the element is visible, even in IE
						// actually showing the wrapped element is handled elsewhere
						place = error.hide().show().wrap( "<" + this.settings.wrapper + "/>" ).parent();
					}
					if ( this.labelContainer.length ) {
						this.labelContainer.append( place );
					} else if ( this.settings.errorPlacement ) {
						this.settings.errorPlacement.call( this, place, $( element ) );
					} else {
						place.insertAfter( element );
					}

					// Link error back to the element
					if ( error.is( "label" ) ) {

						// If the error is a label, then associate using 'for'
						error.attr( "for", elementID );

						// If the element is not a child of an associated label, then it's necessary
						// to explicitly apply aria-describedby
					} else if ( error.parents( "label[for='" + this.escapeCssMeta( elementID ) + "']" ).length === 0 ) {
						errorID = error.attr( "id" );

						// Respect existing non-error aria-describedby
						if ( !describedBy ) {
							describedBy = errorID;
						} else if ( !describedBy.match( new RegExp( "\\b" + this.escapeCssMeta( errorID ) + "\\b" ) ) ) {

							// Add to end of list if not already present
							describedBy += " " + errorID;
						}
						$( element ).attr( "aria-describedby", describedBy );

						// If this element is grouped, then assign to all elements in the same group
						group = this.groups[ element.name ];
						if ( group ) {
							v = this;
							$.each( v.groups, function( name, testgroup ) {
								if ( testgroup === group ) {
									$( "[name='" + v.escapeCssMeta( name ) + "']", v.currentForm )
										.attr( "aria-describedby", error.attr( "id" ) );
								}
							} );
						}
					}
				}
				if ( !message && this.settings.success ) {
					error.text( "" );
					if ( typeof this.settings.success === "string" ) {
						error.addClass( this.settings.success );
					} else {
						this.settings.success( error, element );
					}
				}
				this.toShow = this.toShow.add( error );
			},

			errorsFor: function( element ) {
				var name = this.escapeCssMeta( this.idOrName( element ) ),
					describer = $( element ).attr( "aria-describedby" ),
					selector = "label[for='" + name + "'], label[for='" + name + "'] *";

				// 'aria-describedby' should directly reference the error element
				if ( describer ) {
					selector = selector + ", #" + this.escapeCssMeta( describer )
						.replace( /\s+/g, ", #" );
				}

				return this
					.errors()
					.filter( selector );
			},

			// See https://api.jquery.com/category/selectors/, for CSS
			// meta-characters that should be escaped in order to be used with JQuery
			// as a literal part of a name/id or any selector.
			escapeCssMeta: function( string ) {
				return string.replace( /([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g, "\\$1" );
			},

			idOrName: function( element ) {
				return this.groups[ element.name ] || ( this.checkable( element ) ? element.name : element.id || element.name );
			},

			validationTargetFor: function( element ) {

				// If radio/checkbox, validate first element in group instead
				if ( this.checkable( element ) ) {
					element = this.findByName( element.name );
				}

				// Always apply ignore filter
				return $( element ).not( this.settings.ignore )[ 0 ];
			},

			checkable: function( element ) {
				return ( /radio|checkbox/i ).test( element.type );
			},

			findByName: function( name ) {
				return $( this.currentForm ).find( "[name='" + this.escapeCssMeta( name ) + "']" );
			},

			getLength: function( value, element ) {
				switch ( element.nodeName.toLowerCase() ) {
					case "select":
						return $( "option:selected", element ).length;
					case "input":
						if ( this.checkable( element ) ) {
							return this.findByName( element.name ).filter( ":checked" ).length;
						}
				}
				return value.length;
			},

			depend: function( param, element ) {
				return this.dependTypes[ typeof param ] ? this.dependTypes[ typeof param ]( param, element ) : true;
			},

			dependTypes: {
				"boolean": function( param ) {
					return param;
				},
				"string": function( param, element ) {
					return !!$( param, element.form ).length;
				},
				"function": function( param, element ) {
					return param( element );
				}
			},

			optional: function( element ) {
				var val = this.elementValue( element );
				return !$.validator.methods.required.call( this, val, element ) && "dependency-mismatch";
			},

			startRequest: function( element ) {
				if ( !this.pending[ element.name ] ) {
					this.pendingRequest++;
					$( element ).addClass( this.settings.pendingClass );
					this.pending[ element.name ] = true;
				}
			},

			stopRequest: function( element, valid ) {
				this.pendingRequest--;

				// Sometimes synchronization fails, make sure pendingRequest is never < 0
				if ( this.pendingRequest < 0 ) {
					this.pendingRequest = 0;
				}
				delete this.pending[ element.name ];
				$( element ).removeClass( this.settings.pendingClass );
				if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
					$( this.currentForm ).submit();
					this.formSubmitted = false;
				} else if ( !valid && this.pendingRequest === 0 && this.formSubmitted ) {
					$( this.currentForm ).triggerHandler( "invalid-form", [ this ] );
					this.formSubmitted = false;
				}
			},

			previousValue: function( element, method ) {
				method = typeof method === "string" && method || "remote";

				return $.data( element, "previousValue" ) || $.data( element, "previousValue", {
					old: null,
					valid: true,
					message: this.defaultMessage( element, { method: method } )
				} );
			},

			// Cleans up all forms and elements, removes validator-specific events
			destroy: function() {
				this.resetForm();

				$( this.currentForm )
					.off( ".validate" )
					.removeData( "validator" )
					.find( ".validate-equalTo-blur" )
					.off( ".validate-equalTo" )
					.removeClass( "validate-equalTo-blur" );
			}

		},

		classRuleSettings: {
			required: { required: true },
			email: { email: true },
			url: { url: true },
			date: { date: true },
			dateISO: { dateISO: true },
			number: { number: true },
			digits: { digits: true },
			creditcard: { creditcard: true }
		},

		addClassRules: function( className, rules ) {
			if ( className.constructor === String ) {
				this.classRuleSettings[ className ] = rules;
			} else {
				$.extend( this.classRuleSettings, className );
			}
		},

		classRules: function( element ) {
			var rules = {},
				classes = $( element ).attr( "class" );

			if ( classes ) {
				$.each( classes.split( " " ), function() {
					if ( this in $.validator.classRuleSettings ) {
						$.extend( rules, $.validator.classRuleSettings[ this ] );
					}
				} );
			}
			return rules;
		},

		normalizeAttributeRule: function( rules, type, method, value ) {

			// Convert the value to a number for number inputs, and for text for backwards compability
			// allows type="date" and others to be compared as strings
			if ( /min|max|step/.test( method ) && ( type === null || /number|range|text/.test( type ) ) ) {
				value = Number( value );

				// Support Opera Mini, which returns NaN for undefined minlength
				if ( isNaN( value ) ) {
					value = undefined;
				}
			}

			if ( value || value === 0 ) {
				rules[ method ] = value;
			} else if ( type === method && type !== "range" ) {

				// Exception: the jquery validate 'range' method
				// does not test for the html5 'range' type
				rules[ method ] = true;
			}
		},

		attributeRules: function( element ) {
			var rules = {},
				$element = $( element ),
				type = element.getAttribute( "type" ),
				method, value;

			for ( method in $.validator.methods ) {

				// Support for <input required> in both html5 and older browsers
				if ( method === "required" ) {
					value = element.getAttribute( method );

					// Some browsers return an empty string for the required attribute
					// and non-HTML5 browsers might have required="" markup
					if ( value === "" ) {
						value = true;
					}

					// Force non-HTML5 browsers to return bool
					value = !!value;
				} else {
					value = $element.attr( method );
				}

				this.normalizeAttributeRule( rules, type, method, value );
			}

			// 'maxlength' may be returned as -1, 2147483647 ( IE ) and 524288 ( safari ) for text inputs
			if ( rules.maxlength && /-1|2147483647|524288/.test( rules.maxlength ) ) {
				delete rules.maxlength;
			}

			return rules;
		},

		dataRules: function( element ) {
			var rules = {},
				$element = $( element ),
				type = element.getAttribute( "type" ),
				method, value;

			for ( method in $.validator.methods ) {
				value = $element.data( "rule" + method.charAt( 0 ).toUpperCase() + method.substring( 1 ).toLowerCase() );
				this.normalizeAttributeRule( rules, type, method, value );
			}
			return rules;
		},

		staticRules: function( element ) {
			var rules = {},
				validator = $.data( element.form, "validator" );

			if ( validator.settings.rules ) {
				rules = $.validator.normalizeRule( validator.settings.rules[ element.name ] ) || {};
			}
			return rules;
		},

		normalizeRules: function( rules, element ) {

			// Handle dependency check
			$.each( rules, function( prop, val ) {

				// Ignore rule when param is explicitly false, eg. required:false
				if ( val === false ) {
					delete rules[ prop ];
					return;
				}
				if ( val.param || val.depends ) {
					var keepRule = true;
					switch ( typeof val.depends ) {
						case "string":
							keepRule = !!$( val.depends, element.form ).length;
							break;
						case "function":
							keepRule = val.depends.call( element, element );
							break;
					}
					if ( keepRule ) {
						rules[ prop ] = val.param !== undefined ? val.param : true;
					} else {
						$.data( element.form, "validator" ).resetElements( $( element ) );
						delete rules[ prop ];
					}
				}
			} );

			// Evaluate parameters
			$.each( rules, function( rule, parameter ) {
				rules[ rule ] = $.isFunction( parameter ) && rule !== "normalizer" ? parameter( element ) : parameter;
			} );

			// Clean number parameters
			$.each( [ "minlength", "maxlength" ], function() {
				if ( rules[ this ] ) {
					rules[ this ] = Number( rules[ this ] );
				}
			} );
			$.each( [ "rangelength", "range" ], function() {
				var parts;
				if ( rules[ this ] ) {
					if ( $.isArray( rules[ this ] ) ) {
						rules[ this ] = [ Number( rules[ this ][ 0 ] ), Number( rules[ this ][ 1 ] ) ];
					} else if ( typeof rules[ this ] === "string" ) {
						parts = rules[ this ].replace( /[\[\]]/g, "" ).split( /[\s,]+/ );
						rules[ this ] = [ Number( parts[ 0 ] ), Number( parts[ 1 ] ) ];
					}
				}
			} );

			if ( $.validator.autoCreateRanges ) {

				// Auto-create ranges
				if ( rules.min != null && rules.max != null ) {
					rules.range = [ rules.min, rules.max ];
					delete rules.min;
					delete rules.max;
				}
				if ( rules.minlength != null && rules.maxlength != null ) {
					rules.rangelength = [ rules.minlength, rules.maxlength ];
					delete rules.minlength;
					delete rules.maxlength;
				}
			}

			return rules;
		},

		// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
		normalizeRule: function( data ) {
			if ( typeof data === "string" ) {
				var transformed = {};
				$.each( data.split( /\s/ ), function() {
					transformed[ this ] = true;
				} );
				data = transformed;
			}
			return data;
		},

		// http://jqueryvalidation.org/jQuery.validator.addMethod/
		addMethod: function( name, method, message ) {
			$.validator.methods[ name ] = method;
			$.validator.messages[ name ] = message !== undefined ? message : $.validator.messages[ name ];
			if ( method.length < 3 ) {
				$.validator.addClassRules( name, $.validator.normalizeRule( name ) );
			}
		},

		// http://jqueryvalidation.org/jQuery.validator.methods/
		methods: {

			// http://jqueryvalidation.org/required-method/
			required: function( value, element, param ) {

				// Check if dependency is met
				if ( !this.depend( param, element ) ) {
					return "dependency-mismatch";
				}
				if ( element.nodeName.toLowerCase() === "select" ) {

					// Could be an array for select-multiple or a string, both are fine this way
					var val = $( element ).val();
					return val && val.length > 0;
				}
				if ( this.checkable( element ) ) {
					return this.getLength( value, element ) > 0;
				}
				return value.length > 0;
			},

			// http://jqueryvalidation.org/email-method/
			email: function( value, element ) {

				// From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
				// Retrieved 2014-01-14
				// If you have a problem with this implementation, report a bug against the above spec
				// Or use custom methods to implement your own email validation
				return this.optional( element ) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
			},

			// http://jqueryvalidation.org/url-method/
			url: function( value, element ) {

				// Copyright (c) 2010-2013 Diego Perini, MIT licensed
				// https://gist.github.com/dperini/729294
				// see also https://mathiasbynens.be/demo/url-regex
				// modified to allow protocol-relative URLs
				return this.optional( element ) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );
			},

			// http://jqueryvalidation.org/date-method/
			date: function( value, element ) {
				return this.optional( element ) || !/Invalid|NaN/.test( new Date( value ).toString() );
			},

			// http://jqueryvalidation.org/dateISO-method/
			dateISO: function( value, element ) {
				return this.optional( element ) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test( value );
			},

			// http://jqueryvalidation.org/number-method/
			number: function( value, element ) {
				return this.optional( element ) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
			},

			// http://jqueryvalidation.org/digits-method/
			digits: function( value, element ) {
				return this.optional( element ) || /^\d+$/.test( value );
			},

			// http://jqueryvalidation.org/minlength-method/
			minlength: function( value, element, param ) {
				var length = $.isArray( value ) ? value.length : this.getLength( value, element );
				return this.optional( element ) || length >= param;
			},

			// http://jqueryvalidation.org/maxlength-method/
			maxlength: function( value, element, param ) {
				var length = $.isArray( value ) ? value.length : this.getLength( value, element );
				return this.optional( element ) || length <= param;
			},

			// http://jqueryvalidation.org/rangelength-method/
			rangelength: function( value, element, param ) {
				var length = $.isArray( value ) ? value.length : this.getLength( value, element );
				return this.optional( element ) || ( length >= param[ 0 ] && length <= param[ 1 ] );
			},

			// http://jqueryvalidation.org/min-method/
			min: function( value, element, param ) {
				return this.optional( element ) || value >= param;
			},

			// http://jqueryvalidation.org/max-method/
			max: function( value, element, param ) {
				return this.optional( element ) || value <= param;
			},

			// http://jqueryvalidation.org/range-method/
			range: function( value, element, param ) {
				return this.optional( element ) || ( value >= param[ 0 ] && value <= param[ 1 ] );
			},

			// http://jqueryvalidation.org/step-method/
			step: function( value, element, param ) {
				var type = $( element ).attr( "type" ),
					errorMessage = "Step attribute on input type " + type + " is not supported.",
					supportedTypes = [ "text", "number", "range" ],
					re = new RegExp( "\\b" + type + "\\b" ),
					notSupported = type && !re.test( supportedTypes.join() ),
					decimalPlaces = function( num ) {
						var match = ( "" + num ).match( /(?:\.(\d+))?$/ );
						if ( !match ) {
							return 0;
						}

						// Number of digits right of decimal point.
						return match[ 1 ] ? match[ 1 ].length : 0;
					},
					toInt = function( num ) {
						return Math.round( num * Math.pow( 10, decimals ) );
					},
					valid = true,
					decimals;

				// Works only for text, number and range input types
				// TODO find a way to support input types date, datetime, datetime-local, month, time and week
				if ( notSupported ) {
					throw new Error( errorMessage );
				}

				decimals = decimalPlaces( param );

				// Value can't have too many decimals
				if ( decimalPlaces( value ) > decimals || toInt( value ) % toInt( param ) !== 0 ) {
					valid = false;
				}

				return this.optional( element ) || valid;
			},

			// http://jqueryvalidation.org/equalTo-method/
			equalTo: function( value, element, param ) {

				// Bind to the blur event of the target in order to revalidate whenever the target field is updated
				var target = $( param );
				if ( this.settings.onfocusout && target.not( ".validate-equalTo-blur" ).length ) {
					target.addClass( "validate-equalTo-blur" ).on( "blur.validate-equalTo", function() {
						$( element ).valid();
					} );
				}
				return value === target.val();
			},

			// http://jqueryvalidation.org/remote-method/
			remote: function( value, element, param, method ) {
				if ( this.optional( element ) ) {
					return "dependency-mismatch";
				}

				method = typeof method === "string" && method || "remote";

				var previous = this.previousValue( element, method ),
					validator, data, optionDataString;

				if ( !this.settings.messages[ element.name ] ) {
					this.settings.messages[ element.name ] = {};
				}
				previous.originalMessage = previous.originalMessage || this.settings.messages[ element.name ][ method ];
				this.settings.messages[ element.name ][ method ] = previous.message;

				param = typeof param === "string" && { url: param } || param;
				optionDataString = $.param( $.extend( { data: value }, param.data ) );
				if ( previous.old === optionDataString ) {
					return previous.valid;
				}

				previous.old = optionDataString;
				validator = this;
				this.startRequest( element );
				data = {};
				data[ element.name ] = value;
				$.ajax( $.extend( true, {
					mode: "abort",
					port: "validate" + element.name,
					dataType: "json",
					data: data,
					context: validator.currentForm,
					success: function( response ) {
						var valid = response === true || response === "true",
							errors, message, submitted;

						validator.settings.messages[ element.name ][ method ] = previous.originalMessage;
						if ( valid ) {
							submitted = validator.formSubmitted;
							validator.resetInternals();
							validator.toHide = validator.errorsFor( element );
							validator.formSubmitted = submitted;
							validator.successList.push( element );
							validator.invalid[ element.name ] = false;
							validator.showErrors();
						} else {
							errors = {};
							message = response || validator.defaultMessage( element, { method: method, parameters: value } );
							errors[ element.name ] = previous.message = message;
							validator.invalid[ element.name ] = true;
							validator.showErrors( errors );
						}
						previous.valid = valid;
						validator.stopRequest( element, valid );
					}
				}, param ) );
				return "pending";
			}
		}

	} );

// Ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()

	var pendingRequests = {},
		ajax;

// Use a prefilter if available (1.5+)
	if ( $.ajaxPrefilter ) {
		$.ajaxPrefilter( function( settings, _, xhr ) {
			var port = settings.port;
			if ( settings.mode === "abort" ) {
				if ( pendingRequests[ port ] ) {
					pendingRequests[ port ].abort();
				}
				pendingRequests[ port ] = xhr;
			}
		} );
	} else {

		// Proxy ajax
		ajax = $.ajax;
		$.ajax = function( settings ) {
			var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
				port = ( "port" in settings ? settings : $.ajaxSettings ).port;
			if ( mode === "abort" ) {
				if ( pendingRequests[ port ] ) {
					pendingRequests[ port ].abort();
				}
				pendingRequests[ port ] = ajax.apply( this, arguments );
				return pendingRequests[ port ];
			}
			return ajax.apply( this, arguments );
		};
	}
	return $;
}(jQuery));



/*! Magnific Popup - v1.1.0 - 2016-02-20
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov; */
(function($) {
	/**
	 * Private static constants
	 */
	var CLOSE_EVENT = 'Close',
		BEFORE_CLOSE_EVENT = 'BeforeClose',
		AFTER_CLOSE_EVENT = 'AfterClose',
		BEFORE_APPEND_EVENT = 'BeforeAppend',
		MARKUP_PARSE_EVENT = 'MarkupParse',
		OPEN_EVENT = 'Open',
		CHANGE_EVENT = 'Change',
		NS = 'mfp',
		EVENT_NS = '.' + NS,
		READY_CLASS = 'mfp-ready',
		REMOVING_CLASS = 'mfp-removing',
		PREVENT_CLOSE_CLASS = 'mfp-prevent-close';


	/**
	 * Private vars
	 */
	/*jshint -W079 */
	var mfp, // As we have only one instance of MagnificPopup object, we define it locally to not to use 'this'
		MagnificPopup = function(){},
		_isJQ = !!(jQuery),
		_prevStatus,
		_window = $(window),
		_document,
		_prevContentType,
		_wrapClasses,
		_currPopupType;


	/**
	 * Private functions
	 */
	var _mfpOn = function(name, f) {
			mfp.ev.on(NS + name + EVENT_NS, f);
		},
		_getEl = function(className, appendTo, html, raw) {
			var el = document.createElement('div');
			el.className = 'mfp-'+className;
			if(html) {
				el.innerHTML = html;
			}
			if(!raw) {
				el = $(el);
				if(appendTo) {
					el.appendTo(appendTo);
				}
			} else if(appendTo) {
				appendTo.appendChild(el);
			}
			return el;
		},
		_mfpTrigger = function(e, data) {
			mfp.ev.triggerHandler(NS + e, data);

			if(mfp.st.callbacks) {
				// converts "mfpEventName" to "eventName" callback and triggers it if it's present
				e = e.charAt(0).toLowerCase() + e.slice(1);
				if(mfp.st.callbacks[e]) {
					mfp.st.callbacks[e].apply(mfp, $.isArray(data) ? data : [data]);
				}
			}
		},
		_getCloseBtn = function(type) {
			if(type !== _currPopupType || !mfp.currTemplate.closeBtn) {
				mfp.currTemplate.closeBtn = $( mfp.st.closeMarkup.replace('%title%', mfp.st.tClose ) );
				_currPopupType = type;
			}
			return mfp.currTemplate.closeBtn;
		},
		// Initialize Magnific Popup only when called at least once
		_checkInstance = function() {
			if(!$.magnificPopup.instance) {
				/*jshint -W020 */
				mfp = new MagnificPopup();
				mfp.init();
				$.magnificPopup.instance = mfp;
			}
		},
		// CSS transition detection, http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
		supportsTransitions = function() {
			var s = document.createElement('p').style, // 's' for style. better to create an element if body yet to exist
				v = ['ms','O','Moz','Webkit']; // 'v' for vendor

			if( s['transition'] !== undefined ) {
				return true;
			}

			while( v.length ) {
				if( v.pop() + 'Transition' in s ) {
					return true;
				}
			}

			return false;
		};



	/**
	 * Public functions
	 */
	MagnificPopup.prototype = {

		constructor: MagnificPopup,

		/**
		 * Initializes Magnific Popup plugin.
		 * This function is triggered only once when $.fn.magnificPopup or $.magnificPopup is executed
		 */
		init: function() {
			var appVersion = navigator.appVersion;
			mfp.isLowIE = mfp.isIE8 = document.all && !document.addEventListener;
			mfp.isAndroid = (/android/gi).test(appVersion);
			mfp.isIOS = (/iphone|ipad|ipod/gi).test(appVersion);
			mfp.supportsTransition = supportsTransitions();

			// We disable fixed positioned lightbox on devices that don't handle it nicely.
			// If you know a better way of detecting this - let me know.
			mfp.probablyMobile = (mfp.isAndroid || mfp.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent) );
			_document = $(document);

			mfp.popupsCache = {};
		},

		/**
		 * Opens popup
		 * @param  data [description]
		 */
		open: function(data) {

			var i;

			if(data.isObj === false) {
				// convert jQuery collection to array to avoid conflicts later
				mfp.items = data.items.toArray();

				mfp.index = 0;
				var items = data.items,
					item;
				for(i = 0; i < items.length; i++) {
					item = items[i];
					if(item.parsed) {
						item = item.el[0];
					}
					if(item === data.el[0]) {
						mfp.index = i;
						break;
					}
				}
			} else {
				mfp.items = $.isArray(data.items) ? data.items : [data.items];
				mfp.index = data.index || 0;
			}

			// if popup is already opened - we just update the content
			if(mfp.isOpen) {
				mfp.updateItemHTML();
				return;
			}

			mfp.types = [];
			_wrapClasses = '';
			if(data.mainEl && data.mainEl.length) {
				mfp.ev = data.mainEl.eq(0);
			} else {
				mfp.ev = _document;
			}

			if(data.key) {
				if(!mfp.popupsCache[data.key]) {
					mfp.popupsCache[data.key] = {};
				}
				mfp.currTemplate = mfp.popupsCache[data.key];
			} else {
				mfp.currTemplate = {};
			}



			mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data );
			mfp.fixedContentPos = mfp.st.fixedContentPos === 'auto' ? !mfp.probablyMobile : mfp.st.fixedContentPos;

			if(mfp.st.modal) {
				mfp.st.closeOnContentClick = false;
				mfp.st.closeOnBgClick = false;
				mfp.st.showCloseBtn = false;
				mfp.st.enableEscapeKey = false;
			}


			// Building markup
			// main containers are created only once
			if(!mfp.bgOverlay) {

				// Dark overlay
				mfp.bgOverlay = _getEl('bg').on('click'+EVENT_NS, function() {
					mfp.close();
				});

				mfp.wrap = _getEl('wrap').attr('tabindex', -1).on('click'+EVENT_NS, function(e) {
					if(mfp._checkIfClose(e.target)) {
						mfp.close();
					}
				});

				mfp.container = _getEl('container', mfp.wrap);
			}

			mfp.contentContainer = _getEl('content');
			if(mfp.st.preloader) {
				mfp.preloader = _getEl('preloader', mfp.container, mfp.st.tLoading);
			}


			// Initializing modules
			var modules = $.magnificPopup.modules;
			for(i = 0; i < modules.length; i++) {
				var n = modules[i];
				n = n.charAt(0).toUpperCase() + n.slice(1);
				mfp['init'+n].call(mfp);
			}
			_mfpTrigger('BeforeOpen');


			if(mfp.st.showCloseBtn) {
				// Close button
				if(!mfp.st.closeBtnInside) {
					mfp.wrap.append( _getCloseBtn() );
				} else {
					_mfpOn(MARKUP_PARSE_EVENT, function(e, template, values, item) {
						values.close_replaceWith = _getCloseBtn(item.type);
					});
					_wrapClasses += ' mfp-close-btn-in';
				}
			}

			if(mfp.st.alignTop) {
				_wrapClasses += ' mfp-align-top';
			}



			if(mfp.fixedContentPos) {
				mfp.wrap.css({
					overflow: mfp.st.overflowY,
					overflowX: 'hidden',
					overflowY: mfp.st.overflowY
				});
			} else {
				mfp.wrap.css({
					top: _window.scrollTop(),
					position: 'absolute'
				});
			}
			if( mfp.st.fixedBgPos === false || (mfp.st.fixedBgPos === 'auto' && !mfp.fixedContentPos) ) {
				mfp.bgOverlay.css({
					height: _document.height(),
					position: 'absolute'
				});
			}



			if(mfp.st.enableEscapeKey) {
				// Close on ESC key
				_document.on('keyup' + EVENT_NS, function(e) {
					if(e.keyCode === 27) {
						mfp.close();
					}
				});
			}

			_window.on('resize' + EVENT_NS, function() {
				mfp.updateSize();
			});


			if(!mfp.st.closeOnContentClick) {
				_wrapClasses += ' mfp-auto-cursor';
			}

			if(_wrapClasses)
				mfp.wrap.addClass(_wrapClasses);


			// this triggers recalculation of layout, so we get it once to not to trigger twice
			var windowHeight = mfp.wH = _window.height();


			var windowStyles = {};

			if( mfp.fixedContentPos ) {
				if(mfp._hasScrollBar(windowHeight)){
					var s = mfp._getScrollbarSize();
					if(s) {
						windowStyles.marginRight = s;
					}
				}
			}

			if(mfp.fixedContentPos) {
				if(!mfp.isIE7) {
					windowStyles.overflow = 'hidden';
				} else {
					// ie7 double-scroll bug
					$('body, html').css('overflow', 'hidden');
				}
			}



			var classesToadd = mfp.st.mainClass;
			if(mfp.isIE7) {
				classesToadd += ' mfp-ie7';
			}
			if(classesToadd) {
				mfp._addClassToMFP( classesToadd );
			}

			// add content
			mfp.updateItemHTML();

			_mfpTrigger('BuildControls');

			// remove scrollbar, add margin e.t.c
			$('html').css(windowStyles);

			// add everything to DOM
			mfp.bgOverlay.add(mfp.wrap).prependTo( mfp.st.prependTo || $(document.body) );

			// Save last focused element
			mfp._lastFocusedEl = document.activeElement;

			// Wait for next cycle to allow CSS transition
			setTimeout(function() {

				if(mfp.content) {
					mfp._addClassToMFP(READY_CLASS);
					mfp._setFocus();
				} else {
					// if content is not defined (not loaded e.t.c) we add class only for BG
					mfp.bgOverlay.addClass(READY_CLASS);
				}

				// Trap the focus in popup
				_document.on('focusin' + EVENT_NS, mfp._onFocusIn);

			}, 16);

			mfp.isOpen = true;
			mfp.updateSize(windowHeight);
			_mfpTrigger(OPEN_EVENT);

			return data;
		},

		/**
		 * Closes the popup
		 */
		close: function() {
			if(!mfp.isOpen) return;
			_mfpTrigger(BEFORE_CLOSE_EVENT);

			mfp.isOpen = false;
			// for CSS3 animation
			if(mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition )  {
				mfp._addClassToMFP(REMOVING_CLASS);
				setTimeout(function() {
					mfp._close();
				}, mfp.st.removalDelay);
			} else {
				mfp._close();
			}
		},

		/**
		 * Helper for close() function
		 */
		_close: function() {
			_mfpTrigger(CLOSE_EVENT);

			var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' ';

			mfp.bgOverlay.detach();
			mfp.wrap.detach();
			mfp.container.empty();

			if(mfp.st.mainClass) {
				classesToRemove += mfp.st.mainClass + ' ';
			}

			mfp._removeClassFromMFP(classesToRemove);

			if(mfp.fixedContentPos) {
				var windowStyles = {marginRight: ''};
				if(mfp.isIE7) {
					$('body, html').css('overflow', '');
				} else {
					windowStyles.overflow = '';
				}
				$('html').css(windowStyles);
			}

			_document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS);
			mfp.ev.off(EVENT_NS);

			// clean up DOM elements that aren't removed
			mfp.wrap.attr('class', 'mfp-wrap').removeAttr('style');
			mfp.bgOverlay.attr('class', 'mfp-bg');
			mfp.container.attr('class', 'mfp-container');

			// remove close button from target element
			if(mfp.st.showCloseBtn &&
				(!mfp.st.closeBtnInside || mfp.currTemplate[mfp.currItem.type] === true)) {
				if(mfp.currTemplate.closeBtn)
					mfp.currTemplate.closeBtn.detach();
			}


			if(mfp.st.autoFocusLast && mfp._lastFocusedEl) {
				$(mfp._lastFocusedEl).focus(); // put tab focus back
			}
			mfp.currItem = null;
			mfp.content = null;
			mfp.currTemplate = null;
			mfp.prevHeight = 0;

			_mfpTrigger(AFTER_CLOSE_EVENT);
		},

		updateSize: function(winHeight) {

			if(mfp.isIOS) {
				// fixes iOS nav bars https://github.com/dimsemenov/Magnific-Popup/issues/2
				var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
				var height = window.innerHeight * zoomLevel;
				mfp.wrap.css('height', height);
				mfp.wH = height;
			} else {
				mfp.wH = winHeight || _window.height();
			}
			// Fixes #84: popup incorrectly positioned with position:relative on body
			if(!mfp.fixedContentPos) {
				mfp.wrap.css('height', mfp.wH);
			}

			_mfpTrigger('Resize');

		},

		/**
		 * Set content of popup based on current index
		 */
		updateItemHTML: function() {
			var item = mfp.items[mfp.index];

			// Detach and perform modifications
			mfp.contentContainer.detach();

			if(mfp.content)
				mfp.content.detach();

			if(!item.parsed) {
				item = mfp.parseEl( mfp.index );
			}

			var type = item.type;

			_mfpTrigger('BeforeChange', [mfp.currItem ? mfp.currItem.type : '', type]);
			// BeforeChange event works like so:
			// _mfpOn('BeforeChange', function(e, prevType, newType) { });

			mfp.currItem = item;

			if(!mfp.currTemplate[type]) {
				var markup = mfp.st[type] ? mfp.st[type].markup : false;

				// allows to modify markup
				_mfpTrigger('FirstMarkupParse', markup);

				if(markup) {
					mfp.currTemplate[type] = $(markup);
				} else {
					// if there is no markup found we just define that template is parsed
					mfp.currTemplate[type] = true;
				}
			}

			if(_prevContentType && _prevContentType !== item.type) {
				mfp.container.removeClass('mfp-'+_prevContentType+'-holder');
			}

			var newContent = mfp['get' + type.charAt(0).toUpperCase() + type.slice(1)](item, mfp.currTemplate[type]);
			mfp.appendContent(newContent, type);

			item.preloaded = true;

			_mfpTrigger(CHANGE_EVENT, item);
			_prevContentType = item.type;

			// Append container back after its content changed
			mfp.container.prepend(mfp.contentContainer);

			_mfpTrigger('AfterChange');
		},


		/**
		 * Set HTML content of popup
		 */
		appendContent: function(newContent, type) {
			mfp.content = newContent;

			if(newContent) {
				if(mfp.st.showCloseBtn && mfp.st.closeBtnInside &&
					mfp.currTemplate[type] === true) {
					// if there is no markup, we just append close button element inside
					if(!mfp.content.find('.mfp-close').length) {
						mfp.content.append(_getCloseBtn());
					}
				} else {
					mfp.content = newContent;
				}
			} else {
				mfp.content = '';
			}

			_mfpTrigger(BEFORE_APPEND_EVENT);
			mfp.container.addClass('mfp-'+type+'-holder');

			mfp.contentContainer.append(mfp.content);
		},


		/**
		 * Creates Magnific Popup data object based on given data
		 * @param  {int} index Index of item to parse
		 */
		parseEl: function(index) {
			var item = mfp.items[index],
				type;

			if(item.tagName) {
				item = { el: $(item) };
			} else {
				type = item.type;
				item = { data: item, src: item.src };
			}

			if(item.el) {
				var types = mfp.types;

				// check for 'mfp-TYPE' class
				for(var i = 0; i < types.length; i++) {
					if( item.el.hasClass('mfp-'+types[i]) ) {
						type = types[i];
						break;
					}
				}

				item.src = item.el.attr('data-mfp-src');
				if(!item.src) {
					item.src = item.el.attr('href');
				}
			}

			item.type = type || mfp.st.type || 'inline';
			item.index = index;
			item.parsed = true;
			mfp.items[index] = item;
			_mfpTrigger('ElementParse', item);

			return mfp.items[index];
		},


		/**
		 * Initializes single popup or a group of popups
		 */
		addGroup: function(el, options) {
			var eHandler = function(e) {
				e.mfpEl = this;
				mfp._openClick(e, el, options);
			};

			if(!options) {
				options = {};
			}

			var eName = 'click.magnificPopup';
			options.mainEl = el;

			if(options.items) {
				options.isObj = true;
				el.off(eName).on(eName, eHandler);
			} else {
				options.isObj = false;
				if(options.delegate) {
					el.off(eName).on(eName, options.delegate , eHandler);
				} else {
					options.items = el;
					el.off(eName).on(eName, eHandler);
				}
			}
		},
		_openClick: function(e, el, options) {
			var midClick = options.midClick !== undefined ? options.midClick : $.magnificPopup.defaults.midClick;


			if(!midClick && ( e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey ) ) {
				return;
			}

			var disableOn = options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn;

			if(disableOn) {
				if($.isFunction(disableOn)) {
					if( !disableOn.call(mfp) ) {
						return true;
					}
				} else { // else it's number
					if( _window.width() < disableOn ) {
						return true;
					}
				}
			}

			if(e.type) {
				e.preventDefault();

				// This will prevent popup from closing if element is inside and popup is already opened
				if(mfp.isOpen) {
					e.stopPropagation();
				}
			}

			options.el = $(e.mfpEl);
			if(options.delegate) {
				options.items = el.find(options.delegate);
			}
			mfp.open(options);
		},


		/**
		 * Updates text on preloader
		 */
		updateStatus: function(status, text) {

			if(mfp.preloader) {
				if(_prevStatus !== status) {
					mfp.container.removeClass('mfp-s-'+_prevStatus);
				}

				if(!text && status === 'loading') {
					text = mfp.st.tLoading;
				}

				var data = {
					status: status,
					text: text
				};
				// allows to modify status
				_mfpTrigger('UpdateStatus', data);

				status = data.status;
				text = data.text;

				mfp.preloader.html(text);

				mfp.preloader.find('a').on('click', function(e) {
					e.stopImmediatePropagation();
				});

				mfp.container.addClass('mfp-s-'+status);
				_prevStatus = status;
			}
		},


		/*
            "Private" helpers that aren't private at all
         */
		// Check to close popup or not
		// "target" is an element that was clicked
		_checkIfClose: function(target) {

			if($(target).hasClass(PREVENT_CLOSE_CLASS)) {
				return;
			}

			var closeOnContent = mfp.st.closeOnContentClick;
			var closeOnBg = mfp.st.closeOnBgClick;

			if(closeOnContent && closeOnBg) {
				return true;
			} else {

				// We close the popup if click is on close button or on preloader. Or if there is no content.
				if(!mfp.content || $(target).hasClass('mfp-close') || (mfp.preloader && target === mfp.preloader[0]) ) {
					return true;
				}

				// if click is outside the content
				if(  (target !== mfp.content[0] && !$.contains(mfp.content[0], target))  ) {
					if(closeOnBg) {
						// last check, if the clicked element is in DOM, (in case it's removed onclick)
						if( $.contains(document, target) ) {
							return true;
						}
					}
				} else if(closeOnContent) {
					return true;
				}

			}
			return false;
		},
		_addClassToMFP: function(cName) {
			mfp.bgOverlay.addClass(cName);
			mfp.wrap.addClass(cName);
		},
		_removeClassFromMFP: function(cName) {
			this.bgOverlay.removeClass(cName);
			mfp.wrap.removeClass(cName);
		},
		_hasScrollBar: function(winHeight) {
			return (  (mfp.isIE7 ? _document.height() : document.body.scrollHeight) > (winHeight || _window.height()) );
		},
		_setFocus: function() {
			(mfp.st.focus ? mfp.content.find(mfp.st.focus).eq(0) : mfp.wrap).focus();
		},
		_onFocusIn: function(e) {
			if( e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target) ) {
				mfp._setFocus();
				return false;
			}
		},
		_parseMarkup: function(template, values, item) {
			var arr;
			if(item.data) {
				values = $.extend(item.data, values);
			}
			_mfpTrigger(MARKUP_PARSE_EVENT, [template, values, item] );

			$.each(values, function(key, value) {
				if(value === undefined || value === false) {
					return true;
				}
				arr = key.split('_');
				if(arr.length > 1) {
					var el = template.find(EVENT_NS + '-'+arr[0]);

					if(el.length > 0) {
						var attr = arr[1];
						if(attr === 'replaceWith') {
							if(el[0] !== value[0]) {
								el.replaceWith(value);
							}
						} else if(attr === 'img') {
							if(el.is('img')) {
								el.attr('src', value);
							} else {
								el.replaceWith( $('<img>').attr('src', value).attr('class', el.attr('class')) );
							}
						} else {
							el.attr(arr[1], value);
						}
					}

				} else {
					template.find(EVENT_NS + '-'+key).html(value);
				}
			});
		},

		_getScrollbarSize: function() {
			// thx David
			if(mfp.scrollbarSize === undefined) {
				var scrollDiv = document.createElement("div");
				scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
				document.body.appendChild(scrollDiv);
				mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
				document.body.removeChild(scrollDiv);
			}
			return mfp.scrollbarSize;
		}

	}; /* MagnificPopup core prototype end */




	/**
	 * Public static functions
	 */
	$.magnificPopup = {
		instance: null,
		proto: MagnificPopup.prototype,
		modules: [],

		open: function(options, index) {
			_checkInstance();

			if(!options) {
				options = {};
			} else {
				options = $.extend(true, {}, options);
			}

			options.isObj = true;
			options.index = index || 0;
			return this.instance.open(options);
		},

		close: function() {
			return $.magnificPopup.instance && $.magnificPopup.instance.close();
		},

		registerModule: function(name, module) {
			if(module.options) {
				$.magnificPopup.defaults[name] = module.options;
			}
			$.extend(this.proto, module.proto);
			this.modules.push(name);
		},

		defaults: {

			// Info about options is in docs:
			// http://dimsemenov.com/plugins/magnific-popup/documentation.html#options

			disableOn: 0,

			key: null,

			midClick: false,

			mainClass: '',

			preloader: true,

			focus: '', // CSS selector of input to focus after popup is opened

			closeOnContentClick: false,

			closeOnBgClick: true,

			closeBtnInside: true,

			showCloseBtn: true,

			enableEscapeKey: true,

			modal: false,

			alignTop: false,

			removalDelay: 0,

			prependTo: null,

			fixedContentPos: 'auto',

			fixedBgPos: 'auto',

			overflowY: 'auto',

			closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',

			tClose: 'Close (Esc)',

			tLoading: 'Loading...',

			autoFocusLast: true

		}
	};



	$.fn.magnificPopup = function(options) {
		_checkInstance();

		var jqEl = $(this);

		// We call some API method of first param is a string
		if (typeof options === "string" ) {

			if(options === 'open') {
				var items,
					itemOpts = _isJQ ? jqEl.data('magnificPopup') : jqEl[0].magnificPopup,
					index = parseInt(arguments[1], 10) || 0;

				if(itemOpts.items) {
					items = itemOpts.items[index];
				} else {
					items = jqEl;
					if(itemOpts.delegate) {
						items = items.find(itemOpts.delegate);
					}
					items = items.eq( index );
				}
				mfp._openClick({mfpEl:items}, jqEl, itemOpts);
			} else {
				if(mfp.isOpen)
					mfp[options].apply(mfp, Array.prototype.slice.call(arguments, 1));
			}

		} else {
			// clone options obj
			options = $.extend(true, {}, options);

			/*
             * As Zepto doesn't support .data() method for objects
             * and it works only in normal browsers
             * we assign "options" object directly to the DOM element. FTW!
             */
			if(_isJQ) {
				jqEl.data('magnificPopup', options);
			} else {
				jqEl[0].magnificPopup = options;
			}

			mfp.addGroup(jqEl, options);

		}
		return jqEl;
	};

	/*>>core*/

	/*>>inline*/

	var INLINE_NS = 'inline',
		_hiddenClass,
		_inlinePlaceholder,
		_lastInlineElement,
		_putInlineElementsBack = function() {
			if(_lastInlineElement) {
				_inlinePlaceholder.after( _lastInlineElement.addClass(_hiddenClass) ).detach();
				_lastInlineElement = null;
			}
		};

	$.magnificPopup.registerModule(INLINE_NS, {
		options: {
			hiddenClass: 'hide', // will be appended with `mfp-` prefix
			markup: '',
			tNotFound: 'Content not found'
		},
		proto: {

			initInline: function() {
				mfp.types.push(INLINE_NS);

				_mfpOn(CLOSE_EVENT+'.'+INLINE_NS, function() {
					_putInlineElementsBack();
				});
			},

			getInline: function(item, template) {

				_putInlineElementsBack();

				if(item.src) {
					var inlineSt = mfp.st.inline,
						el = $(item.src);

					if(el.length) {

						// If target element has parent - we replace it with placeholder and put it back after popup is closed
						var parent = el[0].parentNode;
						if(parent && parent.tagName) {
							if(!_inlinePlaceholder) {
								_hiddenClass = inlineSt.hiddenClass;
								_inlinePlaceholder = _getEl(_hiddenClass);
								_hiddenClass = 'mfp-'+_hiddenClass;
							}
							// replace target inline element with placeholder
							_lastInlineElement = el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass);
						}

						mfp.updateStatus('ready');
					} else {
						mfp.updateStatus('error', inlineSt.tNotFound);
						el = $('<div>');
					}

					item.inlineElement = el;
					return el;
				}

				mfp.updateStatus('ready');
				mfp._parseMarkup(template, {}, item);
				return template;
			}
		}
	});

	/*>>inline*/

	/*>>ajax*/
	var AJAX_NS = 'ajax',
		_ajaxCur,
		_removeAjaxCursor = function() {
			if(_ajaxCur) {
				$(document.body).removeClass(_ajaxCur);
			}
		},
		_destroyAjaxRequest = function() {
			_removeAjaxCursor();
			if(mfp.req) {
				mfp.req.abort();
			}
		};

	$.magnificPopup.registerModule(AJAX_NS, {

		options: {
			settings: null,
			cursor: 'mfp-ajax-cur',
			tError: '<a href="%url%">The content</a> could not be loaded.'
		},

		proto: {
			initAjax: function() {
				mfp.types.push(AJAX_NS);
				_ajaxCur = mfp.st.ajax.cursor;

				_mfpOn(CLOSE_EVENT+'.'+AJAX_NS, _destroyAjaxRequest);
				_mfpOn('BeforeChange.' + AJAX_NS, _destroyAjaxRequest);
			},
			getAjax: function(item) {

				if(_ajaxCur) {
					$(document.body).addClass(_ajaxCur);
				}

				mfp.updateStatus('loading');

				var opts = $.extend({
					url: item.src,
					success: function(data, textStatus, jqXHR) {
						var temp = {
							data:data,
							xhr:jqXHR
						};

						_mfpTrigger('ParseAjax', temp);

						mfp.appendContent( $(temp.data), AJAX_NS );

						item.finished = true;

						_removeAjaxCursor();

						mfp._setFocus();

						setTimeout(function() {
							mfp.wrap.addClass(READY_CLASS);
						}, 16);

						mfp.updateStatus('ready');

						_mfpTrigger('AjaxContentAdded');
					},
					error: function() {
						_removeAjaxCursor();
						item.finished = item.loadError = true;
						mfp.updateStatus('error', mfp.st.ajax.tError.replace('%url%', item.src));
					}
				}, mfp.st.ajax.settings);

				mfp.req = $.ajax(opts);

				return '';
			}
		}
	});

	/*>>ajax*/

	/*>>image*/
	var _imgInterval,
		_getTitle = function(item) {
			if(item.data && item.data.title !== undefined)
				return item.data.title;

			var src = mfp.st.image.titleSrc;

			if(src) {
				if($.isFunction(src)) {
					return src.call(mfp, item);
				} else if(item.el) {
					return item.el.attr(src) || '';
				}
			}
			return '';
		};

	$.magnificPopup.registerModule('image', {

		options: {
			markup: '<div class="mfp-figure">'+
				'<div class="mfp-close"></div>'+
				'<figure>'+
				'<div class="mfp-img"></div>'+
				'<figcaption>'+
				'<div class="mfp-bottom-bar">'+
				'<div class="mfp-title"></div>'+
				'<div class="mfp-counter"></div>'+
				'</div>'+
				'</figcaption>'+
				'</figure>'+
				'</div>',
			cursor: 'mfp-zoom-out-cur',
			titleSrc: 'title',
			verticalFit: true,
			tError: '<a href="%url%">The image</a> could not be loaded.'
		},

		proto: {
			initImage: function() {
				var imgSt = mfp.st.image,
					ns = '.image';

				mfp.types.push('image');

				_mfpOn(OPEN_EVENT+ns, function() {
					if(mfp.currItem.type === 'image' && imgSt.cursor) {
						$(document.body).addClass(imgSt.cursor);
					}
				});

				_mfpOn(CLOSE_EVENT+ns, function() {
					if(imgSt.cursor) {
						$(document.body).removeClass(imgSt.cursor);
					}
					_window.off('resize' + EVENT_NS);
				});

				_mfpOn('Resize'+ns, mfp.resizeImage);
				if(mfp.isLowIE) {
					_mfpOn('AfterChange', mfp.resizeImage);
				}
			},
			resizeImage: function() {
				var item = mfp.currItem;
				if(!item || !item.img) return;

				if(mfp.st.image.verticalFit) {
					var decr = 0;
					// fix box-sizing in ie7/8
					if(mfp.isLowIE) {
						decr = parseInt(item.img.css('padding-top'), 10) + parseInt(item.img.css('padding-bottom'),10);
					}
					item.img.css('max-height', mfp.wH-decr);
				}
			},
			_onImageHasSize: function(item) {
				if(item.img) {

					item.hasSize = true;

					if(_imgInterval) {
						clearInterval(_imgInterval);
					}

					item.isCheckingImgSize = false;

					_mfpTrigger('ImageHasSize', item);

					if(item.imgHidden) {
						if(mfp.content)
							mfp.content.removeClass('mfp-loading');

						item.imgHidden = false;
					}

				}
			},

			/**
			 * Function that loops until the image has size to display elements that rely on it asap
			 */
			findImageSize: function(item) {

				var counter = 0,
					img = item.img[0],
					mfpSetInterval = function(delay) {

						if(_imgInterval) {
							clearInterval(_imgInterval);
						}
						// decelerating interval that checks for size of an image
						_imgInterval = setInterval(function() {
							if(img.naturalWidth > 0) {
								mfp._onImageHasSize(item);
								return;
							}

							if(counter > 200) {
								clearInterval(_imgInterval);
							}

							counter++;
							if(counter === 3) {
								mfpSetInterval(10);
							} else if(counter === 40) {
								mfpSetInterval(50);
							} else if(counter === 100) {
								mfpSetInterval(500);
							}
						}, delay);
					};

				mfpSetInterval(1);
			},

			getImage: function(item, template) {

				var guard = 0,

					// image load complete handler
					onLoadComplete = function() {
						if(item) {
							if (item.img[0].complete) {
								item.img.off('.mfploader');

								if(item === mfp.currItem){
									mfp._onImageHasSize(item);

									mfp.updateStatus('ready');
								}

								item.hasSize = true;
								item.loaded = true;

								_mfpTrigger('ImageLoadComplete');

							}
							else {
								// if image complete check fails 200 times (20 sec), we assume that there was an error.
								guard++;
								if(guard < 200) {
									setTimeout(onLoadComplete,100);
								} else {
									onLoadError();
								}
							}
						}
					},

					// image error handler
					onLoadError = function() {
						if(item) {
							item.img.off('.mfploader');
							if(item === mfp.currItem){
								mfp._onImageHasSize(item);
								mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
							}

							item.hasSize = true;
							item.loaded = true;
							item.loadError = true;
						}
					},
					imgSt = mfp.st.image;


				var el = template.find('.mfp-img');
				if(el.length) {
					var img = document.createElement('img');
					img.className = 'mfp-img';
					if(item.el && item.el.find('img').length) {
						img.alt = item.el.find('img').attr('alt');
					}
					item.img = $(img).on('load.mfploader', onLoadComplete).on('error.mfploader', onLoadError);
					img.src = item.src;

					// without clone() "error" event is not firing when IMG is replaced by new IMG
					// TODO: find a way to avoid such cloning
					if(el.is('img')) {
						item.img = item.img.clone();
					}

					img = item.img[0];
					if(img.naturalWidth > 0) {
						item.hasSize = true;
					} else if(!img.width) {
						item.hasSize = false;
					}
				}

				mfp._parseMarkup(template, {
					title: _getTitle(item),
					img_replaceWith: item.img
				}, item);

				mfp.resizeImage();

				if(item.hasSize) {
					if(_imgInterval) clearInterval(_imgInterval);

					if(item.loadError) {
						template.addClass('mfp-loading');
						mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
					} else {
						template.removeClass('mfp-loading');
						mfp.updateStatus('ready');
					}
					return template;
				}

				mfp.updateStatus('loading');
				item.loading = true;

				if(!item.hasSize) {
					item.imgHidden = true;
					template.addClass('mfp-loading');
					mfp.findImageSize(item);
				}

				return template;
			}
		}
	});

	/*>>image*/

	/*>>zoom*/
	var hasMozTransform,
		getHasMozTransform = function() {
			if(hasMozTransform === undefined) {
				hasMozTransform = document.createElement('p').style.MozTransform !== undefined;
			}
			return hasMozTransform;
		};

	$.magnificPopup.registerModule('zoom', {

		options: {
			enabled: false,
			easing: 'ease-in-out',
			duration: 300,
			opener: function(element) {
				return element.is('img') ? element : element.find('img');
			}
		},

		proto: {

			initZoom: function() {
				var zoomSt = mfp.st.zoom,
					ns = '.zoom',
					image;

				if(!zoomSt.enabled || !mfp.supportsTransition) {
					return;
				}

				var duration = zoomSt.duration,
					getElToAnimate = function(image) {
						var newImg = image.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'),
							transition = 'all '+(zoomSt.duration/1000)+'s ' + zoomSt.easing,
							cssObj = {
								position: 'fixed',
								zIndex: 9999,
								left: 0,
								top: 0,
								'-webkit-backface-visibility': 'hidden'
							},
							t = 'transition';

						cssObj['-webkit-'+t] = cssObj['-moz-'+t] = cssObj['-o-'+t] = cssObj[t] = transition;

						newImg.css(cssObj);
						return newImg;
					},
					showMainContent = function() {
						mfp.content.css('visibility', 'visible');
					},
					openTimeout,
					animatedImg;

				_mfpOn('BuildControls'+ns, function() {
					if(mfp._allowZoom()) {

						clearTimeout(openTimeout);
						mfp.content.css('visibility', 'hidden');

						// Basically, all code below does is clones existing image, puts in on top of the current one and animated it

						image = mfp._getItemToZoom();

						if(!image) {
							showMainContent();
							return;
						}

						animatedImg = getElToAnimate(image);

						animatedImg.css( mfp._getOffset() );

						mfp.wrap.append(animatedImg);

						openTimeout = setTimeout(function() {
							animatedImg.css( mfp._getOffset( true ) );
							openTimeout = setTimeout(function() {

								showMainContent();

								setTimeout(function() {
									animatedImg.remove();
									image = animatedImg = null;
									_mfpTrigger('ZoomAnimationEnded');
								}, 16); // avoid blink when switching images

							}, duration); // this timeout equals animation duration

						}, 16); // by adding this timeout we avoid short glitch at the beginning of animation


						// Lots of timeouts...
					}
				});
				_mfpOn(BEFORE_CLOSE_EVENT+ns, function() {
					if(mfp._allowZoom()) {

						clearTimeout(openTimeout);

						mfp.st.removalDelay = duration;

						if(!image) {
							image = mfp._getItemToZoom();
							if(!image) {
								return;
							}
							animatedImg = getElToAnimate(image);
						}

						animatedImg.css( mfp._getOffset(true) );
						mfp.wrap.append(animatedImg);
						mfp.content.css('visibility', 'hidden');

						setTimeout(function() {
							animatedImg.css( mfp._getOffset() );
						}, 16);
					}

				});

				_mfpOn(CLOSE_EVENT+ns, function() {
					if(mfp._allowZoom()) {
						showMainContent();
						if(animatedImg) {
							animatedImg.remove();
						}
						image = null;
					}
				});
			},

			_allowZoom: function() {
				return mfp.currItem.type === 'image';
			},

			_getItemToZoom: function() {
				if(mfp.currItem.hasSize) {
					return mfp.currItem.img;
				} else {
					return false;
				}
			},

			// Get element postion relative to viewport
			_getOffset: function(isLarge) {
				var el;
				if(isLarge) {
					el = mfp.currItem.img;
				} else {
					el = mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem);
				}

				var offset = el.offset();
				var paddingTop = parseInt(el.css('padding-top'),10);
				var paddingBottom = parseInt(el.css('padding-bottom'),10);
				offset.top -= ( $(window).scrollTop() - paddingTop );


				/*

                Animating left + top + width/height looks glitchy in Firefox, but perfect in Chrome. And vice-versa.

                 */
				var obj = {
					width: el.width(),
					// fix Zepto height+padding issue
					height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop
				};

				// I hate to do this, but there is no another option
				if( getHasMozTransform() ) {
					obj['-moz-transform'] = obj['transform'] = 'translate(' + offset.left + 'px,' + offset.top + 'px)';
				} else {
					obj.left = offset.left;
					obj.top = offset.top;
				}
				return obj;
			}

		}
	});



	/*>>zoom*/

	/*>>iframe*/

	var IFRAME_NS = 'iframe',
		_emptyPage = '//about:blank',

		_fixIframeBugs = function(isShowing) {
			if(mfp.currTemplate[IFRAME_NS]) {
				var el = mfp.currTemplate[IFRAME_NS].find('iframe');
				if(el.length) {
					// reset src after the popup is closed to avoid "video keeps playing after popup is closed" bug
					if(!isShowing) {
						el[0].src = _emptyPage;
					}

					// IE8 black screen bug fix
					if(mfp.isIE8) {
						el.css('display', isShowing ? 'block' : 'none');
					}
				}
			}
		};

	$.magnificPopup.registerModule(IFRAME_NS, {

		options: {
			markup: '<div class="mfp-iframe-scaler">'+
				'<div class="mfp-close"></div>'+
				'<iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>'+
				'</div>',

			srcAction: 'iframe_src',

			// we don't care and support only one default type of URL by default
			patterns: {
				youtube: {
					index: 'youtube.com',
					id: 'v=',
					src: '//www.youtube.com/embed/%id%?autoplay=1'
				},
				vimeo: {
					index: 'vimeo.com/',
					id: '/',
					src: '//player.vimeo.com/video/%id%?autoplay=1'
				},
				gmaps: {
					index: '//maps.google.',
					src: '%id%&output=embed'
				}
			}
		},

		proto: {
			initIframe: function() {
				mfp.types.push(IFRAME_NS);

				_mfpOn('BeforeChange', function(e, prevType, newType) {
					if(prevType !== newType) {
						if(prevType === IFRAME_NS) {
							_fixIframeBugs(); // iframe if removed
						} else if(newType === IFRAME_NS) {
							_fixIframeBugs(true); // iframe is showing
						}
					}// else {
					// iframe source is switched, don't do anything
					//}
				});

				_mfpOn(CLOSE_EVENT + '.' + IFRAME_NS, function() {
					_fixIframeBugs();
				});
			},

			getIframe: function(item, template) {
				var embedSrc = item.src;
				var iframeSt = mfp.st.iframe;

				$.each(iframeSt.patterns, function() {
					if(embedSrc.indexOf( this.index ) > -1) {
						if(this.id) {
							if(typeof this.id === 'string') {
								embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id)+this.id.length, embedSrc.length);
							} else {
								embedSrc = this.id.call( this, embedSrc );
							}
						}
						embedSrc = this.src.replace('%id%', embedSrc );
						return false; // break;
					}
				});

				var dataObj = {};
				if(iframeSt.srcAction) {
					dataObj[iframeSt.srcAction] = embedSrc;
				}
				mfp._parseMarkup(template, dataObj, item);

				mfp.updateStatus('ready');

				return template;
			}
		}
	});



	/*>>iframe*/

	/*>>gallery*/
	/**
	 * Get looped index depending on number of slides
	 */
	var _getLoopedId = function(index) {
			var numSlides = mfp.items.length;
			if(index > numSlides - 1) {
				return index - numSlides;
			} else  if(index < 0) {
				return numSlides + index;
			}
			return index;
		},
		_replaceCurrTotal = function(text, curr, total) {
			return text.replace(/%curr%/gi, curr + 1).replace(/%total%/gi, total);
		};

	$.magnificPopup.registerModule('gallery', {

		options: {
			enabled: false,
			arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
			preload: [0,2],
			navigateByImgClick: true,
			arrows: true,

			tPrev: 'Previous (Left arrow key)',
			tNext: 'Next (Right arrow key)',
			tCounter: '%curr% of %total%'
		},

		proto: {
			initGallery: function() {

				var gSt = mfp.st.gallery,
					ns = '.mfp-gallery';

				mfp.direction = true; // true - next, false - prev

				if(!gSt || !gSt.enabled ) return false;

				_wrapClasses += ' mfp-gallery';

				_mfpOn(OPEN_EVENT+ns, function() {

					if(gSt.navigateByImgClick) {
						mfp.wrap.on('click'+ns, '.mfp-img', function() {
							if(mfp.items.length > 1) {
								mfp.next();
								return false;
							}
						});
					}

					_document.on('keydown'+ns, function(e) {
						if (e.keyCode === 37) {
							mfp.prev();
						} else if (e.keyCode === 39) {
							mfp.next();
						}
					});
				});

				_mfpOn('UpdateStatus'+ns, function(e, data) {
					if(data.text) {
						data.text = _replaceCurrTotal(data.text, mfp.currItem.index, mfp.items.length);
					}
				});

				_mfpOn(MARKUP_PARSE_EVENT+ns, function(e, element, values, item) {
					var l = mfp.items.length;
					values.counter = l > 1 ? _replaceCurrTotal(gSt.tCounter, item.index, l) : '';
				});

				_mfpOn('BuildControls' + ns, function() {
					if(mfp.items.length > 1 && gSt.arrows && !mfp.arrowLeft) {
						var markup = gSt.arrowMarkup,
							arrowLeft = mfp.arrowLeft = $( markup.replace(/%title%/gi, gSt.tPrev).replace(/%dir%/gi, 'left') ).addClass(PREVENT_CLOSE_CLASS),
							arrowRight = mfp.arrowRight = $( markup.replace(/%title%/gi, gSt.tNext).replace(/%dir%/gi, 'right') ).addClass(PREVENT_CLOSE_CLASS);

						arrowLeft.click(function() {
							mfp.prev();
						});
						arrowRight.click(function() {
							mfp.next();
						});

						mfp.container.append(arrowLeft.add(arrowRight));
					}
				});

				_mfpOn(CHANGE_EVENT+ns, function() {
					if(mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout);

					mfp._preloadTimeout = setTimeout(function() {
						mfp.preloadNearbyImages();
						mfp._preloadTimeout = null;
					}, 16);
				});


				_mfpOn(CLOSE_EVENT+ns, function() {
					_document.off(ns);
					mfp.wrap.off('click'+ns);
					mfp.arrowRight = mfp.arrowLeft = null;
				});

			},
			next: function() {
				mfp.direction = true;
				mfp.index = _getLoopedId(mfp.index + 1);
				mfp.updateItemHTML();
			},
			prev: function() {
				mfp.direction = false;
				mfp.index = _getLoopedId(mfp.index - 1);
				mfp.updateItemHTML();
			},
			goTo: function(newIndex) {
				mfp.direction = (newIndex >= mfp.index);
				mfp.index = newIndex;
				mfp.updateItemHTML();
			},
			preloadNearbyImages: function() {
				var p = mfp.st.gallery.preload,
					preloadBefore = Math.min(p[0], mfp.items.length),
					preloadAfter = Math.min(p[1], mfp.items.length),
					i;

				for(i = 1; i <= (mfp.direction ? preloadAfter : preloadBefore); i++) {
					mfp._preloadItem(mfp.index+i);
				}
				for(i = 1; i <= (mfp.direction ? preloadBefore : preloadAfter); i++) {
					mfp._preloadItem(mfp.index-i);
				}
			},
			_preloadItem: function(index) {
				index = _getLoopedId(index);

				if(mfp.items[index].preloaded) {
					return;
				}

				var item = mfp.items[index];
				if(!item.parsed) {
					item = mfp.parseEl( index );
				}

				_mfpTrigger('LazyLoad', item);

				if(item.type === 'image') {
					item.img = $('<img class="mfp-img" />').on('load.mfploader', function() {
						item.hasSize = true;
					}).on('error.mfploader', function() {
						item.hasSize = true;
						item.loadError = true;
						_mfpTrigger('LazyLoadError', item);
					}).attr('src', item.src);
				}


				item.preloaded = true;
			}
		}
	});

	/*>>gallery*/

	/*>>retina*/

	var RETINA_NS = 'retina';

	$.magnificPopup.registerModule(RETINA_NS, {
		options: {
			replaceSrc: function(item) {
				return item.src.replace(/\.\w+$/, function(m) { return '@2x' + m; });
			},
			ratio: 1 // Function or number.  Set to 1 to disable.
		},
		proto: {
			initRetina: function() {
				if(window.devicePixelRatio > 1) {

					var st = mfp.st.retina,
						ratio = st.ratio;

					ratio = !isNaN(ratio) ? ratio : ratio();

					if(ratio > 1) {
						_mfpOn('ImageHasSize' + '.' + RETINA_NS, function(e, item) {
							item.img.css({
								'max-width': item.img[0].naturalWidth / ratio,
								'width': '100%'
							});
						});
						_mfpOn('ElementParse' + '.' + RETINA_NS, function(e, item) {
							item.src = st.replaceSrc(item, ratio);
						});
					}
				}

			}
		}
	});

	/*>>retina*/
	_checkInstance();
}(jQuery));



/*
 * jQuery mmenu v6.1.0
 * @requires jQuery 1.7.0 or later
 *
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 * www.frebsite.nl
 *
 * License: CC-BY-NC-4.0
 * http://creativecommons.org/licenses/by-nc/4.0/
 */
(function($) {

	!function(e){function t(){e[n].glbl||(r={$wndw:e(window),$docu:e(document),$html:e("html"),$body:e("body")},s={},a={},o={},e.each([s,a,o],function(e,t){t.add=function(e){e=e.split(" ");for(var n=0,i=e.length;n<i;n++)t[e[n]]=t.mm(e[n])}}),s.mm=function(e){return"mm-"+e},s.add("wrapper menu panels panel nopanel highest opened subopened navbar hasnavbar title btn prev next listview nolistview inset vertical selected divider spacer hidden fullsubopen noanimation"),s.umm=function(e){return"mm-"==e.slice(0,3)&&(e=e.slice(3)),e},a.mm=function(e){return"mm-"+e},a.add("parent child"),o.mm=function(e){return e+".mm"},o.add("transitionend webkitTransitionEnd click scroll resize keydown mousedown mouseup touchstart touchmove touchend orientationchange"),e[n]._c=s,e[n]._d=a,e[n]._e=o,e[n].glbl=r)}var n="mmenu",i="6.1.0";if(!(e[n]&&e[n].version>i)){e[n]=function(e,t,n){return this.$menu=e,this._api=["bind","getInstance","initPanels","openPanel","closePanel","closeAllPanels","setSelected"],this.opts=t,this.conf=n,this.vars={},this.cbck={},this.mtch={},"function"==typeof this.___deprecated&&this.___deprecated(),this._initAddons(),this._initExtensions(),this._initMenu(),this._initPanels(),this._initOpened(),this._initAnchors(),this._initMatchMedia(),"function"==typeof this.___debug&&this.___debug(),this},e[n].version=i,e[n].addons={},e[n].uniqueId=0,e[n].defaults={extensions:[],initMenu:function(){},initPanels:function(){},navbar:{add:!0,title:"Menu",titleLink:"parent"},onClick:{setSelected:!0},slidingSubmenus:!0},e[n].configuration={classNames:{divider:"Divider",inset:"Inset",nolistview:"NoListview",nopanel:"NoPanel",panel:"Panel",selected:"Selected",spacer:"Spacer",vertical:"Vertical"},clone:!1,openingInterval:25,panelNodetype:"ul, ol, div",transitionDuration:400},e[n].prototype={getInstance:function(){return this},initPanels:function(e){this._initPanels(e)},openPanel:function(t,i){if(this.trigger("openPanel:before",t),t&&t.length&&(t.is("."+s.panel)||(t=t.closest("."+s.panel)),t.is("."+s.panel))){var o=this;if("boolean"!=typeof i&&(i=!0),t.hasClass(s.vertical))t.add(t.parents("."+s.vertical)).removeClass(s.hidden).parent("li").addClass(s.opened),this.openPanel(t.parents("."+s.panel).not("."+s.vertical).first()),this.trigger("openPanel:start",t),this.trigger("openPanel:finish",t);else{if(t.hasClass(s.opened))return;var r=this.$pnls.children("."+s.panel),l=r.filter("."+s.opened);if(!e[n].support.csstransitions)return l.addClass(s.hidden).removeClass(s.opened),t.removeClass(s.hidden).addClass(s.opened),this.trigger("openPanel:start",t),void this.trigger("openPanel:finish",t);r.not(t).removeClass(s.subopened);for(var d=t.data(a.parent);d;)d=d.closest("."+s.panel),d.is("."+s.vertical)||d.addClass(s.subopened),d=d.data(a.parent);r.removeClass(s.highest).not(l).not(t).addClass(s.hidden),t.removeClass(s.hidden);var c=function(){l.removeClass(s.opened),t.addClass(s.opened),t.hasClass(s.subopened)?(l.addClass(s.highest),t.removeClass(s.subopened)):(l.addClass(s.subopened),t.addClass(s.highest)),this.trigger("openPanel:start",t)},h=function(){l.removeClass(s.highest).addClass(s.hidden),t.removeClass(s.highest),this.trigger("openPanel:finish",t)};i&&!t.hasClass(s.noanimation)?setTimeout(function(){o.__transitionend(t,function(){h.call(o)},o.conf.transitionDuration),c.call(o)},this.conf.openingInterval):(c.call(this),h.call(this))}this.trigger("openPanel:after",t)}},closePanel:function(e){this.trigger("closePanel:before",e);var t=e.parent();t.hasClass(s.vertical)&&(t.removeClass(s.opened),this.trigger("closePanel",e)),this.trigger("closePanel:after",e)},closeAllPanels:function(){this.trigger("closeAllPanels:before"),this.$pnls.find("."+s.listview).children().removeClass(s.selected).filter("."+s.vertical).removeClass(s.opened);var e=this.$pnls.children("."+s.panel),t=e.first();this.$pnls.children("."+s.panel).not(t).removeClass(s.subopened).removeClass(s.opened).removeClass(s.highest).addClass(s.hidden),this.openPanel(t),this.trigger("closeAllPanels:after")},togglePanel:function(e){var t=e.parent();t.hasClass(s.vertical)&&this[t.hasClass(s.opened)?"closePanel":"openPanel"](e)},setSelected:function(e){this.trigger("setSelected:before",e),this.$menu.find("."+s.listview).children("."+s.selected).removeClass(s.selected),e.addClass(s.selected),this.trigger("setSelected:after",e)},bind:function(e,t){this.cbck[e]=this.cbck[e]||[],this.cbck[e].push(t)},trigger:function(){var e=this,t=Array.prototype.slice.call(arguments),n=t.shift();if(this.cbck[n])for(var i=0,s=this.cbck[n].length;i<s;i++)this.cbck[n][i].apply(e,t)},matchMedia:function(e,t,n){var i={yes:t,no:n};this.mtch[e]=this.mtch[e]||[],this.mtch[e].push(i)},_initAddons:function(){this.trigger("initAddons:before");var t;for(t in e[n].addons)e[n].addons[t].add.call(this),e[n].addons[t].add=function(){};for(t in e[n].addons)e[n].addons[t].setup.call(this);this.trigger("initAddons:after")},_initExtensions:function(){this.trigger("initExtensions:before");var e=this;this.opts.extensions.constructor===Array&&(this.opts.extensions={all:this.opts.extensions});for(var t in this.opts.extensions)this.opts.extensions[t]=this.opts.extensions[t].length?"mm-"+this.opts.extensions[t].join(" mm-"):"",this.opts.extensions[t]&&!function(t){e.matchMedia(t,function(){this.$menu.addClass(this.opts.extensions[t])},function(){this.$menu.removeClass(this.opts.extensions[t])})}(t);this.trigger("initExtensions:after")},_initMenu:function(){this.trigger("initMenu:before");this.conf.clone&&(this.$orig=this.$menu,this.$menu=this.$orig.clone(),this.$menu.add(this.$menu.find("[id]")).filter("[id]").each(function(){e(this).attr("id",s.mm(e(this).attr("id")))})),this.opts.initMenu.call(this,this.$menu,this.$orig),this.$menu.attr("id",this.$menu.attr("id")||this.__getUniqueId()),this.$pnls=e('<div class="'+s.panels+'" />').append(this.$menu.children(this.conf.panelNodetype)).prependTo(this.$menu);var t=[s.menu];this.opts.slidingSubmenus||t.push(s.vertical),this.$menu.addClass(t.join(" ")).parent().addClass(s.wrapper),this.trigger("initMenu:after")},_initPanels:function(t){this.trigger("initPanels:before",t),t=t||this.$pnls.children(this.conf.panelNodetype);var n=e(),i=this,a=function(t){t.filter(this.conf.panelNodetype).each(function(){var t=i._initPanel(e(this));if(t){i._initNavbar(t),i._initListview(t),n=n.add(t);var o=t.children("."+s.listview).children("li").children(i.conf.panelNodeType).add(t.children("."+i.conf.classNames.panel));o.length&&a.call(i,o)}})};a.call(this,t),this.opts.initPanels.call(this,n),this.trigger("initPanels:after",n)},_initPanel:function(e){this.trigger("initPanel:before",e);if(this.__refactorClass(e,this.conf.classNames.panel,"panel"),this.__refactorClass(e,this.conf.classNames.nopanel,"nopanel"),this.__refactorClass(e,this.conf.classNames.vertical,"vertical"),this.__refactorClass(e,this.conf.classNames.inset,"inset"),e.filter("."+s.inset).addClass(s.nopanel),e.hasClass(s.nopanel))return!1;if(e.hasClass(s.panel))return e;var t=e.hasClass(s.vertical)||!this.opts.slidingSubmenus;e.removeClass(s.vertical);var n=e.attr("id")||this.__getUniqueId();e.removeAttr("id"),e.is("ul, ol")&&(e.wrap("<div />"),e=e.parent()),e.addClass(s.panel+" "+s.hidden).attr("id",n);var i=e.parent("li");return t?e.add(i).addClass(s.vertical):e.appendTo(this.$pnls),i.length&&(i.data(a.child,e),e.data(a.parent,i)),this.trigger("initPanel:after",e),e},_initNavbar:function(t){if(this.trigger("initNavbar:before",t),!t.children("."+s.navbar).length){var i=t.data(a.parent),o=e('<div class="'+s.navbar+'" />'),r=e[n].i18n(this.opts.navbar.title),l="";if(i&&i.length){if(i.hasClass(s.vertical))return;if(i.parent().is("."+s.listview))var d=i.children("a, span").not("."+s.next);else var d=i.closest("."+s.panel).find('a[href="#'+t.attr("id")+'"]');d=d.first(),i=d.closest("."+s.panel);var c=i.attr("id");switch(r=d.text(),this.opts.navbar.titleLink){case"anchor":l=d.attr("href");break;case"parent":l="#"+c}o.append('<a class="'+s.btn+" "+s.prev+'" href="#'+c+'" />')}else if(!this.opts.navbar.title)return;this.opts.navbar.add&&t.addClass(s.hasnavbar),o.append('<a class="'+s.title+'"'+(l.length?' href="'+l+'"':"")+">"+r+"</a>").prependTo(t),this.trigger("initNavbar:after",t)}},_initListview:function(t){this.trigger("initListview:before",t);var n=this.__childAddBack(t,"ul, ol");this.__refactorClass(n,this.conf.classNames.nolistview,"nolistview"),n.filter("."+this.conf.classNames.inset).addClass(s.nolistview);var i=n.not("."+s.nolistview).addClass(s.listview).children();this.__refactorClass(i,this.conf.classNames.selected,"selected"),this.__refactorClass(i,this.conf.classNames.divider,"divider"),this.__refactorClass(i,this.conf.classNames.spacer,"spacer");var o=t.data(a.parent);if(o&&o.parent().is("."+s.listview)&&!o.children("."+s.next).length){var r=o.children("a, span").first(),l=e('<a class="'+s.next+'" href="#'+t.attr("id")+'" />').insertBefore(r);r.is("span")&&l.addClass(s.fullsubopen)}this.trigger("initListview:after",t)},_initOpened:function(){this.trigger("initOpened:before");var e=this.$pnls.find("."+s.listview).children("."+s.selected).removeClass(s.selected).last().addClass(s.selected),t=e.length?e.closest("."+s.panel):this.$pnls.children("."+s.panel).first();this.openPanel(t,!1),this.trigger("initOpened:after")},_initAnchors:function(){var t=this;r.$body.on(o.click+"-oncanvas","a[href]",function(i){var a=e(this),o=!1,r=t.$menu.find(a).length;for(var l in e[n].addons)if(e[n].addons[l].clickAnchor.call(t,a,r)){o=!0;break}var d=a.attr("href");if(!o&&r&&d.length>1&&"#"==d.slice(0,1))try{var c=e(d,t.$menu);c.is("."+s.panel)&&(o=!0,t[a.parent().hasClass(s.vertical)?"togglePanel":"openPanel"](c))}catch(h){}if(o&&i.preventDefault(),!o&&r&&a.is("."+s.listview+" > li > a")&&!a.is('[rel="external"]')&&!a.is('[target="_blank"]')){t.__valueOrFn(t.opts.onClick.setSelected,a)&&t.setSelected(e(i.target).parent());var f=t.__valueOrFn(t.opts.onClick.preventDefault,a,"#"==d.slice(0,1));f&&i.preventDefault(),t.__valueOrFn(t.opts.onClick.close,a,f)&&t.close()}})},_initMatchMedia:function(){var e=this;this._fireMatchMedia(),r.$wndw.on(o.resize,function(t){e._fireMatchMedia()})},_fireMatchMedia:function(){for(var e in this.mtch)for(var t=window.matchMedia&&window.matchMedia(e).matches?"yes":"no",n=0;n<this.mtch[e].length;n++)this.mtch[e][n][t].call(this)},_getOriginalMenuId:function(){var e=this.$menu.attr("id");return this.conf.clone&&e&&e.length&&(e=s.umm(e)),e},__api:function(){var t=this,n={};return e.each(this._api,function(e){var i=this;n[i]=function(){var e=t[i].apply(t,arguments);return"undefined"==typeof e?n:e}}),n},__valueOrFn:function(e,t,n){return"function"==typeof e?e.call(t[0]):"undefined"==typeof e&&"undefined"!=typeof n?n:e},__refactorClass:function(e,t,n){return e.filter("."+t).removeClass(t).addClass(s[n])},__findAddBack:function(e,t){return e.find(t).add(e.filter(t))},__childAddBack:function(e,t){return e.children(t).add(e.filter(t))},__filterListItems:function(e){return e.not("."+s.divider).not("."+s.hidden)},__filterListItemAnchors:function(e){return this.__filterListItems(e).children("a").not("."+s.next)},__transitionend:function(e,t,n){var i=!1,s=function(n){"undefined"!=typeof n&&n.target!=e[0]||(i||(e.unbind(o.transitionend),e.unbind(o.webkitTransitionEnd),t.call(e[0])),i=!0)};e.on(o.transitionend,s),e.on(o.webkitTransitionEnd,s),setTimeout(s,1.1*n)},__getUniqueId:function(){return s.mm(e[n].uniqueId++)}},e.fn[n]=function(i,s){t(),i=e.extend(!0,{},e[n].defaults,i),s=e.extend(!0,{},e[n].configuration,s);var a=e();return this.each(function(){var t=e(this);if(!t.data(n)){var o=new e[n](t,i,s);o.$menu.data(n,o.__api()),a=a.add(o.$menu)}}),a},e[n].i18n=function(){var t={};return function(n){switch(typeof n){case"object":return e.extend(t,n),t;case"string":return t[n]||n;case"undefined":default:return t}}}(),e[n].support={touch:"ontouchstart"in window||navigator.msMaxTouchPoints||!1,csstransitions:function(){return"undefined"==typeof Modernizr||"undefined"==typeof Modernizr.csstransitions||Modernizr.csstransitions}(),csstransforms:function(){return"undefined"==typeof Modernizr||"undefined"==typeof Modernizr.csstransforms||Modernizr.csstransforms}(),csstransforms3d:function(){return"undefined"==typeof Modernizr||"undefined"==typeof Modernizr.csstransforms3d||Modernizr.csstransforms3d}()};var s,a,o,r}}(jQuery),/*
 * jQuery mmenu offCanvas add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="offCanvas";e[t].addons[n]={setup:function(){if(this.opts[n]){var s=this,a=this.opts[n],r=this.conf[n];o=e[t].glbl,this._api=e.merge(this._api,["open","close","setPage"]),"object"!=typeof a&&(a={}),"top"!=a.position&&"bottom"!=a.position||(a.zposition="front"),a=this.opts[n]=e.extend(!0,{},e[t].defaults[n],a),"string"!=typeof r.pageSelector&&(r.pageSelector="> "+r.pageNodetype),o.$allMenus=(o.$allMenus||e()).add(this.$menu),this.vars.opened=!1;var l=[i.offcanvas];"left"!=a.position&&l.push(i.mm(a.position)),"back"!=a.zposition&&l.push(i.mm(a.zposition)),e[t].support.csstransforms||l.push(i["no-csstransforms"]),e[t].support.csstransforms3d||l.push(i["no-csstransforms3d"]),this.bind("initMenu:after",function(){this.setPage(o.$page),this._initBlocker(),this["_initWindow_"+n](),this.$menu.addClass(l.join(" ")).parent("."+i.wrapper).removeClass(i.wrapper),this.$menu[r.menuInsertMethod](r.menuInsertSelector);var e=window.location.hash;if(e){var t=this._getOriginalMenuId();t&&t==e.slice(1)&&this.open()}}),this.bind("initExtensions:after",function(){for(var e=[i.mm("widescreen"),i.mm("iconbar")],t=0;t<e.length;t++)for(var n in this.opts.extensions)if(this.opts.extensions[n].indexOf(e[t])>-1){!function(t,n){s.matchMedia(t,function(){o.$html.addClass(e[n])},function(){o.$html.removeClass(e[n])})}(n,t);break}}),this.bind("open:start:sr-aria",function(){this.__sr_aria(this.$menu,"hidden",!1)}),this.bind("close:finish:sr-aria",function(){this.__sr_aria(this.$menu,"hidden",!0)}),this.bind("initMenu:after:sr-aria",function(){this.__sr_aria(this.$menu,"hidden",!0)})}},add:function(){i=e[t]._c,s=e[t]._d,a=e[t]._e,i.add("offcanvas slideout blocking modal background opening blocker page no-csstransforms3d"),s.add("style")},clickAnchor:function(e,t){var s=this;if(this.opts[n]){var a=this._getOriginalMenuId();if(a&&e.is('[href="#'+a+'"]')){if(t)return!0;var r=e.closest("."+i.menu);if(r.length){var l=r.data("mmenu");if(l&&l.close)return l.close(),s.__transitionend(r,function(){s.open()},s.conf.transitionDuration),!0}return this.open(),!0}if(o.$page)return a=o.$page.first().attr("id"),a&&e.is('[href="#'+a+'"]')?(this.close(),!0):void 0}}},e[t].defaults[n]={position:"left",zposition:"back",blockUI:!0,moveBackground:!0},e[t].configuration[n]={pageNodetype:"div",pageSelector:null,noPageSelector:[],wrapPageIfNeeded:!0,menuInsertMethod:"prependTo",menuInsertSelector:"body"},e[t].prototype.open=function(){if(this.trigger("open:before"),!this.vars.opened){var e=this;this._openSetup(),setTimeout(function(){e._openFinish()},this.conf.openingInterval),this.trigger("open:after")}},e[t].prototype._openSetup=function(){var t=this,r=this.opts[n];this.closeAllOthers(),o.$page.each(function(){e(this).data(s.style,e(this).attr("style")||"")}),o.$wndw.trigger(a.resize+"-"+n,[!0]);var l=[i.opened];r.blockUI&&l.push(i.blocking),"modal"==r.blockUI&&l.push(i.modal),r.moveBackground&&l.push(i.background),"left"!=r.position&&l.push(i.mm(this.opts[n].position)),"back"!=r.zposition&&l.push(i.mm(this.opts[n].zposition)),o.$html.addClass(l.join(" ")),setTimeout(function(){t.vars.opened=!0},this.conf.openingInterval),this.$menu.addClass(i.opened)},e[t].prototype._openFinish=function(){var e=this;this.__transitionend(o.$page.first(),function(){e.trigger("open:finish")},this.conf.transitionDuration),this.trigger("open:start"),o.$html.addClass(i.opening)},e[t].prototype.close=function(){if(this.trigger("close:before"),this.vars.opened){var t=this;this.__transitionend(o.$page.first(),function(){t.$menu.removeClass(i.opened);var a=[i.opened,i.blocking,i.modal,i.background,i.mm(t.opts[n].position),i.mm(t.opts[n].zposition)];o.$html.removeClass(a.join(" ")),o.$page.each(function(){e(this).attr("style",e(this).data(s.style))}),t.vars.opened=!1,t.trigger("close:finish")},this.conf.transitionDuration),this.trigger("close:start"),o.$html.removeClass(i.opening),this.trigger("close:after")}},e[t].prototype.closeAllOthers=function(){o.$allMenus.not(this.$menu).each(function(){var n=e(this).data(t);n&&n.close&&n.close()})},e[t].prototype.setPage=function(t){this.trigger("setPage:before",t);var s=this,a=this.conf[n];t&&t.length||(t=o.$body.find(a.pageSelector),a.noPageSelector.length&&(t=t.not(a.noPageSelector.join(", "))),t.length>1&&a.wrapPageIfNeeded&&(t=t.wrapAll("<"+this.conf[n].pageNodetype+" />").parent())),t.each(function(){e(this).attr("id",e(this).attr("id")||s.__getUniqueId())}),t.addClass(i.page+" "+i.slideout),o.$page=t,this.trigger("setPage:after",t)},e[t].prototype["_initWindow_"+n]=function(){o.$wndw.off(a.keydown+"-"+n).on(a.keydown+"-"+n,function(e){if(o.$html.hasClass(i.opened)&&9==e.keyCode)return e.preventDefault(),!1});var e=0;o.$wndw.off(a.resize+"-"+n).on(a.resize+"-"+n,function(t,n){if(1==o.$page.length&&(n||o.$html.hasClass(i.opened))){var s=o.$wndw.height();(n||s!=e)&&(e=s,o.$page.css("minHeight",s))}})},e[t].prototype._initBlocker=function(){var t=this;this.opts[n].blockUI&&(o.$blck||(o.$blck=e('<div id="'+i.blocker+'" class="'+i.slideout+'" />')),o.$blck.appendTo(o.$body).off(a.touchstart+"-"+n+" "+a.touchmove+"-"+n).on(a.touchstart+"-"+n+" "+a.touchmove+"-"+n,function(e){e.preventDefault(),e.stopPropagation(),o.$blck.trigger(a.mousedown+"-"+n)}).off(a.mousedown+"-"+n).on(a.mousedown+"-"+n,function(e){e.preventDefault(),o.$html.hasClass(i.modal)||(t.closeAllOthers(),t.close())}))};var i,s,a,o}(jQuery),/*
 * jQuery mmenu scrollBugFix add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="scrollBugFix";e[t].addons[n]={setup:function(){var s=this.opts[n];this.conf[n];o=e[t].glbl,e[t].support.touch&&this.opts.offCanvas&&this.opts.offCanvas.blockUI&&("boolean"==typeof s&&(s={fix:s}),"object"!=typeof s&&(s={}),s=this.opts[n]=e.extend(!0,{},e[t].defaults[n],s),s.fix&&(this.bind("open:start",function(){this.$pnls.children("."+i.opened).scrollTop(0)}),this.bind("initMenu:after",function(){this["_initWindow_"+n]()})))},add:function(){i=e[t]._c,s=e[t]._d,a=e[t]._e},clickAnchor:function(e,t){}},e[t].defaults[n]={fix:!0},e[t].prototype["_initWindow_"+n]=function(){var t=this;o.$docu.off(a.touchmove+"-"+n).on(a.touchmove+"-"+n,function(e){o.$html.hasClass(i.opened)&&e.preventDefault()});var s=!1;o.$body.off(a.touchstart+"-"+n).on(a.touchstart+"-"+n,"."+i.panels+"> ."+i.opened,function(e){o.$html.hasClass(i.opened)&&(s||(s=!0,0===e.currentTarget.scrollTop?e.currentTarget.scrollTop=1:e.currentTarget.scrollHeight===e.currentTarget.scrollTop+e.currentTarget.offsetHeight&&(e.currentTarget.scrollTop-=1),s=!1))}).off(a.touchmove+"-"+n).on(a.touchmove+"-"+n,"."+i.panels+"> ."+i.opened,function(t){o.$html.hasClass(i.opened)&&e(this)[0].scrollHeight>e(this).innerHeight()&&t.stopPropagation()}),o.$wndw.off(a.orientationchange+"-"+n).on(a.orientationchange+"-"+n,function(){t.$pnls.children("."+i.opened).scrollTop(0).css({"-webkit-overflow-scrolling":"auto"}).css({"-webkit-overflow-scrolling":"touch"})})};var i,s,a,o}(jQuery),/*
 * jQuery mmenu screenReader add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="screenReader";e[t].addons[n]={setup:function(){var a=this,r=this.opts[n],l=this.conf[n];o=e[t].glbl,"boolean"==typeof r&&(r={aria:r,text:r}),"object"!=typeof r&&(r={}),r=this.opts[n]=e.extend(!0,{},e[t].defaults[n],r),r.aria&&(this.bind("initAddons:after",function(){this.bind("initMenu:after",function(){this.trigger("initMenu:after:sr-aria")}),this.bind("initNavbar:after",function(){this.trigger("initNavbar:after:sr-aria",arguments[0])}),this.bind("openPanel:start",function(){this.trigger("openPanel:start:sr-aria",arguments[0])}),this.bind("close:start",function(){this.trigger("close:start:sr-aria")}),this.bind("close:finish",function(){this.trigger("close:finish:sr-aria")}),this.bind("open:start",function(){this.trigger("open:start:sr-aria")}),this.bind("open:finish",function(){this.trigger("open:finish:sr-aria")})}),this.bind("updateListview",function(){this.$pnls.find("."+i.listview).children().each(function(){a.__sr_aria(e(this),"hidden",e(this).is("."+i.hidden))})}),this.bind("openPanel:start",function(e){var t=this.$menu.find("."+i.panel).not(e).not(e.parents("."+i.panel)),n=e.add(e.find("."+i.vertical+"."+i.opened).children("."+i.panel));this.__sr_aria(t,"hidden",!0),this.__sr_aria(n,"hidden",!1)}),this.bind("closePanel",function(e){this.__sr_aria(e,"hidden",!0)}),this.bind("initPanels:after",function(t){var n=t.find("."+i.prev+", ."+i.next).each(function(){a.__sr_aria(e(this),"owns",e(this).attr("href").replace("#",""))});this.__sr_aria(n,"haspopup",!0)}),this.bind("initNavbar:after",function(e){var t=e.children("."+i.navbar);this.__sr_aria(t,"hidden",!e.hasClass(i.hasnavbar))}),r.text&&(this.bind("initlistview:after",function(e){var t=e.find("."+i.listview).find("."+i.fullsubopen).parent().children("span");this.__sr_aria(t,"hidden",!0)}),"parent"==this.opts.navbar.titleLink&&this.bind("initNavbar:after",function(e){var t=e.children("."+i.navbar),n=!!t.children("."+i.prev).length;this.__sr_aria(t.children("."+i.title),"hidden",n)}))),r.text&&(this.bind("initAddons:after",function(){this.bind("setPage:after",function(){this.trigger("setPage:after:sr-text",arguments[0])})}),this.bind("initNavbar:after",function(n){var s=n.children("."+i.navbar),a=s.children("."+i.title).text(),o=e[t].i18n(l.text.closeSubmenu);a&&(o+=" ("+a+")"),s.children("."+i.prev).html(this.__sr_text(o))}),this.bind("initListview:after",function(n){var o=n.data(s.parent);if(o&&o.length){var r=o.children("."+i.next),d=r.nextAll("span, a").first().text(),c=e[t].i18n(l.text[r.parent().is("."+i.vertical)?"toggleSubmenu":"openSubmenu"]);d&&(c+=" ("+d+")"),r.html(a.__sr_text(c))}}))},add:function(){i=e[t]._c,s=e[t]._d,a=e[t]._e,i.add("sronly")},clickAnchor:function(e,t){}},e[t].defaults[n]={aria:!0,text:!0},e[t].configuration[n]={text:{closeMenu:"Close menu",closeSubmenu:"Close submenu",openSubmenu:"Open submenu",toggleSubmenu:"Toggle submenu"}},e[t].prototype.__sr_aria=function(e,t,n){e.prop("aria-"+t,n)[n?"attr":"removeAttr"]("aria-"+t,n)},e[t].prototype.__sr_text=function(e){return'<span class="'+i.sronly+'">'+e+"</span>"};var i,s,a,o}(jQuery),/*
 * jQuery mmenu autoHeight add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="autoHeight";e[t].addons[n]={setup:function(){var s=this.opts[n];this.conf[n];if(o=e[t].glbl,"boolean"==typeof s&&s&&(s={height:"auto"}),"string"==typeof s&&(s={height:s}),"object"!=typeof s&&(s={}),s=this.opts[n]=e.extend(!0,{},e[t].defaults[n],s),"auto"==s.height||"highest"==s.height){this.bind("initMenu:after",function(){this.$menu.addClass(i.autoheight)});var a=function(t){if(!this.opts.offCanvas||this.vars.opened){var n=Math.max(parseInt(this.$pnls.css("top"),10),0)||0,a=Math.max(parseInt(this.$pnls.css("bottom"),10),0)||0,o=0;this.$menu.addClass(i.measureheight),"auto"==s.height?(t=t||this.$pnls.children("."+i.opened),t.is("."+i.vertical)&&(t=t.parents("."+i.panel).not("."+i.vertical)),t.length||(t=this.$pnls.children("."+i.panel)),o=t.first().outerHeight()):"highest"==s.height&&this.$pnls.children().each(function(){var t=e(this);t.is("."+i.vertical)&&(t=t.parents("."+i.panel).not("."+i.vertical).first()),o=Math.max(o,t.outerHeight())}),this.$menu.height(o+n+a).removeClass(i.measureheight)}};this.opts.offCanvas&&this.bind("open:start",a),"highest"==s.height&&this.bind("initPanels:after",a),"auto"==s.height&&(this.bind("updateListview",a),this.bind("openPanel:start",a),this.bind("closePanel",a))}},add:function(){i=e[t]._c,s=e[t]._d,a=e[t]._e,i.add("autoheight measureheight"),a.add("resize")},clickAnchor:function(e,t){}},e[t].defaults[n]={height:"default"};var i,s,a,o}(jQuery),/*
 * jQuery mmenu backButton add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="backButton";e[t].addons[n]={setup:function(){if(this.opts.offCanvas){var s=this,a=this.opts[n];this.conf[n];if(o=e[t].glbl,"boolean"==typeof a&&(a={close:a}),"object"!=typeof a&&(a={}),a=e.extend(!0,{},e[t].defaults[n],a),a.close){var r="#"+s.$menu.attr("id");this.bind("open:finish",function(e){location.hash!=r&&history.pushState(null,document.title,r)}),e(window).on("popstate",function(e){o.$html.hasClass(i.opened)?(e.stopPropagation(),s.close()):location.hash==r&&(e.stopPropagation(),s.open())})}}},add:function(){return window.history&&window.history.pushState?(i=e[t]._c,s=e[t]._d,void(a=e[t]._e)):void(e[t].addons[n].setup=function(){})},clickAnchor:function(e,t){}},e[t].defaults[n]={close:!1};var i,s,a,o}(jQuery),/*
 * jQuery mmenu columns add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="columns";e[t].addons[n]={setup:function(){var s=this.opts[n];this.conf[n];if(o=e[t].glbl,"boolean"==typeof s&&(s={add:s}),"number"==typeof s&&(s={add:!0,visible:s}),"object"!=typeof s&&(s={}),"number"==typeof s.visible&&(s.visible={min:s.visible,max:s.visible}),s=this.opts[n]=e.extend(!0,{},e[t].defaults[n],s),s.add){s.visible.min=Math.max(1,Math.min(6,s.visible.min)),s.visible.max=Math.max(s.visible.min,Math.min(6,s.visible.max));for(var a=this.opts.offCanvas?this.$menu.add(o.$html):this.$menu,r="",l=0;l<=s.visible.max;l++)r+=" "+i.columns+"-"+l;r.length&&(r=r.slice(1));var d=function(e){var t=this.$pnls.children("."+i.subopened).length;e&&!e.hasClass(i.subopened)&&t++,t=Math.min(s.visible.max,Math.max(s.visible.min,t)),a.removeClass(r).addClass(i.columns+"-"+t)},c=function(){a.removeClass(r)},h=function(t){this.$pnls.children("."+i.panel).removeClass(r).filter("."+i.subopened).add(t).slice(-s.visible.max).each(function(t){e(this).addClass(i.columns+"-"+t)})};this.bind("initMenu:after",function(){this.$menu.addClass(i.columns)}),this.bind("initPanels:after",function(e){h.call(this,this.$pnls.children("."+i.opened))}),this.bind("open:start",d),this.bind("openPanel:start",d),this.bind("openPanel:start",h),this.bind("close:finish",c),this.opts.offCanvas||d.call(this)}},add:function(){i=e[t]._c,s=e[t]._d,a=e[t]._e,i.add("columns")},clickAnchor:function(t,s){if(!this.opts[n].add)return!1;if(s){var a=t.attr("href");if(a.length>1&&"#"==a.slice(0,1))try{var o=e(a,this.$menu);if(o.is("."+i.panel))for(var r=parseInt(t.closest("."+i.panel).attr("class").split(i.columns+"-")[1].split(" ")[0],10)+1;r>0;){var l=this.$pnls.children("."+i.columns+"-"+r);if(!l.length){r=-1;break}r++,l.removeClass(i.subopened).removeClass(i.opened).removeClass(i.highest).addClass(i.hidden)}}catch(d){}}}},e[t].defaults[n]={add:!1,visible:{min:1,max:3}};var i,s,a,o}(jQuery),/*
 * jQuery mmenu counters add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="counters";e[t].addons[n]={setup:function(){var a=this,r=this.opts[n];this.conf[n];if(o=e[t].glbl,"boolean"==typeof r&&(r={add:r,update:r}),"object"!=typeof r&&(r={}),r=this.opts[n]=e.extend(!0,{},e[t].defaults[n],r),this.bind("initListview:after",function(t){this.__refactorClass(e("em",t),this.conf.classNames[n].counter,"counter")}),r.add&&this.bind("initListview:after",function(t){var n;switch(r.addTo){case"panels":n=t;break;default:n=t.filter(r.addTo)}n.each(function(){var t=e(this).data(s.parent);t&&(t.children("em."+i.counter).length||t.prepend(e('<em class="'+i.counter+'" />')))})}),r.update){var l=function(t){t=t||this.$pnls.children("."+i.panel),t.each(function(){var t=e(this),n=t.data(s.parent);if(n){var o=n.children("em."+i.counter);o.length&&(t=t.children("."+i.listview),t.length&&o.html(a.__filterListItems(t.children()).length))}})};this.bind("initListview:after",l),this.bind("updateListview",l)}},add:function(){i=e[t]._c,s=e[t]._d,a=e[t]._e,i.add("counter search noresultsmsg")},clickAnchor:function(e,t){}},e[t].defaults[n]={add:!1,addTo:"panels",count:!1},e[t].configuration.classNames[n]={counter:"Counter"};var i,s,a,o}(jQuery),/*
 * jQuery mmenu dividers add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="dividers";e[t].addons[n]={setup:function(){var s=this,r=this.opts[n];this.conf[n];if(o=e[t].glbl,"boolean"==typeof r&&(r={add:r,fixed:r}),"object"!=typeof r&&(r={}),r=this.opts[n]=e.extend(!0,{},e[t].defaults[n],r),this.bind("initListview:after",function(e){this.__refactorClass(e.find("li"),this.conf.classNames[n].collapsed,"collapsed")}),r.add&&this.bind("initListview:after",function(t){var n;switch(r.addTo){case"panels":n=t;break;default:n=t.filter(r.addTo)}n.length&&n.find("."+i.listview).find("."+i.divider).remove().end().each(function(){var t="";s.__filterListItems(e(this).children()).each(function(){var n=e.trim(e(this).children("a, span").text()).slice(0,1).toLowerCase();n!=t&&n.length&&(t=n,e('<li class="'+i.divider+'">'+n+"</li>").insertBefore(this))})})}),r.collapse&&this.bind("initListview:after",function(t){t.find("."+i.divider).each(function(){var t=e(this),n=t.nextUntil("."+i.divider,"."+i.collapsed);n.length&&(t.children("."+i.next).length||(t.wrapInner("<span />"),t.prepend('<a href="#" class="'+i.next+" "+i.fullsubopen+'" />')))})}),r.fixed){this.bind("initPanels:after",function(){"undefined"==typeof this.$fixeddivider&&(this.$fixeddivider=e('<ul class="'+i.listview+" "+i.fixeddivider+'"><li class="'+i.divider+'"></li></ul>').prependTo(this.$pnls).children())});var l=function(t){if(t=t||this.$pnls.children("."+i.opened),!t.is(":hidden")){var n=t.children("."+i.listview).children("."+i.divider).not("."+i.hidden),s=t.scrollTop()||0,a="";n.each(function(){e(this).position().top+s<s+1&&(a=e(this).text())}),this.$fixeddivider.text(a),this.$pnls[a.length?"addClass":"removeClass"](i.hasdividers)}};this.bind("open:start",l),this.bind("openPanel:start",l),this.bind("updateListview",l),this.bind("initPanel:after",function(e){e.off(a.scroll+"-"+n+" "+a.touchmove+"-"+n).on(a.scroll+"-"+n+" "+a.touchmove+"-"+n,function(t){l.call(s,e)})})}},add:function(){i=e[t]._c,s=e[t]._d,a=e[t]._e,i.add("collapsed uncollapsed fixeddivider hasdividers"),a.add("scroll")},clickAnchor:function(e,t){if(this.opts[n].collapse&&t){var s=e.parent();if(s.is("."+i.divider)){var a=s.nextUntil("."+i.divider,"."+i.collapsed);return s.toggleClass(i.opened),a[s.hasClass(i.opened)?"addClass":"removeClass"](i.uncollapsed),!0}}return!1}},e[t].defaults[n]={add:!1,addTo:"panels",fixed:!1,collapse:!1},e[t].configuration.classNames[n]={collapsed:"Collapsed"};var i,s,a,o}(jQuery),/*
 * jQuery mmenu drag add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){function t(e,t,n){return e<t&&(e=t),e>n&&(e=n),e}function n(n,i,s){var r,l,d,c=this,h={events:"panleft panright",typeLower:"x",typeUpper:"X",open_dir:"right",close_dir:"left",negative:!1},f="width",u=h.open_dir,p=function(e){e<=n.maxStartPos&&(m=1)},v=function(){return e("."+o.slideout)},m=0,b=0,g=0;switch(this.opts.offCanvas.position){case"top":case"bottom":h.events="panup pandown",h.typeLower="y",h.typeUpper="Y",f="height"}switch(this.opts.offCanvas.position){case"right":case"bottom":h.negative=!0,p=function(e){e>=s.$wndw[f]()-n.maxStartPos&&(m=1)}}switch(this.opts.offCanvas.position){case"left":break;case"right":h.open_dir="left",h.close_dir="right";break;case"top":h.open_dir="down",h.close_dir="up";break;case"bottom":h.open_dir="up",h.close_dir="down"}switch(this.opts.offCanvas.zposition){case"front":v=function(){return this.$menu}}var _=this.__valueOrFn(n.node,this.$menu,s.$page);"string"==typeof _&&(_=e(_));var C=new Hammer(_[0],this.opts[a].vendors.hammer);C.on("panstart",function(e){p(e.center[h.typeLower]),s.$slideOutNodes=v(),u=h.open_dir}),C.on(h.events+" panend",function(e){m>0&&e.preventDefault()}),C.on(h.events,function(e){if(r=e["delta"+h.typeUpper],h.negative&&(r=-r),r!=b&&(u=r>=b?h.open_dir:h.close_dir),b=r,b>n.threshold&&1==m){if(s.$html.hasClass(o.opened))return;m=2,c._openSetup(),c.trigger("open:start"),s.$html.addClass(o.dragging),g=t(s.$wndw[f]()*i[f].perc,i[f].min,i[f].max)}2==m&&(l=t(b,10,g)-("front"==c.opts.offCanvas.zposition?g:0),h.negative&&(l=-l),d="translate"+h.typeUpper+"("+l+"px )",s.$slideOutNodes.css({"-webkit-transform":"-webkit-"+d,transform:d}))}),C.on("panend",function(e){2==m&&(s.$html.removeClass(o.dragging),s.$slideOutNodes.css("transform",""),c[u==h.open_dir?"_openFinish":"close"]()),m=0})}function i(e,t,n,i){var s=this,l=e.data(r.parent);if(l){l=l.closest("."+o.panel);var d=new Hammer(e[0],s.opts[a].vendors.hammer),c=null;d.on("panright",function(e){c||(s.openPanel(l),c=setTimeout(function(){clearTimeout(c),c=null},s.conf.openingInterval+s.conf.transitionDuration))})}}var s="mmenu",a="drag";e[s].addons[a]={setup:function(){if(this.opts.offCanvas){var t=this.opts[a],o=this.conf[a];d=e[s].glbl,"boolean"==typeof t&&(t={menu:t,panels:t}),"object"!=typeof t&&(t={}),"boolean"==typeof t.menu&&(t.menu={open:t.menu}),"object"!=typeof t.menu&&(t.menu={}),"boolean"==typeof t.panels&&(t.panels={close:t.panels}),"object"!=typeof t.panels&&(t.panels={}),t=this.opts[a]=e.extend(!0,{},e[s].defaults[a],t),t.menu.open&&this.bind("setPage:after",function(){n.call(this,t.menu,o.menu,d)}),t.panels.close&&this.bind("initPanel:after",function(e){i.call(this,e,t.panels,o.panels,d)})}},add:function(){return"function"!=typeof Hammer||Hammer.VERSION<2?(e[s].addons[a].add=function(){},void(e[s].addons[a].setup=function(){})):(o=e[s]._c,r=e[s]._d,l=e[s]._e,void o.add("dragging"))},clickAnchor:function(e,t){}},e[s].defaults[a]={menu:{open:!1,maxStartPos:100,threshold:50},panels:{close:!1},vendors:{hammer:{}}},e[s].configuration[a]={menu:{width:{perc:.8,min:140,max:440},height:{perc:.8,min:140,max:880}},panels:{}};var o,r,l,d}(jQuery),/*
 * jQuery mmenu dropdown add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="dropdown";e[t].addons[n]={setup:function(){if(this.opts.offCanvas){var r=this,l=this.opts[n],d=this.conf[n];if(o=e[t].glbl,"boolean"==typeof l&&l&&(l={drop:l}),"object"!=typeof l&&(l={}),"string"==typeof l.position&&(l.position={of:l.position}),l=this.opts[n]=e.extend(!0,{},e[t].defaults[n],l),l.drop){var c;this.bind("initMenu:after",function(){if(this.$menu.addClass(i.dropdown),l.tip&&this.$menu.addClass(i.tip),"string"!=typeof l.position.of){var t=this._getOriginalMenuId();t&&t.length&&(l.position.of='[href="#'+t+'"]')}"string"==typeof l.position.of&&(c=e(l.position.of),l.event=l.event.split(" "),1==l.event.length&&(l.event[1]=l.event[0]),"hover"==l.event[0]&&c.on(a.mouseenter+"-"+n,function(){r.open()}),"hover"==l.event[1]&&this.$menu.on(a.mouseleave+"-"+n,function(){r.close()}))}),this.bind("open:start",function(){this.$menu.data(s.style,this.$menu.attr("style")||""),o.$html.addClass(i.dropdown)}),this.bind("close:finish",function(){this.$menu.attr("style",this.$menu.data(s.style)),o.$html.removeClass(i.dropdown)});var h=function(e,t){var n=t[0],s=t[1],a="x"==e?"scrollLeft":"scrollTop",r="x"==e?"outerWidth":"outerHeight",h="x"==e?"left":"top",f="x"==e?"right":"bottom",u="x"==e?"width":"height",p="x"==e?"maxWidth":"maxHeight",v=null,m=o.$wndw[a](),b=c.offset()[h]-=m,g=b+c[r](),_=o.$wndw[u](),C=d.offset.button[e]+d.offset.viewport[e];if(l.position[e])switch(l.position[e]){case"left":case"bottom":v="after";break;case"right":case"top":v="before"}null===v&&(v=b+(g-b)/2<_/2?"after":"before");var y,w;return"after"==v?(y="x"==e?b:g,w=_-(y+C),n[h]=y+d.offset.button[e],n[f]="auto",s.push(i["x"==e?"tipleft":"tiptop"])):(y="x"==e?g:b,w=y-C,n[f]="calc( 100% - "+(y-d.offset.button[e])+"px )",n[h]="auto",s.push(i["x"==e?"tipright":"tipbottom"])),n[p]=Math.min(d[u].max,w),[n,s]},f=function(e){if(this.vars.opened){this.$menu.attr("style",this.$menu.data(s.style));var t=[{},[]];t=h.call(this,"y",t),t=h.call(this,"x",t),this.$menu.css(t[0]),l.tip&&this.$menu.removeClass(i.tipleft+" "+i.tipright+" "+i.tiptop+" "+i.tipbottom).addClass(t[1].join(" "))}};this.bind("open:start",f),o.$wndw.on(a.resize+"-"+n,function(e){f.call(r)}),this.opts.offCanvas.blockUI||o.$wndw.on(a.scroll+"-"+n,function(e){f.call(r)})}}},add:function(){i=e[t]._c,s=e[t]._d,a=e[t]._e,i.add("dropdown tip tipleft tipright tiptop tipbottom"),a.add("mouseenter mouseleave resize scroll")},clickAnchor:function(e,t){}},e[t].defaults[n]={drop:!1,event:"click",position:{},tip:!0},e[t].configuration[n]={offset:{button:{x:-10,y:10},viewport:{x:20,y:20}},height:{max:880},width:{max:440}};var i,s,a,o}(jQuery),/*
 * jQuery mmenu fixedElements add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="fixedElements";e[t].addons[n]={setup:function(){if(this.opts.offCanvas){var i=this.opts[n],s=this.conf[n];o=e[t].glbl,i=this.opts[n]=e.extend(!0,{},e[t].defaults[n],i);var a=function(e){var t=this.conf.classNames[n].fixed;this.__refactorClass(e.find("."+t),t,"slideout")[s.elemInsertMethod](s.elemInsertSelector)};this.bind("setPage:after",a)}},add:function(){i=e[t]._c,s=e[t]._d,a=e[t]._e,i.add("fixed")},clickAnchor:function(e,t){}},e[t].configuration[n]={elemInsertMethod:"appendTo",elemInsertSelector:"body"},e[t].configuration.classNames[n]={fixed:"Fixed"};var i,s,a,o}(jQuery),/*
 * jQuery mmenu iconPanels add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="iconPanels";e[t].addons[n]={setup:function(){var s=this,a=this.opts[n];this.conf[n];if(o=e[t].glbl,"boolean"==typeof a&&(a={add:a}),"number"==typeof a&&(a={add:!0,visible:a}),"object"!=typeof a&&(a={}),a=this.opts[n]=e.extend(!0,{},e[t].defaults[n],a),a.visible++,a.add){for(var r="",l=0;l<=a.visible;l++)r+=" "+i.iconpanel+"-"+l;r.length&&(r=r.slice(1));var d=function(t){t.hasClass(i.vertical)||s.$pnls.children("."+i.panel).removeClass(r).filter("."+i.subopened).removeClass(i.hidden).add(t).not("."+i.vertical).slice(-a.visible).each(function(t){e(this).addClass(i.iconpanel+"-"+t)})};this.bind("initMenu:after",function(){this.$menu.addClass(i.iconpanel)}),this.bind("openPanel:start",d),this.bind("initPanels:after",function(e){d.call(s,s.$pnls.children("."+i.opened))}),this.bind("initListview:after",function(e){e.hasClass(i.vertical)||e.children("."+i.subblocker).length||e.prepend('<a href="#'+e.closest("."+i.panel).attr("id")+'" class="'+i.subblocker+'" />')})}},add:function(){i=e[t]._c,s=e[t]._d,a=e[t]._e,i.add("iconpanel subblocker")},clickAnchor:function(e,t){}},e[t].defaults[n]={add:!1,visible:3};var i,s,a,o}(jQuery),/*
 * jQuery mmenu keyboardNavigation add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){function t(t,n){t=t||this.$pnls.children("."+a.opened);var i=e(),s=this.$menu.children("."+a.mm("navbars-top")+", ."+a.mm("navbars-bottom")).children("."+a.navbar);s.find(d).filter(":focus").length||("default"==n&&(i=t.children("."+a.listview).find("a[href]").not("."+a.hidden),i.length||(i=t.find(d).not("."+a.hidden)),i.length||(i=s.find(d).not("."+a.hidden))),i.length||(i=this.$menu.children("."+a.tabstart)),i.first().focus())}function n(e){e||(e=this.$pnls.children("."+a.opened));var t=this.$pnls.children("."+a.panel),n=t.not(e);n.find(d).attr("tabindex",-1),e.find(d).attr("tabindex",0),e.find("."+a.mm("toggle")+", ."+a.mm("check")).attr("tabindex",-1),e.children("."+a.navbar).children("."+a.title).attr("tabindex",-1)}var i="mmenu",s="keyboardNavigation";e[i].addons[s]={setup:function(){var o=this.opts[s];this.conf[s];if(l=e[i].glbl,"boolean"!=typeof o&&"string"!=typeof o||(o={enable:o}),"object"!=typeof o&&(o={}),o=this.opts[s]=e.extend(!0,{},e[i].defaults[s],o),o.enable){var r=e('<button class="'+a.tabstart+'" tabindex="0" type="button" />'),d=e('<button class="'+a.tabend+'" tabindex="0" type="button" />');this.bind("initMenu:after",function(){o.enhance&&this.$menu.addClass(a.keyboardfocus),this["_initWindow_"+s](o.enhance)}),this.bind("initOpened:before",function(){this.$menu.prepend(r).append(d).children("."+a.mm("navbars-top")+", ."+a.mm("navbars-bottom")).children("."+a.navbar).children("a."+a.title).attr("tabindex",-1)}),this.bind("open:start",function(){n.call(this)}),this.bind("open:finish",function(){t.call(this,null,o.enable)}),this.bind("openPanel:start",function(e){n.call(this,e)}),this.bind("openPanel:finish",function(e){t.call(this,e,o.enable)}),this.bind("initOpened:after",function(){this.__sr_aria(this.$menu.children("."+a.mm("tabstart")+", ."+a.mm("tabend")),"hidden",!0)})}},add:function(){a=e[i]._c,o=e[i]._d,r=e[i]._e,a.add("tabstart tabend keyboardfocus"),r.add("focusin keydown")},clickAnchor:function(e,t){}},e[i].defaults[s]={enable:!1,enhance:!1},e[i].configuration[s]={},e[i].prototype["_initWindow_"+s]=function(t){l.$wndw.off(r.keydown+"-offCanvas"),l.$wndw.off(r.focusin+"-"+s).on(r.focusin+"-"+s,function(t){if(l.$html.hasClass(a.opened)){var n=e(t.target);n.is("."+a.tabend)&&n.parent().find("."+a.tabstart).focus()}}),l.$wndw.off(r.keydown+"-"+s).on(r.keydown+"-"+s,function(t){var n=e(t.target),i=n.closest("."+a.menu);if(i.length){i.data("mmenu");if(n.is("input, textarea"));else switch(t.keyCode){case 13:(n.is(".mm-toggle")||n.is(".mm-check"))&&n.trigger(r.click);break;case 32:case 37:case 38:case 39:case 40:t.preventDefault()}}}),t&&l.$wndw.off(r.keydown+"-"+s).on(r.keydown+"-"+s,function(t){var n=e(t.target),i=n.closest("."+a.menu);if(i.length){var s=i.data("mmenu");if(n.is("input, textarea"))switch(t.keyCode){case 27:n.val("")}else switch(t.keyCode){case 8:var r=n.closest("."+a.panel).data(o.parent);r&&r.length&&s.openPanel(r.closest("."+a.panel));break;case 27:i.hasClass(a.offcanvas)&&s.close()}}})};var a,o,r,l,d="input, select, textarea, button, label, a[href]"}(jQuery),/*
 * jQuery mmenu lazySubmenus add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="lazySubmenus";e[t].addons[n]={setup:function(){var s=this.opts[n];this.conf[n];o=e[t].glbl,"boolean"==typeof s&&(s={load:s}),"object"!=typeof s&&(s={}),s=this.opts[n]=e.extend(!0,{},e[t].defaults[n],s),s.load&&(this.bind("initMenu:after",function(){this.$pnls.find("li").children(this.conf.panelNodetype).not("."+i.inset).not("."+i.nolistview).not("."+i.nopanel).addClass(i.lazysubmenu+" "+i.nolistview+" "+i.nopanel)}),this.bind("initPanels:before",function(e){e=e||this.$pnls.children(this.conf.panelNodetype),this.__findAddBack(e,"."+i.lazysubmenu).not("."+i.lazysubmenu+" ."+i.lazysubmenu).removeClass(i.lazysubmenu+" "+i.nolistview+" "+i.nopanel)}),this.bind("initOpened:before",function(){var e=this.$pnls.find("."+this.conf.classNames.selected).parents("."+i.lazysubmenu);e.length&&(e.removeClass(i.lazysubmenu+" "+i.nolistview+" "+i.nopanel),this.initPanels(e.last()))}),this.bind("openPanel:before",function(e){var t=this.__findAddBack(e,"."+i.lazysubmenu).not("."+i.lazysubmenu+" ."+i.lazysubmenu);t.length&&this.initPanels(t)}))},add:function(){i=e[t]._c,s=e[t]._d,a=e[t]._e,i.add("lazysubmenu"),s.add("lazysubmenu")},clickAnchor:function(e,t){}},e[t].defaults[n]={load:!1},e[t].configuration[n]={};var i,s,a,o}(jQuery),/*
 * jQuery mmenu navbar add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="navbars";e[t].addons[n]={setup:function(){var s=this,a=this.opts[n],r=this.conf[n];if(o=e[t].glbl,"undefined"!=typeof a){a instanceof Array||(a=[a]);var l={},d={};a.length&&(e.each(a,function(o){var c=a[o];"boolean"==typeof c&&c&&(c={}),"object"!=typeof c&&(c={}),"undefined"==typeof c.content&&(c.content=["prev","title"]),c.content instanceof Array||(c.content=[c.content]),c=e.extend(!0,{},s.opts.navbar,c);var h=e('<div class="'+i.navbar+'" />'),f=c.height;"number"!=typeof f&&(f=1),f=Math.min(4,Math.max(1,f)),h.addClass(i.navbar+"-size-"+f);var u=c.position;"bottom"!=u&&(u="top"),l[u]||(l[u]=0),l[u]+=f,d[u]||(d[u]=e('<div class="'+i.navbars+"-"+u+'" />')),d[u].append(h);for(var p=0,v=0,m=c.content.length;v<m;v++){var b=e[t].addons[n][c.content[v]]||!1;b?p+=b.call(s,h,c,r):(b=c.content[v],b instanceof e||(b=e(c.content[v])),h.append(b))}p+=Math.ceil(h.children().not("."+i.btn).length/f),p>1&&h.addClass(i.navbar+"-content-"+p),h.children("."+i.btn).length&&h.addClass(i.hasbtns)}),this.bind("initMenu:after",function(){for(var e in l)this.$menu.addClass(i.hasnavbar+"-"+e+"-"+l[e]),this.$menu["bottom"==e?"append":"prepend"](d[e])}))}},add:function(){i=e[t]._c,s=e[t]._d,a=e[t]._e,i.add("navbars close hasbtns")},clickAnchor:function(e,t){}},e[t].configuration[n]={breadcrumbSeparator:"/"},e[t].configuration.classNames[n]={};var i,s,a,o}(jQuery),/*
 * jQuery mmenu navbar add-on breadcrumbs content
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="navbars",i="breadcrumbs";e[t].addons[n][i]=function(n,i,s){var a=this,o=e[t]._c,r=e[t]._d;o.add("breadcrumbs separator");var l=e('<span class="'+o.breadcrumbs+'" />').appendTo(n);return this.bind("initNavbar:after",function(t){t.removeClass(o.hasnavbar);for(var n=[],i=e('<span class="'+o.breadcrumbs+'"></span>'),a=t,l=!0;a&&a.length;){if(a.is("."+o.panel)||(a=a.closest("."+o.panel)),!a.hasClass(o.vertical)){var d=a.children("."+o.navbar).children("."+o.title).text();n.unshift(l?"<span>"+d+"</span>":'<a href="#'+a.attr("id")+'">'+d+"</a>"),l=!1}a=a.data(r.parent)}i.append(n.join('<span class="'+o.separator+'">'+s.breadcrumbSeparator+"</span>")).appendTo(t.children("."+o.navbar))}),this.bind("openPanel:start",function(e){l.html(e.children("."+o.navbar).children("."+o.breadcrumbs).html()||"")}),this.bind("initNavbar:after:sr-aria",function(t){t.children("."+o.navbar).children("."+o.breadcrumbs).children("a").each(function(){a.__sr_aria(e(this),"owns",e(this).attr("href").slice(1))})}),0}}(jQuery),/*
 * jQuery mmenu navbar add-on close content
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="navbars",i="close";e[t].addons[n][i]=function(n,i){var s=e[t]._c,a=(e[t].glbl,e('<a class="'+s.close+" "+s.btn+'" href="#" />').appendTo(n));return this.bind("setPage:after",function(e){a.attr("href","#"+e.attr("id"))}),this.bind("setPage:after:sr-text",function(n){a.html(this.__sr_text(e[t].i18n(this.conf.screenReader.text.closeMenu))),this.__sr_aria(a,"owns",a.attr("href").slice(1))}),-1}}(jQuery),/*
 * jQuery mmenu navbar add-on next content
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="navbars",i="next";e[t].addons[n][i]=function(i,s){var a,o,r,l=e[t]._c,d=e('<a class="'+l.next+" "+l.btn+'" href="#" />').appendTo(i);return this.bind("openPanel:start",function(e){a=e.find("."+this.conf.classNames[n].panelNext),o=a.attr("href"),r=a.html(),o?d.attr("href",o):d.removeAttr("href"),d[o||r?"removeClass":"addClass"](l.hidden),d.html(r)}),this.bind("openPanel:start:sr-aria",function(e){this.__sr_aria(d,"hidden",d.hasClass(l.hidden)),this.__sr_aria(d,"owns",(d.attr("href")||"").slice(1))}),-1},e[t].configuration.classNames[n].panelNext="Next"}(jQuery),/*
 * jQuery mmenu navbar add-on prev content
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="navbars",i="prev";e[t].addons[n][i]=function(i,s){var a=e[t]._c,o=e('<a class="'+a.prev+" "+a.btn+'" href="#" />').appendTo(i);this.bind("initNavbar:after",function(e){e.removeClass(a.hasnavbar)});var r,l,d;return this.bind("openPanel:start",function(e){e.hasClass(a.vertical)||(r=e.find("."+this.conf.classNames[n].panelPrev),r.length||(r=e.children("."+a.navbar).children("."+a.prev)),l=r.attr("href"),d=r.html(),l?o.attr("href",l):o.removeAttr("href"),o[l||d?"removeClass":"addClass"](a.hidden),o.html(d))}),this.bind("initNavbar:after:sr-aria",function(e){var t=e.children("."+a.navbar);this.__sr_aria(t,"hidden",!0)}),this.bind("openPanel:start:sr-aria",function(e){this.__sr_aria(o,"hidden",o.hasClass(a.hidden)),this.__sr_aria(o,"owns",(o.attr("href")||"").slice(1))}),-1},e[t].configuration.classNames[n].panelPrev="Prev"}(jQuery),/*
 * jQuery mmenu navbar add-on searchfield content
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="navbars",i="searchfield";e[t].addons[n][i]=function(n,i){var s=e[t]._c,a=e('<div class="'+s.search+'" />').appendTo(n);return"object"!=typeof this.opts.searchfield&&(this.opts.searchfield={}),this.opts.searchfield.add=!0,this.opts.searchfield.addTo=a,0}}(jQuery),/*
 * jQuery mmenu navbar add-on title content
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="navbars",i="title";e[t].addons[n][i]=function(i,s){var a,o,r,l=e[t]._c,d=e('<a class="'+l.title+'" />').appendTo(i);this.bind("openPanel:start",function(e){e.hasClass(l.vertical)||(r=e.find("."+this.conf.classNames[n].panelTitle),r.length||(r=e.children("."+l.navbar).children("."+l.title)),a=r.attr("href"),o=r.html()||s.title,a?d.attr("href",a):d.removeAttr("href"),d[a||o?"removeClass":"addClass"](l.hidden),d.html(o))});var c;return this.bind("openPanel:start:sr-aria",function(e){if(this.opts.screenReader.text&&(c||(c=this.$menu.children("."+l.navbars+"-top, ."+l.navbars+"-bottom").children("."+l.navbar).children("."+l.prev)),c.length)){var t=!0;"parent"==this.opts.navbar.titleLink&&(t=!c.hasClass(l.hidden)),this.__sr_aria(d,"hidden",t)}}),0},e[t].configuration.classNames[n].panelTitle="Title"}(jQuery),/*
 * jQuery mmenu pageScroll add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){function t(e){d&&d.length&&d.is(":visible")&&l.$html.add(l.$body).animate({scrollTop:d.offset().top+e}),d=!1}function n(e){try{return!("#"==e||"#"!=e.slice(0,1)||!l.$page.find(e).length)}catch(t){return!1}}var i="mmenu",s="pageScroll";e[i].addons[s]={setup:function(){var o=this,d=this.opts[s],c=this.conf[s];if(l=e[i].glbl,"boolean"==typeof d&&(d={scroll:d}),d=this.opts[s]=e.extend(!0,{},e[i].defaults[s],d),d.scroll&&this.bind("close:finish",function(){t(c.scrollOffset)}),d.update){var o=this,h=[],f=[];o.bind("initListview:after",function(t){o.__filterListItemAnchors(t.find("."+a.listview).children("li")).each(function(){var t=e(this).attr("href");n(t)&&h.push(t)}),f=h.reverse()});var u=-1;l.$wndw.on(r.scroll+"-"+s,function(t){for(var n=l.$wndw.scrollTop(),i=0;i<f.length;i++)if(e(f[i]).offset().top<n+c.updateOffset){u!==i&&(u=i,o.setSelected(o.__filterListItemAnchors(o.$pnls.children("."+a.opened).find("."+a.listview).children("li")).filter('[href="'+f[i]+'"]').parent()));break}})}},add:function(){a=e[i]._c,o=e[i]._d,r=e[i]._e},clickAnchor:function(i,o){if(d=!1,o&&this.opts[s].scroll&&this.opts.offCanvas&&l.$page&&l.$page.length){var r=i.attr("href");n(r)&&(d=e(r),l.$html.hasClass(a.mm("widescreen"))&&t(this.conf[s].scrollOffset))}}},e[i].defaults[s]={scroll:!1,update:!1},e[i].configuration[s]={scrollOffset:0,updateOffset:50};var a,o,r,l,d=!1}(jQuery),/*
 * jQuery mmenu RTL add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="rtl";e[t].addons[n]={setup:function(){var s=this.opts[n];this.conf[n];o=e[t].glbl,"object"!=typeof s&&(s={use:s}),s=this.opts[n]=e.extend(!0,{},e[t].defaults[n],s),"boolean"!=typeof s.use&&(s.use="rtl"==(o.$html.attr("dir")||"").toLowerCase()),s.use&&this.bind("initMenu:after",function(){this.$menu.addClass(i.rtl)})},add:function(){i=e[t]._c,s=e[t]._d,a=e[t]._e,i.add("rtl")},clickAnchor:function(e,t){}},e[t].defaults[n]={use:"detect"};var i,s,a,o}(jQuery),/*
 * jQuery mmenu searchfield add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){function t(e){switch(e){case 9:case 16:case 17:case 18:case 37:case 38:case 39:case 40:return!0}return!1}var n="mmenu",i="searchfield";e[n].addons[i]={setup:function(){var l=this,d=this.opts[i],c=this.conf[i];r=e[n].glbl,"boolean"==typeof d&&(d={add:d}),"object"!=typeof d&&(d={}),"boolean"==typeof d.resultsPanel&&(d.resultsPanel={add:d.resultsPanel}),d=this.opts[i]=e.extend(!0,{},e[n].defaults[i],d),c=this.conf[i]=e.extend(!0,{},e[n].configuration[i],c),this.bind("close:start",function(){this.$menu.find("."+s.search).find("input").blur()}),this.bind("initPanels:after",function(r){if(d.add){var h;switch(d.addTo){case"panels":h=r;break;default:h=this.$menu.find(d.addTo)}if(h.each(function(){var t=e(this);if(!t.is("."+s.panel)||!t.is("."+s.vertical)){if(!t.children("."+s.search).length){var i=l.__valueOrFn(c.clear,t),a=l.__valueOrFn(c.form,t),r=l.__valueOrFn(c.input,t),h=l.__valueOrFn(c.submit,t),f=e("<"+(a?"form":"div")+' class="'+s.search+'" />'),u=e('<input placeholder="'+e[n].i18n(d.placeholder)+'" type="text" autocomplete="off" />');f.append(u);var p;if(r)for(p in r)u.attr(p,r[p]);if(i&&e('<a class="'+s.btn+" "+s.clear+'" href="#" />').appendTo(f).on(o.click+"-searchfield",function(e){e.preventDefault(),u.val("").trigger(o.keyup+"-searchfield")}),a){for(p in a)f.attr(p,a[p]);h&&!i&&e('<a class="'+s.btn+" "+s.next+'" href="#" />').appendTo(f).on(o.click+"-searchfield",function(e){e.preventDefault(),f.submit()})}t.hasClass(s.search)?t.replaceWith(f):t.prepend(f).addClass(s.hassearch)}if(d.noResults){var v=t.closest("."+s.panel).length;if(v||(t=l.$pnls.children("."+s.panel).first()),!t.children("."+s.noresultsmsg).length){var m=t.children("."+s.listview).first(),b=e('<div class="'+s.noresultsmsg+" "+s.hidden+'" />');b.append(e[n].i18n(d.noResults))[m.length?"insertAfter":"prependTo"](m.length?m:t)}}}}),d.search){if(d.resultsPanel.add){d.showSubPanels=!1;var f=this.$pnls.children("."+s.resultspanel);f.length||(f=e('<div class="'+s.panel+" "+s.resultspanel+" "+s.noanimation+" "+s.hidden+'" />').appendTo(this.$pnls).append('<div class="'+s.navbar+" "+s.hidden+'"><a class="'+s.title+'">'+e[n].i18n(d.resultsPanel.title)+"</a></div>").append('<ul class="'+s.listview+'" />').append(this.$pnls.find("."+s.noresultsmsg).first().clone()),this.initPanels(f))}this.$menu.find("."+s.search).each(function(){var n,r,c=e(this),h=c.closest("."+s.panel).length;h?(n=c.closest("."+s.panel),r=n):(n=e("."+s.panel,l.pnls),r=l.$menu),d.resultsPanel.add&&(n=n.not(f));var u=c.children("input"),p=l.__findAddBack(n,"."+s.listview).children("li"),v=p.filter("."+s.divider),m=l.__filterListItems(p),b="a",g=b+", span",_="",C=function(){var t=u.val().toLowerCase();if(t!=_){if(_=t,d.resultsPanel.add&&f.children("."+s.listview).empty(),n.scrollTop(0),m.add(v).addClass(s.hidden).find("."+s.fullsubopensearch).removeClass(s.fullsubopen+" "+s.fullsubopensearch),m.each(function(){var t=e(this),n=b;(d.showTextItems||d.showSubPanels&&t.find("."+s.next))&&(n=g);var i=t.data(a.searchtext)||t.children(n).not("."+s.next).text();i.toLowerCase().indexOf(_)>-1&&t.add(t.prevAll("."+s.divider).first()).removeClass(s.hidden)}),d.showSubPanels&&n.each(function(t){var n=e(this);l.__filterListItems(n.find("."+s.listview).children()).each(function(){var t=e(this),n=t.data(a.child);t.removeClass(s.nosubresults),n&&n.find("."+s.listview).children().removeClass(s.hidden)})}),d.resultsPanel.add)if(""===_)this.closeAllPanels(),this.openPanel(this.$pnls.children("."+s.subopened).last());else{var i=e();n.each(function(){var t=l.__filterListItems(e(this).find("."+s.listview).children()).not("."+s.hidden).clone(!0);t.length&&(d.resultsPanel.dividers&&(i=i.add('<li class="'+s.divider+'">'+e(this).children("."+s.navbar).children("."+s.title).text()+"</li>")),t.children("."+s.mm("toggle")+", ."+s.mm("check")).remove(),i=i.add(t))}),i.find("."+s.next).remove(),f.children("."+s.listview).append(i),this.openPanel(f)}else e(n.get().reverse()).each(function(t){var n=e(this),i=n.data(a.parent);i&&(l.__filterListItems(n.find("."+s.listview).children()).length?(i.hasClass(s.hidden)&&i.children("."+s.next).not("."+s.fullsubopen).addClass(s.fullsubopen).addClass(s.fullsubopensearch),i.removeClass(s.hidden).removeClass(s.nosubresults).prevAll("."+s.divider).first().removeClass(s.hidden)):h||(n.hasClass(s.opened)&&setTimeout(function(){l.openPanel(i.closest("."+s.panel))},(t+1)*(1.5*l.conf.openingInterval)),i.addClass(s.nosubresults)))});r.find("."+s.noresultsmsg)[m.not("."+s.hidden).length?"addClass":"removeClass"](s.hidden),this.trigger("updateListview")}};u.off(o.keyup+"-"+i+" "+o.change+"-"+i).on(o.keyup+"-"+i,function(e){t(e.keyCode)||C.call(l)}).on(o.change+"-"+i,function(e){C.call(l)});var y=c.children("."+s.btn);y.length&&u.on(o.keyup+"-"+i,function(e){y[u.val().length?"removeClass":"addClass"](s.hidden)}),u.trigger(o.keyup+"-"+i)})}}})},add:function(){s=e[n]._c,a=e[n]._d,o=e[n]._e,s.add("clear search hassearch resultspanel noresultsmsg noresults nosubresults fullsubopensearch"),a.add("searchtext"),o.add("change keyup")},clickAnchor:function(e,t){}},e[n].defaults[i]={add:!1,addTo:"panels",placeholder:"Search",noResults:"No results found.",resultsPanel:{add:!1,dividers:!0,title:"Search results"},search:!0,showTextItems:!1,showSubPanels:!0},e[n].configuration[i]={clear:!1,form:!1,input:!1,submit:!1};var s,a,o,r}(jQuery),/*
 * jQuery mmenu sectionIndexer add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="sectionIndexer";e[t].addons[n]={setup:function(){var s=this,r=this.opts[n];this.conf[n];o=e[t].glbl,"boolean"==typeof r&&(r={add:r}),"object"!=typeof r&&(r={}),r=this.opts[n]=e.extend(!0,{},e[t].defaults[n],r),this.bind("initPanels:after",function(t){if(r.add){var o;switch(r.addTo){case"panels":o=t;break;default:o=e(r.addTo,this.$menu).filter("."+i.panel)}o.find("."+i.divider).closest("."+i.panel).addClass(i.hasindexer),this.$indexer||(this.$indexer=e('<div class="'+i.indexer+'" />').prependTo(this.$pnls).append('<a href="#a">a</a><a href="#b">b</a><a href="#c">c</a><a href="#d">d</a><a href="#e">e</a><a href="#f">f</a><a href="#g">g</a><a href="#h">h</a><a href="#i">i</a><a href="#j">j</a><a href="#k">k</a><a href="#l">l</a><a href="#m">m</a><a href="#n">n</a><a href="#o">o</a><a href="#p">p</a><a href="#q">q</a><a href="#r">r</a><a href="#s">s</a><a href="#t">t</a><a href="#u">u</a><a href="#v">v</a><a href="#w">w</a><a href="#x">x</a><a href="#y">y</a><a href="#z">z</a>'),this.$indexer.children().on(a.mouseover+"-"+n+" "+i.touchstart+"-"+n,function(t){var n=e(this).attr("href").slice(1),a=s.$pnls.children("."+i.opened),o=a.find("."+i.listview),r=-1,l=a.scrollTop();a.scrollTop(0),o.children("."+i.divider).not("."+i.hidden).each(function(){r<0&&n==e(this).text().slice(0,1).toLowerCase()&&(r=e(this).position().top)}),a.scrollTop(r>-1?r:l)}));var l=function(e){e=e||this.$pnls.children("."+i.opened),this.$menu[(e.hasClass(i.hasindexer)?"add":"remove")+"Class"](i.hasindexer)};this.bind("openPanel:start",l),this.bind("initPanels:after",l)}})},add:function(){i=e[t]._c,s=e[t]._d,a=e[t]._e,i.add("indexer hasindexer"),a.add("mouseover touchstart")},clickAnchor:function(e,t){if(e.parent().is("."+i.indexer))return!0}},e[t].defaults[n]={add:!1,addTo:"panels"};var i,s,a,o}(jQuery),/*
 * jQuery mmenu setSelected add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="setSelected";e[t].addons[n]={setup:function(){var a=this,r=this.opts[n];this.conf[n];if(o=e[t].glbl,"boolean"==typeof r&&(r={hover:r,parent:r}),"object"!=typeof r&&(r={}),r=this.opts[n]=e.extend(!0,{},e[t].defaults[n],r),"detect"==r.current){var l=function(e){e=e.split("?")[0].split("#")[0];var t=a.$menu.find('a[href="'+e+'"], a[href="'+e+'/"]');t.length?a.setSelected(t.parent(),!0):(e=e.split("/").slice(0,-1),e.length&&l(e.join("/")))};this.bind("initMenu:after",function(){l(window.location.href)})}else r.current||this.bind("initListview:after",function(e){this.$pnls.find("."+i.listview).children("."+i.selected).removeClass(i.selected)});r.hover&&this.bind("initMenu:after",function(){this.$menu.addClass(i.hoverselected)}),r.parent&&(this.bind("openPanel:finish",function(e){this.$pnls.find("."+i.listview).find("."+i.next).removeClass(i.selected);for(var t=e.data(s.parent);t;)t.not("."+i.vertical).children("."+i.next).addClass(i.selected),t=t.closest("."+i.panel).data(s.parent)}),this.bind("initMenu:after",function(){this.$menu.addClass(i.parentselected)}))},add:function(){i=e[t]._c,s=e[t]._d,a=e[t]._e,i.add("hoverselected parentselected")},clickAnchor:function(e,t){}},e[t].defaults[n]={current:!0,hover:!1,parent:!1};var i,s,a,o}(jQuery),/*
 * jQuery mmenu toggles add-on
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
		function(e){var t="mmenu",n="toggles";e[t].addons[n]={setup:function(){var s=this;this.opts[n],this.conf[n];o=e[t].glbl,this.bind("initListview:after",function(t){this.__refactorClass(t.find("input"),this.conf.classNames[n].toggle,"toggle"),this.__refactorClass(t.find("input"),this.conf.classNames[n].check,"check"),t.find("input."+i.toggle+", input."+i.check).each(function(){var t=e(this),n=t.closest("li"),a=t.hasClass(i.toggle)?"toggle":"check",o=t.attr("id")||s.__getUniqueId();n.children('label[for="'+o+'"]').length||(t.attr("id",o),n.prepend(t),e('<label for="'+o+'" class="'+i[a]+'"></label>').insertBefore(n.children("a, span").last()))})})},add:function(){i=e[t]._c,s=e[t]._d,a=e[t]._e,i.add("toggle check")},clickAnchor:function(e,t){}},e[t].configuration.classNames[n]={toggle:"Toggle",check:"Check"};var i,s,a,o}(jQuery);
	return true;

}(jQuery));



/*!
  hey, [be]Lazy.js - v1.8.2 - 2016.10.25
  A fast, small and dependency free lazy load script (https://github.com/dinbror/blazy)
  (c) Bjoern Klinggaard - @bklinggaard - http://dinbror.dk/blazy
*/
(function($) {

	'use strict';

	//private vars
	var _source, _viewport, _isRetina, _supportClosest, _attrSrc = 'src', _attrSrcset = 'srcset';

	// constructor
	function Blazy(options) {
		//IE7- fallback for missing querySelectorAll support
		if (!document.querySelectorAll) {
			var s = document.createStyleSheet();
			document.querySelectorAll = function(r, c, i, j, a) {
				a = document.all, c = [], r = r.replace(/\[for\b/gi, '[htmlFor').split(',');
				for (i = r.length; i--;) {
					s.addRule(r[i], 'k:v');
					for (j = a.length; j--;) a[j].currentStyle.k && c.push(a[j]);
					s.removeRule(0);
				}
				return c;
			};
		}

		//options and helper vars
		var scope = this;
		var util = scope._util = {};
		util.elements = [];
		util.destroyed = true;
		scope.options = options || {};
		scope.options.error = scope.options.error || false;
		scope.options.offset = scope.options.offset || 100;
		scope.options.root = scope.options.root || document;
		scope.options.success = scope.options.success || false;
		scope.options.selector = scope.options.selector || '.b-lazy';
		scope.options.separator = scope.options.separator || '|';
		scope.options.containerClass = scope.options.container;
		scope.options.container = scope.options.containerClass ? document.querySelectorAll(scope.options.containerClass) : false;
		scope.options.errorClass = scope.options.errorClass || 'b-error';
		scope.options.breakpoints = scope.options.breakpoints || false;
		scope.options.loadInvisible = scope.options.loadInvisible || false;
		scope.options.successClass = scope.options.successClass || 'b-loaded';
		scope.options.validateDelay = scope.options.validateDelay || 25;
		scope.options.saveViewportOffsetDelay = scope.options.saveViewportOffsetDelay || 50;
		scope.options.srcset = scope.options.srcset || 'data-srcset';
		scope.options.src = _source = scope.options.src || 'data-src';
		_supportClosest = Element.prototype.closest;
		_isRetina = window.devicePixelRatio > 1;
		_viewport = {};
		_viewport.top = 0 - scope.options.offset;
		_viewport.left = 0 - scope.options.offset;


		/* public functions
         ************************************/
		scope.revalidate = function() {
			initialize(scope);
		};
		scope.load = function(elements, force) {
			var opt = this.options;
			if (elements && elements.length === undefined) {
				loadElement(elements, force, opt);
			} else {
				each(elements, function(element) {
					loadElement(element, force, opt);
				});
			}
		};
		scope.destroy = function() {
			var util = scope._util;
			if (scope.options.container) {
				each(scope.options.container, function(object) {
					unbindEvent(object, 'scroll', util.validateT);
				});
			}
			unbindEvent(window, 'scroll', util.validateT);
			unbindEvent(window, 'resize', util.validateT);
			unbindEvent(window, 'resize', util.saveViewportOffsetT);
			util.count = 0;
			util.elements.length = 0;
			util.destroyed = true;
		};

		//throttle, ensures that we don't call the functions too often
		util.validateT = throttle(function() {
			validate(scope);
		}, scope.options.validateDelay, scope);
		util.saveViewportOffsetT = throttle(function() {
			saveViewportOffset(scope.options.offset);
		}, scope.options.saveViewportOffsetDelay, scope);
		saveViewportOffset(scope.options.offset);

		//handle multi-served image src (obsolete)
		each(scope.options.breakpoints, function(object) {
			if (object.width >= window.screen.width) {
				_source = object.src;
				return false;
			}
		});

		// start lazy load
		setTimeout(function() {
			initialize(scope);
		}); // "dom ready" fix

	};


	/* Private helper functions
     ************************************/
	function initialize(self) {
		var util = self._util;
		// First we create an array of elements to lazy load
		util.elements = toArray(self.options);
		util.count = util.elements.length;
		// Then we bind resize and scroll events if not already binded
		if (util.destroyed) {
			util.destroyed = false;
			if (self.options.container) {
				each(self.options.container, function(object) {
					bindEvent(object, 'scroll', util.validateT);
				});
			}
			bindEvent(window, 'resize', util.saveViewportOffsetT);
			bindEvent(window, 'resize', util.validateT);
			bindEvent(window, 'scroll', util.validateT);
		}
		// And finally, we start to lazy load.
		validate(self);
	}

	function validate(self) {
		var util = self._util;
		for (var i = 0; i < util.count; i++) {
			var element = util.elements[i];
			if (elementInView(element, self.options) || hasClass(element, self.options.successClass)) {
				self.load(element);
				util.elements.splice(i, 1);
				util.count--;
				i--;
			}
		}
		if (util.count === 0) {
			self.destroy();
		}
	}

	function elementInView(ele, options) {
		var rect = ele.getBoundingClientRect();

		if(options.container && _supportClosest){
			// Is element inside a container?
			var elementContainer = ele.closest(options.containerClass);
			if(elementContainer){
				var containerRect = elementContainer.getBoundingClientRect();
				// Is container in view?
				if(inView(containerRect, _viewport)){
					var top = containerRect.top - options.offset;
					var right = containerRect.right + options.offset;
					var bottom = containerRect.bottom + options.offset;
					var left = containerRect.left - options.offset;
					var containerRectWithOffset = {
						top: top > _viewport.top ? top : _viewport.top,
						right: right < _viewport.right ? right : _viewport.right,
						bottom: bottom < _viewport.bottom ? bottom : _viewport.bottom,
						left: left > _viewport.left ? left : _viewport.left
					};
					// Is element in view of container?
					return inView(rect, containerRectWithOffset);
				} else {
					return false;
				}
			}
		}
		return inView(rect, _viewport);
	}

	function inView(rect, viewport){
		// Intersection
		return rect.right >= viewport.left &&
			rect.bottom >= viewport.top &&
			rect.left <= viewport.right &&
			rect.top <= viewport.bottom;
	}

	function loadElement(ele, force, options) {
		// if element is visible, not loaded or forced
		if (!hasClass(ele, options.successClass) && (force || options.loadInvisible || (ele.offsetWidth > 0 && ele.offsetHeight > 0))) {
			var dataSrc = getAttr(ele, _source) || getAttr(ele, options.src); // fallback to default 'data-src'
			if (dataSrc) {
				var dataSrcSplitted = dataSrc.split(options.separator);
				var src = dataSrcSplitted[_isRetina && dataSrcSplitted.length > 1 ? 1 : 0];
				var srcset = getAttr(ele, options.srcset);
				var isImage = equal(ele, 'img');
				var parent = ele.parentNode;
				var isPicture = parent && equal(parent, 'picture');
				// Image or background image
				if (isImage || ele.src === undefined) {
					var img = new Image();
					// using EventListener instead of onerror and onload
					// due to bug introduced in chrome v50
					// (https://productforums.google.com/forum/#!topic/chrome/p51Lk7vnP2o)
					var onErrorHandler = function() {
						if (options.error) options.error(ele, "invalid");
						addClass(ele, options.errorClass);
						unbindEvent(img, 'error', onErrorHandler);
						unbindEvent(img, 'load', onLoadHandler);
					};
					var onLoadHandler = function() {
						// Is element an image
						if (isImage) {
							if(!isPicture) {
								handleSources(ele, src, srcset);
							}
							// or background-image
						} else {
							ele.style.backgroundImage = 'url("' + src + '")';
						}
						itemLoaded(ele, options);
						unbindEvent(img, 'load', onLoadHandler);
						unbindEvent(img, 'error', onErrorHandler);
					};

					// Picture element
					if (isPicture) {
						img = ele; // Image tag inside picture element wont get preloaded
						each(parent.getElementsByTagName('source'), function(source) {
							handleSource(source, _attrSrcset, options.srcset);
						});
					}
					bindEvent(img, 'error', onErrorHandler);
					bindEvent(img, 'load', onLoadHandler);
					handleSources(img, src, srcset); // Preload

				} else { // An item with src like iframe, unity games, simpel video etc
					ele.src = src;
					itemLoaded(ele, options);
				}
			} else {
				// video with child source
				if (equal(ele, 'video')) {
					each(ele.getElementsByTagName('source'), function(source) {
						handleSource(source, _attrSrc, options.src);
					});
					ele.load();
					itemLoaded(ele, options);
				} else {
					if (options.error) options.error(ele, "missing");
					addClass(ele, options.errorClass);
				}
			}
		}
	}

	function itemLoaded(ele, options) {
		addClass(ele, options.successClass);
		if (options.success) options.success(ele);
		// cleanup markup, remove data source attributes
		removeAttr(ele, options.src);
		removeAttr(ele, options.srcset);
		each(options.breakpoints, function(object) {
			removeAttr(ele, object.src);
		});
	}

	function handleSource(ele, attr, dataAttr) {
		var dataSrc = getAttr(ele, dataAttr);
		if (dataSrc) {
			setAttr(ele, attr, dataSrc);
			removeAttr(ele, dataAttr);
		}
	}

	function handleSources(ele, src, srcset){
		if(srcset) {
			setAttr(ele, _attrSrcset, srcset); //srcset
		}
		ele.src = src; //src
	}

	function setAttr(ele, attr, value){
		ele.setAttribute(attr, value);
	}

	function getAttr(ele, attr) {
		return ele.getAttribute(attr);
	}

	function removeAttr(ele, attr){
		ele.removeAttribute(attr);
	}

	function equal(ele, str) {
		return ele.nodeName.toLowerCase() === str;
	}

	function hasClass(ele, className) {
		return (' ' + ele.className + ' ').indexOf(' ' + className + ' ') !== -1;
	}

	function addClass(ele, className) {
		if (!hasClass(ele, className)) {
			ele.className += ' ' + className;
		}
	}

	function toArray(options) {
		var array = [];
		var nodelist = (options.root).querySelectorAll(options.selector);
		for (var i = nodelist.length; i--; array.unshift(nodelist[i])) {}
		return array;
	}

	function saveViewportOffset(offset) {
		_viewport.bottom = (window.innerHeight || document.documentElement.clientHeight) + offset;
		_viewport.right = (window.innerWidth || document.documentElement.clientWidth) + offset;
	}

	function bindEvent(ele, type, fn) {
		if (ele.attachEvent) {
			ele.attachEvent && ele.attachEvent('on' + type, fn);
		} else {
			ele.addEventListener(type, fn, { capture: false, passive: true });
		}
	}

	function unbindEvent(ele, type, fn) {
		if (ele.detachEvent) {
			ele.detachEvent && ele.detachEvent('on' + type, fn);
		} else {
			ele.removeEventListener(type, fn, { capture: false, passive: true });
		}
	}

	function each(object, fn) {
		if (object && fn) {
			var l = object.length;
			for (var i = 0; i < l && fn(object[i], i) !== false; i++) {}
		}
	}

	function throttle(fn, minDelay, scope) {
		var lastCall = 0;
		return function() {
			var now = +new Date();
			if (now - lastCall < minDelay) {
				return;
			}
			lastCall = now;
			fn.apply(scope, arguments);
		};
	}
	window.Blazy = Blazy;

}(jQuery));



/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.6.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues



 */

(function($) {

	'use strict';
	var Slick = window.Slick || {};

	Slick = (function() {

		var instanceUid = 0;

		function Slick(element, settings) {

			var _ = this, dataSettings;

			_.defaults = {
				accessibility: true,
				adaptiveHeight: false,
				appendArrows: $(element),
				appendDots: $(element),
				arrows: true,
				asNavFor: null,
				prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
				nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
				autoplay: false,
				autoplaySpeed: 3000,
				centerMode: false,
				centerPadding: '50px',
				cssEase: 'ease',
				customPaging: function(slider, i) {
					return $('<button type="button" data-role="none" role="button" tabindex="0" />').text(i + 1);
				},
				dots: false,
				dotsClass: 'slick-dots',
				draggable: true,
				easing: 'linear',
				edgeFriction: 0.35,
				fade: false,
				focusOnSelect: false,
				infinite: true,
				initialSlide: 0,
				lazyLoad: 'ondemand',
				mobileFirst: false,
				pauseOnHover: true,
				pauseOnFocus: true,
				pauseOnDotsHover: false,
				respondTo: 'window',
				responsive: null,
				rows: 1,
				rtl: false,
				slide: '',
				slidesPerRow: 1,
				slidesToShow: 1,
				slidesToScroll: 1,
				speed: 500,
				swipe: true,
				swipeToSlide: false,
				touchMove: true,
				touchThreshold: 5,
				useCSS: true,
				useTransform: true,
				variableWidth: false,
				vertical: false,
				verticalSwiping: false,
				waitForAnimate: true,
				zIndex: 1000
			};

			_.initials = {
				animating: false,
				dragging: false,
				autoPlayTimer: null,
				currentDirection: 0,
				currentLeft: null,
				currentSlide: 0,
				direction: 1,
				$dots: null,
				listWidth: null,
				listHeight: null,
				loadIndex: 0,
				$nextArrow: null,
				$prevArrow: null,
				slideCount: null,
				slideWidth: null,
				$slideTrack: null,
				$slides: null,
				sliding: false,
				slideOffset: 0,
				swipeLeft: null,
				$list: null,
				touchObject: {},
				transformsEnabled: false,
				unslicked: false
			};

			$.extend(_, _.initials);

			_.activeBreakpoint = null;
			_.animType = null;
			_.animProp = null;
			_.breakpoints = [];
			_.breakpointSettings = [];
			_.cssTransitions = false;
			_.focussed = false;
			_.interrupted = false;
			_.hidden = 'hidden';
			_.paused = true;
			_.positionProp = null;
			_.respondTo = null;
			_.rowCount = 1;
			_.shouldClick = true;
			_.$slider = $(element);
			_.$slidesCache = null;
			_.transformType = null;
			_.transitionType = null;
			_.visibilityChange = 'visibilitychange';
			_.windowWidth = 0;
			_.windowTimer = null;

			dataSettings = $(element).data('slick') || {};

			_.options = $.extend({}, _.defaults, settings, dataSettings);

			_.currentSlide = _.options.initialSlide;

			_.originalSettings = _.options;

			if (typeof document.mozHidden !== 'undefined') {
				_.hidden = 'mozHidden';
				_.visibilityChange = 'mozvisibilitychange';
			} else if (typeof document.webkitHidden !== 'undefined') {
				_.hidden = 'webkitHidden';
				_.visibilityChange = 'webkitvisibilitychange';
			}

			_.autoPlay = $.proxy(_.autoPlay, _);
			_.autoPlayClear = $.proxy(_.autoPlayClear, _);
			_.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
			_.changeSlide = $.proxy(_.changeSlide, _);
			_.clickHandler = $.proxy(_.clickHandler, _);
			_.selectHandler = $.proxy(_.selectHandler, _);
			_.setPosition = $.proxy(_.setPosition, _);
			_.swipeHandler = $.proxy(_.swipeHandler, _);
			_.dragHandler = $.proxy(_.dragHandler, _);
			_.keyHandler = $.proxy(_.keyHandler, _);

			_.instanceUid = instanceUid++;

			// A simple way to check for HTML strings
			// Strict HTML recognition (must start with <)
			// Extracted from jQuery v1.11 source
			_.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;


			_.registerBreakpoints();
			_.init(true);

		}

		return Slick;

	}());

	Slick.prototype.activateADA = function() {
		var _ = this;

		_.$slideTrack.find('.slick-active').attr({
			'aria-hidden': 'false'
		}).find('a, input, button, select').attr({
			'tabindex': '0'
		});

	};

	Slick.prototype.addSlide = Slick.prototype.slickAdd = function(markup, index, addBefore) {

		var _ = this;

		if (typeof(index) === 'boolean') {
			addBefore = index;
			index = null;
		} else if (index < 0 || (index >= _.slideCount)) {
			return false;
		}

		_.unload();

		if (typeof(index) === 'number') {
			if (index === 0 && _.$slides.length === 0) {
				$(markup).appendTo(_.$slideTrack);
			} else if (addBefore) {
				$(markup).insertBefore(_.$slides.eq(index));
			} else {
				$(markup).insertAfter(_.$slides.eq(index));
			}
		} else {
			if (addBefore === true) {
				$(markup).prependTo(_.$slideTrack);
			} else {
				$(markup).appendTo(_.$slideTrack);
			}
		}

		_.$slides = _.$slideTrack.children(this.options.slide);

		_.$slideTrack.children(this.options.slide).detach();

		_.$slideTrack.append(_.$slides);

		_.$slides.each(function(index, element) {
			$(element).attr('data-slick-index', index);
		});

		_.$slidesCache = _.$slides;

		_.reinit();

	};

	Slick.prototype.animateHeight = function() {
		var _ = this;
		if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
			var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
			_.$list.animate({
				height: targetHeight
			}, _.options.speed);
		}
	};

	Slick.prototype.animateSlide = function(targetLeft, callback) {

		var animProps = {},
			_ = this;

		_.animateHeight();

		if (_.options.rtl === true && _.options.vertical === false) {
			targetLeft = -targetLeft;
		}
		if (_.transformsEnabled === false) {
			if (_.options.vertical === false) {
				_.$slideTrack.animate({
					left: targetLeft
				}, _.options.speed, _.options.easing, callback);
			} else {
				_.$slideTrack.animate({
					top: targetLeft
				}, _.options.speed, _.options.easing, callback);
			}

		} else {

			if (_.cssTransitions === false) {
				if (_.options.rtl === true) {
					_.currentLeft = -(_.currentLeft);
				}
				$({
					animStart: _.currentLeft
				}).animate({
					animStart: targetLeft
				}, {
					duration: _.options.speed,
					easing: _.options.easing,
					step: function(now) {
						now = Math.ceil(now);
						if (_.options.vertical === false) {
							animProps[_.animType] = 'translate(' +
								now + 'px, 0px)';
							_.$slideTrack.css(animProps);
						} else {
							animProps[_.animType] = 'translate(0px,' +
								now + 'px)';
							_.$slideTrack.css(animProps);
						}
					},
					complete: function() {
						if (callback) {
							callback.call();
						}
					}
				});

			} else {

				_.applyTransition();
				targetLeft = Math.ceil(targetLeft);

				if (_.options.vertical === false) {
					animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
				} else {
					animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
				}
				_.$slideTrack.css(animProps);

				if (callback) {
					setTimeout(function() {

						_.disableTransition();

						callback.call();
					}, _.options.speed);
				}

			}

		}

	};

	Slick.prototype.getNavTarget = function() {

		var _ = this,
			asNavFor = _.options.asNavFor;

		if ( asNavFor && asNavFor !== null ) {
			asNavFor = $(asNavFor).not(_.$slider);
		}

		return asNavFor;

	};

	Slick.prototype.asNavFor = function(index) {

		var _ = this,
			asNavFor = _.getNavTarget();

		if ( asNavFor !== null && typeof asNavFor === 'object' ) {
			asNavFor.each(function() {
				var target = $(this).slick('getSlick');
				if(!target.unslicked) {
					target.slideHandler(index, true);
				}
			});
		}

	};

	Slick.prototype.applyTransition = function(slide) {

		var _ = this,
			transition = {};

		if (_.options.fade === false) {
			transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
		} else {
			transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
		}

		if (_.options.fade === false) {
			_.$slideTrack.css(transition);
		} else {
			_.$slides.eq(slide).css(transition);
		}

	};

	Slick.prototype.autoPlay = function() {

		var _ = this;

		_.autoPlayClear();

		if ( _.slideCount > _.options.slidesToShow ) {
			_.autoPlayTimer = setInterval( _.autoPlayIterator, _.options.autoplaySpeed );
		}

	};

	Slick.prototype.autoPlayClear = function() {

		var _ = this;

		if (_.autoPlayTimer) {
			clearInterval(_.autoPlayTimer);
		}

	};

	Slick.prototype.autoPlayIterator = function() {

		var _ = this,
			slideTo = _.currentSlide + _.options.slidesToScroll;

		if ( !_.paused && !_.interrupted && !_.focussed ) {

			if ( _.options.infinite === false ) {

				if ( _.direction === 1 && ( _.currentSlide + 1 ) === ( _.slideCount - 1 )) {
					_.direction = 0;
				}

				else if ( _.direction === 0 ) {

					slideTo = _.currentSlide - _.options.slidesToScroll;

					if ( _.currentSlide - 1 === 0 ) {
						_.direction = 1;
					}

				}

			}

			_.slideHandler( slideTo );

		}

	};

	Slick.prototype.buildArrows = function() {

		var _ = this;

		if (_.options.arrows === true ) {

			_.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
			_.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

			if( _.slideCount > _.options.slidesToShow ) {

				_.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
				_.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

				if (_.htmlExpr.test(_.options.prevArrow)) {
					_.$prevArrow.prependTo(_.options.appendArrows);
				}

				if (_.htmlExpr.test(_.options.nextArrow)) {
					_.$nextArrow.appendTo(_.options.appendArrows);
				}

				if (_.options.infinite !== true) {
					_.$prevArrow
						.addClass('slick-disabled')
						.attr('aria-disabled', 'true');
				}

			} else {

				_.$prevArrow.add( _.$nextArrow )

					.addClass('slick-hidden')
					.attr({
						'aria-disabled': 'true',
						'tabindex': '-1'
					});

			}

		}

	};

	Slick.prototype.buildDots = function() {

		var _ = this,
			i, dot;

		if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

			_.$slider.addClass('slick-dotted');

			dot = $('<ul />').addClass(_.options.dotsClass);

			for (i = 0; i <= _.getDotCount(); i += 1) {
				dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
			}

			_.$dots = dot.appendTo(_.options.appendDots);

			_.$dots.find('li').first().addClass('slick-active').attr('aria-hidden', 'false');

		}

	};

	Slick.prototype.buildOut = function() {

		var _ = this;

		_.$slides =
			_.$slider
				.children( _.options.slide + ':not(.slick-cloned)')
				.addClass('slick-slide');

		_.slideCount = _.$slides.length;

		_.$slides.each(function(index, element) {
			$(element)
				.attr('data-slick-index', index)
				.data('originalStyling', $(element).attr('style') || '');
		});

		_.$slider.addClass('slick-slider');

		_.$slideTrack = (_.slideCount === 0) ?
			$('<div class="slick-track"/>').appendTo(_.$slider) :
			_.$slides.wrapAll('<div class="slick-track"/>').parent();

		_.$list = _.$slideTrack.wrap(
			'<div aria-live="polite" class="slick-list"/>').parent();
		_.$slideTrack.css('opacity', 0);

		if (_.options.centerMode === true || _.options.swipeToSlide === true) {
			_.options.slidesToScroll = 1;
		}

		$('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

		_.setupInfinite();

		_.buildArrows();

		_.buildDots();

		_.updateDots();


		_.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

		if (_.options.draggable === true) {
			_.$list.addClass('draggable');
		}

	};

	Slick.prototype.buildRows = function() {

		var _ = this, a, b, c, newSlides, numOfSlides, originalSlides,slidesPerSection;

		newSlides = document.createDocumentFragment();
		originalSlides = _.$slider.children();

		if(_.options.rows > 1) {

			slidesPerSection = _.options.slidesPerRow * _.options.rows;
			numOfSlides = Math.ceil(
				originalSlides.length / slidesPerSection
			);

			for(a = 0; a < numOfSlides; a++){
				var slide = document.createElement('div');
				for(b = 0; b < _.options.rows; b++) {
					var row = document.createElement('div');
					for(c = 0; c < _.options.slidesPerRow; c++) {
						var target = (a * slidesPerSection + ((b * _.options.slidesPerRow) + c));
						if (originalSlides.get(target)) {
							row.appendChild(originalSlides.get(target));
						}
					}
					slide.appendChild(row);
				}
				newSlides.appendChild(slide);
			}

			_.$slider.empty().append(newSlides);
			_.$slider.children().children().children()
				.css({
					'width':(100 / _.options.slidesPerRow) + '%',
					'display': 'inline-block'
				});

		}

	};

	Slick.prototype.checkResponsive = function(initial, forceUpdate) {

		var _ = this,
			breakpoint, targetBreakpoint, respondToWidth, triggerBreakpoint = false;
		var sliderWidth = _.$slider.width();
		var windowWidth = window.innerWidth || $(window).width();

		if (_.respondTo === 'window') {
			respondToWidth = windowWidth;
		} else if (_.respondTo === 'slider') {
			respondToWidth = sliderWidth;
		} else if (_.respondTo === 'min') {
			respondToWidth = Math.min(windowWidth, sliderWidth);
		}

		if ( _.options.responsive &&
			_.options.responsive.length &&
			_.options.responsive !== null) {

			targetBreakpoint = null;

			for (breakpoint in _.breakpoints) {
				if (_.breakpoints.hasOwnProperty(breakpoint)) {
					if (_.originalSettings.mobileFirst === false) {
						if (respondToWidth < _.breakpoints[breakpoint]) {
							targetBreakpoint = _.breakpoints[breakpoint];
						}
					} else {
						if (respondToWidth > _.breakpoints[breakpoint]) {
							targetBreakpoint = _.breakpoints[breakpoint];
						}
					}
				}
			}

			if (targetBreakpoint !== null) {
				if (_.activeBreakpoint !== null) {
					if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
						_.activeBreakpoint =
							targetBreakpoint;
						if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
							_.unslick(targetBreakpoint);
						} else {
							_.options = $.extend({}, _.originalSettings,
								_.breakpointSettings[
									targetBreakpoint]);
							if (initial === true) {
								_.currentSlide = _.options.initialSlide;
							}
							_.refresh(initial);
						}
						triggerBreakpoint = targetBreakpoint;
					}
				} else {
					_.activeBreakpoint = targetBreakpoint;
					if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
						_.unslick(targetBreakpoint);
					} else {
						_.options = $.extend({}, _.originalSettings,
							_.breakpointSettings[
								targetBreakpoint]);
						if (initial === true) {
							_.currentSlide = _.options.initialSlide;
						}
						_.refresh(initial);
					}
					triggerBreakpoint = targetBreakpoint;
				}
			} else {
				if (_.activeBreakpoint !== null) {
					_.activeBreakpoint = null;
					_.options = _.originalSettings;
					if (initial === true) {
						_.currentSlide = _.options.initialSlide;
					}
					_.refresh(initial);
					triggerBreakpoint = targetBreakpoint;
				}
			}

			// only trigger breakpoints during an actual break. not on initialize.
			if( !initial && triggerBreakpoint !== false ) {
				_.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
			}
		}

	};

	Slick.prototype.changeSlide = function(event, dontAnimate) {

		var _ = this,
			$target = $(event.currentTarget),
			indexOffset, slideOffset, unevenOffset;

		// If target is a link, prevent default action.
		if($target.is('a')) {
			event.preventDefault();
		}

		// If target is not the <li> element (ie: a child), find the <li>.
		if(!$target.is('li')) {
			$target = $target.closest('li');
		}

		unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);
		indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

		switch (event.data.message) {

			case 'previous':
				slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
				if (_.slideCount > _.options.slidesToShow) {
					_.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
				}
				break;

			case 'next':
				slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
				if (_.slideCount > _.options.slidesToShow) {
					_.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
				}
				break;

			case 'index':
				var index = event.data.index === 0 ? 0 :
					event.data.index || $target.index() * _.options.slidesToScroll;

				_.slideHandler(_.checkNavigable(index), false, dontAnimate);
				$target.children().trigger('focus');
				break;

			default:
				return;
		}

	};

	Slick.prototype.checkNavigable = function(index) {

		var _ = this,
			navigables, prevNavigable;

		navigables = _.getNavigableIndexes();
		prevNavigable = 0;
		if (index > navigables[navigables.length - 1]) {
			index = navigables[navigables.length - 1];
		} else {
			for (var n in navigables) {
				if (index < navigables[n]) {
					index = prevNavigable;
					break;
				}
				prevNavigable = navigables[n];
			}
		}

		return index;
	};

	Slick.prototype.cleanUpEvents = function() {

		var _ = this;

		if (_.options.dots && _.$dots !== null) {

			$('li', _.$dots)
				.off('click.slick', _.changeSlide)
				.off('mouseenter.slick', $.proxy(_.interrupt, _, true))
				.off('mouseleave.slick', $.proxy(_.interrupt, _, false));

		}

		_.$slider.off('focus.slick blur.slick');

		if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
			_.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
			_.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);
		}

		_.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
		_.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
		_.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
		_.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

		_.$list.off('click.slick', _.clickHandler);

		$(document).off(_.visibilityChange, _.visibility);

		_.cleanUpSlideEvents();

		if (_.options.accessibility === true) {
			_.$list.off('keydown.slick', _.keyHandler);
		}

		if (_.options.focusOnSelect === true) {
			$(_.$slideTrack).children().off('click.slick', _.selectHandler);
		}

		$(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);

		$(window).off('resize.slick.slick-' + _.instanceUid, _.resize);

		$('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);

		$(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);
		$(document).off('ready.slick.slick-' + _.instanceUid, _.setPosition);

	};

	Slick.prototype.cleanUpSlideEvents = function() {

		var _ = this;

		_.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
		_.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));

	};

	Slick.prototype.cleanUpRows = function() {

		var _ = this, originalSlides;

		if(_.options.rows > 1) {
			originalSlides = _.$slides.children().children();
			originalSlides.removeAttr('style');
			_.$slider.empty().append(originalSlides);
		}

	};

	Slick.prototype.clickHandler = function(event) {

		var _ = this;

		if (_.shouldClick === false) {
			event.stopImmediatePropagation();
			event.stopPropagation();
			event.preventDefault();
		}

	};

	Slick.prototype.destroy = function(refresh) {

		var _ = this;

		_.autoPlayClear();

		_.touchObject = {};

		_.cleanUpEvents();

		$('.slick-cloned', _.$slider).detach();

		if (_.$dots) {
			_.$dots.remove();
		}


		if ( _.$prevArrow && _.$prevArrow.length ) {

			_.$prevArrow
				.removeClass('slick-disabled slick-arrow slick-hidden')
				.removeAttr('aria-hidden aria-disabled tabindex')
				.css('display','');

			if ( _.htmlExpr.test( _.options.prevArrow )) {
				_.$prevArrow.remove();
			}
		}

		if ( _.$nextArrow && _.$nextArrow.length ) {

			_.$nextArrow
				.removeClass('slick-disabled slick-arrow slick-hidden')
				.removeAttr('aria-hidden aria-disabled tabindex')
				.css('display','');

			if ( _.htmlExpr.test( _.options.nextArrow )) {
				_.$nextArrow.remove();
			}

		}


		if (_.$slides) {

			_.$slides
				.removeClass('slick-slide slick-active slick-center slick-visible slick-current')
				.removeAttr('aria-hidden')
				.removeAttr('data-slick-index')
				.each(function(){
					$(this).attr('style', $(this).data('originalStyling'));
				});

			_.$slideTrack.children(this.options.slide).detach();

			_.$slideTrack.detach();

			_.$list.detach();

			_.$slider.append(_.$slides);
		}

		_.cleanUpRows();

		_.$slider.removeClass('slick-slider');
		_.$slider.removeClass('slick-initialized');
		_.$slider.removeClass('slick-dotted');

		_.unslicked = true;

		if(!refresh) {
			_.$slider.trigger('destroy', [_]);
		}

	};

	Slick.prototype.disableTransition = function(slide) {

		var _ = this,
			transition = {};

		transition[_.transitionType] = '';

		if (_.options.fade === false) {
			_.$slideTrack.css(transition);
		} else {
			_.$slides.eq(slide).css(transition);
		}

	};

	Slick.prototype.fadeSlide = function(slideIndex, callback) {

		var _ = this;

		if (_.cssTransitions === false) {

			_.$slides.eq(slideIndex).css({
				zIndex: _.options.zIndex
			});

			_.$slides.eq(slideIndex).animate({
				opacity: 1
			}, _.options.speed, _.options.easing, callback);

		} else {

			_.applyTransition(slideIndex);

			_.$slides.eq(slideIndex).css({
				opacity: 1,
				zIndex: _.options.zIndex
			});

			if (callback) {
				setTimeout(function() {

					_.disableTransition(slideIndex);

					callback.call();
				}, _.options.speed);
			}

		}

	};

	Slick.prototype.fadeSlideOut = function(slideIndex) {

		var _ = this;

		if (_.cssTransitions === false) {

			_.$slides.eq(slideIndex).animate({
				opacity: 0,
				zIndex: _.options.zIndex - 2
			}, _.options.speed, _.options.easing);

		} else {

			_.applyTransition(slideIndex);

			_.$slides.eq(slideIndex).css({
				opacity: 0,
				zIndex: _.options.zIndex - 2
			});

		}

	};

	Slick.prototype.filterSlides = Slick.prototype.slickFilter = function(filter) {

		var _ = this;

		if (filter !== null) {

			_.$slidesCache = _.$slides;

			_.unload();

			_.$slideTrack.children(this.options.slide).detach();

			_.$slidesCache.filter(filter).appendTo(_.$slideTrack);

			_.reinit();

		}

	};

	Slick.prototype.focusHandler = function() {

		var _ = this;

		_.$slider
			.off('focus.slick blur.slick')
			.on('focus.slick blur.slick',
				'*:not(.slick-arrow)', function(event) {

					event.stopImmediatePropagation();
					var $sf = $(this);

					setTimeout(function() {

						if( _.options.pauseOnFocus ) {
							_.focussed = $sf.is(':focus');
							_.autoPlay();
						}

					}, 0);

				});
	};

	Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function() {

		var _ = this;
		return _.currentSlide;

	};

	Slick.prototype.getDotCount = function() {

		var _ = this;

		var breakPoint = 0;
		var counter = 0;
		var pagerQty = 0;

		if (_.options.infinite === true) {
			while (breakPoint < _.slideCount) {
				++pagerQty;
				breakPoint = counter + _.options.slidesToScroll;
				counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
			}
		} else if (_.options.centerMode === true) {
			pagerQty = _.slideCount;
		} else if(!_.options.asNavFor) {
			pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
		}else {
			while (breakPoint < _.slideCount) {
				++pagerQty;
				breakPoint = counter + _.options.slidesToScroll;
				counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
			}
		}

		return pagerQty - 1;

	};

	Slick.prototype.getLeft = function(slideIndex) {

		var _ = this,
			targetLeft,
			verticalHeight,
			verticalOffset = 0,
			targetSlide;

		_.slideOffset = 0;
		verticalHeight = _.$slides.first().outerHeight(true);

		if (_.options.infinite === true) {
			if (_.slideCount > _.options.slidesToShow) {
				_.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
				verticalOffset = (verticalHeight * _.options.slidesToShow) * -1;
			}
			if (_.slideCount % _.options.slidesToScroll !== 0) {
				if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
					if (slideIndex > _.slideCount) {
						_.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth) * -1;
						verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight) * -1;
					} else {
						_.slideOffset = ((_.slideCount % _.options.slidesToScroll) * _.slideWidth) * -1;
						verticalOffset = ((_.slideCount % _.options.slidesToScroll) * verticalHeight) * -1;
					}
				}
			}
		} else {
			if (slideIndex + _.options.slidesToShow > _.slideCount) {
				_.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * _.slideWidth;
				verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * verticalHeight;
			}
		}

		if (_.slideCount <= _.options.slidesToShow) {
			_.slideOffset = 0;
			verticalOffset = 0;
		}

		if (_.options.centerMode === true && _.options.infinite === true) {
			_.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
		} else if (_.options.centerMode === true) {
			_.slideOffset = 0;
			_.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
		}

		if (_.options.vertical === false) {
			targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;
		} else {
			targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
		}

		if (_.options.variableWidth === true) {

			if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
				targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
			} else {
				targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
			}

			if (_.options.rtl === true) {
				if (targetSlide[0]) {
					targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
				} else {
					targetLeft =  0;
				}
			} else {
				targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
			}

			if (_.options.centerMode === true) {
				if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
					targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
				} else {
					targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
				}

				if (_.options.rtl === true) {
					if (targetSlide[0]) {
						targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
					} else {
						targetLeft =  0;
					}
				} else {
					targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
				}

				targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
			}
		}

		return targetLeft;

	};

	Slick.prototype.getOption = Slick.prototype.slickGetOption = function(option) {

		var _ = this;

		return _.options[option];

	};

	Slick.prototype.getNavigableIndexes = function() {

		var _ = this,
			breakPoint = 0,
			counter = 0,
			indexes = [],
			max;

		if (_.options.infinite === false) {
			max = _.slideCount;
		} else {
			breakPoint = _.options.slidesToScroll * -1;
			counter = _.options.slidesToScroll * -1;
			max = _.slideCount * 2;
		}

		while (breakPoint < max) {
			indexes.push(breakPoint);
			breakPoint = counter + _.options.slidesToScroll;
			counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
		}

		return indexes;

	};

	Slick.prototype.getSlick = function() {

		return this;

	};

	Slick.prototype.getSlideCount = function() {

		var _ = this,
			slidesTraversed, swipedSlide, centerOffset;

		centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;

		if (_.options.swipeToSlide === true) {
			_.$slideTrack.find('.slick-slide').each(function(index, slide) {
				if (slide.offsetLeft - centerOffset + ($(slide).outerWidth() / 2) > (_.swipeLeft * -1)) {
					swipedSlide = slide;
					return false;
				}
			});

			slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;

			return slidesTraversed;

		} else {
			return _.options.slidesToScroll;
		}

	};

	Slick.prototype.goTo = Slick.prototype.slickGoTo = function(slide, dontAnimate) {

		var _ = this;

		_.changeSlide({
			data: {
				message: 'index',
				index: parseInt(slide)
			}
		}, dontAnimate);

	};

	Slick.prototype.init = function(creation) {

		var _ = this;

		if (!$(_.$slider).hasClass('slick-initialized')) {

			$(_.$slider).addClass('slick-initialized');

			_.buildRows();
			_.buildOut();
			_.setProps();
			_.startLoad();
			_.loadSlider();
			_.initializeEvents();
			_.updateArrows();
			_.updateDots();
			_.checkResponsive(true);
			_.focusHandler();

		}

		if (creation) {
			_.$slider.trigger('init', [_]);
		}

		if (_.options.accessibility === true) {
			_.initADA();
		}

		if ( _.options.autoplay ) {

			_.paused = false;
			_.autoPlay();

		}

	};

	Slick.prototype.initADA = function() {
		var _ = this;
		_.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
			'aria-hidden': 'true',
			'tabindex': '-1'
		}).find('a, input, button, select').attr({
			'tabindex': '-1'
		});

		_.$slideTrack.attr('role', 'listbox');

		_.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function(i) {
			$(this).attr({
				'role': 'option',
				'aria-describedby': 'slick-slide' + _.instanceUid + i + ''
			});
		});

		if (_.$dots !== null) {
			_.$dots.attr('role', 'tablist').find('li').each(function(i) {
				$(this).attr({
					'role': 'presentation',
					'aria-selected': 'false',
					'aria-controls': 'navigation' + _.instanceUid + i + '',
					'id': 'slick-slide' + _.instanceUid + i + ''
				});
			})
				.first().attr('aria-selected', 'true').end()
				.find('button').attr('role', 'button').end()
				.closest('div').attr('role', 'toolbar');
		}
		_.activateADA();

	};

	Slick.prototype.initArrowEvents = function() {

		var _ = this;

		if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
			_.$prevArrow
				.off('click.slick')
				.on('click.slick', {
					message: 'previous'
				}, _.changeSlide);
			_.$nextArrow
				.off('click.slick')
				.on('click.slick', {
					message: 'next'
				}, _.changeSlide);
		}

	};

	Slick.prototype.initDotEvents = function() {

		var _ = this;

		if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
			$('li', _.$dots).on('click.slick', {
				message: 'index'
			}, _.changeSlide);
		}

		if ( _.options.dots === true && _.options.pauseOnDotsHover === true ) {

			$('li', _.$dots)
				.on('mouseenter.slick', $.proxy(_.interrupt, _, true))
				.on('mouseleave.slick', $.proxy(_.interrupt, _, false));

		}

	};

	Slick.prototype.initSlideEvents = function() {

		var _ = this;

		if ( _.options.pauseOnHover ) {

			_.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
			_.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));

		}

	};

	Slick.prototype.initializeEvents = function() {

		var _ = this;

		_.initArrowEvents();

		_.initDotEvents();
		_.initSlideEvents();

		_.$list.on('touchstart.slick mousedown.slick', {
			action: 'start'
		}, _.swipeHandler);
		_.$list.on('touchmove.slick mousemove.slick', {
			action: 'move'
		}, _.swipeHandler);
		_.$list.on('touchend.slick mouseup.slick', {
			action: 'end'
		}, _.swipeHandler);
		_.$list.on('touchcancel.slick mouseleave.slick', {
			action: 'end'
		}, _.swipeHandler);

		_.$list.on('click.slick', _.clickHandler);

		$(document).on(_.visibilityChange, $.proxy(_.visibility, _));

		if (_.options.accessibility === true) {
			_.$list.on('keydown.slick', _.keyHandler);
		}

		if (_.options.focusOnSelect === true) {
			$(_.$slideTrack).children().on('click.slick', _.selectHandler);
		}

		$(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));

		$(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));

		$('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

		$(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
		$(document).on('ready.slick.slick-' + _.instanceUid, _.setPosition);

	};

	Slick.prototype.initUI = function() {

		var _ = this;

		if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

			_.$prevArrow.show();
			_.$nextArrow.show();

		}

		if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

			_.$dots.show();

		}

	};

	Slick.prototype.keyHandler = function(event) {

		var _ = this;
		//Dont slide if the cursor is inside the form fields and arrow keys are pressed
		if(!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
			if (event.keyCode === 37 && _.options.accessibility === true) {
				_.changeSlide({
					data: {
						message: _.options.rtl === true ? 'next' :  'previous'
					}
				});
			} else if (event.keyCode === 39 && _.options.accessibility === true) {
				_.changeSlide({
					data: {
						message: _.options.rtl === true ? 'previous' : 'next'
					}
				});
			}
		}

	};

	Slick.prototype.lazyLoad = function() {

		var _ = this,
			loadRange, cloneRange, rangeStart, rangeEnd;

		function loadImages(imagesScope) {

			$('img[data-lazy]', imagesScope).each(function() {

				var image = $(this),
					imageSource = $(this).attr('data-lazy'),
					imageToLoad = document.createElement('img');

				imageToLoad.onload = function() {

					image
						.animate({ opacity: 0 }, 100, function() {
							image
								.attr('src', imageSource)
								.animate({ opacity: 1 }, 200, function() {
									image
										.removeAttr('data-lazy')
										.removeClass('slick-loading');
								});
							_.$slider.trigger('lazyLoaded', [_, image, imageSource]);
						});

				};

				imageToLoad.onerror = function() {

					image
						.removeAttr( 'data-lazy' )
						.removeClass( 'slick-loading' )
						.addClass( 'slick-lazyload-error' );

					_.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

				};

				imageToLoad.src = imageSource;

			});

		}

		if (_.options.centerMode === true) {
			if (_.options.infinite === true) {
				rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
				rangeEnd = rangeStart + _.options.slidesToShow + 2;
			} else {
				rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
				rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
			}
		} else {
			rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
			rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
			if (_.options.fade === true) {
				if (rangeStart > 0) rangeStart--;
				if (rangeEnd <= _.slideCount) rangeEnd++;
			}
		}

		loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);
		loadImages(loadRange);

		if (_.slideCount <= _.options.slidesToShow) {
			cloneRange = _.$slider.find('.slick-slide');
			loadImages(cloneRange);
		} else
		if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
			cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
			loadImages(cloneRange);
		} else if (_.currentSlide === 0) {
			cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
			loadImages(cloneRange);
		}

	};

	Slick.prototype.loadSlider = function() {

		var _ = this;

		_.setPosition();

		_.$slideTrack.css({
			opacity: 1
		});

		_.$slider.removeClass('slick-loading');

		_.initUI();

		if (_.options.lazyLoad === 'progressive') {
			_.progressiveLazyLoad();
		}

	};

	Slick.prototype.next = Slick.prototype.slickNext = function() {

		var _ = this;

		_.changeSlide({
			data: {
				message: 'next'
			}
		});

	};

	Slick.prototype.orientationChange = function() {

		var _ = this;

		_.checkResponsive();
		_.setPosition();

	};

	Slick.prototype.pause = Slick.prototype.slickPause = function() {

		var _ = this;

		_.autoPlayClear();
		_.paused = true;

	};

	Slick.prototype.play = Slick.prototype.slickPlay = function() {

		var _ = this;

		_.autoPlay();
		_.options.autoplay = true;
		_.paused = false;
		_.focussed = false;
		_.interrupted = false;

	};

	Slick.prototype.postSlide = function(index) {

		var _ = this;

		if( !_.unslicked ) {

			_.$slider.trigger('afterChange', [_, index]);

			_.animating = false;

			_.setPosition();

			_.swipeLeft = null;

			if ( _.options.autoplay ) {
				_.autoPlay();
			}

			if (_.options.accessibility === true) {
				_.initADA();
			}

		}

	};

	Slick.prototype.prev = Slick.prototype.slickPrev = function() {

		var _ = this;

		_.changeSlide({
			data: {
				message: 'previous'
			}
		});

	};

	Slick.prototype.preventDefault = function(event) {

		event.preventDefault();

	};

	Slick.prototype.progressiveLazyLoad = function( tryCount ) {

		tryCount = tryCount || 1;

		var _ = this,
			$imgsToLoad = $( 'img[data-lazy]', _.$slider ),
			image,
			imageSource,
			imageToLoad;

		if ( $imgsToLoad.length ) {

			image = $imgsToLoad.first();
			imageSource = image.attr('data-lazy');
			imageToLoad = document.createElement('img');

			imageToLoad.onload = function() {

				image
					.attr( 'src', imageSource )
					.removeAttr('data-lazy')
					.removeClass('slick-loading');

				if ( _.options.adaptiveHeight === true ) {
					_.setPosition();
				}

				_.$slider.trigger('lazyLoaded', [ _, image, imageSource ]);
				_.progressiveLazyLoad();

			};

			imageToLoad.onerror = function() {

				if ( tryCount < 3 ) {

					/**
					 * try to load the image 3 times,
					 * leave a slight delay so we don't get
					 * servers blocking the request.
					 */
					setTimeout( function() {
						_.progressiveLazyLoad( tryCount + 1 );
					}, 500 );

				} else {

					image
						.removeAttr( 'data-lazy' )
						.removeClass( 'slick-loading' )
						.addClass( 'slick-lazyload-error' );

					_.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

					_.progressiveLazyLoad();

				}

			};

			imageToLoad.src = imageSource;

		} else {

			_.$slider.trigger('allImagesLoaded', [ _ ]);

		}

	};

	Slick.prototype.refresh = function( initializing ) {

		var _ = this, currentSlide, lastVisibleIndex;

		lastVisibleIndex = _.slideCount - _.options.slidesToShow;

		// in non-infinite sliders, we don't want to go past the
		// last visible index.
		if( !_.options.infinite && ( _.currentSlide > lastVisibleIndex )) {
			_.currentSlide = lastVisibleIndex;
		}

		// if less slides than to show, go to start.
		if ( _.slideCount <= _.options.slidesToShow ) {
			_.currentSlide = 0;

		}

		currentSlide = _.currentSlide;

		_.destroy(true);

		$.extend(_, _.initials, { currentSlide: currentSlide });

		_.init();

		if( !initializing ) {

			_.changeSlide({
				data: {
					message: 'index',
					index: currentSlide
				}
			}, false);

		}

	};

	Slick.prototype.registerBreakpoints = function() {

		var _ = this, breakpoint, currentBreakpoint, l,
			responsiveSettings = _.options.responsive || null;

		if ( $.type(responsiveSettings) === 'array' && responsiveSettings.length ) {

			_.respondTo = _.options.respondTo || 'window';

			for ( breakpoint in responsiveSettings ) {

				l = _.breakpoints.length-1;
				currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

				if (responsiveSettings.hasOwnProperty(breakpoint)) {

					// loop through the breakpoints and cut out any existing
					// ones with the same breakpoint number, we don't want dupes.
					while( l >= 0 ) {
						if( _.breakpoints[l] && _.breakpoints[l] === currentBreakpoint ) {
							_.breakpoints.splice(l,1);
						}
						l--;
					}

					_.breakpoints.push(currentBreakpoint);
					_.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;

				}

			}

			_.breakpoints.sort(function(a, b) {
				return ( _.options.mobileFirst ) ? a-b : b-a;
			});

		}

	};

	Slick.prototype.reinit = function() {

		var _ = this;

		_.$slides =
			_.$slideTrack
				.children(_.options.slide)
				.addClass('slick-slide');

		_.slideCount = _.$slides.length;

		if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
			_.currentSlide = _.currentSlide - _.options.slidesToScroll;
		}

		if (_.slideCount <= _.options.slidesToShow) {
			_.currentSlide = 0;
		}

		_.registerBreakpoints();

		_.setProps();
		_.setupInfinite();
		_.buildArrows();
		_.updateArrows();
		_.initArrowEvents();
		_.buildDots();
		_.updateDots();
		_.initDotEvents();
		_.cleanUpSlideEvents();
		_.initSlideEvents();

		_.checkResponsive(false, true);

		if (_.options.focusOnSelect === true) {
			$(_.$slideTrack).children().on('click.slick', _.selectHandler);
		}

		_.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

		_.setPosition();
		_.focusHandler();

		_.paused = !_.options.autoplay;
		_.autoPlay();

		_.$slider.trigger('reInit', [_]);

	};

	Slick.prototype.resize = function() {

		var _ = this;

		if ($(window).width() !== _.windowWidth) {
			clearTimeout(_.windowDelay);
			_.windowDelay = window.setTimeout(function() {
				_.windowWidth = $(window).width();
				_.checkResponsive();
				if( !_.unslicked ) { _.setPosition(); }
			}, 50);
		}
	};

	Slick.prototype.removeSlide = Slick.prototype.slickRemove = function(index, removeBefore, removeAll) {

		var _ = this;

		if (typeof(index) === 'boolean') {
			removeBefore = index;
			index = removeBefore === true ? 0 : _.slideCount - 1;
		} else {
			index = removeBefore === true ? --index : index;
		}

		if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
			return false;
		}

		_.unload();

		if (removeAll === true) {
			_.$slideTrack.children().remove();
		} else {
			_.$slideTrack.children(this.options.slide).eq(index).remove();
		}

		_.$slides = _.$slideTrack.children(this.options.slide);

		_.$slideTrack.children(this.options.slide).detach();

		_.$slideTrack.append(_.$slides);

		_.$slidesCache = _.$slides;

		_.reinit();

	};

	Slick.prototype.setCSS = function(position) {

		var _ = this,
			positionProps = {},
			x, y;

		if (_.options.rtl === true) {
			position = -position;
		}
		x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
		y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

		positionProps[_.positionProp] = position;

		if (_.transformsEnabled === false) {
			_.$slideTrack.css(positionProps);
		} else {
			positionProps = {};
			if (_.cssTransitions === false) {
				positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
				_.$slideTrack.css(positionProps);
			} else {
				positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
				_.$slideTrack.css(positionProps);
			}
		}

	};

	Slick.prototype.setDimensions = function() {

		var _ = this;

		if (_.options.vertical === false) {
			if (_.options.centerMode === true) {
				_.$list.css({
					padding: ('0px ' + _.options.centerPadding)
				});
			}
		} else {
			_.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
			if (_.options.centerMode === true) {
				_.$list.css({
					padding: (_.options.centerPadding + ' 0px')
				});
			}
		}

		_.listWidth = _.$list.width();
		_.listHeight = _.$list.height();


		if (_.options.vertical === false && _.options.variableWidth === false) {
			_.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
			_.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));

		} else if (_.options.variableWidth === true) {
			_.$slideTrack.width(5000 * _.slideCount);
		} else {
			_.slideWidth = Math.ceil(_.listWidth);
			_.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
		}

		var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
		if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);

	};

	Slick.prototype.setFade = function() {

		var _ = this,
			targetLeft;

		_.$slides.each(function(index, element) {
			targetLeft = (_.slideWidth * index) * -1;
			if (_.options.rtl === true) {
				$(element).css({
					position: 'relative',
					right: targetLeft,
					top: 0,
					zIndex: _.options.zIndex - 2,
					opacity: 0
				});
			} else {
				$(element).css({
					position: 'relative',
					left: targetLeft,
					top: 0,
					zIndex: _.options.zIndex - 2,
					opacity: 0
				});
			}
		});

		_.$slides.eq(_.currentSlide).css({
			zIndex: _.options.zIndex - 1,
			opacity: 1
		});

	};

	Slick.prototype.setHeight = function() {

		var _ = this;

		if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
			var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
			_.$list.css('height', targetHeight);
		}

	};

	Slick.prototype.setOption =
		Slick.prototype.slickSetOption = function() {

			/**
			 * accepts arguments in format of:
			 *
			 *  - for changing a single option's value:
			 *     .slick("setOption", option, value, refresh )
			 *
			 *  - for changing a set of responsive options:
			 *     .slick("setOption", 'responsive', [{}, ...], refresh )
			 *
			 *  - for updating multiple values at once (not responsive)
			 *     .slick("setOption", { 'option': value, ... }, refresh )
			 */

			var _ = this, l, item, option, value, refresh = false, type;

			if( $.type( arguments[0] ) === 'object' ) {

				option =  arguments[0];
				refresh = arguments[1];
				type = 'multiple';

			} else if ( $.type( arguments[0] ) === 'string' ) {

				option =  arguments[0];
				value = arguments[1];
				refresh = arguments[2];

				if ( arguments[0] === 'responsive' && $.type( arguments[1] ) === 'array' ) {

					type = 'responsive';

				} else if ( typeof arguments[1] !== 'undefined' ) {

					type = 'single';

				}

			}

			if ( type === 'single' ) {

				_.options[option] = value;


			} else if ( type === 'multiple' ) {

				$.each( option , function( opt, val ) {

					_.options[opt] = val;

				});


			} else if ( type === 'responsive' ) {

				for ( item in value ) {

					if( $.type( _.options.responsive ) !== 'array' ) {

						_.options.responsive = [ value[item] ];

					} else {

						l = _.options.responsive.length-1;

						// loop through the responsive object and splice out duplicates.
						while( l >= 0 ) {

							if( _.options.responsive[l].breakpoint === value[item].breakpoint ) {

								_.options.responsive.splice(l,1);

							}

							l--;

						}

						_.options.responsive.push( value[item] );

					}

				}

			}

			if ( refresh ) {

				_.unload();
				_.reinit();

			}

		};

	Slick.prototype.setPosition = function() {

		var _ = this;

		_.setDimensions();

		_.setHeight();

		if (_.options.fade === false) {
			_.setCSS(_.getLeft(_.currentSlide));
		} else {
			_.setFade();
		}

		_.$slider.trigger('setPosition', [_]);

	};

	Slick.prototype.setProps = function() {

		var _ = this,
			bodyStyle = document.body.style;

		_.positionProp = _.options.vertical === true ? 'top' : 'left';

		if (_.positionProp === 'top') {
			_.$slider.addClass('slick-vertical');
		} else {
			_.$slider.removeClass('slick-vertical');
		}

		if (bodyStyle.WebkitTransition !== undefined ||
			bodyStyle.MozTransition !== undefined ||
			bodyStyle.msTransition !== undefined) {
			if (_.options.useCSS === true) {
				_.cssTransitions = true;
			}
		}

		if ( _.options.fade ) {
			if ( typeof _.options.zIndex === 'number' ) {
				if( _.options.zIndex < 3 ) {
					_.options.zIndex = 3;
				}
			} else {
				_.options.zIndex = _.defaults.zIndex;
			}
		}

		if (bodyStyle.OTransform !== undefined) {
			_.animType = 'OTransform';
			_.transformType = '-o-transform';
			_.transitionType = 'OTransition';
			if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
		}
		if (bodyStyle.MozTransform !== undefined) {
			_.animType = 'MozTransform';
			_.transformType = '-moz-transform';
			_.transitionType = 'MozTransition';
			if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
		}
		if (bodyStyle.webkitTransform !== undefined) {
			_.animType = 'webkitTransform';
			_.transformType = '-webkit-transform';
			_.transitionType = 'webkitTransition';
			if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
		}
		if (bodyStyle.msTransform !== undefined) {
			_.animType = 'msTransform';
			_.transformType = '-ms-transform';
			_.transitionType = 'msTransition';
			if (bodyStyle.msTransform === undefined) _.animType = false;
		}
		if (bodyStyle.transform !== undefined && _.animType !== false) {
			_.animType = 'transform';
			_.transformType = 'transform';
			_.transitionType = 'transition';
		}
		_.transformsEnabled = _.options.useTransform && (_.animType !== null && _.animType !== false);
	};


	Slick.prototype.setSlideClasses = function(index) {

		var _ = this,
			centerOffset, allSlides, indexOffset, remainder;

		allSlides = _.$slider
			.find('.slick-slide')
			.removeClass('slick-active slick-center slick-current')
			.attr('aria-hidden', 'true');

		_.$slides
			.eq(index)
			.addClass('slick-current');

		if (_.options.centerMode === true) {

			centerOffset = Math.floor(_.options.slidesToShow / 2);

			if (_.options.infinite === true) {

				if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {

					_.$slides
						.slice(index - centerOffset, index + centerOffset + 1)
						.addClass('slick-active')
						.attr('aria-hidden', 'false');

				} else {

					indexOffset = _.options.slidesToShow + index;
					allSlides
						.slice(indexOffset - centerOffset + 1, indexOffset + centerOffset + 2)
						.addClass('slick-active')
						.attr('aria-hidden', 'false');

				}

				if (index === 0) {

					allSlides
						.eq(allSlides.length - 1 - _.options.slidesToShow)
						.addClass('slick-center');

				} else if (index === _.slideCount - 1) {

					allSlides
						.eq(_.options.slidesToShow)
						.addClass('slick-center');

				}

			}

			_.$slides
				.eq(index)
				.addClass('slick-center');

		} else {

			if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {

				_.$slides
					.slice(index, index + _.options.slidesToShow)
					.addClass('slick-active')
					.attr('aria-hidden', 'false');

			} else if (allSlides.length <= _.options.slidesToShow) {

				allSlides
					.addClass('slick-active')
					.attr('aria-hidden', 'false');

			} else {

				remainder = _.slideCount % _.options.slidesToShow;
				indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

				if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {

					allSlides
						.slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)
						.addClass('slick-active')
						.attr('aria-hidden', 'false');

				} else {

					allSlides
						.slice(indexOffset, indexOffset + _.options.slidesToShow)
						.addClass('slick-active')
						.attr('aria-hidden', 'false');

				}

			}

		}

		if (_.options.lazyLoad === 'ondemand') {
			_.lazyLoad();
		}

	};

	Slick.prototype.setupInfinite = function() {

		var _ = this,
			i, slideIndex, infiniteCount;

		if (_.options.fade === true) {
			_.options.centerMode = false;
		}

		if (_.options.infinite === true && _.options.fade === false) {

			slideIndex = null;

			if (_.slideCount > _.options.slidesToShow) {

				if (_.options.centerMode === true) {
					infiniteCount = _.options.slidesToShow + 1;
				} else {
					infiniteCount = _.options.slidesToShow;
				}

				for (i = _.slideCount; i > (_.slideCount -
					infiniteCount); i -= 1) {
					slideIndex = i - 1;
					$(_.$slides[slideIndex]).clone(true).attr('id', '')
						.attr('data-slick-index', slideIndex - _.slideCount)
						.prependTo(_.$slideTrack).addClass('slick-cloned');
				}
				for (i = 0; i < infiniteCount; i += 1) {
					slideIndex = i;
					$(_.$slides[slideIndex]).clone(true).attr('id', '')
						.attr('data-slick-index', slideIndex + _.slideCount)
						.appendTo(_.$slideTrack).addClass('slick-cloned');
				}
				_.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
					$(this).attr('id', '');
				});

			}

		}

	};

	Slick.prototype.interrupt = function( toggle ) {

		var _ = this;

		if( !toggle ) {
			_.autoPlay();
		}
		_.interrupted = toggle;

	};

	Slick.prototype.selectHandler = function(event) {

		var _ = this;

		var targetElement =
			$(event.target).is('.slick-slide') ?
				$(event.target) :
				$(event.target).parents('.slick-slide');

		var index = parseInt(targetElement.attr('data-slick-index'));

		if (!index) index = 0;

		if (_.slideCount <= _.options.slidesToShow) {

			_.setSlideClasses(index);
			_.asNavFor(index);
			return;

		}

		_.slideHandler(index);

	};

	Slick.prototype.slideHandler = function(index, sync, dontAnimate) {

		var targetSlide, animSlide, oldSlide, slideLeft, targetLeft = null,
			_ = this, navTarget;

		sync = sync || false;

		if (_.animating === true && _.options.waitForAnimate === true) {
			return;
		}

		if (_.options.fade === true && _.currentSlide === index) {
			return;
		}

		if (_.slideCount <= _.options.slidesToShow) {
			return;
		}

		if (sync === false) {
			_.asNavFor(index);
		}

		targetSlide = index;
		targetLeft = _.getLeft(targetSlide);
		slideLeft = _.getLeft(_.currentSlide);

		_.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

		if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
			if (_.options.fade === false) {
				targetSlide = _.currentSlide;
				if (dontAnimate !== true) {
					_.animateSlide(slideLeft, function() {
						_.postSlide(targetSlide);
					});
				} else {
					_.postSlide(targetSlide);
				}
			}
			return;
		} else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {
			if (_.options.fade === false) {
				targetSlide = _.currentSlide;
				if (dontAnimate !== true) {
					_.animateSlide(slideLeft, function() {
						_.postSlide(targetSlide);
					});
				} else {
					_.postSlide(targetSlide);
				}
			}
			return;
		}

		if ( _.options.autoplay ) {
			clearInterval(_.autoPlayTimer);
		}

		if (targetSlide < 0) {
			if (_.slideCount % _.options.slidesToScroll !== 0) {
				animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
			} else {
				animSlide = _.slideCount + targetSlide;
			}
		} else if (targetSlide >= _.slideCount) {
			if (_.slideCount % _.options.slidesToScroll !== 0) {
				animSlide = 0;
			} else {
				animSlide = targetSlide - _.slideCount;
			}
		} else {
			animSlide = targetSlide;
		}

		_.animating = true;

		_.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

		oldSlide = _.currentSlide;
		_.currentSlide = animSlide;

		_.setSlideClasses(_.currentSlide);

		if ( _.options.asNavFor ) {

			navTarget = _.getNavTarget();
			navTarget = navTarget.slick('getSlick');

			if ( navTarget.slideCount <= navTarget.options.slidesToShow ) {
				navTarget.setSlideClasses(_.currentSlide);
			}

		}

		_.updateDots();
		_.updateArrows();

		if (_.options.fade === true) {
			if (dontAnimate !== true) {

				_.fadeSlideOut(oldSlide);

				_.fadeSlide(animSlide, function() {
					_.postSlide(animSlide);
				});

			} else {
				_.postSlide(animSlide);
			}
			_.animateHeight();
			return;
		}

		if (dontAnimate !== true) {
			_.animateSlide(targetLeft, function() {
				_.postSlide(animSlide);
			});
		} else {
			_.postSlide(animSlide);
		}

	};

	Slick.prototype.startLoad = function() {

		var _ = this;

		if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

			_.$prevArrow.hide();
			_.$nextArrow.hide();

		}

		if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

			_.$dots.hide();

		}

		_.$slider.addClass('slick-loading');

	};

	Slick.prototype.swipeDirection = function() {

		var xDist, yDist, r, swipeAngle, _ = this;

		xDist = _.touchObject.startX - _.touchObject.curX;
		yDist = _.touchObject.startY - _.touchObject.curY;
		r = Math.atan2(yDist, xDist);

		swipeAngle = Math.round(r * 180 / Math.PI);
		if (swipeAngle < 0) {
			swipeAngle = 360 - Math.abs(swipeAngle);
		}

		if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
			return (_.options.rtl === false ? 'left' : 'right');
		}
		if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
			return (_.options.rtl === false ? 'left' : 'right');
		}
		if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
			return (_.options.rtl === false ? 'right' : 'left');
		}
		if (_.options.verticalSwiping === true) {
			if ((swipeAngle >= 35) && (swipeAngle <= 135)) {
				return 'down';
			} else {
				return 'up';
			}
		}

		return 'vertical';

	};

	Slick.prototype.swipeEnd = function(event) {

		var _ = this,
			slideCount,
			direction;

		_.dragging = false;
		_.interrupted = false;
		_.shouldClick = ( _.touchObject.swipeLength > 10 ) ? false : true;

		if ( _.touchObject.curX === undefined ) {
			return false;
		}

		if ( _.touchObject.edgeHit === true ) {
			_.$slider.trigger('edge', [_, _.swipeDirection() ]);
		}

		if ( _.touchObject.swipeLength >= _.touchObject.minSwipe ) {

			direction = _.swipeDirection();

			switch ( direction ) {

				case 'left':
				case 'down':

					slideCount =
						_.options.swipeToSlide ?
							_.checkNavigable( _.currentSlide + _.getSlideCount() ) :
							_.currentSlide + _.getSlideCount();

					_.currentDirection = 0;

					break;

				case 'right':
				case 'up':

					slideCount =
						_.options.swipeToSlide ?
							_.checkNavigable( _.currentSlide - _.getSlideCount() ) :
							_.currentSlide - _.getSlideCount();

					_.currentDirection = 1;

					break;

				default:


			}

			if( direction != 'vertical' ) {

				_.slideHandler( slideCount );
				_.touchObject = {};
				_.$slider.trigger('swipe', [_, direction ]);

			}

		} else {

			if ( _.touchObject.startX !== _.touchObject.curX ) {

				_.slideHandler( _.currentSlide );
				_.touchObject = {};

			}

		}

	};

	Slick.prototype.swipeHandler = function(event) {

		var _ = this;

		if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {
			return;
		} else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
			return;
		}

		_.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
			event.originalEvent.touches.length : 1;

		_.touchObject.minSwipe = _.listWidth / _.options
			.touchThreshold;

		if (_.options.verticalSwiping === true) {
			_.touchObject.minSwipe = _.listHeight / _.options
				.touchThreshold;
		}

		switch (event.data.action) {

			case 'start':
				_.swipeStart(event);
				break;

			case 'move':
				_.swipeMove(event);
				break;

			case 'end':
				_.swipeEnd(event);
				break;

		}

	};

	Slick.prototype.swipeMove = function(event) {

		var _ = this,
			edgeWasHit = false,
			curLeft, swipeDirection, swipeLength, positionOffset, touches;

		touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

		if (!_.dragging || touches && touches.length !== 1) {
			return false;
		}

		curLeft = _.getLeft(_.currentSlide);

		_.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
		_.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

		_.touchObject.swipeLength = Math.round(Math.sqrt(
			Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));

		if (_.options.verticalSwiping === true) {
			_.touchObject.swipeLength = Math.round(Math.sqrt(
				Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));
		}

		swipeDirection = _.swipeDirection();

		if (swipeDirection === 'vertical') {
			return;
		}

		if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
			event.preventDefault();
		}

		positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
		if (_.options.verticalSwiping === true) {
			positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
		}


		swipeLength = _.touchObject.swipeLength;

		_.touchObject.edgeHit = false;

		if (_.options.infinite === false) {
			if ((_.currentSlide === 0 && swipeDirection === 'right') || (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {
				swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
				_.touchObject.edgeHit = true;
			}
		}

		if (_.options.vertical === false) {
			_.swipeLeft = curLeft + swipeLength * positionOffset;
		} else {
			_.swipeLeft = curLeft + (swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;
		}
		if (_.options.verticalSwiping === true) {
			_.swipeLeft = curLeft + swipeLength * positionOffset;
		}

		if (_.options.fade === true || _.options.touchMove === false) {
			return false;
		}

		if (_.animating === true) {
			_.swipeLeft = null;
			return false;
		}

		_.setCSS(_.swipeLeft);

	};

	Slick.prototype.swipeStart = function(event) {

		var _ = this,
			touches;

		_.interrupted = true;

		if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
			_.touchObject = {};
			return false;
		}

		if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
			touches = event.originalEvent.touches[0];
		}

		_.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
		_.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

		_.dragging = true;

	};

	Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function() {

		var _ = this;

		if (_.$slidesCache !== null) {

			_.unload();

			_.$slideTrack.children(this.options.slide).detach();

			_.$slidesCache.appendTo(_.$slideTrack);

			_.reinit();

		}

	};

	Slick.prototype.unload = function() {

		var _ = this;

		$('.slick-cloned', _.$slider).remove();

		if (_.$dots) {
			_.$dots.remove();
		}

		if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
			_.$prevArrow.remove();
		}

		if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
			_.$nextArrow.remove();
		}

		_.$slides
			.removeClass('slick-slide slick-active slick-visible slick-current')
			.attr('aria-hidden', 'true')
			.css('width', '');

	};

	Slick.prototype.unslick = function(fromBreakpoint) {

		var _ = this;
		_.$slider.trigger('unslick', [_, fromBreakpoint]);
		_.destroy();

	};

	Slick.prototype.updateArrows = function() {

		var _ = this,
			centerOffset;

		centerOffset = Math.floor(_.options.slidesToShow / 2);

		if ( _.options.arrows === true &&
			_.slideCount > _.options.slidesToShow &&
			!_.options.infinite ) {

			_.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
			_.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

			if (_.currentSlide === 0) {

				_.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
				_.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

			} else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {

				_.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
				_.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

			} else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {

				_.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
				_.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

			}

		}

	};

	Slick.prototype.updateDots = function() {

		var _ = this;

		if (_.$dots !== null) {

			_.$dots
				.find('li')
				.removeClass('slick-active')
				.attr('aria-hidden', 'true');

			_.$dots
				.find('li')
				.eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
				.addClass('slick-active')
				.attr('aria-hidden', 'false');

		}

	};

	Slick.prototype.visibility = function() {

		var _ = this;

		if ( _.options.autoplay ) {

			if ( document[_.hidden] ) {

				_.interrupted = true;

			} else {

				_.interrupted = false;

			}

		}

	};

	$.fn.slick = function() {
		var _ = this,
			opt = arguments[0],
			args = Array.prototype.slice.call(arguments, 1),
			l = _.length,
			i,
			ret;
		for (i = 0; i < l; i++) {
			if (typeof opt == 'object' || typeof opt == 'undefined')
				_[i].slick = new Slick(_[i], opt);
			else
				ret = _[i].slick[opt].apply(_[i].slick, args);
			if (typeof ret != 'undefined') return ret;
		}
		return _;
	};

}(jQuery));



/*!
* jquery.inputmask.bundle.js
* https://github.com/RobinHerbots/jquery.inputmask
* Copyright (c) 2010 - 2017 Robin Herbots
* Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
* Version: 3.3.5-10
*/
!function($) {
	function Inputmask(alias, options) {
		return this instanceof Inputmask ? ($.isPlainObject(alias) ? options = alias : (options = options || {},
		options.alias = alias), this.el = void 0, this.opts = $.extend(!0, {}, this.defaults, options),
		this.maskset = void 0, this.noMasksCache = options && void 0 !== options.definitions,
		this.userOptions = options || {}, this.events = {}, this.dataAttribute = "data-inputmask",
		this.isRTL = this.opts.numericInput, this.refreshValue = !1, resolveAlias(this.opts.alias, options, this.opts),
		void 0) : new Inputmask(alias, options);
	}
	function resolveAlias(aliasStr, options, opts) {
		var aliasDefinition = opts.aliases[aliasStr];
		return aliasDefinition ? (aliasDefinition.alias && resolveAlias(aliasDefinition.alias, void 0, opts),
		$.extend(!0, opts, aliasDefinition), $.extend(!0, opts, options), !0) : (null === opts.mask && (opts.mask = aliasStr),
		!1);
	}
	function generateMaskSet(opts, nocache) {
		function generateMask(mask, metadata, opts) {
			if (null !== mask && "" !== mask) {
				if (1 === mask.length && opts.greedy === !1 && 0 !== opts.repeat && (opts.placeholder = ""),
				opts.repeat > 0 || "*" === opts.repeat || "+" === opts.repeat) {
					var repeatStart = "*" === opts.repeat ? 0 : "+" === opts.repeat ? 1 : opts.repeat;
					mask = opts.groupmarker.start + mask + opts.groupmarker.end + opts.quantifiermarker.start + repeatStart + "," + opts.repeat + opts.quantifiermarker.end;
				}
				var masksetDefinition;
				return void 0 === Inputmask.prototype.masksCache[mask] || nocache === !0 ? (masksetDefinition = {
					mask: mask,
					maskToken: Inputmask.prototype.analyseMask(mask, opts),
					validPositions: {},
					_buffer: void 0,
					buffer: void 0,
					tests: {},
					metadata: metadata,
					maskLength: void 0
				}, nocache !== !0 && (Inputmask.prototype.masksCache[opts.numericInput ? mask.split("").reverse().join("") : mask] = masksetDefinition,
				masksetDefinition = $.extend(!0, {}, Inputmask.prototype.masksCache[opts.numericInput ? mask.split("").reverse().join("") : mask]))) : masksetDefinition = $.extend(!0, {}, Inputmask.prototype.masksCache[opts.numericInput ? mask.split("").reverse().join("") : mask]),
				masksetDefinition;
			}
		}
		var ms;
		if ($.isFunction(opts.mask) && (opts.mask = opts.mask(opts)), $.isArray(opts.mask)) {
			if (opts.mask.length > 1) {
				opts.keepStatic = null === opts.keepStatic || opts.keepStatic;
				var altMask = opts.groupmarker.start;
				return $.each(opts.numericInput ? opts.mask.reverse() : opts.mask, function(ndx, msk) {
					altMask.length > 1 && (altMask += opts.groupmarker.end + opts.alternatormarker + opts.groupmarker.start),
					altMask += void 0 === msk.mask || $.isFunction(msk.mask) ? msk : msk.mask;
				}), altMask += opts.groupmarker.end, generateMask(altMask, opts.mask, opts);
			}
			opts.mask = opts.mask.pop();
		}
		return opts.mask && (ms = void 0 === opts.mask.mask || $.isFunction(opts.mask.mask) ? generateMask(opts.mask, opts.mask, opts) : generateMask(opts.mask.mask, opts.mask, opts)),
		ms;
	}
	function maskScope(actionObj, maskset, opts) {
		function getMaskTemplate(baseOnInput, minimalPos, includeMode) {
			minimalPos = minimalPos || 0;
			var ndxIntlzr, test, testPos, maskTemplate = [], pos = 0, lvp = getLastValidPosition();
			maxLength = void 0 !== el ? el.maxLength : void 0, maxLength === -1 && (maxLength = void 0);
			do baseOnInput === !0 && getMaskSet().validPositions[pos] ? (testPos = getMaskSet().validPositions[pos],
			test = testPos.match, ndxIntlzr = testPos.locator.slice(), maskTemplate.push(includeMode === !0 ? testPos.input : includeMode === !1 ? test.nativeDef : getPlaceholder(pos, test))) : (testPos = getTestTemplate(pos, ndxIntlzr, pos - 1),
			test = testPos.match, ndxIntlzr = testPos.locator.slice(), (opts.jitMasking === !1 || pos < lvp || "number" == typeof opts.jitMasking && isFinite(opts.jitMasking) && opts.jitMasking > pos) && maskTemplate.push(includeMode === !1 ? test.nativeDef : getPlaceholder(pos, test))),
			pos++; while ((void 0 === maxLength || pos < maxLength) && (null !== test.fn || "" !== test.def) || minimalPos > pos);
			return "" === maskTemplate[maskTemplate.length - 1] && maskTemplate.pop(), getMaskSet().maskLength = pos + 1,
			maskTemplate;
		}
		function getMaskSet() {
			return maskset;
		}
		function resetMaskSet(soft) {
			var maskset = getMaskSet();
			maskset.buffer = void 0, soft !== !0 && (maskset._buffer = void 0, maskset.validPositions = {},
			maskset.p = 0);
		}
		function getLastValidPosition(closestTo, strict, validPositions) {
			var before = -1, after = -1, valids = validPositions || getMaskSet().validPositions;
			void 0 === closestTo && (closestTo = -1);
			for (var posNdx in valids) {
				var psNdx = parseInt(posNdx);
				valids[psNdx] && (strict || valids[psNdx].generatedInput !== !0) && (psNdx <= closestTo && (before = psNdx),
				psNdx >= closestTo && (after = psNdx));
			}
			return before !== -1 && closestTo - before > 1 || after < closestTo ? before : after;
		}
		function stripValidPositions(start, end, nocheck, strict) {
			function IsEnclosedStatic(pos) {
				var posMatch = getMaskSet().validPositions[pos];
				if (void 0 !== posMatch && null === posMatch.match.fn) {
					var prevMatch = getMaskSet().validPositions[pos - 1], nextMatch = getMaskSet().validPositions[pos + 1];
					return void 0 !== prevMatch && void 0 !== nextMatch;
				}
				return !1;
			}
			var i, startPos = start, positionsClone = $.extend(!0, {}, getMaskSet().validPositions), needsValidation = !1;
			for (getMaskSet().p = start, i = end - 1; i >= startPos; i--) void 0 !== getMaskSet().validPositions[i] && (nocheck !== !0 && (!getMaskSet().validPositions[i].match.optionality && IsEnclosedStatic(i) || opts.canClearPosition(getMaskSet(), i, getLastValidPosition(), strict, opts) === !1) || delete getMaskSet().validPositions[i]);
			for (resetMaskSet(!0), i = startPos + 1; i <= getLastValidPosition(); ) {
				for (;void 0 !== getMaskSet().validPositions[startPos]; ) startPos++;
				if (i < startPos && (i = startPos + 1), void 0 === getMaskSet().validPositions[i] && isMask(i)) i++; else {
					var t = getTestTemplate(i);
					needsValidation === !1 && positionsClone[startPos] && positionsClone[startPos].match.def === t.match.def ? (getMaskSet().validPositions[startPos] = $.extend(!0, {}, positionsClone[startPos]),
					getMaskSet().validPositions[startPos].input = t.input, delete getMaskSet().validPositions[i],
					i++) : positionCanMatchDefinition(startPos, t.match.def) ? isValid(startPos, t.input || getPlaceholder(i), !0) !== !1 && (delete getMaskSet().validPositions[i],
					i++, needsValidation = !0) : isMask(i) || (i++, startPos--), startPos++;
				}
			}
			resetMaskSet(!0);
		}
		function determineTestTemplate(tests, guessNextBest) {
			for (var testPos, testPositions = tests, lvp = getLastValidPosition(), lvTest = getMaskSet().validPositions[lvp] || getTests(0)[0], lvTestAltArr = void 0 !== lvTest.alternation ? lvTest.locator[lvTest.alternation].toString().split(",") : [], ndx = 0; ndx < testPositions.length && (testPos = testPositions[ndx],
			!(testPos.match && (opts.greedy && testPos.match.optionalQuantifier !== !0 || (testPos.match.optionality === !1 || testPos.match.newBlockMarker === !1) && testPos.match.optionalQuantifier !== !0) && (void 0 === lvTest.alternation || lvTest.alternation !== testPos.alternation || void 0 !== testPos.locator[lvTest.alternation] && checkAlternationMatch(testPos.locator[lvTest.alternation].toString().split(","), lvTestAltArr))) || guessNextBest === !0 && (null !== testPos.match.fn || /[0-9a-bA-Z]/.test(testPos.match.def))); ndx++) ;
			return testPos;
		}
		function getTestTemplate(pos, ndxIntlzr, tstPs) {
			return getMaskSet().validPositions[pos] || determineTestTemplate(getTests(pos, ndxIntlzr ? ndxIntlzr.slice() : ndxIntlzr, tstPs));
		}
		function getTest(pos) {
			return getMaskSet().validPositions[pos] ? getMaskSet().validPositions[pos] : getTests(pos)[0];
		}
		function positionCanMatchDefinition(pos, def) {
			for (var valid = !1, tests = getTests(pos), tndx = 0; tndx < tests.length; tndx++) if (tests[tndx].match && tests[tndx].match.def === def) {
				valid = !0;
				break;
			}
			return valid;
		}
		function getTests(pos, ndxIntlzr, tstPs) {
			function resolveTestFromToken(maskToken, ndxInitializer, loopNdx, quantifierRecurse) {
				function handleMatch(match, loopNdx, quantifierRecurse) {
					function isFirstMatch(latestMatch, tokenGroup) {
						var firstMatch = 0 === $.inArray(latestMatch, tokenGroup.matches);
						return firstMatch || $.each(tokenGroup.matches, function(ndx, match) {
							if (match.isQuantifier === !0 && (firstMatch = isFirstMatch(latestMatch, tokenGroup.matches[ndx - 1]))) return !1;
						}), firstMatch;
					}
					function resolveNdxInitializer(pos, alternateNdx, targetAlternation) {
						var bestMatch, indexPos;
						return (getMaskSet().tests[pos] || getMaskSet().validPositions[pos]) && $.each(getMaskSet().tests[pos] || [ getMaskSet().validPositions[pos] ], function(ndx, lmnt) {
							var alternation = void 0 !== targetAlternation ? targetAlternation : lmnt.alternation, ndxPos = void 0 !== lmnt.locator[alternation] ? lmnt.locator[alternation].toString().indexOf(alternateNdx) : -1;
							(void 0 === indexPos || ndxPos < indexPos) && ndxPos !== -1 && (bestMatch = lmnt,
							indexPos = ndxPos);
						}), bestMatch ? bestMatch.locator.slice((void 0 !== targetAlternation ? targetAlternation : bestMatch.alternation) + 1) : void 0 !== targetAlternation ? resolveNdxInitializer(pos, alternateNdx) : void 0;
					}
					function staticCanMatchDefinition(source, target) {
						return null === source.match.fn && null !== target.match.fn && target.match.fn.test(source.match.def, getMaskSet(), pos, !1, opts, !1);
					}
					if (testPos > 1e4) throw "Inputmask: There is probably an error in your mask definition or in the code. Create an issue on github with an example of the mask you are using. " + getMaskSet().mask;
					if (testPos === pos && void 0 === match.matches) return matches.push({
						match: match,
						locator: loopNdx.reverse(),
						cd: cacheDependency
					}), !0;
					if (void 0 !== match.matches) {
						if (match.isGroup && quantifierRecurse !== match) {
							if (match = handleMatch(maskToken.matches[$.inArray(match, maskToken.matches) + 1], loopNdx)) return !0;
						} else if (match.isOptional) {
							var optionalToken = match;
							if (match = resolveTestFromToken(match, ndxInitializer, loopNdx, quantifierRecurse)) {
								if (latestMatch = matches[matches.length - 1].match, !isFirstMatch(latestMatch, optionalToken)) return !0;
								insertStop = !0, testPos = pos;
							}
						} else if (match.isAlternator) {
							var maltMatches, alternateToken = match, malternateMatches = [], currentMatches = matches.slice(), loopNdxCnt = loopNdx.length, altIndex = ndxInitializer.length > 0 ? ndxInitializer.shift() : -1;
							if (altIndex === -1 || "string" == typeof altIndex) {
								var amndx, currentPos = testPos, ndxInitializerClone = ndxInitializer.slice(), altIndexArr = [];
								if ("string" == typeof altIndex) altIndexArr = altIndex.split(","); else for (amndx = 0; amndx < alternateToken.matches.length; amndx++) altIndexArr.push(amndx);
								for (var ndx = 0; ndx < altIndexArr.length; ndx++) {
									if (amndx = parseInt(altIndexArr[ndx]), matches = [], ndxInitializer = resolveNdxInitializer(testPos, amndx, loopNdxCnt) || ndxInitializerClone.slice(),
									match = handleMatch(alternateToken.matches[amndx] || maskToken.matches[amndx], [ amndx ].concat(loopNdx), quantifierRecurse) || match,
									match !== !0 && void 0 !== match && altIndexArr[altIndexArr.length - 1] < alternateToken.matches.length) {
										var ntndx = $.inArray(match, maskToken.matches) + 1;
										maskToken.matches.length > ntndx && (match = handleMatch(maskToken.matches[ntndx], [ ntndx ].concat(loopNdx.slice(1, loopNdx.length)), quantifierRecurse),
										match && (altIndexArr.push(ntndx.toString()), $.each(matches, function(ndx, lmnt) {
											lmnt.alternation = loopNdx.length - 1;
										})));
									}
									maltMatches = matches.slice(), testPos = currentPos, matches = [];
									for (var ndx1 = 0; ndx1 < maltMatches.length; ndx1++) {
										var altMatch = maltMatches[ndx1], hasMatch = !1;
										altMatch.alternation = altMatch.alternation || loopNdxCnt;
										for (var ndx2 = 0; ndx2 < malternateMatches.length; ndx2++) {
											var altMatch2 = malternateMatches[ndx2];
											if (("string" != typeof altIndex || $.inArray(altMatch.locator[altMatch.alternation].toString(), altIndexArr) !== -1) && (altMatch.match.def === altMatch2.match.def || staticCanMatchDefinition(altMatch, altMatch2))) {
												hasMatch = altMatch.match.nativeDef === altMatch2.match.nativeDef, altMatch.alternation == altMatch2.alternation && altMatch2.locator[altMatch2.alternation].toString().indexOf(altMatch.locator[altMatch.alternation]) === -1 && (altMatch2.locator[altMatch2.alternation] = altMatch2.locator[altMatch2.alternation] + "," + altMatch.locator[altMatch.alternation],
												altMatch2.alternation = altMatch.alternation, null == altMatch.match.fn && (altMatch2.na = altMatch2.na || altMatch.locator[altMatch.alternation].toString(),
												altMatch2.na.indexOf(altMatch.locator[altMatch.alternation]) === -1 && (altMatch2.na = altMatch2.na + "," + altMatch.locator[altMatch.alternation])));
												break;
											}
										}
										hasMatch || malternateMatches.push(altMatch);
									}
								}
								"string" == typeof altIndex && (malternateMatches = $.map(malternateMatches, function(lmnt, ndx) {
									if (isFinite(ndx)) {
										var mamatch, alternation = lmnt.alternation, altLocArr = lmnt.locator[alternation].toString().split(",");
										lmnt.locator[alternation] = void 0, lmnt.alternation = void 0;
										for (var alndx = 0; alndx < altLocArr.length; alndx++) mamatch = $.inArray(altLocArr[alndx], altIndexArr) !== -1,
										mamatch && (void 0 !== lmnt.locator[alternation] ? (lmnt.locator[alternation] += ",",
										lmnt.locator[alternation] += altLocArr[alndx]) : lmnt.locator[alternation] = parseInt(altLocArr[alndx]),
										lmnt.alternation = alternation);
										if (void 0 !== lmnt.locator[alternation]) return lmnt;
									}
								})), matches = currentMatches.concat(malternateMatches), testPos = pos, insertStop = matches.length > 0,
								ndxInitializer = ndxInitializerClone.slice();
							} else match = handleMatch(alternateToken.matches[altIndex] || maskToken.matches[altIndex], [ altIndex ].concat(loopNdx), quantifierRecurse);
							if (match) return !0;
						} else if (match.isQuantifier && quantifierRecurse !== maskToken.matches[$.inArray(match, maskToken.matches) - 1]) for (var qt = match, qndx = ndxInitializer.length > 0 ? ndxInitializer.shift() : 0; qndx < (isNaN(qt.quantifier.max) ? qndx + 1 : qt.quantifier.max) && testPos <= pos; qndx++) {
							var tokenGroup = maskToken.matches[$.inArray(qt, maskToken.matches) - 1];
							if (match = handleMatch(tokenGroup, [ qndx ].concat(loopNdx), tokenGroup)) {
								if (latestMatch = matches[matches.length - 1].match, latestMatch.optionalQuantifier = qndx > qt.quantifier.min - 1,
								isFirstMatch(latestMatch, tokenGroup)) {
									if (qndx > qt.quantifier.min - 1) {
										insertStop = !0, testPos = pos;
										break;
									}
									return !0;
								}
								return !0;
							}
						} else if (match = resolveTestFromToken(match, ndxInitializer, loopNdx, quantifierRecurse)) return !0;
					} else testPos++;
				}
				for (var tndx = ndxInitializer.length > 0 ? ndxInitializer.shift() : 0; tndx < maskToken.matches.length; tndx++) if (maskToken.matches[tndx].isQuantifier !== !0) {
					var match = handleMatch(maskToken.matches[tndx], [ tndx ].concat(loopNdx), quantifierRecurse);
					if (match && testPos === pos) return match;
					if (testPos > pos) break;
				}
			}
			function mergeLocators(tests) {
				var locator = [];
				return $.isArray(tests) || (tests = [ tests ]), tests.length > 0 && (void 0 === tests[0].alternation ? (locator = determineTestTemplate(tests.slice()).locator.slice(),
				0 === locator.length && (locator = tests[0].locator.slice())) : $.each(tests, function(ndx, tst) {
					if ("" !== tst.def) if (0 === locator.length) locator = tst.locator.slice(); else for (var i = 0; i < locator.length; i++) tst.locator[i] && locator[i].toString().indexOf(tst.locator[i]) === -1 && (locator[i] += "," + tst.locator[i]);
				})), locator;
			}
			function filterTests(tests) {
				return opts.keepStatic && pos > 0 && tests.length > 1 + ("" === tests[tests.length - 1].match.def ? 1 : 0) && tests[0].match.optionality !== !0 && tests[0].match.optionalQuantifier !== !0 && null === tests[0].match.fn && !/[0-9a-bA-Z]/.test(tests[0].match.def) ? [ determineTestTemplate(tests) ] : tests;
			}
			var latestMatch, maskTokens = getMaskSet().maskToken, testPos = ndxIntlzr ? tstPs : 0, ndxInitializer = ndxIntlzr ? ndxIntlzr.slice() : [ 0 ], matches = [], insertStop = !1, cacheDependency = ndxIntlzr ? ndxIntlzr.join("") : "";
			if (pos > -1) {
				if (void 0 === ndxIntlzr) {
					for (var test, previousPos = pos - 1; void 0 === (test = getMaskSet().validPositions[previousPos] || getMaskSet().tests[previousPos]) && previousPos > -1; ) previousPos--;
					void 0 !== test && previousPos > -1 && (ndxInitializer = mergeLocators(test), cacheDependency = ndxInitializer.join(""),
					testPos = previousPos);
				}
				if (getMaskSet().tests[pos] && getMaskSet().tests[pos][0].cd === cacheDependency) return filterTests(getMaskSet().tests[pos]);
				for (var mtndx = ndxInitializer.shift(); mtndx < maskTokens.length; mtndx++) {
					var match = resolveTestFromToken(maskTokens[mtndx], ndxInitializer, [ mtndx ]);
					if (match && testPos === pos || testPos > pos) break;
				}
			}
			return (0 === matches.length || insertStop) && matches.push({
				match: {
					fn: null,
					cardinality: 0,
					optionality: !0,
					casing: null,
					def: "",
					placeholder: ""
				},
				locator: [],
				cd: cacheDependency
			}), void 0 !== ndxIntlzr && getMaskSet().tests[pos] ? filterTests($.extend(!0, [], matches)) : (getMaskSet().tests[pos] = $.extend(!0, [], matches),
			filterTests(getMaskSet().tests[pos]));
		}
		function getBufferTemplate() {
			return void 0 === getMaskSet()._buffer && (getMaskSet()._buffer = getMaskTemplate(!1, 1),
			void 0 === getMaskSet().buffer && getMaskSet()._buffer.slice()), getMaskSet()._buffer;
		}
		function getBuffer(noCache) {
			return void 0 !== getMaskSet().buffer && noCache !== !0 || (getMaskSet().buffer = getMaskTemplate(!0, getLastValidPosition(), !0)),
			getMaskSet().buffer;
		}
		function refreshFromBuffer(start, end, buffer) {
			var i;
			if (start === !0) resetMaskSet(), start = 0, end = buffer.length; else for (i = start; i < end; i++) delete getMaskSet().validPositions[i];
			for (i = start; i < end; i++) resetMaskSet(!0), buffer[i] !== opts.skipOptionalPartCharacter && isValid(i, buffer[i], !0, !0);
		}
		function casing(elem, test, pos) {
			switch (opts.casing || test.casing) {
			  case "upper":
				elem = elem.toUpperCase();
				break;

			  case "lower":
				elem = elem.toLowerCase();
				break;

			  case "title":
				var posBefore = getMaskSet().validPositions[pos - 1];
				elem = 0 === pos || posBefore && posBefore.input === String.fromCharCode(Inputmask.keyCode.SPACE) ? elem.toUpperCase() : elem.toLowerCase();
			}
			return elem;
		}
		function checkAlternationMatch(altArr1, altArr2) {
			for (var altArrC = opts.greedy ? altArr2 : altArr2.slice(0, 1), isMatch = !1, alndx = 0; alndx < altArr1.length; alndx++) if ($.inArray(altArr1[alndx], altArrC) !== -1) {
				isMatch = !0;
				break;
			}
			return isMatch;
		}
		function isValid(pos, c, strict, fromSetValid, fromAlternate) {
			function isSelection(posObj) {
				var selection = isRTL ? posObj.begin - posObj.end > 1 || posObj.begin - posObj.end === 1 && opts.insertMode : posObj.end - posObj.begin > 1 || posObj.end - posObj.begin === 1 && opts.insertMode;
				return selection && 0 === posObj.begin && posObj.end === getMaskSet().maskLength ? "full" : selection;
			}
			function _isValid(position, c, strict) {
				var rslt = !1;
				return $.each(getTests(position), function(ndx, tst) {
					for (var test = tst.match, loopend = c ? 1 : 0, chrs = "", i = test.cardinality; i > loopend; i--) chrs += getBufferElement(position - (i - 1));
					if (c && (chrs += c), getBuffer(!0), rslt = null != test.fn ? test.fn.test(chrs, getMaskSet(), position, strict, opts, isSelection(pos)) : (c === test.def || c === opts.skipOptionalPartCharacter) && "" !== test.def && {
						c: test.placeholder || test.def,
						pos: position
					}, rslt !== !1) {
						var elem = void 0 !== rslt.c ? rslt.c : c;
						elem = elem === opts.skipOptionalPartCharacter && null === test.fn ? test.placeholder || test.def : elem;
						var validatedPos = position, possibleModifiedBuffer = getBuffer();
						if (void 0 !== rslt.remove && ($.isArray(rslt.remove) || (rslt.remove = [ rslt.remove ]),
						$.each(rslt.remove.sort(function(a, b) {
							return b - a;
						}), function(ndx, lmnt) {
							stripValidPositions(lmnt, lmnt + 1, !0);
						})), void 0 !== rslt.insert && ($.isArray(rslt.insert) || (rslt.insert = [ rslt.insert ]),
						$.each(rslt.insert.sort(function(a, b) {
							return a - b;
						}), function(ndx, lmnt) {
							isValid(lmnt.pos, lmnt.c, !0, fromSetValid);
						})), rslt.refreshFromBuffer) {
							var refresh = rslt.refreshFromBuffer;
							if (strict = !0, refreshFromBuffer(refresh === !0 ? refresh : refresh.start, refresh.end, possibleModifiedBuffer),
							void 0 === rslt.pos && void 0 === rslt.c) return rslt.pos = getLastValidPosition(),
							!1;
							if (validatedPos = void 0 !== rslt.pos ? rslt.pos : position, validatedPos !== position) return rslt = $.extend(rslt, isValid(validatedPos, elem, !0, fromSetValid)),
							!1;
						} else if (rslt !== !0 && void 0 !== rslt.pos && rslt.pos !== position && (validatedPos = rslt.pos,
						refreshFromBuffer(position, validatedPos, getBuffer().slice()), validatedPos !== position)) return rslt = $.extend(rslt, isValid(validatedPos, elem, !0)),
						!1;
						return (rslt === !0 || void 0 !== rslt.pos || void 0 !== rslt.c) && (ndx > 0 && resetMaskSet(!0),
						setValidPosition(validatedPos, $.extend({}, tst, {
							input: casing(elem, test, validatedPos)
						}), fromSetValid, isSelection(pos)) || (rslt = !1), !1);
					}
				}), rslt;
			}
			function alternate(pos, c, strict) {
				var lastAlt, alternation, altPos, prevAltPos, i, validPos, altNdxs, decisionPos, validPsClone = $.extend(!0, {}, getMaskSet().validPositions), isValidRslt = !1, lAltPos = getLastValidPosition();
				for (prevAltPos = getMaskSet().validPositions[lAltPos]; lAltPos >= 0; lAltPos--) if (altPos = getMaskSet().validPositions[lAltPos],
				altPos && void 0 !== altPos.alternation) {
					if (lastAlt = lAltPos, alternation = getMaskSet().validPositions[lastAlt].alternation,
					prevAltPos.locator[altPos.alternation] !== altPos.locator[altPos.alternation]) break;
					prevAltPos = altPos;
				}
				if (void 0 !== alternation) {
					decisionPos = parseInt(lastAlt);
					var decisionTaker = void 0 !== prevAltPos.locator[prevAltPos.alternation || alternation] ? prevAltPos.locator[prevAltPos.alternation || alternation] : altNdxs[0];
					decisionTaker.length > 0 && (decisionTaker = decisionTaker.split(",")[0]);
					var possibilityPos = getMaskSet().validPositions[decisionPos], prevPos = getMaskSet().validPositions[decisionPos - 1];
					$.each(getTests(decisionPos, prevPos ? prevPos.locator : void 0, decisionPos - 1), function(ndx, test) {
						altNdxs = test.locator[alternation] ? test.locator[alternation].toString().split(",") : [];
						for (var mndx = 0; mndx < altNdxs.length; mndx++) {
							var validInputs = [], staticInputsBeforePos = 0, staticInputsBeforePosAlternate = 0, verifyValidInput = !1;
							if (decisionTaker < altNdxs[mndx] && (void 0 === test.na || $.inArray(altNdxs[mndx], test.na.split(",")) === -1)) {
								getMaskSet().validPositions[decisionPos] = $.extend(!0, {}, test);
								var possibilities = getMaskSet().validPositions[decisionPos].locator;
								for (getMaskSet().validPositions[decisionPos].locator[alternation] = parseInt(altNdxs[mndx]),
								null == test.match.fn ? (possibilityPos.input !== test.match.def && (verifyValidInput = !0,
								possibilityPos.generatedInput !== !0 && validInputs.push(possibilityPos.input)),
								staticInputsBeforePosAlternate++, getMaskSet().validPositions[decisionPos].generatedInput = !/[0-9a-bA-Z]/.test(test.match.def),
								getMaskSet().validPositions[decisionPos].input = test.match.def) : getMaskSet().validPositions[decisionPos].input = possibilityPos.input,
								i = decisionPos + 1; i < getLastValidPosition(void 0, !0) + 1; i++) validPos = getMaskSet().validPositions[i],
								validPos && validPos.generatedInput !== !0 && /[0-9a-bA-Z]/.test(validPos.input) ? validInputs.push(validPos.input) : i < pos && staticInputsBeforePos++,
								delete getMaskSet().validPositions[i];
								for (verifyValidInput && validInputs[0] === test.match.def && validInputs.shift(),
								resetMaskSet(!0), isValidRslt = !0; validInputs.length > 0; ) {
									var input = validInputs.shift();
									if (input !== opts.skipOptionalPartCharacter && !(isValidRslt = isValid(getLastValidPosition(void 0, !0) + 1, input, !1, fromSetValid, !0))) break;
								}
								if (isValidRslt) {
									getMaskSet().validPositions[decisionPos].locator = possibilities;
									var targetLvp = getLastValidPosition(pos) + 1;
									for (i = decisionPos + 1; i < getLastValidPosition() + 1; i++) validPos = getMaskSet().validPositions[i],
									(void 0 === validPos || null == validPos.match.fn) && i < pos + (staticInputsBeforePosAlternate - staticInputsBeforePos) && staticInputsBeforePosAlternate++;
									pos += staticInputsBeforePosAlternate - staticInputsBeforePos, isValidRslt = isValid(pos > targetLvp ? targetLvp : pos, c, strict, fromSetValid, !0);
								}
								if (isValidRslt) return !1;
								resetMaskSet(), getMaskSet().validPositions = $.extend(!0, {}, validPsClone);
							}
						}
					});
				}
				return isValidRslt;
			}
			function trackbackAlternations(originalPos, newPos) {
				var vp = getMaskSet().validPositions[newPos];
				if (vp) for (var targetLocator = vp.locator, tll = targetLocator.length, ps = originalPos; ps < newPos; ps++) if (void 0 === getMaskSet().validPositions[ps] && !isMask(ps, !0)) {
					var tests = getTests(ps), bestMatch = tests[0], equality = -1;
					$.each(tests, function(ndx, tst) {
						for (var i = 0; i < tll && (void 0 !== tst.locator[i] && checkAlternationMatch(tst.locator[i].toString().split(","), targetLocator[i].toString().split(","))); i++) equality < i && (equality = i,
						bestMatch = tst);
					}), setValidPosition(ps, $.extend({}, bestMatch, {
						input: bestMatch.match.placeholder || bestMatch.match.def
					}), !0);
				}
			}
			function setValidPosition(pos, validTest, fromSetValid, isSelection) {
				if (isSelection || opts.insertMode && void 0 !== getMaskSet().validPositions[pos] && void 0 === fromSetValid) {
					var i, positionsClone = $.extend(!0, {}, getMaskSet().validPositions), lvp = getLastValidPosition(void 0, !0);
					for (i = pos; i <= lvp; i++) delete getMaskSet().validPositions[i];
					getMaskSet().validPositions[pos] = $.extend(!0, {}, validTest);
					var j, valid = !0, vps = getMaskSet().validPositions, needsValidation = !1, initialLength = getMaskSet().maskLength;
					for (i = j = pos; i <= lvp; i++) {
						var t = positionsClone[i];
						if (void 0 !== t) for (var posMatch = j; posMatch < getMaskSet().maskLength && (null === t.match.fn && vps[i] && (vps[i].match.optionalQuantifier === !0 || vps[i].match.optionality === !0) || null != t.match.fn); ) {
							if (posMatch++, needsValidation === !1 && positionsClone[posMatch] && positionsClone[posMatch].match.def === t.match.def) getMaskSet().validPositions[posMatch] = $.extend(!0, {}, positionsClone[posMatch]),
							getMaskSet().validPositions[posMatch].input = t.input, fillMissingNonMask(posMatch),
							j = posMatch, valid = !0; else if (positionCanMatchDefinition(posMatch, t.match.def)) {
								var result = isValid(posMatch, t.input, !0, !0);
								valid = result !== !1, j = result.caret || result.insert ? getLastValidPosition() : posMatch,
								needsValidation = !0;
							} else valid = t.generatedInput === !0;
							if (getMaskSet().maskLength < initialLength && (getMaskSet().maskLength = initialLength),
							valid) break;
						}
						if (!valid) break;
					}
					if (!valid) return getMaskSet().validPositions = $.extend(!0, {}, positionsClone),
					resetMaskSet(!0), !1;
				} else getMaskSet().validPositions[pos] = $.extend(!0, {}, validTest);
				return resetMaskSet(!0), !0;
			}
			function fillMissingNonMask(maskPos) {
				for (var pndx = maskPos - 1; pndx > -1 && !getMaskSet().validPositions[pndx]; pndx--) ;
				var testTemplate, testsFromPos;
				for (pndx++; pndx < maskPos; pndx++) void 0 === getMaskSet().validPositions[pndx] && (opts.jitMasking === !1 || opts.jitMasking > pndx) && (testsFromPos = getTests(pndx, getTestTemplate(pndx - 1).locator, pndx - 1).slice(),
				"" === testsFromPos[testsFromPos.length - 1].match.def && testsFromPos.pop(), testTemplate = determineTestTemplate(testsFromPos),
				testTemplate && (testTemplate.match.def === opts.radixPointDefinitionSymbol || !isMask(pndx, !0) || $.inArray(opts.radixPoint, getBuffer()) < pndx && testTemplate.match.fn && testTemplate.match.fn.test(getPlaceholder(pndx), getMaskSet(), pndx, !1, opts)) && (result = _isValid(pndx, testTemplate.match.placeholder || (null == testTemplate.match.fn ? testTemplate.match.def : "" !== getPlaceholder(pndx) ? getPlaceholder(pndx) : getBuffer()[pndx]), !0),
				result !== !1 && (getMaskSet().validPositions[result.pos || pndx].generatedInput = !0)));
			}
			strict = strict === !0;
			var maskPos = pos;
			void 0 !== pos.begin && (maskPos = isRTL && !isSelection(pos) ? pos.end : pos.begin);
			var result = !1, positionsClone = $.extend(!0, {}, getMaskSet().validPositions);
			if (fillMissingNonMask(maskPos), isSelection(pos) && (handleRemove(void 0, Inputmask.keyCode.DELETE, pos),
			maskPos = getMaskSet().p), maskPos < getMaskSet().maskLength && (result = _isValid(maskPos, c, strict),
			(!strict || fromSetValid === !0) && result === !1)) {
				var currentPosValid = getMaskSet().validPositions[maskPos];
				if (!currentPosValid || null !== currentPosValid.match.fn || currentPosValid.match.def !== c && c !== opts.skipOptionalPartCharacter) {
					if ((opts.insertMode || void 0 === getMaskSet().validPositions[seekNext(maskPos)]) && !isMask(maskPos, !0)) {
						var testsFromPos = getTests(maskPos).slice();
						"" === testsFromPos[testsFromPos.length - 1].match.def && testsFromPos.pop();
						var staticChar = determineTestTemplate(testsFromPos, !0);
						staticChar && null === staticChar.match.fn && (staticChar = staticChar.match.placeholder || staticChar.match.def,
						_isValid(maskPos, staticChar, strict), getMaskSet().validPositions[maskPos].generatedInput = !0);
						for (var nPos = maskPos + 1, snPos = seekNext(maskPos); nPos <= snPos; nPos++) if (result = _isValid(nPos, c, strict),
						result !== !1) {
							trackbackAlternations(maskPos, void 0 !== result.pos ? result.pos : nPos), maskPos = nPos;
							break;
						}
					}
				} else result = {
					caret: seekNext(maskPos)
				};
			}
			return result === !1 && opts.keepStatic && !strict && fromAlternate !== !0 && (result = alternate(maskPos, c, strict)),
			result === !0 && (result = {
				pos: maskPos
			}), $.isFunction(opts.postValidation) && result !== !1 && !strict && fromSetValid !== !0 && (result = !!opts.postValidation(getBuffer(!0), result, opts) && result),
			void 0 === result.pos && (result.pos = maskPos), result === !1 && (resetMaskSet(!0),
			getMaskSet().validPositions = $.extend(!0, {}, positionsClone)), result;
		}
		function isMask(pos, strict) {
			var test;
			if (strict ? (test = getTestTemplate(pos).match, "" === test.def && (test = getTest(pos).match)) : test = getTest(pos).match,
			null != test.fn) return test.fn;
			if (strict !== !0 && pos > -1) {
				var tests = getTests(pos);
				return tests.length > 1 + ("" === tests[tests.length - 1].match.def ? 1 : 0);
			}
			return !1;
		}
		function seekNext(pos, newBlock) {
			var maskL = getMaskSet().maskLength;
			if (pos >= maskL) return maskL;
			for (var position = pos; ++position < maskL && (newBlock === !0 && (getTest(position).match.newBlockMarker !== !0 || !isMask(position)) || newBlock !== !0 && !isMask(position)); ) ;
			return position;
		}
		function seekPrevious(pos, newBlock) {
			var tests, position = pos;
			if (position <= 0) return 0;
			for (;--position > 0 && (newBlock === !0 && getTest(position).match.newBlockMarker !== !0 || newBlock !== !0 && !isMask(position) && (tests = getTests(position),
			tests.length < 2 || 2 === tests.length && "" === tests[1].match.def)); ) ;
			return position;
		}
		function getBufferElement(position) {
			return void 0 === getMaskSet().validPositions[position] ? getPlaceholder(position) : getMaskSet().validPositions[position].input;
		}
		function writeBuffer(input, buffer, caretPos, event, triggerInputEvent) {
			if (event && $.isFunction(opts.onBeforeWrite)) {
				var result = opts.onBeforeWrite(event, buffer, caretPos, opts);
				if (result) {
					if (result.refreshFromBuffer) {
						var refresh = result.refreshFromBuffer;
						refreshFromBuffer(refresh === !0 ? refresh : refresh.start, refresh.end, result.buffer || buffer),
						buffer = getBuffer(!0);
					}
					void 0 !== caretPos && (caretPos = void 0 !== result.caret ? result.caret : caretPos);
				}
			}
			input.inputmask._valueSet(buffer.join("")), void 0 === caretPos || void 0 !== event && "blur" === event.type ? renderColorMask(input, buffer, caretPos) : caret(input, caretPos),
			triggerInputEvent === !0 && (skipInputEvent = !0, $(input).trigger("input"));
		}
		function getPlaceholder(pos, test) {
			if (test = test || getTest(pos).match, void 0 !== test.placeholder) return test.placeholder;
			if (null === test.fn) {
				if (pos > -1 && void 0 === getMaskSet().validPositions[pos]) {
					var prevTest, tests = getTests(pos), staticAlternations = [];
					if (tests.length > 1 + ("" === tests[tests.length - 1].match.def ? 1 : 0)) for (var i = 0; i < tests.length; i++) if (tests[i].match.optionality !== !0 && tests[i].match.optionalQuantifier !== !0 && (null === tests[i].match.fn || void 0 === prevTest || tests[i].match.fn.test(prevTest.match.def, getMaskSet(), pos, !0, opts) !== !1) && (staticAlternations.push(tests[i]),
					null === tests[i].match.fn && (prevTest = tests[i]), staticAlternations.length > 1 && /[0-9a-bA-Z]/.test(staticAlternations[0].match.def))) return opts.placeholder.charAt(pos % opts.placeholder.length);
				}
				return test.def;
			}
			return opts.placeholder.charAt(pos % opts.placeholder.length);
		}
		function checkVal(input, writeOut, strict, nptvl, initiatingEvent, stickyCaret) {
			function isTemplateMatch() {
				var isMatch = !1, charCodeNdx = getBufferTemplate().slice(initialNdx, seekNext(initialNdx)).join("").indexOf(charCodes);
				if (charCodeNdx !== -1 && !isMask(initialNdx)) {
					isMatch = !0;
					for (var bufferTemplateArr = getBufferTemplate().slice(initialNdx, initialNdx + charCodeNdx), i = 0; i < bufferTemplateArr.length; i++) if (" " !== bufferTemplateArr[i]) {
						isMatch = !1;
						break;
					}
				}
				return isMatch;
			}
			var inputValue = nptvl.slice(), charCodes = "", initialNdx = 0, result = void 0;
			if (resetMaskSet(), getMaskSet().p = seekNext(-1), !strict) if (opts.autoUnmask !== !0) {
				var staticInput = getBufferTemplate().slice(0, seekNext(-1)).join(""), matches = inputValue.join("").match(new RegExp("^" + Inputmask.escapeRegex(staticInput), "g"));
				matches && matches.length > 0 && (inputValue.splice(0, matches.length * staticInput.length),
				initialNdx = seekNext(initialNdx));
			} else initialNdx = seekNext(initialNdx);
			if ($.each(inputValue, function(ndx, charCode) {
				if (void 0 !== charCode) {
					var keypress = new $.Event("keypress");
					keypress.which = charCode.charCodeAt(0), charCodes += charCode;
					var lvp = getLastValidPosition(void 0, !0), lvTest = getMaskSet().validPositions[lvp], nextTest = getTestTemplate(lvp + 1, lvTest ? lvTest.locator.slice() : void 0, lvp);
					if (!isTemplateMatch() || strict || opts.autoUnmask) {
						var pos = strict ? ndx : null == nextTest.match.fn && nextTest.match.optionality && lvp + 1 < getMaskSet().p ? lvp + 1 : getMaskSet().p;
						result = EventHandlers.keypressEvent.call(input, keypress, !0, !1, strict, pos),
						initialNdx = pos + 1, charCodes = "";
					} else result = EventHandlers.keypressEvent.call(input, keypress, !0, !1, !0, lvp + 1);
					if (!strict && $.isFunction(opts.onBeforeWrite) && (result = opts.onBeforeWrite(keypress, getBuffer(), result.forwardPosition, opts),
					result && result.refreshFromBuffer)) {
						var refresh = result.refreshFromBuffer;
						refreshFromBuffer(refresh === !0 ? refresh : refresh.start, refresh.end, result.buffer),
						resetMaskSet(!0), result.caret && (getMaskSet().p = result.caret);
					}
				}
			}), writeOut) {
				var caretPos = void 0, lvp = getLastValidPosition();
				document.activeElement === input && (initiatingEvent || result) && (caretPos = caret(input).begin,
				initiatingEvent && result === !1 && (caretPos = seekNext(getLastValidPosition(caretPos))),
				result && stickyCaret !== !0 && (caretPos < lvp + 1 || lvp === -1) && (caretPos = opts.numericInput && void 0 === result.caret ? seekPrevious(result.forwardPosition) : result.forwardPosition)),
				writeBuffer(input, getBuffer(), caretPos, initiatingEvent || new $.Event("checkval"));
			}
		}
		function unmaskedvalue(input) {
			if (input) {
				if (void 0 === input.inputmask) return input.value;
				input.inputmask && input.inputmask.refreshValue && EventHandlers.setValueEvent.call(input);
			}
			var umValue = [], vps = getMaskSet().validPositions;
			for (var pndx in vps) vps[pndx].match && null != vps[pndx].match.fn && umValue.push(vps[pndx].input);
			var unmaskedValue = 0 === umValue.length ? "" : (isRTL ? umValue.reverse() : umValue).join("");
			if ($.isFunction(opts.onUnMask)) {
				var bufferValue = (isRTL ? getBuffer().slice().reverse() : getBuffer()).join("");
				unmaskedValue = opts.onUnMask(bufferValue, unmaskedValue, opts) || unmaskedValue;
			}
			return unmaskedValue;
		}
		function caret(input, begin, end, notranslate) {
			function translatePosition(pos) {
				if (notranslate !== !0 && isRTL && "number" == typeof pos && (!opts.greedy || "" !== opts.placeholder)) {
					var bffrLght = getBuffer().join("").length;
					pos = bffrLght - pos;
				}
				return pos;
			}
			var range;
			if ("number" != typeof begin) return input.setSelectionRange ? (begin = input.selectionStart,
			end = input.selectionEnd) : window.getSelection ? (range = window.getSelection().getRangeAt(0),
			range.commonAncestorContainer.parentNode !== input && range.commonAncestorContainer !== input || (begin = range.startOffset,
			end = range.endOffset)) : document.selection && document.selection.createRange && (range = document.selection.createRange(),
			begin = 0 - range.duplicate().moveStart("character", -input.inputmask._valueGet().length),
			end = begin + range.text.length), {
				begin: translatePosition(begin),
				end: translatePosition(end)
			};
			begin = translatePosition(begin), end = translatePosition(end), end = "number" == typeof end ? end : begin;
			var scrollCalc = parseInt(((input.ownerDocument.defaultView || window).getComputedStyle ? (input.ownerDocument.defaultView || window).getComputedStyle(input, null) : input.currentStyle).fontSize) * end;
			if (input.scrollLeft = scrollCalc > input.scrollWidth ? scrollCalc : 0, mobile || opts.insertMode !== !1 || begin !== end || end++,
			input.setSelectionRange) input.selectionStart = begin, input.selectionEnd = end; else if (window.getSelection) {
				if (range = document.createRange(), void 0 === input.firstChild || null === input.firstChild) {
					var textNode = document.createTextNode("");
					input.appendChild(textNode);
				}
				range.setStart(input.firstChild, begin < input.inputmask._valueGet().length ? begin : input.inputmask._valueGet().length),
				range.setEnd(input.firstChild, end < input.inputmask._valueGet().length ? end : input.inputmask._valueGet().length),
				range.collapse(!0);
				var sel = window.getSelection();
				sel.removeAllRanges(), sel.addRange(range);
			} else input.createTextRange && (range = input.createTextRange(), range.collapse(!0),
			range.moveEnd("character", end), range.moveStart("character", begin), range.select());
			renderColorMask(input, void 0, {
				begin: begin,
				end: end
			});
		}
		function determineLastRequiredPosition(returnDefinition) {
			var pos, testPos, buffer = getBuffer(), bl = buffer.length, lvp = getLastValidPosition(), positions = {}, lvTest = getMaskSet().validPositions[lvp], ndxIntlzr = void 0 !== lvTest ? lvTest.locator.slice() : void 0;
			for (pos = lvp + 1; pos < buffer.length; pos++) testPos = getTestTemplate(pos, ndxIntlzr, pos - 1),
			ndxIntlzr = testPos.locator.slice(), positions[pos] = $.extend(!0, {}, testPos);
			var lvTestAlt = lvTest && void 0 !== lvTest.alternation ? lvTest.locator[lvTest.alternation] : void 0;
			for (pos = bl - 1; pos > lvp && (testPos = positions[pos], (testPos.match.optionality || testPos.match.optionalQuantifier || lvTestAlt && (lvTestAlt !== positions[pos].locator[lvTest.alternation] && null != testPos.match.fn || null === testPos.match.fn && testPos.locator[lvTest.alternation] && checkAlternationMatch(testPos.locator[lvTest.alternation].toString().split(","), lvTestAlt.toString().split(",")) && "" !== getTests(pos)[0].def)) && buffer[pos] === getPlaceholder(pos, testPos.match)); pos--) bl--;
			return returnDefinition ? {
				l: bl,
				def: positions[bl] ? positions[bl].match : void 0
			} : bl;
		}
		function clearOptionalTail(buffer) {
			for (var validPos, rl = determineLastRequiredPosition(), bl = buffer.length; rl < bl && !isMask(rl + 1) && (validPos = getTest(rl + 1)) && validPos.match.optionality !== !0 && validPos.match.optionalQuantifier !== !0; ) rl++;
			for (;(validPos = getTest(rl - 1)) && validPos.match.optionality && validPos.input === opts.skipOptionalPartCharacter; ) rl--;
			return buffer.splice(rl), buffer;
		}
		function isComplete(buffer) {
			if ($.isFunction(opts.isComplete)) return opts.isComplete(buffer, opts);
			if ("*" !== opts.repeat) {
				var complete = !1, lrp = determineLastRequiredPosition(!0), aml = seekPrevious(lrp.l);
				if (void 0 === lrp.def || lrp.def.newBlockMarker || lrp.def.optionality || lrp.def.optionalQuantifier) {
					complete = !0;
					for (var i = 0; i <= aml; i++) {
						var test = getTestTemplate(i).match;
						if (null !== test.fn && void 0 === getMaskSet().validPositions[i] && test.optionality !== !0 && test.optionalQuantifier !== !0 || null === test.fn && buffer[i] !== getPlaceholder(i, test)) {
							complete = !1;
							break;
						}
					}
				}
				return complete;
			}
		}
		function handleRemove(input, k, pos, strict) {
			function generalize() {
				if (opts.keepStatic) {
					for (var validInputs = [], lastAlt = getLastValidPosition(-1, !0), positionsClone = $.extend(!0, {}, getMaskSet().validPositions), prevAltPos = getMaskSet().validPositions[lastAlt]; lastAlt >= 0; lastAlt--) {
						var altPos = getMaskSet().validPositions[lastAlt];
						if (altPos) {
							if (altPos.generatedInput !== !0 && /[0-9a-bA-Z]/.test(altPos.input) && validInputs.push(altPos.input),
							delete getMaskSet().validPositions[lastAlt], void 0 !== altPos.alternation && altPos.locator[altPos.alternation] !== prevAltPos.locator[altPos.alternation]) break;
							prevAltPos = altPos;
						}
					}
					if (lastAlt > -1) for (getMaskSet().p = seekNext(getLastValidPosition(-1, !0)); validInputs.length > 0; ) {
						var keypress = new $.Event("keypress");
						keypress.which = validInputs.pop().charCodeAt(0), EventHandlers.keypressEvent.call(input, keypress, !0, !1, !1, getMaskSet().p);
					} else getMaskSet().validPositions = $.extend(!0, {}, positionsClone);
				}
			}
			if ((opts.numericInput || isRTL) && (k === Inputmask.keyCode.BACKSPACE ? k = Inputmask.keyCode.DELETE : k === Inputmask.keyCode.DELETE && (k = Inputmask.keyCode.BACKSPACE),
			isRTL)) {
				var pend = pos.end;
				pos.end = pos.begin, pos.begin = pend;
			}
			k === Inputmask.keyCode.BACKSPACE && (pos.end - pos.begin < 1 || opts.insertMode === !1) ? (pos.begin = seekPrevious(pos.begin),
			void 0 === getMaskSet().validPositions[pos.begin] || getMaskSet().validPositions[pos.begin].input !== opts.groupSeparator && getMaskSet().validPositions[pos.begin].input !== opts.radixPoint || pos.begin--) : k === Inputmask.keyCode.DELETE && pos.begin === pos.end && (pos.end = isMask(pos.end, !0) ? pos.end + 1 : seekNext(pos.end) + 1,
			void 0 === getMaskSet().validPositions[pos.begin] || getMaskSet().validPositions[pos.begin].input !== opts.groupSeparator && getMaskSet().validPositions[pos.begin].input !== opts.radixPoint || pos.end++),
			stripValidPositions(pos.begin, pos.end, !1, strict), strict !== !0 && generalize();
			var lvp = getLastValidPosition(pos.begin, !0);
			lvp < pos.begin ? getMaskSet().p = seekNext(lvp) : strict !== !0 && (getMaskSet().p = pos.begin);
		}
		function initializeColorMask(input) {
			function findCaretPos(clientx) {
				var caretPos, e = document.createElement("span");
				for (var style in computedStyle) isNaN(style) && style.indexOf("font") !== -1 && (e.style[style] = computedStyle[style]);
				e.style.textTransform = computedStyle.textTransform, e.style.letterSpacing = computedStyle.letterSpacing,
				e.style.position = "absolute", e.style.height = "auto", e.style.width = "auto",
				e.style.visibility = "hidden", e.style.whiteSpace = "nowrap", document.body.appendChild(e);
				var itl, inputText = input.inputmask._valueGet(), previousWidth = 0;
				for (caretPos = 0, itl = inputText.length; caretPos <= itl; caretPos++) {
					if (e.innerHTML += inputText.charAt(caretPos) || "_", e.offsetWidth >= clientx) {
						var offset1 = clientx - previousWidth, offset2 = e.offsetWidth - clientx;
						e.innerHTML = inputText.charAt(caretPos), offset1 -= e.offsetWidth / 3, caretPos = offset1 < offset2 ? caretPos - 1 : caretPos;
						break;
					}
					previousWidth = e.offsetWidth;
				}
				return document.body.removeChild(e), caretPos;
			}
			function position() {
				colorMask.style.position = "absolute", colorMask.style.top = offset.top + "px",
				colorMask.style.left = offset.left + "px", colorMask.style.width = parseInt(input.offsetWidth) - parseInt(computedStyle.paddingLeft) - parseInt(computedStyle.paddingRight) - parseInt(computedStyle.borderLeftWidth) - parseInt(computedStyle.borderRightWidth) + "px",
				colorMask.style.height = parseInt(input.offsetHeight) - parseInt(computedStyle.paddingTop) - parseInt(computedStyle.paddingBottom) - parseInt(computedStyle.borderTopWidth) - parseInt(computedStyle.borderBottomWidth) + "px",
				colorMask.style.lineHeight = colorMask.style.height, colorMask.style.zIndex = isNaN(computedStyle.zIndex) ? -1 : computedStyle.zIndex - 1,
				colorMask.style.webkitAppearance = "textfield", colorMask.style.mozAppearance = "textfield",
				colorMask.style.Appearance = "textfield";
			}
			var offset = $(input).position(), computedStyle = (input.ownerDocument.defaultView || window).getComputedStyle(input, null);
			input.parentNode;
			colorMask = document.createElement("div"), document.body.appendChild(colorMask);
			for (var style in computedStyle) isNaN(style) && "cssText" !== style && style.indexOf("webkit") == -1 && (colorMask.style[style] = computedStyle[style]);
			input.style.backgroundColor = "transparent", input.style.color = "transparent",
			input.style.webkitAppearance = "caret", input.style.mozAppearance = "caret", input.style.Appearance = "caret",
			position(), $(window).on("resize", function(e) {
				offset = $(input).position(), computedStyle = (input.ownerDocument.defaultView || window).getComputedStyle(input, null),
				position();
			}), $(input).on("click", function(e) {
				return caret(input, findCaretPos(e.clientX)), EventHandlers.clickEvent.call(this, [ e ]);
			}), $(input).on("keydown", function(e) {
				e.shiftKey || opts.insertMode === !1 || setTimeout(function() {
					renderColorMask(input);
				}, 0);
			});
		}
		function renderColorMask(input, buffer, caretPos) {
			function handleStatic() {
				isStatic || null !== test.fn && void 0 !== testPos.input ? isStatic && null !== test.fn && void 0 !== testPos.input && (isStatic = !1,
				maskTemplate += "</span>") : (isStatic = !0, maskTemplate += "<span class='im-static''>");
			}
			if (void 0 !== colorMask) {
				buffer = buffer || getBuffer(), void 0 === caretPos ? caretPos = caret(input) : void 0 === caretPos.begin && (caretPos = {
					begin: caretPos,
					end: caretPos
				});
				var maskTemplate = "", isStatic = !1;
				if ("" != buffer) {
					var ndxIntlzr, test, testPos, pos = 0, lvp = getLastValidPosition();
					do pos === caretPos.begin && document.activeElement === input && (maskTemplate += "<span class='im-caret' style='border-right-width: 1px;border-right-style: solid;'></span>"),
					getMaskSet().validPositions[pos] ? (testPos = getMaskSet().validPositions[pos],
					test = testPos.match, ndxIntlzr = testPos.locator.slice(), handleStatic(), maskTemplate += testPos.input) : (testPos = getTestTemplate(pos, ndxIntlzr, pos - 1),
					test = testPos.match, ndxIntlzr = testPos.locator.slice(), (opts.jitMasking === !1 || pos < lvp || "number" == typeof opts.jitMasking && isFinite(opts.jitMasking) && opts.jitMasking > pos) && (handleStatic(),
					maskTemplate += getPlaceholder(pos, test))), pos++; while ((void 0 === maxLength || pos < maxLength) && (null !== test.fn || "" !== test.def) || lvp > pos);
				}
				colorMask.innerHTML = maskTemplate;
			}
		}
		function mask(elem) {
			function isElementTypeSupported(input, opts) {
				function patchValueProperty(npt) {
					function patchValhook(type) {
						if ($.valHooks && (void 0 === $.valHooks[type] || $.valHooks[type].inputmaskpatch !== !0)) {
							var valhookGet = $.valHooks[type] && $.valHooks[type].get ? $.valHooks[type].get : function(elem) {
								return elem.value;
							}, valhookSet = $.valHooks[type] && $.valHooks[type].set ? $.valHooks[type].set : function(elem, value) {
								return elem.value = value, elem;
							};
							$.valHooks[type] = {
								get: function(elem) {
									if (elem.inputmask) {
										if (elem.inputmask.opts.autoUnmask) return elem.inputmask.unmaskedvalue();
										var result = valhookGet(elem);
										return getLastValidPosition(void 0, void 0, elem.inputmask.maskset.validPositions) !== -1 || opts.nullable !== !0 ? result : "";
									}
									return valhookGet(elem);
								},
								set: function(elem, value) {
									var result, $elem = $(elem);
									return result = valhookSet(elem, value), elem.inputmask && $elem.trigger("setvalue"),
									result;
								},
								inputmaskpatch: !0
							};
						}
					}
					function getter() {
						return this.inputmask ? this.inputmask.opts.autoUnmask ? this.inputmask.unmaskedvalue() : getLastValidPosition() !== -1 || opts.nullable !== !0 ? document.activeElement === this && opts.clearMaskOnLostFocus ? (isRTL ? clearOptionalTail(getBuffer().slice()).reverse() : clearOptionalTail(getBuffer().slice())).join("") : valueGet.call(this) : "" : valueGet.call(this);
					}
					function setter(value) {
						valueSet.call(this, value), this.inputmask && $(this).trigger("setvalue");
					}
					function installNativeValueSetFallback(npt) {
						EventRuler.on(npt, "mouseenter", function(event) {
							var $input = $(this), input = this, value = input.inputmask._valueGet();
							value !== getBuffer().join("") && $input.trigger("setvalue");
						});
					}
					var valueGet, valueSet;
					if (!npt.inputmask.__valueGet) {
						if (opts.noValuePatching !== !0) {
							if (Object.getOwnPropertyDescriptor) {
								"function" != typeof Object.getPrototypeOf && (Object.getPrototypeOf = "object" == typeof "test".__proto__ ? function(object) {
									return object.__proto__;
								} : function(object) {
									return object.constructor.prototype;
								});
								var valueProperty = Object.getPrototypeOf ? Object.getOwnPropertyDescriptor(Object.getPrototypeOf(npt), "value") : void 0;
								valueProperty && valueProperty.get && valueProperty.set ? (valueGet = valueProperty.get,
								valueSet = valueProperty.set, Object.defineProperty(npt, "value", {
									get: getter,
									set: setter,
									configurable: !0
								})) : "INPUT" !== npt.tagName && (valueGet = function() {
									return this.textContent;
								}, valueSet = function(value) {
									this.textContent = value;
								}, Object.defineProperty(npt, "value", {
									get: getter,
									set: setter,
									configurable: !0
								}));
							} else document.__lookupGetter__ && npt.__lookupGetter__("value") && (valueGet = npt.__lookupGetter__("value"),
							valueSet = npt.__lookupSetter__("value"), npt.__defineGetter__("value", getter),
							npt.__defineSetter__("value", setter));
							npt.inputmask.__valueGet = valueGet, npt.inputmask.__valueSet = valueSet;
						}
						npt.inputmask._valueGet = function(overruleRTL) {
							return isRTL && overruleRTL !== !0 ? valueGet.call(this.el).split("").reverse().join("") : valueGet.call(this.el);
						}, npt.inputmask._valueSet = function(value, overruleRTL) {
							valueSet.call(this.el, null === value || void 0 === value ? "" : overruleRTL !== !0 && isRTL ? value.split("").reverse().join("") : value);
						}, void 0 === valueGet && (valueGet = function() {
							return this.value;
						}, valueSet = function(value) {
							this.value = value;
						}, patchValhook(npt.type), installNativeValueSetFallback(npt));
					}
				}
				var elementType = input.getAttribute("type"), isSupported = "INPUT" === input.tagName && $.inArray(elementType, opts.supportsInputType) !== -1 || input.isContentEditable || "TEXTAREA" === input.tagName;
				if (!isSupported) if ("INPUT" === input.tagName) {
					var el = document.createElement("input");
					el.setAttribute("type", elementType), isSupported = "text" === el.type, el = null;
				} else isSupported = "partial";
				return isSupported !== !1 && patchValueProperty(input), isSupported;
			}
			var isSupported = isElementTypeSupported(elem, opts);
			if (isSupported !== !1 && (el = elem, $el = $(el), ("rtl" === el.dir || opts.rightAlign) && (el.style.textAlign = "right"),
			("rtl" === el.dir || opts.numericInput) && (el.dir = "ltr", el.removeAttribute("dir"),
			el.inputmask.isRTL = !0, isRTL = !0), opts.colorMask === !0 && initializeColorMask(el),
			android && (el.hasOwnProperty("inputmode") && (el.inputmode = opts.inputmode, el.setAttribute("inputmode", opts.inputmode)),
			"rtfm" === opts.androidHack && (opts.colorMask !== !0 && initializeColorMask(el),
			el.type = "password")), EventRuler.off(el), isSupported === !0 && (EventRuler.on(el, "submit", EventHandlers.submitEvent),
			EventRuler.on(el, "reset", EventHandlers.resetEvent), EventRuler.on(el, "mouseenter", EventHandlers.mouseenterEvent),
			EventRuler.on(el, "blur", EventHandlers.blurEvent), EventRuler.on(el, "focus", EventHandlers.focusEvent),
			EventRuler.on(el, "mouseleave", EventHandlers.mouseleaveEvent), opts.colorMask !== !0 && EventRuler.on(el, "click", EventHandlers.clickEvent),
			EventRuler.on(el, "dblclick", EventHandlers.dblclickEvent), EventRuler.on(el, "paste", EventHandlers.pasteEvent),
			EventRuler.on(el, "dragdrop", EventHandlers.pasteEvent), EventRuler.on(el, "drop", EventHandlers.pasteEvent),
			EventRuler.on(el, "cut", EventHandlers.cutEvent), EventRuler.on(el, "complete", opts.oncomplete),
			EventRuler.on(el, "incomplete", opts.onincomplete), EventRuler.on(el, "cleared", opts.oncleared),
			opts.inputEventOnly !== !0 && (EventRuler.on(el, "keydown", EventHandlers.keydownEvent),
			EventRuler.on(el, "keypress", EventHandlers.keypressEvent)), EventRuler.on(el, "compositionstart", $.noop),
			EventRuler.on(el, "compositionupdate", $.noop), EventRuler.on(el, "compositionend", $.noop),
			EventRuler.on(el, "keyup", $.noop), EventRuler.on(el, "input", EventHandlers.inputFallBackEvent)),
			EventRuler.on(el, "setvalue", EventHandlers.setValueEvent), getBufferTemplate(),
			"" !== el.inputmask._valueGet() || opts.clearMaskOnLostFocus === !1 || document.activeElement === el)) {
				var initialValue = $.isFunction(opts.onBeforeMask) ? opts.onBeforeMask(el.inputmask._valueGet(), opts) || el.inputmask._valueGet() : el.inputmask._valueGet();
				checkVal(el, !0, !1, initialValue.split(""));
				var buffer = getBuffer().slice();
				undoValue = buffer.join(""), isComplete(buffer) === !1 && opts.clearIncomplete && resetMaskSet(),
				opts.clearMaskOnLostFocus && document.activeElement !== el && (getLastValidPosition() === -1 ? buffer = [] : clearOptionalTail(buffer)),
				writeBuffer(el, buffer), document.activeElement === el && caret(el, seekNext(getLastValidPosition()));
			}
		}
		maskset = maskset || this.maskset, opts = opts || this.opts;
		var undoValue, $el, maxLength, colorMask, valueBuffer, el = this.el, isRTL = this.isRTL, skipKeyPressEvent = !1, skipInputEvent = !1, ignorable = !1, mouseEnter = !1, EventRuler = {
			on: function(input, eventName, eventHandler) {
				var ev = function(e) {
					if (void 0 === this.inputmask && "FORM" !== this.nodeName) {
						var imOpts = $.data(this, "_inputmask_opts");
						imOpts ? new Inputmask(imOpts).mask(this) : EventRuler.off(this);
					} else {
						if ("setvalue" === e.type || "FORM" === this.nodeName || !(this.disabled || this.readOnly && !("keydown" === e.type && e.ctrlKey && 67 === e.keyCode || opts.tabThrough === !1 && e.keyCode === Inputmask.keyCode.TAB))) {
							switch (e.type) {
							  case "input":
								if (skipInputEvent === !0) return skipInputEvent = !1, e.preventDefault();
								break;

							  case "keydown":
								skipKeyPressEvent = !1, skipInputEvent = !1;
								break;

							  case "keypress":
								if (skipKeyPressEvent === !0) return e.preventDefault();
								skipKeyPressEvent = !0;
								break;

							  case "click":
								if (iemobile || iphone) {
									var that = this, args = arguments;
									return setTimeout(function() {
										eventHandler.apply(that, args);
									}, 0), !1;
								}
							}
							var returnVal = eventHandler.apply(this, arguments);
							return returnVal === !1 && (e.preventDefault(), e.stopPropagation()), returnVal;
						}
						e.preventDefault();
					}
				};
				input.inputmask.events[eventName] = input.inputmask.events[eventName] || [], input.inputmask.events[eventName].push(ev),
				$.inArray(eventName, [ "submit", "reset" ]) !== -1 ? null != input.form && $(input.form).on(eventName, ev) : $(input).on(eventName, ev);
			},
			off: function(input, event) {
				if (input.inputmask && input.inputmask.events) {
					var events;
					event ? (events = [], events[event] = input.inputmask.events[event]) : events = input.inputmask.events,
					$.each(events, function(eventName, evArr) {
						for (;evArr.length > 0; ) {
							var ev = evArr.pop();
							$.inArray(eventName, [ "submit", "reset" ]) !== -1 ? null != input.form && $(input.form).off(eventName, ev) : $(input).off(eventName, ev);
						}
						delete input.inputmask.events[eventName];
					});
				}
			}
		}, EventHandlers = {
			keydownEvent: function(e) {
				function isInputEventSupported(eventName) {
					var el = document.createElement("input"), evName = "on" + eventName, isSupported = evName in el;
					return isSupported || (el.setAttribute(evName, "return;"), isSupported = "function" == typeof el[evName]),
					el = null, isSupported;
				}
				var input = this, $input = $(input), k = e.keyCode, pos = caret(input);
				if (k === Inputmask.keyCode.BACKSPACE || k === Inputmask.keyCode.DELETE || iphone && k === Inputmask.keyCode.BACKSPACE_SAFARI || e.ctrlKey && k === Inputmask.keyCode.X && !isInputEventSupported("cut")) e.preventDefault(),
				handleRemove(input, k, pos), writeBuffer(input, getBuffer(!0), getMaskSet().p, e, input.inputmask._valueGet() !== getBuffer().join("")),
				input.inputmask._valueGet() === getBufferTemplate().join("") ? $input.trigger("cleared") : isComplete(getBuffer()) === !0 && $input.trigger("complete"); else if (k === Inputmask.keyCode.END || k === Inputmask.keyCode.PAGE_DOWN) {
					e.preventDefault();
					var caretPos = seekNext(getLastValidPosition());
					opts.insertMode || caretPos !== getMaskSet().maskLength || e.shiftKey || caretPos--,
					caret(input, e.shiftKey ? pos.begin : caretPos, caretPos, !0);
				} else k === Inputmask.keyCode.HOME && !e.shiftKey || k === Inputmask.keyCode.PAGE_UP ? (e.preventDefault(),
				caret(input, 0, e.shiftKey ? pos.begin : 0, !0)) : (opts.undoOnEscape && k === Inputmask.keyCode.ESCAPE || 90 === k && e.ctrlKey) && e.altKey !== !0 ? (checkVal(input, !0, !1, undoValue.split("")),
				$input.trigger("click")) : k !== Inputmask.keyCode.INSERT || e.shiftKey || e.ctrlKey ? opts.tabThrough === !0 && k === Inputmask.keyCode.TAB ? (e.shiftKey === !0 ? (null === getTest(pos.begin).match.fn && (pos.begin = seekNext(pos.begin)),
				pos.end = seekPrevious(pos.begin, !0), pos.begin = seekPrevious(pos.end, !0)) : (pos.begin = seekNext(pos.begin, !0),
				pos.end = seekNext(pos.begin, !0), pos.end < getMaskSet().maskLength && pos.end--),
				pos.begin < getMaskSet().maskLength && (e.preventDefault(), caret(input, pos.begin, pos.end))) : e.shiftKey || opts.insertMode === !1 && (k === Inputmask.keyCode.RIGHT ? setTimeout(function() {
					var caretPos = caret(input);
					caret(input, caretPos.begin);
				}, 0) : k === Inputmask.keyCode.LEFT && setTimeout(function() {
					var caretPos = caret(input);
					caret(input, isRTL ? caretPos.begin + 1 : caretPos.begin - 1);
				}, 0)) : (opts.insertMode = !opts.insertMode, caret(input, opts.insertMode || pos.begin !== getMaskSet().maskLength ? pos.begin : pos.begin - 1));
				opts.onKeyDown.call(this, e, getBuffer(), caret(input).begin, opts), ignorable = $.inArray(k, opts.ignorables) !== -1;
			},
			keypressEvent: function(e, checkval, writeOut, strict, ndx) {
				var input = this, $input = $(input), k = e.which || e.charCode || e.keyCode;
				if (!(checkval === !0 || e.ctrlKey && e.altKey) && (e.ctrlKey || e.metaKey || ignorable)) return k === Inputmask.keyCode.ENTER && undoValue !== getBuffer().join("") && (undoValue = getBuffer().join(""),
				setTimeout(function() {
					$input.trigger("change");
				}, 0)), !0;
				if (k) {
					46 === k && e.shiftKey === !1 && "," === opts.radixPoint && (k = 44);
					var forwardPosition, pos = checkval ? {
						begin: ndx,
						end: ndx
					} : caret(input), c = String.fromCharCode(k);
					getMaskSet().writeOutBuffer = !0;
					var valResult = isValid(pos, c, strict);
					if (valResult !== !1 && (resetMaskSet(!0), forwardPosition = void 0 !== valResult.caret ? valResult.caret : checkval ? valResult.pos + 1 : seekNext(valResult.pos),
					getMaskSet().p = forwardPosition), writeOut !== !1) {
						var self = this;
						if (setTimeout(function() {
							opts.onKeyValidation.call(self, k, valResult, opts);
						}, 0), getMaskSet().writeOutBuffer && valResult !== !1) {
							var buffer = getBuffer();
							writeBuffer(input, buffer, opts.numericInput && void 0 === valResult.caret ? seekPrevious(forwardPosition) : forwardPosition, e, checkval !== !0),
							checkval !== !0 && setTimeout(function() {
								isComplete(buffer) === !0 && $input.trigger("complete");
							}, 0);
						}
					}
					if (e.preventDefault(), checkval) return valResult.forwardPosition = forwardPosition,
					valResult;
				}
			},
			pasteEvent: function(e) {
				var tempValue, input = this, ev = e.originalEvent || e, $input = $(input), inputValue = input.inputmask._valueGet(!0), caretPos = caret(input);
				isRTL && (tempValue = caretPos.end, caretPos.end = caretPos.begin, caretPos.begin = tempValue);
				var valueBeforeCaret = inputValue.substr(0, caretPos.begin), valueAfterCaret = inputValue.substr(caretPos.end, inputValue.length);
				if (valueBeforeCaret === (isRTL ? getBufferTemplate().reverse() : getBufferTemplate()).slice(0, caretPos.begin).join("") && (valueBeforeCaret = ""),
				valueAfterCaret === (isRTL ? getBufferTemplate().reverse() : getBufferTemplate()).slice(caretPos.end).join("") && (valueAfterCaret = ""),
				isRTL && (tempValue = valueBeforeCaret, valueBeforeCaret = valueAfterCaret, valueAfterCaret = tempValue),
				window.clipboardData && window.clipboardData.getData) inputValue = valueBeforeCaret + window.clipboardData.getData("Text") + valueAfterCaret; else {
					if (!ev.clipboardData || !ev.clipboardData.getData) return !0;
					inputValue = valueBeforeCaret + ev.clipboardData.getData("text/plain") + valueAfterCaret;
				}
				var pasteValue = inputValue;
				if ($.isFunction(opts.onBeforePaste)) {
					if (pasteValue = opts.onBeforePaste(inputValue, opts), pasteValue === !1) return e.preventDefault();
					pasteValue || (pasteValue = inputValue);
				}
				return checkVal(input, !1, !1, isRTL ? pasteValue.split("").reverse() : pasteValue.toString().split("")),
				writeBuffer(input, getBuffer(), seekNext(getLastValidPosition()), e, undoValue !== getBuffer().join("")),
				isComplete(getBuffer()) === !0 && $input.trigger("complete"), e.preventDefault();
			},
			inputFallBackEvent: function(e) {
				var input = this, inputValue = input.inputmask._valueGet();
				if (getBuffer().join("") !== inputValue) {
					var caretPos = caret(input);
					if (inputValue = inputValue.replace(new RegExp("(" + Inputmask.escapeRegex(getBufferTemplate().join("")) + ")*"), ""),
					iemobile) {
						var inputChar = inputValue.replace(getBuffer().join(""), "");
						if (1 === inputChar.length) {
							var keypress = new $.Event("keypress");
							return keypress.which = inputChar.charCodeAt(0), EventHandlers.keypressEvent.call(input, keypress, !0, !0, !1, getMaskSet().validPositions[caretPos.begin - 1] ? caretPos.begin : caretPos.begin - 1),
							!1;
						}
					}
					if (caretPos.begin > inputValue.length && (caret(input, inputValue.length), caretPos = caret(input)),
					getBuffer().length - inputValue.length !== 1 || inputValue.charAt(caretPos.begin) === getBuffer()[caretPos.begin] || inputValue.charAt(caretPos.begin + 1) === getBuffer()[caretPos.begin] || isMask(caretPos.begin)) {
						for (var lvp = getLastValidPosition() + 1, bufferTemplate = getBufferTemplate().join(""); null === inputValue.match(Inputmask.escapeRegex(bufferTemplate) + "$"); ) bufferTemplate = bufferTemplate.slice(1);
						inputValue = inputValue.replace(bufferTemplate, ""), inputValue = inputValue.split(""),
						checkVal(input, !0, !1, inputValue, e, caretPos.begin < lvp), isComplete(getBuffer()) === !0 && $(input).trigger("complete");
					} else e.keyCode = Inputmask.keyCode.BACKSPACE, EventHandlers.keydownEvent.call(input, e);
					e.preventDefault();
				}
			},
			setValueEvent: function(e) {
				this.inputmask.refreshValue = !1;
				var input = this, value = input.inputmask._valueGet();
				checkVal(input, !0, !1, ($.isFunction(opts.onBeforeMask) ? opts.onBeforeMask(value, opts) || value : value).split("")),
				undoValue = getBuffer().join(""), (opts.clearMaskOnLostFocus || opts.clearIncomplete) && input.inputmask._valueGet() === getBufferTemplate().join("") && input.inputmask._valueSet("");
			},
			focusEvent: function(e) {
				var input = this, nptValue = input.inputmask._valueGet();
				opts.showMaskOnFocus && (!opts.showMaskOnHover || opts.showMaskOnHover && "" === nptValue) && (input.inputmask._valueGet() !== getBuffer().join("") ? writeBuffer(input, getBuffer(), seekNext(getLastValidPosition())) : mouseEnter === !1 && caret(input, seekNext(getLastValidPosition()))),
				opts.positionCaretOnTab === !0 && EventHandlers.clickEvent.apply(input, [ e, !0 ]),
				undoValue = getBuffer().join("");
			},
			mouseleaveEvent: function(e) {
				var input = this;
				if (mouseEnter = !1, opts.clearMaskOnLostFocus && document.activeElement !== input) {
					var buffer = getBuffer().slice(), nptValue = input.inputmask._valueGet();
					nptValue !== input.getAttribute("placeholder") && "" !== nptValue && (getLastValidPosition() === -1 && nptValue === getBufferTemplate().join("") ? buffer = [] : clearOptionalTail(buffer),
					writeBuffer(input, buffer));
				}
			},
			clickEvent: function(e, tabbed) {
				function doRadixFocus(clickPos) {
					if ("" !== opts.radixPoint) {
						var vps = getMaskSet().validPositions;
						if (void 0 === vps[clickPos] || vps[clickPos].input === getPlaceholder(clickPos)) {
							if (clickPos < seekNext(-1)) return !0;
							var radixPos = $.inArray(opts.radixPoint, getBuffer());
							if (radixPos !== -1) {
								for (var vp in vps) if (radixPos < vp && vps[vp].input !== getPlaceholder(vp)) return !1;
								return !0;
							}
						}
					}
					return !1;
				}
				var input = this;
				setTimeout(function() {
					if (document.activeElement === input) {
						var selectedCaret = caret(input);
						if (tabbed && (selectedCaret.begin = selectedCaret.end), selectedCaret.begin === selectedCaret.end) switch (opts.positionCaretOnClick) {
						  case "none":
							break;

						  case "radixFocus":
							if (doRadixFocus(selectedCaret.begin)) {
								var radixPos = $.inArray(opts.radixPoint, getBuffer().join(""));
								caret(input, opts.numericInput ? seekNext(radixPos) : radixPos);
								break;
							}

						  default:
							var clickPosition = selectedCaret.begin, lvclickPosition = getLastValidPosition(clickPosition, !0), lastPosition = seekNext(lvclickPosition);
							if (clickPosition < lastPosition) caret(input, isMask(clickPosition) || isMask(clickPosition - 1) ? clickPosition : seekNext(clickPosition)); else {
								var placeholder = getPlaceholder(lastPosition);
								("" !== placeholder && getBuffer()[lastPosition] !== placeholder && getTest(lastPosition).match.optionalQuantifier !== !0 || !isMask(lastPosition) && getTest(lastPosition).match.def === placeholder) && (lastPosition = seekNext(lastPosition)),
								caret(input, lastPosition);
							}
						}
					}
				}, 0);
			},
			dblclickEvent: function(e) {
				var input = this;
				setTimeout(function() {
					caret(input, 0, seekNext(getLastValidPosition()));
				}, 0);
			},
			cutEvent: function(e) {
				var input = this, $input = $(input), pos = caret(input), ev = e.originalEvent || e, clipboardData = window.clipboardData || ev.clipboardData, clipData = isRTL ? getBuffer().slice(pos.end, pos.begin) : getBuffer().slice(pos.begin, pos.end);
				clipboardData.setData("text", isRTL ? clipData.reverse().join("") : clipData.join("")),
				document.execCommand && document.execCommand("copy"), handleRemove(input, Inputmask.keyCode.DELETE, pos),
				writeBuffer(input, getBuffer(), getMaskSet().p, e, undoValue !== getBuffer().join("")),
				input.inputmask._valueGet() === getBufferTemplate().join("") && $input.trigger("cleared");
			},
			blurEvent: function(e) {
				var $input = $(this), input = this;
				if (input.inputmask) {
					var nptValue = input.inputmask._valueGet(), buffer = getBuffer().slice();
					undoValue !== buffer.join("") && setTimeout(function() {
						$input.trigger("change"), undoValue = buffer.join("");
					}, 0), "" !== nptValue && (opts.clearMaskOnLostFocus && (getLastValidPosition() === -1 && nptValue === getBufferTemplate().join("") ? buffer = [] : clearOptionalTail(buffer)),
					isComplete(buffer) === !1 && (setTimeout(function() {
						$input.trigger("incomplete");
					}, 0), opts.clearIncomplete && (resetMaskSet(), buffer = opts.clearMaskOnLostFocus ? [] : getBufferTemplate().slice())),
					writeBuffer(input, buffer, void 0, e));
				}
			},
			mouseenterEvent: function(e) {
				var input = this;
				mouseEnter = !0, document.activeElement !== input && opts.showMaskOnHover && input.inputmask._valueGet() !== getBuffer().join("") && writeBuffer(input, getBuffer());
			},
			submitEvent: function(e) {
				undoValue !== getBuffer().join("") && $el.trigger("change"), opts.clearMaskOnLostFocus && getLastValidPosition() === -1 && el.inputmask._valueGet && el.inputmask._valueGet() === getBufferTemplate().join("") && el.inputmask._valueSet(""),
				opts.removeMaskOnSubmit && (el.inputmask._valueSet(el.inputmask.unmaskedvalue(), !0),
				setTimeout(function() {
					writeBuffer(el, getBuffer());
				}, 0));
			},
			resetEvent: function(e) {
				el.inputmask.refreshValue = !0, setTimeout(function() {
					$el.trigger("setvalue");
				}, 0);
			}
		};
		if (void 0 !== actionObj) switch (actionObj.action) {
		  case "isComplete":
			return el = actionObj.el, isComplete(getBuffer());

		  case "unmaskedvalue":
			return void 0 !== el && void 0 === actionObj.value || (valueBuffer = actionObj.value,
			valueBuffer = ($.isFunction(opts.onBeforeMask) ? opts.onBeforeMask(valueBuffer, opts) || valueBuffer : valueBuffer).split(""),
			checkVal(void 0, !1, !1, isRTL ? valueBuffer.reverse() : valueBuffer), $.isFunction(opts.onBeforeWrite) && opts.onBeforeWrite(void 0, getBuffer(), 0, opts)),
			unmaskedvalue(el);

		  case "mask":
			mask(el);
			break;

		  case "format":
			return valueBuffer = ($.isFunction(opts.onBeforeMask) ? opts.onBeforeMask(actionObj.value, opts) || actionObj.value : actionObj.value).split(""),
			checkVal(void 0, !1, !1, isRTL ? valueBuffer.reverse() : valueBuffer), $.isFunction(opts.onBeforeWrite) && opts.onBeforeWrite(void 0, getBuffer(), 0, opts),
			actionObj.metadata ? {
				value: isRTL ? getBuffer().slice().reverse().join("") : getBuffer().join(""),
				metadata: maskScope.call(this, {
					action: "getmetadata"
				}, maskset, opts)
			} : isRTL ? getBuffer().slice().reverse().join("") : getBuffer().join("");

		  case "isValid":
			actionObj.value ? (valueBuffer = actionObj.value.split(""), checkVal(void 0, !1, !0, isRTL ? valueBuffer.reverse() : valueBuffer)) : actionObj.value = getBuffer().join("");
			for (var buffer = getBuffer(), rl = determineLastRequiredPosition(), lmib = buffer.length - 1; lmib > rl && !isMask(lmib); lmib--) ;
			return buffer.splice(rl, lmib + 1 - rl), isComplete(buffer) && actionObj.value === getBuffer().join("");

		  case "getemptymask":
			return getBufferTemplate().join("");

		  case "remove":
			if (el) {
				$el = $(el), el.inputmask._valueSet(unmaskedvalue(el)), EventRuler.off(el);
				var valueProperty;
				Object.getOwnPropertyDescriptor && Object.getPrototypeOf ? (valueProperty = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), "value"),
				valueProperty && el.inputmask.__valueGet && Object.defineProperty(el, "value", {
					get: el.inputmask.__valueGet,
					set: el.inputmask.__valueSet,
					configurable: !0
				})) : document.__lookupGetter__ && el.__lookupGetter__("value") && el.inputmask.__valueGet && (el.__defineGetter__("value", el.inputmask.__valueGet),
				el.__defineSetter__("value", el.inputmask.__valueSet)), el.inputmask = void 0;
			}
			return el;

		  case "getmetadata":
			if ($.isArray(maskset.metadata)) {
				var maskTarget = getMaskTemplate(!0, 0, !1).join("");
				return $.each(maskset.metadata, function(ndx, mtdt) {
					if (mtdt.mask === maskTarget) return maskTarget = mtdt, !1;
				}), maskTarget;
			}
			return maskset.metadata;
		}
	}
	var ua = navigator.userAgent, mobile = /mobile/i.test(ua), iemobile = /iemobile/i.test(ua), iphone = /iphone/i.test(ua) && !iemobile, android = /android/i.test(ua) && !iemobile;
	return Inputmask.prototype = {
		defaults: {
			placeholder: "_",
			optionalmarker: {
				start: "[",
				end: "]"
			},
			quantifiermarker: {
				start: "{",
				end: "}"
			},
			groupmarker: {
				start: "(",
				end: ")"
			},
			alternatormarker: "|",
			escapeChar: "\\",
			mask: null,
			oncomplete: $.noop,
			onincomplete: $.noop,
			oncleared: $.noop,
			repeat: 0,
			greedy: !0,
			autoUnmask: !1,
			removeMaskOnSubmit: !1,
			clearMaskOnLostFocus: !0,
			insertMode: !0,
			clearIncomplete: !1,
			aliases: {},
			alias: null,
			onKeyDown: $.noop,
			onBeforeMask: null,
			onBeforePaste: function(pastedValue, opts) {
				return $.isFunction(opts.onBeforeMask) ? opts.onBeforeMask(pastedValue, opts) : pastedValue;
			},
			onBeforeWrite: null,
			onUnMask: null,
			showMaskOnFocus: !0,
			showMaskOnHover: !0,
			onKeyValidation: $.noop,
			skipOptionalPartCharacter: " ",
			numericInput: !1,
			rightAlign: !1,
			undoOnEscape: !0,
			radixPoint: "",
			radixPointDefinitionSymbol: void 0,
			groupSeparator: "",
			keepStatic: null,
			positionCaretOnTab: !0,
			tabThrough: !1,
			supportsInputType: [ "text", "tel", "password" ],
			definitions: {
				"9": {
					validator: "[0-9]",
					cardinality: 1,
					definitionSymbol: "*"
				},
				a: {
					validator: "[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]",
					cardinality: 1,
					definitionSymbol: "*"
				},
				"*": {
					validator: "[0-9A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]",
					cardinality: 1
				}
			},
			ignorables: [ 8, 9, 13, 19, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123 ],
			isComplete: null,
			canClearPosition: $.noop,
			postValidation: null,
			staticDefinitionSymbol: void 0,
			jitMasking: !1,
			nullable: !0,
			inputEventOnly: !1,
			noValuePatching: !1,
			positionCaretOnClick: "lvp",
			casing: null,
			inputmode: "verbatim",
			colorMask: !1,
			androidHack: !1
		},
		masksCache: {},
		mask: function(elems) {
			function importAttributeOptions(npt, opts, userOptions, dataAttribute) {
				function importOption(option, optionData) {
					optionData = void 0 !== optionData ? optionData : npt.getAttribute(dataAttribute + "-" + option),
					null !== optionData && ("string" == typeof optionData && (0 === option.indexOf("on") ? optionData = window[optionData] : "false" === optionData ? optionData = !1 : "true" === optionData && (optionData = !0)),
					userOptions[option] = optionData);
				}
				var option, dataoptions, optionData, p, attrOptions = npt.getAttribute(dataAttribute);
				if (attrOptions && "" !== attrOptions && (attrOptions = attrOptions.replace(new RegExp("'", "g"), '"'),
				dataoptions = JSON.parse("{" + attrOptions + "}")), dataoptions) {
					optionData = void 0;
					for (p in dataoptions) if ("alias" === p.toLowerCase()) {
						optionData = dataoptions[p];
						break;
					}
				}
				importOption("alias", optionData), userOptions.alias && resolveAlias(userOptions.alias, userOptions, opts);
				for (option in opts) {
					if (dataoptions) {
						optionData = void 0;
						for (p in dataoptions) if (p.toLowerCase() === option.toLowerCase()) {
							optionData = dataoptions[p];
							break;
						}
					}
					importOption(option, optionData);
				}
				return $.extend(!0, opts, userOptions), opts;
			}
			var that = this;
			return "string" == typeof elems && (elems = document.getElementById(elems) || document.querySelectorAll(elems)),
			elems = elems.nodeName ? [ elems ] : elems, $.each(elems, function(ndx, el) {
				var scopedOpts = $.extend(!0, {}, that.opts);
				importAttributeOptions(el, scopedOpts, $.extend(!0, {}, that.userOptions), that.dataAttribute);
				var maskset = generateMaskSet(scopedOpts, that.noMasksCache);
				void 0 !== maskset && (void 0 !== el.inputmask && el.inputmask.remove(), el.inputmask = new Inputmask(),
				el.inputmask.opts = scopedOpts, el.inputmask.noMasksCache = that.noMasksCache, el.inputmask.userOptions = $.extend(!0, {}, that.userOptions),
				el.inputmask.el = el, el.inputmask.maskset = maskset, $.data(el, "_inputmask_opts", scopedOpts),
				maskScope.call(el.inputmask, {
					action: "mask"
				}));
			}), elems && elems[0] ? elems[0].inputmask || this : this;
		},
		option: function(options, noremask) {
			return "string" == typeof options ? this.opts[options] : "object" == typeof options ? ($.extend(this.userOptions, options),
			this.el && noremask !== !0 && this.mask(this.el), this) : void 0;
		},
		unmaskedvalue: function(value) {
			return this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache),
			maskScope.call(this, {
				action: "unmaskedvalue",
				value: value
			});
		},
		remove: function() {
			return maskScope.call(this, {
				action: "remove"
			});
		},
		getemptymask: function() {
			return this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache),
			maskScope.call(this, {
				action: "getemptymask"
			});
		},
		hasMaskedValue: function() {
			return !this.opts.autoUnmask;
		},
		isComplete: function() {
			return this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache),
			maskScope.call(this, {
				action: "isComplete"
			});
		},
		getmetadata: function() {
			return this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache),
			maskScope.call(this, {
				action: "getmetadata"
			});
		},
		isValid: function(value) {
			return this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache),
			maskScope.call(this, {
				action: "isValid",
				value: value
			});
		},
		format: function(value, metadata) {
			return this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache),
			maskScope.call(this, {
				action: "format",
				value: value,
				metadata: metadata
			});
		},
		analyseMask: function(mask, opts) {
			function MaskToken(isGroup, isOptional, isQuantifier, isAlternator) {
				this.matches = [], this.openGroup = isGroup || !1, this.isGroup = isGroup || !1,
				this.isOptional = isOptional || !1, this.isQuantifier = isQuantifier || !1, this.isAlternator = isAlternator || !1,
				this.quantifier = {
					min: 1,
					max: 1
				};
			}
			function insertTestDefinition(mtoken, element, position) {
				var maskdef = opts.definitions[element];
				position = void 0 !== position ? position : mtoken.matches.length;
				var prevMatch = mtoken.matches[position - 1];
				if (maskdef && !escaped) {
					maskdef.placeholder = $.isFunction(maskdef.placeholder) ? maskdef.placeholder(opts) : maskdef.placeholder;
					for (var prevalidators = maskdef.prevalidator, prevalidatorsL = prevalidators ? prevalidators.length : 0, i = 1; i < maskdef.cardinality; i++) {
						var prevalidator = prevalidatorsL >= i ? prevalidators[i - 1] : [], validator = prevalidator.validator, cardinality = prevalidator.cardinality;
						mtoken.matches.splice(position++, 0, {
							fn: validator ? "string" == typeof validator ? new RegExp(validator) : new function() {
								this.test = validator;
							}() : new RegExp("."),
							cardinality: cardinality ? cardinality : 1,
							optionality: mtoken.isOptional,
							newBlockMarker: void 0 === prevMatch || prevMatch.def !== (maskdef.definitionSymbol || element),
							casing: maskdef.casing,
							def: maskdef.definitionSymbol || element,
							placeholder: maskdef.placeholder,
							nativeDef: element
						}), prevMatch = mtoken.matches[position - 1];
					}
					mtoken.matches.splice(position++, 0, {
						fn: maskdef.validator ? "string" == typeof maskdef.validator ? new RegExp(maskdef.validator) : new function() {
							this.test = maskdef.validator;
						}() : new RegExp("."),
						cardinality: maskdef.cardinality,
						optionality: mtoken.isOptional,
						newBlockMarker: void 0 === prevMatch || prevMatch.def !== (maskdef.definitionSymbol || element),
						casing: maskdef.casing,
						def: maskdef.definitionSymbol || element,
						placeholder: maskdef.placeholder,
						nativeDef: element
					});
				} else mtoken.matches.splice(position++, 0, {
					fn: null,
					cardinality: 0,
					optionality: mtoken.isOptional,
					newBlockMarker: void 0 === prevMatch || prevMatch.def !== element,
					casing: null,
					def: opts.staticDefinitionSymbol || element,
					placeholder: void 0 !== opts.staticDefinitionSymbol ? element : void 0,
					nativeDef: element
				}), escaped = !1;
			}
			function verifyGroupMarker(maskToken) {
				maskToken && maskToken.matches && $.each(maskToken.matches, function(ndx, token) {
					var nextToken = maskToken.matches[ndx + 1];
					(void 0 === nextToken || void 0 === nextToken.matches || nextToken.isQuantifier === !1) && token && token.isGroup && (token.isGroup = !1,
					insertTestDefinition(token, opts.groupmarker.start, 0), token.openGroup !== !0 && insertTestDefinition(token, opts.groupmarker.end)),
					verifyGroupMarker(token);
				});
			}
			function defaultCase() {
				if (openenings.length > 0) {
					if (currentOpeningToken = openenings[openenings.length - 1], insertTestDefinition(currentOpeningToken, m),
					currentOpeningToken.isAlternator) {
						alternator = openenings.pop();
						for (var mndx = 0; mndx < alternator.matches.length; mndx++) alternator.matches[mndx].isGroup = !1;
						openenings.length > 0 ? (currentOpeningToken = openenings[openenings.length - 1],
						currentOpeningToken.matches.push(alternator)) : currentToken.matches.push(alternator);
					}
				} else insertTestDefinition(currentToken, m);
			}
			function reverseTokens(maskToken) {
				function reverseStatic(st) {
					return st === opts.optionalmarker.start ? st = opts.optionalmarker.end : st === opts.optionalmarker.end ? st = opts.optionalmarker.start : st === opts.groupmarker.start ? st = opts.groupmarker.end : st === opts.groupmarker.end && (st = opts.groupmarker.start),
					st;
				}
				maskToken.matches = maskToken.matches.reverse();
				for (var match in maskToken.matches) {
					var intMatch = parseInt(match);
					if (maskToken.matches[match].isQuantifier && maskToken.matches[intMatch + 1] && maskToken.matches[intMatch + 1].isGroup) {
						var qt = maskToken.matches[match];
						maskToken.matches.splice(match, 1), maskToken.matches.splice(intMatch + 1, 0, qt);
					}
					void 0 !== maskToken.matches[match].matches ? maskToken.matches[match] = reverseTokens(maskToken.matches[match]) : maskToken.matches[match] = reverseStatic(maskToken.matches[match]);
				}
				return maskToken;
			}
			for (var match, m, openingToken, currentOpeningToken, alternator, lastMatch, groupToken, tokenizer = /(?:[?*+]|\{[0-9\+\*]+(?:,[0-9\+\*]*)?\})|[^.?*+^${[]()|\\]+|./g, escaped = !1, currentToken = new MaskToken(), openenings = [], maskTokens = []; match = tokenizer.exec(mask); ) if (m = match[0],
			escaped) defaultCase(); else switch (m.charAt(0)) {
			  case opts.escapeChar:
				escaped = !0;
				break;

			  case opts.optionalmarker.end:
			  case opts.groupmarker.end:
				if (openingToken = openenings.pop(), openingToken.openGroup = !1, void 0 !== openingToken) if (openenings.length > 0) {
					if (currentOpeningToken = openenings[openenings.length - 1], currentOpeningToken.matches.push(openingToken),
					currentOpeningToken.isAlternator) {
						alternator = openenings.pop();
						for (var mndx = 0; mndx < alternator.matches.length; mndx++) alternator.matches[mndx].isGroup = !1;
						openenings.length > 0 ? (currentOpeningToken = openenings[openenings.length - 1],
						currentOpeningToken.matches.push(alternator)) : currentToken.matches.push(alternator);
					}
				} else currentToken.matches.push(openingToken); else defaultCase();
				break;

			  case opts.optionalmarker.start:
				openenings.push(new MaskToken((!1), (!0)));
				break;

			  case opts.groupmarker.start:
				openenings.push(new MaskToken((!0)));
				break;

			  case opts.quantifiermarker.start:
				var quantifier = new MaskToken((!1), (!1), (!0));
				m = m.replace(/[{}]/g, "");
				var mq = m.split(","), mq0 = isNaN(mq[0]) ? mq[0] : parseInt(mq[0]), mq1 = 1 === mq.length ? mq0 : isNaN(mq[1]) ? mq[1] : parseInt(mq[1]);
				if ("*" !== mq1 && "+" !== mq1 || (mq0 = "*" === mq1 ? 0 : 1), quantifier.quantifier = {
					min: mq0,
					max: mq1
				}, openenings.length > 0) {
					var matches = openenings[openenings.length - 1].matches;
					match = matches.pop(), match.isGroup || (groupToken = new MaskToken((!0)), groupToken.matches.push(match),
					match = groupToken), matches.push(match), matches.push(quantifier);
				} else match = currentToken.matches.pop(), match.isGroup || (groupToken = new MaskToken((!0)),
				groupToken.matches.push(match), match = groupToken), currentToken.matches.push(match),
				currentToken.matches.push(quantifier);
				break;

			  case opts.alternatormarker:
				openenings.length > 0 ? (currentOpeningToken = openenings[openenings.length - 1],
				lastMatch = currentOpeningToken.matches.pop()) : lastMatch = currentToken.matches.pop(),
				lastMatch.isAlternator ? openenings.push(lastMatch) : (alternator = new MaskToken((!1), (!1), (!1), (!0)),
				alternator.matches.push(lastMatch), openenings.push(alternator));
				break;

			  default:
				defaultCase();
			}
			for (;openenings.length > 0; ) openingToken = openenings.pop(), currentToken.matches.push(openingToken);
			return currentToken.matches.length > 0 && (verifyGroupMarker(currentToken), maskTokens.push(currentToken)),
			opts.numericInput && reverseTokens(maskTokens[0]), maskTokens;
		}
	}, Inputmask.extendDefaults = function(options) {
		$.extend(!0, Inputmask.prototype.defaults, options);
	}, Inputmask.extendDefinitions = function(definition) {
		$.extend(!0, Inputmask.prototype.defaults.definitions, definition);
	}, Inputmask.extendAliases = function(alias) {
		$.extend(!0, Inputmask.prototype.defaults.aliases, alias);
	}, Inputmask.format = function(value, options, metadata) {
		return Inputmask(options).format(value, metadata);
	}, Inputmask.unmask = function(value, options) {
		return Inputmask(options).unmaskedvalue(value);
	}, Inputmask.isValid = function(value, options) {
		return Inputmask(options).isValid(value);
	}, Inputmask.remove = function(elems) {
		$.each(elems, function(ndx, el) {
			el.inputmask && el.inputmask.remove();
		});
	}, Inputmask.escapeRegex = function(str) {
		var specials = [ "/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\", "$", "^" ];
		return str.replace(new RegExp("(\\" + specials.join("|\\") + ")", "gim"), "\\$1");
	}, Inputmask.keyCode = {
		ALT: 18,
		BACKSPACE: 8,
		BACKSPACE_SAFARI: 127,
		CAPS_LOCK: 20,
		COMMA: 188,
		COMMAND: 91,
		COMMAND_LEFT: 91,
		COMMAND_RIGHT: 93,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		MENU: 93,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38,
		WINDOWS: 91,
		X: 88
	}, window.Inputmask = Inputmask, Inputmask;
}(jQuery), function($, Inputmask) {
	return void 0 === $.fn.inputmask && ($.fn.inputmask = function(fn, options) {
		var nptmask, input = this[0];
		if (void 0 === options && (options = {}), "string" == typeof fn) switch (fn) {
		  case "unmaskedvalue":
			return input && input.inputmask ? input.inputmask.unmaskedvalue() : $(input).val();

		  case "remove":
			return this.each(function() {
				this.inputmask && this.inputmask.remove();
			});

		  case "getemptymask":
			return input && input.inputmask ? input.inputmask.getemptymask() : "";

		  case "hasMaskedValue":
			return !(!input || !input.inputmask) && input.inputmask.hasMaskedValue();

		  case "isComplete":
			return !input || !input.inputmask || input.inputmask.isComplete();

		  case "getmetadata":
			return input && input.inputmask ? input.inputmask.getmetadata() : void 0;

		  case "setvalue":
			$(input).val(options), input && void 0 === input.inputmask && $(input).triggerHandler("setvalue");
			break;

		  case "option":
			if ("string" != typeof options) return this.each(function() {
				if (void 0 !== this.inputmask) return this.inputmask.option(options);
			});
			if (input && void 0 !== input.inputmask) return input.inputmask.option(options);
			break;

		  default:
			return options.alias = fn, nptmask = new Inputmask(options), this.each(function() {
				nptmask.mask(this);
			});
		} else {
			if ("object" == typeof fn) return nptmask = new Inputmask(fn), void 0 === fn.mask && void 0 === fn.alias ? this.each(function() {
				return void 0 !== this.inputmask ? this.inputmask.option(fn) : void nptmask.mask(this);
			}) : this.each(function() {
				nptmask.mask(this);
			});
			if (void 0 === fn) return this.each(function() {
				nptmask = new Inputmask(options), nptmask.mask(this);
			});
		}
	}), $.fn.inputmask;
}(jQuery, Inputmask), function($, Inputmask) {}(jQuery, Inputmask), function($, Inputmask) {
	function isLeapYear(year) {
		return isNaN(year) || 29 === new Date(year, 2, 0).getDate();
	}
	return Inputmask.extendAliases({
		"dd/mm/yyyy": {
			mask: "1/2/y",
			placeholder: "dd/mm/yyyy",
			regex: {
				val1pre: new RegExp("[0-3]"),
				val1: new RegExp("0[1-9]|[12][0-9]|3[01]"),
				val2pre: function(separator) {
					var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
					return new RegExp("((0[1-9]|[12][0-9]|3[01])" + escapedSeparator + "[01])");
				},
				val2: function(separator) {
					var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
					return new RegExp("((0[1-9]|[12][0-9])" + escapedSeparator + "(0[1-9]|1[012]))|(30" + escapedSeparator + "(0[13-9]|1[012]))|(31" + escapedSeparator + "(0[13578]|1[02]))");
				}
			},
			leapday: "29/02/",
			separator: "/",
			yearrange: {
				minyear: 1900,
				maxyear: 2099
			},
			isInYearRange: function(chrs, minyear, maxyear) {
				if (isNaN(chrs)) return !1;
				var enteredyear = parseInt(chrs.concat(minyear.toString().slice(chrs.length))), enteredyear2 = parseInt(chrs.concat(maxyear.toString().slice(chrs.length)));
				return !isNaN(enteredyear) && (minyear <= enteredyear && enteredyear <= maxyear) || !isNaN(enteredyear2) && (minyear <= enteredyear2 && enteredyear2 <= maxyear);
			},
			determinebaseyear: function(minyear, maxyear, hint) {
				var currentyear = new Date().getFullYear();
				if (minyear > currentyear) return minyear;
				if (maxyear < currentyear) {
					for (var maxYearPrefix = maxyear.toString().slice(0, 2), maxYearPostfix = maxyear.toString().slice(2, 4); maxyear < maxYearPrefix + hint; ) maxYearPrefix--;
					var maxxYear = maxYearPrefix + maxYearPostfix;
					return minyear > maxxYear ? minyear : maxxYear;
				}
				if (minyear <= currentyear && currentyear <= maxyear) {
					for (var currentYearPrefix = currentyear.toString().slice(0, 2); maxyear < currentYearPrefix + hint; ) currentYearPrefix--;
					var currentYearAndHint = currentYearPrefix + hint;
					return currentYearAndHint < minyear ? minyear : currentYearAndHint;
				}
				return currentyear;
			},
			onKeyDown: function(e, buffer, caretPos, opts) {
				var $input = $(this);
				if (e.ctrlKey && e.keyCode === Inputmask.keyCode.RIGHT) {
					var today = new Date();
					$input.val(today.getDate().toString() + (today.getMonth() + 1).toString() + today.getFullYear().toString()),
					$input.trigger("setvalue");
				}
			},
			getFrontValue: function(mask, buffer, opts) {
				for (var start = 0, length = 0, i = 0; i < mask.length && "2" !== mask.charAt(i); i++) {
					var definition = opts.definitions[mask.charAt(i)];
					definition ? (start += length, length = definition.cardinality) : length++;
				}
				return buffer.join("").substr(start, length);
			},
			postValidation: function(buffer, currentResult, opts) {
				var dayMonthValue, year, bufferStr = buffer.join("");
				return 0 === opts.mask.indexOf("y") ? (year = bufferStr.substr(0, 4), dayMonthValue = bufferStr.substr(4, 11)) : (year = bufferStr.substr(6, 11),
				dayMonthValue = bufferStr.substr(0, 6)), currentResult && (dayMonthValue !== opts.leapday || isLeapYear(year));
			},
			definitions: {
				"1": {
					validator: function(chrs, maskset, pos, strict, opts) {
						var isValid = opts.regex.val1.test(chrs);
						return strict || isValid || chrs.charAt(1) !== opts.separator && "-./".indexOf(chrs.charAt(1)) === -1 || !(isValid = opts.regex.val1.test("0" + chrs.charAt(0))) ? isValid : (maskset.buffer[pos - 1] = "0",
						{
							refreshFromBuffer: {
								start: pos - 1,
								end: pos
							},
							pos: pos,
							c: chrs.charAt(0)
						});
					},
					cardinality: 2,
					prevalidator: [ {
						validator: function(chrs, maskset, pos, strict, opts) {
							var pchrs = chrs;
							isNaN(maskset.buffer[pos + 1]) || (pchrs += maskset.buffer[pos + 1]);
							var isValid = 1 === pchrs.length ? opts.regex.val1pre.test(pchrs) : opts.regex.val1.test(pchrs);
							if (!strict && !isValid) {
								if (isValid = opts.regex.val1.test(chrs + "0")) return maskset.buffer[pos] = chrs,
								maskset.buffer[++pos] = "0", {
									pos: pos,
									c: "0"
								};
								if (isValid = opts.regex.val1.test("0" + chrs)) return maskset.buffer[pos] = "0",
								pos++, {
									pos: pos
								};
							}
							return isValid;
						},
						cardinality: 1
					} ]
				},
				"2": {
					validator: function(chrs, maskset, pos, strict, opts) {
						var frontValue = opts.getFrontValue(maskset.mask, maskset.buffer, opts);
						frontValue.indexOf(opts.placeholder[0]) !== -1 && (frontValue = "01" + opts.separator);
						var isValid = opts.regex.val2(opts.separator).test(frontValue + chrs);
						return strict || isValid || chrs.charAt(1) !== opts.separator && "-./".indexOf(chrs.charAt(1)) === -1 || !(isValid = opts.regex.val2(opts.separator).test(frontValue + "0" + chrs.charAt(0))) ? isValid : (maskset.buffer[pos - 1] = "0",
						{
							refreshFromBuffer: {
								start: pos - 1,
								end: pos
							},
							pos: pos,
							c: chrs.charAt(0)
						});
					},
					cardinality: 2,
					prevalidator: [ {
						validator: function(chrs, maskset, pos, strict, opts) {
							isNaN(maskset.buffer[pos + 1]) || (chrs += maskset.buffer[pos + 1]);
							var frontValue = opts.getFrontValue(maskset.mask, maskset.buffer, opts);
							frontValue.indexOf(opts.placeholder[0]) !== -1 && (frontValue = "01" + opts.separator);
							var isValid = 1 === chrs.length ? opts.regex.val2pre(opts.separator).test(frontValue + chrs) : opts.regex.val2(opts.separator).test(frontValue + chrs);
							return strict || isValid || !(isValid = opts.regex.val2(opts.separator).test(frontValue + "0" + chrs)) ? isValid : (maskset.buffer[pos] = "0",
							pos++, {
								pos: pos
							});
						},
						cardinality: 1
					} ]
				},
				y: {
					validator: function(chrs, maskset, pos, strict, opts) {
						return opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
					},
					cardinality: 4,
					prevalidator: [ {
						validator: function(chrs, maskset, pos, strict, opts) {
							var isValid = opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
							if (!strict && !isValid) {
								var yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs + "0").toString().slice(0, 1);
								if (isValid = opts.isInYearRange(yearPrefix + chrs, opts.yearrange.minyear, opts.yearrange.maxyear)) return maskset.buffer[pos++] = yearPrefix.charAt(0),
								{
									pos: pos
								};
								if (yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs + "0").toString().slice(0, 2),
								isValid = opts.isInYearRange(yearPrefix + chrs, opts.yearrange.minyear, opts.yearrange.maxyear)) return maskset.buffer[pos++] = yearPrefix.charAt(0),
								maskset.buffer[pos++] = yearPrefix.charAt(1), {
									pos: pos
								};
							}
							return isValid;
						},
						cardinality: 1
					}, {
						validator: function(chrs, maskset, pos, strict, opts) {
							var isValid = opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
							if (!strict && !isValid) {
								var yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs).toString().slice(0, 2);
								if (isValid = opts.isInYearRange(chrs[0] + yearPrefix[1] + chrs[1], opts.yearrange.minyear, opts.yearrange.maxyear)) return maskset.buffer[pos++] = yearPrefix.charAt(1),
								{
									pos: pos
								};
								if (yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs).toString().slice(0, 2),
								isValid = opts.isInYearRange(yearPrefix + chrs, opts.yearrange.minyear, opts.yearrange.maxyear)) return maskset.buffer[pos - 1] = yearPrefix.charAt(0),
								maskset.buffer[pos++] = yearPrefix.charAt(1), maskset.buffer[pos++] = chrs.charAt(0),
								{
									refreshFromBuffer: {
										start: pos - 3,
										end: pos
									},
									pos: pos
								};
							}
							return isValid;
						},
						cardinality: 2
					}, {
						validator: function(chrs, maskset, pos, strict, opts) {
							return opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
						},
						cardinality: 3
					} ]
				}
			},
			insertMode: !1,
			autoUnmask: !1
		},
		"mm/dd/yyyy": {
			placeholder: "mm/dd/yyyy",
			alias: "dd/mm/yyyy",
			regex: {
				val2pre: function(separator) {
					var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
					return new RegExp("((0[13-9]|1[012])" + escapedSeparator + "[0-3])|(02" + escapedSeparator + "[0-2])");
				},
				val2: function(separator) {
					var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
					return new RegExp("((0[1-9]|1[012])" + escapedSeparator + "(0[1-9]|[12][0-9]))|((0[13-9]|1[012])" + escapedSeparator + "30)|((0[13578]|1[02])" + escapedSeparator + "31)");
				},
				val1pre: new RegExp("[01]"),
				val1: new RegExp("0[1-9]|1[012]")
			},
			leapday: "02/29/",
			onKeyDown: function(e, buffer, caretPos, opts) {
				var $input = $(this);
				if (e.ctrlKey && e.keyCode === Inputmask.keyCode.RIGHT) {
					var today = new Date();
					$input.val((today.getMonth() + 1).toString() + today.getDate().toString() + today.getFullYear().toString()),
					$input.trigger("setvalue");
				}
			}
		},
		"yyyy/mm/dd": {
			mask: "y/1/2",
			placeholder: "yyyy/mm/dd",
			alias: "mm/dd/yyyy",
			leapday: "/02/29",
			onKeyDown: function(e, buffer, caretPos, opts) {
				var $input = $(this);
				if (e.ctrlKey && e.keyCode === Inputmask.keyCode.RIGHT) {
					var today = new Date();
					$input.val(today.getFullYear().toString() + (today.getMonth() + 1).toString() + today.getDate().toString()),
					$input.trigger("setvalue");
				}
			}
		},
		"dd.mm.yyyy": {
			mask: "1.2.y",
			placeholder: "dd.mm.yyyy",
			leapday: "29.02.",
			separator: ".",
			alias: "dd/mm/yyyy"
		},
		"dd-mm-yyyy": {
			mask: "1-2-y",
			placeholder: "dd-mm-yyyy",
			leapday: "29-02-",
			separator: "-",
			alias: "dd/mm/yyyy"
		},
		"mm.dd.yyyy": {
			mask: "1.2.y",
			placeholder: "mm.dd.yyyy",
			leapday: "02.29.",
			separator: ".",
			alias: "mm/dd/yyyy"
		},
		"mm-dd-yyyy": {
			mask: "1-2-y",
			placeholder: "mm-dd-yyyy",
			leapday: "02-29-",
			separator: "-",
			alias: "mm/dd/yyyy"
		},
		"yyyy.mm.dd": {
			mask: "y.1.2",
			placeholder: "yyyy.mm.dd",
			leapday: ".02.29",
			separator: ".",
			alias: "yyyy/mm/dd"
		},
		"yyyy-mm-dd": {
			mask: "y-1-2",
			placeholder: "yyyy-mm-dd",
			leapday: "-02-29",
			separator: "-",
			alias: "yyyy/mm/dd"
		},
		datetime: {
			mask: "1/2/y h:s",
			placeholder: "dd/mm/yyyy hh:mm",
			alias: "dd/mm/yyyy",
			regex: {
				hrspre: new RegExp("[012]"),
				hrs24: new RegExp("2[0-4]|1[3-9]"),
				hrs: new RegExp("[01][0-9]|2[0-4]"),
				ampm: new RegExp("^[a|p|A|P][m|M]"),
				mspre: new RegExp("[0-5]"),
				ms: new RegExp("[0-5][0-9]")
			},
			timeseparator: ":",
			hourFormat: "24",
			definitions: {
				h: {
					validator: function(chrs, maskset, pos, strict, opts) {
						if ("24" === opts.hourFormat && 24 === parseInt(chrs, 10)) return maskset.buffer[pos - 1] = "0",
						maskset.buffer[pos] = "0", {
							refreshFromBuffer: {
								start: pos - 1,
								end: pos
							},
							c: "0"
						};
						var isValid = opts.regex.hrs.test(chrs);
						if (!strict && !isValid && (chrs.charAt(1) === opts.timeseparator || "-.:".indexOf(chrs.charAt(1)) !== -1) && (isValid = opts.regex.hrs.test("0" + chrs.charAt(0)))) return maskset.buffer[pos - 1] = "0",
						maskset.buffer[pos] = chrs.charAt(0), pos++, {
							refreshFromBuffer: {
								start: pos - 2,
								end: pos
							},
							pos: pos,
							c: opts.timeseparator
						};
						if (isValid && "24" !== opts.hourFormat && opts.regex.hrs24.test(chrs)) {
							var tmp = parseInt(chrs, 10);
							return 24 === tmp ? (maskset.buffer[pos + 5] = "a", maskset.buffer[pos + 6] = "m") : (maskset.buffer[pos + 5] = "p",
							maskset.buffer[pos + 6] = "m"), tmp -= 12, tmp < 10 ? (maskset.buffer[pos] = tmp.toString(),
							maskset.buffer[pos - 1] = "0") : (maskset.buffer[pos] = tmp.toString().charAt(1),
							maskset.buffer[pos - 1] = tmp.toString().charAt(0)), {
								refreshFromBuffer: {
									start: pos - 1,
									end: pos + 6
								},
								c: maskset.buffer[pos]
							};
						}
						return isValid;
					},
					cardinality: 2,
					prevalidator: [ {
						validator: function(chrs, maskset, pos, strict, opts) {
							var isValid = opts.regex.hrspre.test(chrs);
							return strict || isValid || !(isValid = opts.regex.hrs.test("0" + chrs)) ? isValid : (maskset.buffer[pos] = "0",
							pos++, {
								pos: pos
							});
						},
						cardinality: 1
					} ]
				},
				s: {
					validator: "[0-5][0-9]",
					cardinality: 2,
					prevalidator: [ {
						validator: function(chrs, maskset, pos, strict, opts) {
							var isValid = opts.regex.mspre.test(chrs);
							return strict || isValid || !(isValid = opts.regex.ms.test("0" + chrs)) ? isValid : (maskset.buffer[pos] = "0",
							pos++, {
								pos: pos
							});
						},
						cardinality: 1
					} ]
				},
				t: {
					validator: function(chrs, maskset, pos, strict, opts) {
						return opts.regex.ampm.test(chrs + "m");
					},
					casing: "lower",
					cardinality: 1
				}
			},
			insertMode: !1,
			autoUnmask: !1
		},
		datetime12: {
			mask: "1/2/y h:s t\\m",
			placeholder: "dd/mm/yyyy hh:mm xm",
			alias: "datetime",
			hourFormat: "12"
		},
		"mm/dd/yyyy hh:mm xm": {
			mask: "1/2/y h:s t\\m",
			placeholder: "mm/dd/yyyy hh:mm xm",
			alias: "datetime12",
			regex: {
				val2pre: function(separator) {
					var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
					return new RegExp("((0[13-9]|1[012])" + escapedSeparator + "[0-3])|(02" + escapedSeparator + "[0-2])");
				},
				val2: function(separator) {
					var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
					return new RegExp("((0[1-9]|1[012])" + escapedSeparator + "(0[1-9]|[12][0-9]))|((0[13-9]|1[012])" + escapedSeparator + "30)|((0[13578]|1[02])" + escapedSeparator + "31)");
				},
				val1pre: new RegExp("[01]"),
				val1: new RegExp("0[1-9]|1[012]")
			},
			leapday: "02/29/",
			onKeyDown: function(e, buffer, caretPos, opts) {
				var $input = $(this);
				if (e.ctrlKey && e.keyCode === Inputmask.keyCode.RIGHT) {
					var today = new Date();
					$input.val((today.getMonth() + 1).toString() + today.getDate().toString() + today.getFullYear().toString()),
					$input.trigger("setvalue");
				}
			}
		},
		"hh:mm t": {
			mask: "h:s t\\m",
			placeholder: "hh:mm xm",
			alias: "datetime",
			hourFormat: "12"
		},
		"h:s t": {
			mask: "h:s t\\m",
			placeholder: "hh:mm xm",
			alias: "datetime",
			hourFormat: "12"
		},
		"hh:mm:ss": {
			mask: "h:s:s",
			placeholder: "hh:mm:ss",
			alias: "datetime",
			autoUnmask: !1
		},
		"hh:mm": {
			mask: "h:s",
			placeholder: "hh:mm",
			alias: "datetime",
			autoUnmask: !1
		},
		date: {
			alias: "dd/mm/yyyy"
		},
		"mm/yyyy": {
			mask: "1/y",
			placeholder: "mm/yyyy",
			leapday: "donotuse",
			separator: "/",
			alias: "mm/dd/yyyy"
		},
		shamsi: {
			regex: {
				val2pre: function(separator) {
					var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
					return new RegExp("((0[1-9]|1[012])" + escapedSeparator + "[0-3])");
				},
				val2: function(separator) {
					var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
					return new RegExp("((0[1-9]|1[012])" + escapedSeparator + "(0[1-9]|[12][0-9]))|((0[1-9]|1[012])" + escapedSeparator + "30)|((0[1-6])" + escapedSeparator + "31)");
				},
				val1pre: new RegExp("[01]"),
				val1: new RegExp("0[1-9]|1[012]")
			},
			yearrange: {
				minyear: 1300,
				maxyear: 1499
			},
			mask: "y/1/2",
			leapday: "/12/30",
			placeholder: "yyyy/mm/dd",
			alias: "mm/dd/yyyy",
			clearIncomplete: !0
		},
		"yyyy-mm-dd hh:mm:ss": {
			mask: "y-1-2 h:s:s",
			placeholder: "yyyy-mm-dd hh:mm:ss",
			alias: "datetime",
			separator: "-",
			leapday: "-02-29",
			regex: {
				val2pre: function(separator) {
					var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
					return new RegExp("((0[13-9]|1[012])" + escapedSeparator + "[0-3])|(02" + escapedSeparator + "[0-2])");
				},
				val2: function(separator) {
					var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
					return new RegExp("((0[1-9]|1[012])" + escapedSeparator + "(0[1-9]|[12][0-9]))|((0[13-9]|1[012])" + escapedSeparator + "30)|((0[13578]|1[02])" + escapedSeparator + "31)");
				},
				val1pre: new RegExp("[01]"),
				val1: new RegExp("0[1-9]|1[012]")
			},
			onKeyDown: function(e, buffer, caretPos, opts) {}
		}
	}), Inputmask;
}(jQuery, Inputmask), function($, Inputmask) {
	return Inputmask.extendDefinitions({
		A: {
			validator: "[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]",
			cardinality: 1,
			casing: "upper"
		},
		"&": {
			validator: "[0-9A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]",
			cardinality: 1,
			casing: "upper"
		},
		"#": {
			validator: "[0-9A-Fa-f]",
			cardinality: 1,
			casing: "upper"
		}
	}), Inputmask.extendAliases({
		url: {
			definitions: {
				i: {
					validator: ".",
					cardinality: 1
				}
			},
			mask: "(\\http://)|(\\http\\s://)|(ftp://)|(ftp\\s://)i{+}",
			insertMode: !1,
			autoUnmask: !1,
			inputmode: "url"
		},
		ip: {
			mask: "i[i[i]].i[i[i]].i[i[i]].i[i[i]]",
			definitions: {
				i: {
					validator: function(chrs, maskset, pos, strict, opts) {
						return pos - 1 > -1 && "." !== maskset.buffer[pos - 1] ? (chrs = maskset.buffer[pos - 1] + chrs,
						chrs = pos - 2 > -1 && "." !== maskset.buffer[pos - 2] ? maskset.buffer[pos - 2] + chrs : "0" + chrs) : chrs = "00" + chrs,
						new RegExp("25[0-5]|2[0-4][0-9]|[01][0-9][0-9]").test(chrs);
					},
					cardinality: 1
				}
			},
			onUnMask: function(maskedValue, unmaskedValue, opts) {
				return maskedValue;
			},
			inputmode: "numeric"
		},
		email: {
			mask: "*{1,64}[.*{1,64}][.*{1,64}][.*{1,63}]@-{1,63}.-{1,63}[.-{1,63}][.-{1,63}]",
			greedy: !1,
			onBeforePaste: function(pastedValue, opts) {
				return pastedValue = pastedValue.toLowerCase(), pastedValue.replace("mailto:", "");
			},
			definitions: {
				"*": {
					validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",
					cardinality: 1,
					casing: "lower"
				},
				"-": {
					validator: "[0-9A-Za-z-]",
					cardinality: 1,
					casing: "lower"
				}
			},
			onUnMask: function(maskedValue, unmaskedValue, opts) {
				return maskedValue;
			},
			inputmode: "email"
		},
		mac: {
			mask: "##:##:##:##:##:##"
		},
		vin: {
			mask: "V{13}9{4}",
			definitions: {
				V: {
					validator: "[A-HJ-NPR-Za-hj-npr-z\\d]",
					cardinality: 1,
					casing: "upper"
				}
			},
			clearIncomplete: !0,
			autoUnmask: !0
		}
	}), Inputmask;
}(jQuery, Inputmask), function($, Inputmask) {
	return Inputmask.extendAliases({
		numeric: {
			mask: function(opts) {
				function autoEscape(txt) {
					for (var escapedTxt = "", i = 0; i < txt.length; i++) escapedTxt += opts.definitions[txt.charAt(i)] || opts.optionalmarker.start === txt.charAt(i) || opts.optionalmarker.end === txt.charAt(i) || opts.quantifiermarker.start === txt.charAt(i) || opts.quantifiermarker.end === txt.charAt(i) || opts.groupmarker.start === txt.charAt(i) || opts.groupmarker.end === txt.charAt(i) || opts.alternatormarker === txt.charAt(i) ? "\\" + txt.charAt(i) : txt.charAt(i);
					return escapedTxt;
				}
				if (0 !== opts.repeat && isNaN(opts.integerDigits) && (opts.integerDigits = opts.repeat),
				opts.repeat = 0, opts.groupSeparator === opts.radixPoint && ("." === opts.radixPoint ? opts.groupSeparator = "," : "," === opts.radixPoint ? opts.groupSeparator = "." : opts.groupSeparator = ""),
				" " === opts.groupSeparator && (opts.skipOptionalPartCharacter = void 0), opts.autoGroup = opts.autoGroup && "" !== opts.groupSeparator,
				opts.autoGroup && ("string" == typeof opts.groupSize && isFinite(opts.groupSize) && (opts.groupSize = parseInt(opts.groupSize)),
				isFinite(opts.integerDigits))) {
					var seps = Math.floor(opts.integerDigits / opts.groupSize), mod = opts.integerDigits % opts.groupSize;
					opts.integerDigits = parseInt(opts.integerDigits) + (0 === mod ? seps - 1 : seps),
					opts.integerDigits < 1 && (opts.integerDigits = "*");
				}
				opts.placeholder.length > 1 && (opts.placeholder = opts.placeholder.charAt(0)),
				"radixFocus" === opts.positionCaretOnClick && "" === opts.placeholder && opts.integerOptional === !1 && (opts.positionCaretOnClick = "lvp"),
				opts.definitions[";"] = opts.definitions["~"], opts.definitions[";"].definitionSymbol = "~",
				opts.numericInput === !0 && (opts.positionCaretOnClick = "radixFocus" === opts.positionCaretOnClick ? "lvp" : opts.positionCaretOnClick,
				opts.digitsOptional = !1, isNaN(opts.digits) && (opts.digits = 2), opts.decimalProtect = !1);
				var mask = "[+]";
				if (mask += autoEscape(opts.prefix), mask += opts.integerOptional === !0 ? "~{1," + opts.integerDigits + "}" : "~{" + opts.integerDigits + "}",
				void 0 !== opts.digits) {
					opts.decimalProtect && (opts.radixPointDefinitionSymbol = ":");
					var dq = opts.digits.toString().split(",");
					isFinite(dq[0] && dq[1] && isFinite(dq[1])) ? mask += (opts.decimalProtect ? ":" : opts.radixPoint) + ";{" + opts.digits + "}" : (isNaN(opts.digits) || parseInt(opts.digits) > 0) && (mask += opts.digitsOptional ? "[" + (opts.decimalProtect ? ":" : opts.radixPoint) + ";{1," + opts.digits + "}]" : (opts.decimalProtect ? ":" : opts.radixPoint) + ";{" + opts.digits + "}");
				}
				return mask += autoEscape(opts.suffix), mask += "[-]", opts.greedy = !1, null !== opts.min && (opts.min = opts.min.toString().replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""),
				"," === opts.radixPoint && (opts.min = opts.min.replace(opts.radixPoint, "."))),
				null !== opts.max && (opts.max = opts.max.toString().replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""),
				"," === opts.radixPoint && (opts.max = opts.max.replace(opts.radixPoint, "."))),
				mask;
			},
			placeholder: "",
			greedy: !1,
			digits: "*",
			digitsOptional: !0,
			radixPoint: ".",
			positionCaretOnClick: "radixFocus",
			groupSize: 3,
			groupSeparator: "",
			autoGroup: !1,
			allowPlus: !0,
			allowMinus: !0,
			negationSymbol: {
				front: "-",
				back: ""
			},
			integerDigits: "+",
			integerOptional: !0,
			prefix: "",
			suffix: "",
			rightAlign: !0,
			decimalProtect: !0,
			min: null,
			max: null,
			step: 1,
			insertMode: !0,
			autoUnmask: !1,
			unmaskAsNumber: !1,
			inputmode: "numeric",
			postFormat: function(buffer, pos, opts) {
				opts.numericInput === !0 && (buffer = buffer.reverse(), isFinite(pos) && (pos = buffer.join("").length - pos - 1));
				var i, l;
				pos = pos >= buffer.length ? buffer.length - 1 : pos < 0 ? 0 : pos;
				var charAtPos = buffer[pos], cbuf = buffer.slice();
				charAtPos === opts.groupSeparator && (cbuf.splice(pos--, 1), charAtPos = cbuf[pos]);
				var isNegative = cbuf.join("").match(new RegExp("^" + Inputmask.escapeRegex(opts.negationSymbol.front)));
				isNegative = null !== isNegative && 1 === isNegative.length, pos > (isNegative ? opts.negationSymbol.front.length : 0) + opts.prefix.length && pos < cbuf.length - opts.suffix.length && (cbuf[pos] = "!");
				var bufVal = cbuf.join(""), bufValOrigin = cbuf.join();
				if (isNegative && (bufVal = bufVal.replace(new RegExp("^" + Inputmask.escapeRegex(opts.negationSymbol.front)), ""),
				bufVal = bufVal.replace(new RegExp(Inputmask.escapeRegex(opts.negationSymbol.back) + "$"), "")),
				bufVal = bufVal.replace(new RegExp(Inputmask.escapeRegex(opts.suffix) + "$"), ""),
				bufVal = bufVal.replace(new RegExp("^" + Inputmask.escapeRegex(opts.prefix)), ""),
				bufVal.length > 0 && opts.autoGroup || bufVal.indexOf(opts.groupSeparator) !== -1) {
					var escapedGroupSeparator = Inputmask.escapeRegex(opts.groupSeparator);
					bufVal = bufVal.replace(new RegExp(escapedGroupSeparator, "g"), "");
					var radixSplit = bufVal.split(charAtPos === opts.radixPoint ? "!" : opts.radixPoint);
					if (bufVal = "" === opts.radixPoint ? bufVal : radixSplit[0], charAtPos !== opts.negationSymbol.front && (bufVal = bufVal.replace("!", "?")),
					bufVal.length > opts.groupSize) for (var reg = new RegExp("([-+]?[\\d?]+)([\\d?]{" + opts.groupSize + "})"); reg.test(bufVal) && "" !== opts.groupSeparator; ) bufVal = bufVal.replace(reg, "$1" + opts.groupSeparator + "$2"),
					bufVal = bufVal.replace(opts.groupSeparator + opts.groupSeparator, opts.groupSeparator);
					bufVal = bufVal.replace("?", "!"), "" !== opts.radixPoint && radixSplit.length > 1 && (bufVal += (charAtPos === opts.radixPoint ? "!" : opts.radixPoint) + radixSplit[1]);
				}
				bufVal = opts.prefix + bufVal + opts.suffix, isNegative && (bufVal = opts.negationSymbol.front + bufVal + opts.negationSymbol.back);
				var needsRefresh = bufValOrigin !== bufVal.split("").join(), newPos = $.inArray("!", bufVal);
				if (newPos === -1 && (newPos = pos), needsRefresh) {
					for (buffer.length = bufVal.length, i = 0, l = bufVal.length; i < l; i++) buffer[i] = bufVal.charAt(i);
					buffer[newPos] = charAtPos;
				}
				return newPos = opts.numericInput && isFinite(pos) ? buffer.join("").length - newPos - 1 : newPos,
				opts.numericInput && (buffer = buffer.reverse(), $.inArray(opts.radixPoint, buffer) < newPos && buffer.join("").length - opts.suffix.length !== newPos && (newPos -= 1)),
				{
					pos: newPos,
					refreshFromBuffer: needsRefresh,
					buffer: buffer,
					isNegative: isNegative
				};
			},
			onBeforeWrite: function(e, buffer, caretPos, opts) {
				var rslt;
				if (e && ("blur" === e.type || "checkval" === e.type || "keydown" === e.type)) {
					var maskedValue = opts.numericInput ? buffer.slice().reverse().join("") : buffer.join(""), processValue = maskedValue.replace(opts.prefix, "");
					processValue = processValue.replace(opts.suffix, ""), processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""),
					"," === opts.radixPoint && (processValue = processValue.replace(opts.radixPoint, "."));
					var isNegative = processValue.match(new RegExp("[-" + Inputmask.escapeRegex(opts.negationSymbol.front) + "]", "g"));
					if (isNegative = null !== isNegative && 1 === isNegative.length, processValue = processValue.replace(new RegExp("[-" + Inputmask.escapeRegex(opts.negationSymbol.front) + "]", "g"), ""),
					processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.negationSymbol.back) + "$"), ""),
					isNaN(opts.placeholder) && (processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.placeholder), "g"), "")),
					processValue = processValue === opts.negationSymbol.front ? processValue + "0" : processValue,
					"" !== processValue && isFinite(processValue)) {
						var floatValue = parseFloat(processValue), signedFloatValue = isNegative ? floatValue * -1 : floatValue;
						if (null !== opts.min && isFinite(opts.min) && signedFloatValue < parseFloat(opts.min) ? (floatValue = Math.abs(opts.min),
						isNegative = opts.min < 0, maskedValue = void 0) : null !== opts.max && isFinite(opts.max) && signedFloatValue > parseFloat(opts.max) && (floatValue = Math.abs(opts.max),
						isNegative = opts.max < 0, maskedValue = void 0), processValue = floatValue.toString().replace(".", opts.radixPoint).split(""),
						isFinite(opts.digits)) {
							var radixPosition = $.inArray(opts.radixPoint, processValue), rpb = $.inArray(opts.radixPoint, maskedValue);
							radixPosition === -1 && (processValue.push(opts.radixPoint), radixPosition = processValue.length - 1);
							for (var i = 1; i <= opts.digits; i++) opts.digitsOptional || void 0 !== processValue[radixPosition + i] && processValue[radixPosition + i] !== opts.placeholder.charAt(0) ? rpb !== -1 && void 0 !== maskedValue[rpb + i] && (processValue[radixPosition + i] = processValue[radixPosition + i] || maskedValue[rpb + i]) : processValue[radixPosition + i] = "0";
							processValue[processValue.length - 1] === opts.radixPoint && delete processValue[processValue.length - 1];
						}
						if (floatValue.toString() !== processValue && floatValue.toString() + "." !== processValue || isNegative) return processValue = (opts.prefix + processValue.join("")).split(""),
						!isNegative || 0 === floatValue && "blur" === e.type || (processValue.unshift(opts.negationSymbol.front),
						processValue.push(opts.negationSymbol.back)), opts.numericInput && (processValue = processValue.reverse()),
						rslt = opts.postFormat(processValue, opts.numericInput ? caretPos : caretPos - 1, opts),
						rslt.buffer && (rslt.refreshFromBuffer = rslt.buffer.join("") !== buffer.join("")),
						rslt;
					}
				}
				if (opts.autoGroup) return rslt = opts.postFormat(buffer, opts.numericInput ? caretPos : caretPos - 1, opts),
				rslt.caret = caretPos < (rslt.isNegative ? opts.negationSymbol.front.length : 0) + opts.prefix.length || caretPos > rslt.buffer.length - (rslt.isNegative ? opts.negationSymbol.back.length : 0) ? rslt.pos : rslt.pos + 1,
				rslt;
			},
			regex: {
				integerPart: function(opts) {
					return new RegExp("[" + Inputmask.escapeRegex(opts.negationSymbol.front) + "+]?\\d+");
				},
				integerNPart: function(opts) {
					return new RegExp("[\\d" + Inputmask.escapeRegex(opts.groupSeparator) + Inputmask.escapeRegex(opts.placeholder.charAt(0)) + "]+");
				}
			},
			signHandler: function(chrs, maskset, pos, strict, opts) {
				if (!strict && opts.allowMinus && "-" === chrs || opts.allowPlus && "+" === chrs) {
					var matchRslt = maskset.buffer.join("").match(opts.regex.integerPart(opts));
					if (matchRslt && matchRslt[0].length > 0) return maskset.buffer[matchRslt.index] === ("-" === chrs ? "+" : opts.negationSymbol.front) ? "-" === chrs ? "" !== opts.negationSymbol.back ? {
						pos: 0,
						c: opts.negationSymbol.front,
						remove: 0,
						caret: pos,
						insert: {
							pos: maskset.buffer.length - 1,
							c: opts.negationSymbol.back
						}
					} : {
						pos: 0,
						c: opts.negationSymbol.front,
						remove: 0,
						caret: pos
					} : "" !== opts.negationSymbol.back ? {
						pos: 0,
						c: "+",
						remove: [ 0, maskset.buffer.length - 1 ],
						caret: pos
					} : {
						pos: 0,
						c: "+",
						remove: 0,
						caret: pos
					} : maskset.buffer[0] === ("-" === chrs ? opts.negationSymbol.front : "+") ? "-" === chrs && "" !== opts.negationSymbol.back ? {
						remove: [ 0, maskset.buffer.length - 1 ],
						caret: pos - 1
					} : {
						remove: 0,
						caret: pos - 1
					} : "-" === chrs ? "" !== opts.negationSymbol.back ? {
						pos: 0,
						c: opts.negationSymbol.front,
						caret: pos + 1,
						insert: {
							pos: maskset.buffer.length,
							c: opts.negationSymbol.back
						}
					} : {
						pos: 0,
						c: opts.negationSymbol.front,
						caret: pos + 1
					} : {
						pos: 0,
						c: chrs,
						caret: pos + 1
					};
				}
				return !1;
			},
			radixHandler: function(chrs, maskset, pos, strict, opts) {
				if (!strict && opts.numericInput !== !0 && chrs === opts.radixPoint && void 0 !== opts.digits && (isNaN(opts.digits) || parseInt(opts.digits) > 0)) {
					var radixPos = $.inArray(opts.radixPoint, maskset.buffer), integerValue = maskset.buffer.join("").match(opts.regex.integerPart(opts));
					if (radixPos !== -1 && maskset.validPositions[radixPos]) return maskset.validPositions[radixPos - 1] ? {
						caret: radixPos + 1
					} : {
						pos: integerValue.index,
						c: integerValue[0],
						caret: radixPos + 1
					};
					if (!integerValue || "0" === integerValue[0] && integerValue.index + 1 !== pos) return maskset.buffer[integerValue ? integerValue.index : pos] = "0",
					{
						pos: (integerValue ? integerValue.index : pos) + 1,
						c: opts.radixPoint
					};
				}
				return !1;
			},
			leadingZeroHandler: function(chrs, maskset, pos, strict, opts, isSelection) {
				if (!strict) {
					var initialPos = pos, buffer = opts.numericInput === !0 ? maskset.buffer.slice("").reverse() : maskset.buffer.slice("");
					opts.numericInput && (pos = buffer.join("").length - pos - 1), buffer.splice(0, opts.prefix.length),
					buffer.splice(buffer.length - opts.suffix.length, opts.suffix.length), pos -= opts.prefix.length;
					var radixPosition = $.inArray(opts.radixPoint, buffer), matchRslt = buffer.slice(0, radixPosition !== -1 ? radixPosition : void 0).join("").match(opts.regex.integerNPart(opts));
					if (matchRslt && (radixPosition === -1 || pos <= radixPosition || opts.numericInput)) {
						var decimalPart = radixPosition === -1 ? 0 : parseInt(buffer.slice(radixPosition + 1).join("")), leadingZero = 0 === matchRslt[0].indexOf("" !== opts.placeholder ? opts.placeholder.charAt(0) : "0");
						if (opts.numericInput) {
							if (leadingZero && 0 !== decimalPart && isSelection !== !0) return maskset.buffer.splice(buffer.length - matchRslt.index - 1 + opts.suffix.length, 1),
							{
								pos: initialPos,
								remove: buffer.length - matchRslt.index - 1 + opts.suffix.length
							};
						} else {
							if (leadingZero && (matchRslt.index + 1 === pos || isSelection !== !0 && 0 === decimalPart)) return maskset.buffer.splice(matchRslt.index + opts.prefix.length, 1),
							{
								pos: matchRslt.index + opts.prefix.length,
								remove: matchRslt.index + opts.prefix.length
							};
							if ("0" === chrs && pos <= matchRslt.index && matchRslt[0] !== opts.groupSeparator) return !1;
						}
					}
				}
				return !0;
			},
			definitions: {
				"~": {
					validator: function(chrs, maskset, pos, strict, opts, isSelection) {
						var isValid = opts.signHandler(chrs, maskset, pos, strict, opts);
						if (!isValid && (isValid = opts.radixHandler(chrs, maskset, pos, strict, opts),
						!isValid && (isValid = strict ? new RegExp("[0-9" + Inputmask.escapeRegex(opts.groupSeparator) + "]").test(chrs) : new RegExp("[0-9]").test(chrs),
						isValid === !0 && (isValid = opts.leadingZeroHandler(chrs, maskset, pos, strict, opts, isSelection),
						isValid === !0 && opts.numericInput !== !0)))) {
							var radixPosition = $.inArray(opts.radixPoint, maskset.buffer);
							isValid = radixPosition !== -1 && (opts.digitsOptional === !1 || maskset.validPositions[pos]) && opts.numericInput !== !0 && pos > radixPosition && !strict ? {
								pos: pos,
								remove: pos
							} : {
								pos: pos
							};
						}
						return isValid;
					},
					cardinality: 1
				},
				"+": {
					validator: function(chrs, maskset, pos, strict, opts) {
						var isValid = opts.signHandler(chrs, maskset, pos, strict, opts);
						return !isValid && (strict && opts.allowMinus && chrs === opts.negationSymbol.front || opts.allowMinus && "-" === chrs || opts.allowPlus && "+" === chrs) && (isValid = !(!strict && "-" === chrs) || ("" !== opts.negationSymbol.back ? {
							pos: pos,
							c: "-" === chrs ? opts.negationSymbol.front : "+",
							caret: pos + 1,
							insert: {
								pos: maskset.buffer.length,
								c: opts.negationSymbol.back
							}
						} : {
							pos: pos,
							c: "-" === chrs ? opts.negationSymbol.front : "+",
							caret: pos + 1
						})), isValid;
					},
					cardinality: 1,
					placeholder: ""
				},
				"-": {
					validator: function(chrs, maskset, pos, strict, opts) {
						var isValid = opts.signHandler(chrs, maskset, pos, strict, opts);
						return !isValid && strict && opts.allowMinus && chrs === opts.negationSymbol.back && (isValid = !0),
						isValid;
					},
					cardinality: 1,
					placeholder: ""
				},
				":": {
					validator: function(chrs, maskset, pos, strict, opts) {
						var isValid = opts.signHandler(chrs, maskset, pos, strict, opts);
						if (!isValid) {
							var radix = "[" + Inputmask.escapeRegex(opts.radixPoint) + "]";
							isValid = new RegExp(radix).test(chrs), isValid && maskset.validPositions[pos] && maskset.validPositions[pos].match.placeholder === opts.radixPoint && (isValid = {
								caret: pos + 1
							});
						}
						return isValid;
					},
					cardinality: 1,
					placeholder: function(opts) {
						return opts.radixPoint;
					}
				}
			},
			onUnMask: function(maskedValue, unmaskedValue, opts) {
				if ("" === unmaskedValue && opts.nullable === !0) return unmaskedValue;
				var processValue = maskedValue.replace(opts.prefix, "");
				return processValue = processValue.replace(opts.suffix, ""), processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""),
				opts.unmaskAsNumber ? ("" !== opts.radixPoint && processValue.indexOf(opts.radixPoint) !== -1 && (processValue = processValue.replace(Inputmask.escapeRegex.call(this, opts.radixPoint), ".")),
				Number(processValue)) : processValue;
			},
			isComplete: function(buffer, opts) {
				var maskedValue = buffer.join(""), bufClone = buffer.slice();
				if (opts.postFormat(bufClone, 0, opts), bufClone.join("") !== maskedValue) return !1;
				var processValue = maskedValue.replace(opts.prefix, "");
				return processValue = processValue.replace(opts.suffix, ""), processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""),
				"," === opts.radixPoint && (processValue = processValue.replace(Inputmask.escapeRegex(opts.radixPoint), ".")),
				isFinite(processValue);
			},
			onBeforeMask: function(initialValue, opts) {
				if (initialValue = initialValue.toString(), opts.numericInput === !0 && (initialValue = initialValue.split("").reverse().join("")),
				"" !== opts.radixPoint && isFinite(initialValue)) {
					var vs = initialValue.split("."), groupSize = "" !== opts.groupSeparator ? parseInt(opts.groupSize) : 0;
					2 === vs.length && (vs[0].length > groupSize || vs[1].length > groupSize) && (initialValue = initialValue.replace(".", opts.radixPoint));
				}
				var kommaMatches = initialValue.match(/,/g), dotMatches = initialValue.match(/\./g);
				if (dotMatches && kommaMatches ? dotMatches.length > kommaMatches.length ? (initialValue = initialValue.replace(/\./g, ""),
				initialValue = initialValue.replace(",", opts.radixPoint)) : kommaMatches.length > dotMatches.length ? (initialValue = initialValue.replace(/,/g, ""),
				initialValue = initialValue.replace(".", opts.radixPoint)) : initialValue = initialValue.indexOf(".") < initialValue.indexOf(",") ? initialValue.replace(/\./g, "") : initialValue = initialValue.replace(/,/g, "") : initialValue = initialValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""),
				0 === opts.digits && (initialValue.indexOf(".") !== -1 ? initialValue = initialValue.substring(0, initialValue.indexOf(".")) : initialValue.indexOf(",") !== -1 && (initialValue = initialValue.substring(0, initialValue.indexOf(",")))),
				"" !== opts.radixPoint && isFinite(opts.digits) && initialValue.indexOf(opts.radixPoint) !== -1) {
					var valueParts = initialValue.split(opts.radixPoint), decPart = valueParts[1].match(new RegExp("\\d*"))[0];
					if (parseInt(opts.digits) < decPart.toString().length) {
						var digitsFactor = Math.pow(10, parseInt(opts.digits));
						initialValue = initialValue.replace(Inputmask.escapeRegex(opts.radixPoint), "."),
						initialValue = Math.round(parseFloat(initialValue) * digitsFactor) / digitsFactor,
						initialValue = initialValue.toString().replace(".", opts.radixPoint);
					}
				}
				return opts.numericInput === !0 && (initialValue = initialValue.split("").reverse().join("")),
				initialValue;
			},
			canClearPosition: function(maskset, position, lvp, strict, opts) {
				var positionInput = maskset.validPositions[position].input, canClear = positionInput !== opts.radixPoint || null !== maskset.validPositions[position].match.fn && opts.decimalProtect === !1 || isFinite(positionInput) || position === lvp || positionInput === opts.groupSeparator || positionInput === opts.negationSymbol.front || positionInput === opts.negationSymbol.back;
				return canClear;
			},
			onKeyDown: function(e, buffer, caretPos, opts) {
				var $input = $(this);
				if (e.ctrlKey) switch (e.keyCode) {
				  case Inputmask.keyCode.UP:
					$input.val(parseFloat(this.inputmask.unmaskedvalue()) + parseInt(opts.step)), $input.trigger("setvalue");
					break;

				  case Inputmask.keyCode.DOWN:
					$input.val(parseFloat(this.inputmask.unmaskedvalue()) - parseInt(opts.step)), $input.trigger("setvalue");
				}
			}
		},
		currency: {
			prefix: "$ ",
			groupSeparator: ",",
			alias: "numeric",
			placeholder: "0",
			autoGroup: !0,
			digits: 2,
			digitsOptional: !1,
			clearMaskOnLostFocus: !1
		},
		decimal: {
			alias: "numeric"
		},
		integer: {
			alias: "numeric",
			digits: 0,
			radixPoint: ""
		},
		percentage: {
			alias: "numeric",
			digits: 2,
			radixPoint: ".",
			placeholder: "0",
			autoGroup: !1,
			min: 0,
			max: 100,
			suffix: " %",
			allowPlus: !1,
			allowMinus: !1
		}
	}), Inputmask;
}(jQuery, Inputmask), function($, Inputmask) {
	function maskSort(a, b) {
		var maska = (a.mask || a).replace(/#/g, "9").replace(/\)/, "9").replace(/[+()#-]/g, ""), maskb = (b.mask || b).replace(/#/g, "9").replace(/\)/, "9").replace(/[+()#-]/g, ""), maskas = (a.mask || a).split("#")[0], maskbs = (b.mask || b).split("#")[0];
		return 0 === maskbs.indexOf(maskas) ? -1 : 0 === maskas.indexOf(maskbs) ? 1 : maska.localeCompare(maskb);
	}
	var analyseMaskBase = Inputmask.prototype.analyseMask;
	return Inputmask.prototype.analyseMask = function(mask, opts) {
		function reduceVariations(masks, previousVariation, previousmaskGroup) {
			previousVariation = previousVariation || "", previousmaskGroup = previousmaskGroup || maskGroups,
			"" !== previousVariation && (previousmaskGroup[previousVariation] = {});
			for (var variation = "", maskGroup = previousmaskGroup[previousVariation] || previousmaskGroup, i = masks.length - 1; i >= 0; i--) mask = masks[i].mask || masks[i],
			variation = mask.substr(0, 1), maskGroup[variation] = maskGroup[variation] || [],
			maskGroup[variation].unshift(mask.substr(1)), masks.splice(i, 1);
			for (var ndx in maskGroup) maskGroup[ndx].length > 500 && reduceVariations(maskGroup[ndx].slice(), ndx, maskGroup);
		}
		function rebuild(maskGroup) {
			var mask = "", submasks = [];
			for (var ndx in maskGroup) $.isArray(maskGroup[ndx]) ? 1 === maskGroup[ndx].length ? submasks.push(ndx + maskGroup[ndx]) : submasks.push(ndx + opts.groupmarker.start + maskGroup[ndx].join(opts.groupmarker.end + opts.alternatormarker + opts.groupmarker.start) + opts.groupmarker.end) : submasks.push(ndx + rebuild(maskGroup[ndx]));
			return mask += 1 === submasks.length ? submasks[0] : opts.groupmarker.start + submasks.join(opts.groupmarker.end + opts.alternatormarker + opts.groupmarker.start) + opts.groupmarker.end;
		}
		var maskGroups = {};
		opts.phoneCodes && opts.phoneCodes.length > 1e3 && (mask = mask.substr(1, mask.length - 2),
		reduceVariations(mask.split(opts.groupmarker.end + opts.alternatormarker + opts.groupmarker.start)),
		mask = rebuild(maskGroups));
		var mt = analyseMaskBase.call(this, mask, opts);
		return mt;
	}, Inputmask.extendAliases({
		abstractphone: {
			groupmarker: {
				start: "<",
				end: ">"
			},
			countrycode: "",
			phoneCodes: [],
			mask: function(opts) {
				return opts.definitions = {
					"#": opts.definitions[9]
				}, opts.phoneCodes.sort(maskSort);
			},
			keepStatic: !0,
			onBeforeMask: function(value, opts) {
				var processedValue = value.replace(/^0{1,2}/, "").replace(/[\s]/g, "");
				return (processedValue.indexOf(opts.countrycode) > 1 || processedValue.indexOf(opts.countrycode) === -1) && (processedValue = "+" + opts.countrycode + processedValue),
				processedValue;
			},
			onUnMask: function(maskedValue, unmaskedValue, opts) {
				return unmaskedValue;
			},
			inputmode: "tel"
		}
	}), Inputmask;
}(jQuery, Inputmask), function($, Inputmask) {
	return Inputmask.extendAliases({
		Regex: {
			mask: "r",
			greedy: !1,
			repeat: "*",
			regex: null,
			regexTokens: null,
			tokenizer: /\[\^?]?(?:[^\\\]]+|\\[\S\s]?)*]?|\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9][0-9]*|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)|\((?:\?[:=!]?)?|(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??|[^.?*+^${[()|\\]+|./g,
			quantifierFilter: /[0-9]+[^,]/,
			isComplete: function(buffer, opts) {
				return new RegExp(opts.regex).test(buffer.join(""));
			},
			definitions: {
				r: {
					validator: function(chrs, maskset, pos, strict, opts) {
						function RegexToken(isGroup, isQuantifier) {
							this.matches = [], this.isGroup = isGroup || !1, this.isQuantifier = isQuantifier || !1,
							this.quantifier = {
								min: 1,
								max: 1
							}, this.repeaterPart = void 0;
						}
						function analyseRegex() {
							var match, m, currentToken = new RegexToken(), opengroups = [];
							for (opts.regexTokens = []; match = opts.tokenizer.exec(opts.regex); ) switch (m = match[0],
							m.charAt(0)) {
							  case "(":
								opengroups.push(new RegexToken((!0)));
								break;

							  case ")":
								groupToken = opengroups.pop(), opengroups.length > 0 ? opengroups[opengroups.length - 1].matches.push(groupToken) : currentToken.matches.push(groupToken);
								break;

							  case "{":
							  case "+":
							  case "*":
								var quantifierToken = new RegexToken((!1), (!0));
								m = m.replace(/[{}]/g, "");
								var mq = m.split(","), mq0 = isNaN(mq[0]) ? mq[0] : parseInt(mq[0]), mq1 = 1 === mq.length ? mq0 : isNaN(mq[1]) ? mq[1] : parseInt(mq[1]);
								if (quantifierToken.quantifier = {
									min: mq0,
									max: mq1
								}, opengroups.length > 0) {
									var matches = opengroups[opengroups.length - 1].matches;
									match = matches.pop(), match.isGroup || (groupToken = new RegexToken((!0)), groupToken.matches.push(match),
									match = groupToken), matches.push(match), matches.push(quantifierToken);
								} else match = currentToken.matches.pop(), match.isGroup || (groupToken = new RegexToken((!0)),
								groupToken.matches.push(match), match = groupToken), currentToken.matches.push(match),
								currentToken.matches.push(quantifierToken);
								break;

							  default:
								opengroups.length > 0 ? opengroups[opengroups.length - 1].matches.push(m) : currentToken.matches.push(m);
							}
							currentToken.matches.length > 0 && opts.regexTokens.push(currentToken);
						}
						function validateRegexToken(token, fromGroup) {
							var isvalid = !1;
							fromGroup && (regexPart += "(", openGroupCount++);
							for (var mndx = 0; mndx < token.matches.length; mndx++) {
								var matchToken = token.matches[mndx];
								if (matchToken.isGroup === !0) isvalid = validateRegexToken(matchToken, !0); else if (matchToken.isQuantifier === !0) {
									var crrntndx = $.inArray(matchToken, token.matches), matchGroup = token.matches[crrntndx - 1], regexPartBak = regexPart;
									if (isNaN(matchToken.quantifier.max)) {
										for (;matchToken.repeaterPart && matchToken.repeaterPart !== regexPart && matchToken.repeaterPart.length > regexPart.length && !(isvalid = validateRegexToken(matchGroup, !0)); ) ;
										isvalid = isvalid || validateRegexToken(matchGroup, !0), isvalid && (matchToken.repeaterPart = regexPart),
										regexPart = regexPartBak + matchToken.quantifier.max;
									} else {
										for (var i = 0, qm = matchToken.quantifier.max - 1; i < qm && !(isvalid = validateRegexToken(matchGroup, !0)); i++) ;
										regexPart = regexPartBak + "{" + matchToken.quantifier.min + "," + matchToken.quantifier.max + "}";
									}
								} else if (void 0 !== matchToken.matches) for (var k = 0; k < matchToken.length && !(isvalid = validateRegexToken(matchToken[k], fromGroup)); k++) ; else {
									var testExp;
									if ("[" == matchToken.charAt(0)) {
										testExp = regexPart, testExp += matchToken;
										for (var j = 0; j < openGroupCount; j++) testExp += ")";
										var exp = new RegExp("^(" + testExp + ")$");
										isvalid = exp.test(bufferStr);
									} else for (var l = 0, tl = matchToken.length; l < tl; l++) if ("\\" !== matchToken.charAt(l)) {
										testExp = regexPart, testExp += matchToken.substr(0, l + 1), testExp = testExp.replace(/\|$/, "");
										for (var j = 0; j < openGroupCount; j++) testExp += ")";
										var exp = new RegExp("^(" + testExp + ")$");
										if (isvalid = exp.test(bufferStr)) break;
									}
									regexPart += matchToken;
								}
								if (isvalid) break;
							}
							return fromGroup && (regexPart += ")", openGroupCount--), isvalid;
						}
						var bufferStr, groupToken, cbuffer = maskset.buffer.slice(), regexPart = "", isValid = !1, openGroupCount = 0;
						null === opts.regexTokens && analyseRegex(), cbuffer.splice(pos, 0, chrs), bufferStr = cbuffer.join("");
						for (var i = 0; i < opts.regexTokens.length; i++) {
							var regexToken = opts.regexTokens[i];
							if (isValid = validateRegexToken(regexToken, regexToken.isGroup)) break;
						}
						return isValid;
					},
					cardinality: 1
				}
			}
		}
	}), Inputmask;
}(jQuery, Inputmask);




/*! jQuery UI - v1.12.1 - 2017-05-13
* http://jqueryui.com
* Includes: widget.js, keycode.js, widgets/mouse.js, widgets/slider.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */
(function($) {

	$.ui = $.ui || {};

	var version = $.ui.version = "1.12.1";


	/*!
     * jQuery UI Widget 1.12.1
     * http://jqueryui.com
     *
     * Copyright jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */

//>>label: Widget
//>>group: Core
//>>description: Provides a factory for creating stateful widgets with a common API.
//>>docs: http://api.jqueryui.com/jQuery.widget/
//>>demos: http://jqueryui.com/widget/



	var widgetUuid = 0;
	var widgetSlice = Array.prototype.slice;

	$.cleanData = ( function( orig ) {
		return function( elems ) {
			var events, elem, i;
			for ( i = 0; ( elem = elems[ i ] ) != null; i++ ) {
				try {

					// Only trigger remove when necessary to save time
					events = $._data( elem, "events" );
					if ( events && events.remove ) {
						$( elem ).triggerHandler( "remove" );
					}

					// Http://bugs.jquery.com/ticket/8235
				} catch ( e ) {}
			}
			orig( elems );
		};
	} )( $.cleanData );

	$.widget = function( name, base, prototype ) {
		var existingConstructor, constructor, basePrototype;

		// ProxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		var proxiedPrototype = {};

		var namespace = name.split( "." )[ 0 ];
		name = name.split( "." )[ 1 ];
		var fullName = namespace + "-" + name;

		if ( !prototype ) {
			prototype = base;
			base = $.Widget;
		}

		if ( $.isArray( prototype ) ) {
			prototype = $.extend.apply( null, [ {} ].concat( prototype ) );
		}

		// Create selector for plugin
		$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
			return !!$.data( elem, fullName );
		};

		$[ namespace ] = $[ namespace ] || {};
		existingConstructor = $[ namespace ][ name ];
		constructor = $[ namespace ][ name ] = function( options, element ) {

			// Allow instantiation without "new" keyword
			if ( !this._createWidget ) {
				return new constructor( options, element );
			}

			// Allow instantiation without initializing for simple inheritance
			// must use "new" keyword (the code above always passes args)
			if ( arguments.length ) {
				this._createWidget( options, element );
			}
		};

		// Extend with the existing constructor to carry over any static properties
		$.extend( constructor, existingConstructor, {
			version: prototype.version,

			// Copy the object used to create the prototype in case we need to
			// redefine the widget later
			_proto: $.extend( {}, prototype ),

			// Track widgets that inherit from this widget in case this widget is
			// redefined after a widget inherits from it
			_childConstructors: []
		} );

		basePrototype = new base();

		// We need to make the options hash a property directly on the new instance
		// otherwise we'll modify the options hash on the prototype that we're
		// inheriting from
		basePrototype.options = $.widget.extend( {}, basePrototype.options );
		$.each( prototype, function( prop, value ) {
			if ( !$.isFunction( value ) ) {
				proxiedPrototype[ prop ] = value;
				return;
			}
			proxiedPrototype[ prop ] = ( function() {
				function _super() {
					return base.prototype[ prop ].apply( this, arguments );
				}

				function _superApply( args ) {
					return base.prototype[ prop ].apply( this, args );
				}

				return function() {
					var __super = this._super;
					var __superApply = this._superApply;
					var returnValue;

					this._super = _super;
					this._superApply = _superApply;

					returnValue = value.apply( this, arguments );

					this._super = __super;
					this._superApply = __superApply;

					return returnValue;
				};
			} )();
		} );
		constructor.prototype = $.widget.extend( basePrototype, {

			// TODO: remove support for widgetEventPrefix
			// always use the name + a colon as the prefix, e.g., draggable:start
			// don't prefix for widgets that aren't DOM-based
			widgetEventPrefix: existingConstructor ? ( basePrototype.widgetEventPrefix || name ) : name
		}, proxiedPrototype, {
			constructor: constructor,
			namespace: namespace,
			widgetName: name,
			widgetFullName: fullName
		} );

		// If this widget is being redefined then we need to find all widgets that
		// are inheriting from it and redefine all of them so that they inherit from
		// the new version of this widget. We're essentially trying to replace one
		// level in the prototype chain.
		if ( existingConstructor ) {
			$.each( existingConstructor._childConstructors, function( i, child ) {
				var childPrototype = child.prototype;

				// Redefine the child widget using the same prototype that was
				// originally used, but inherit from the new version of the base
				$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor,
					child._proto );
			} );

			// Remove the list of existing child constructors from the old constructor
			// so the old child constructors can be garbage collected
			delete existingConstructor._childConstructors;
		} else {
			base._childConstructors.push( constructor );
		}

		$.widget.bridge( name, constructor );

		return constructor;
	};

	$.widget.extend = function( target ) {
		var input = widgetSlice.call( arguments, 1 );
		var inputIndex = 0;
		var inputLength = input.length;
		var key;
		var value;

		for ( ; inputIndex < inputLength; inputIndex++ ) {
			for ( key in input[ inputIndex ] ) {
				value = input[ inputIndex ][ key ];
				if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {

					// Clone objects
					if ( $.isPlainObject( value ) ) {
						target[ key ] = $.isPlainObject( target[ key ] ) ?
							$.widget.extend( {}, target[ key ], value ) :

							// Don't extend strings, arrays, etc. with objects
							$.widget.extend( {}, value );

						// Copy everything else by reference
					} else {
						target[ key ] = value;
					}
				}
			}
		}
		return target;
	};

	$.widget.bridge = function( name, object ) {
		var fullName = object.prototype.widgetFullName || name;
		$.fn[ name ] = function( options ) {
			var isMethodCall = typeof options === "string";
			var args = widgetSlice.call( arguments, 1 );
			var returnValue = this;

			if ( isMethodCall ) {

				// If this is an empty collection, we need to have the instance method
				// return undefined instead of the jQuery instance
				if ( !this.length && options === "instance" ) {
					returnValue = undefined;
				} else {
					this.each( function() {
						var methodValue;
						var instance = $.data( this, fullName );

						if ( options === "instance" ) {
							returnValue = instance;
							return false;
						}

						if ( !instance ) {
							return $.error( "cannot call methods on " + name +
								" prior to initialization; " +
								"attempted to call method '" + options + "'" );
						}

						if ( !$.isFunction( instance[ options ] ) || options.charAt( 0 ) === "_" ) {
							return $.error( "no such method '" + options + "' for " + name +
								" widget instance" );
						}

						methodValue = instance[ options ].apply( instance, args );

						if ( methodValue !== instance && methodValue !== undefined ) {
							returnValue = methodValue && methodValue.jquery ?
								returnValue.pushStack( methodValue.get() ) :
								methodValue;
							return false;
						}
					} );
				}
			} else {

				// Allow multiple hashes to be passed on init
				if ( args.length ) {
					options = $.widget.extend.apply( null, [ options ].concat( args ) );
				}

				this.each( function() {
					var instance = $.data( this, fullName );
					if ( instance ) {
						instance.option( options || {} );
						if ( instance._init ) {
							instance._init();
						}
					} else {
						$.data( this, fullName, new object( options, this ) );
					}
				} );
			}

			return returnValue;
		};
	};

	$.Widget = function( /* options, element */ ) {};
	$.Widget._childConstructors = [];

	$.Widget.prototype = {
		widgetName: "widget",
		widgetEventPrefix: "",
		defaultElement: "<div>",

		options: {
			classes: {},
			disabled: false,

			// Callbacks
			create: null
		},

		_createWidget: function( options, element ) {
			element = $( element || this.defaultElement || this )[ 0 ];
			this.element = $( element );
			this.uuid = widgetUuid++;
			this.eventNamespace = "." + this.widgetName + this.uuid;

			this.bindings = $();
			this.hoverable = $();
			this.focusable = $();
			this.classesElementLookup = {};

			if ( element !== this ) {
				$.data( element, this.widgetFullName, this );
				this._on( true, this.element, {
					remove: function( event ) {
						if ( event.target === element ) {
							this.destroy();
						}
					}
				} );
				this.document = $( element.style ?

					// Element within the document
					element.ownerDocument :

					// Element is window or document
					element.document || element );
				this.window = $( this.document[ 0 ].defaultView || this.document[ 0 ].parentWindow );
			}

			this.options = $.widget.extend( {},
				this.options,
				this._getCreateOptions(),
				options );

			this._create();

			if ( this.options.disabled ) {
				this._setOptionDisabled( this.options.disabled );
			}

			this._trigger( "create", null, this._getCreateEventData() );
			this._init();
		},

		_getCreateOptions: function() {
			return {};
		},

		_getCreateEventData: $.noop,

		_create: $.noop,

		_init: $.noop,

		destroy: function() {
			var that = this;

			this._destroy();
			$.each( this.classesElementLookup, function( key, value ) {
				that._removeClass( value, key );
			} );

			// We can probably remove the unbind calls in 2.0
			// all event bindings should go through this._on()
			this.element
				.off( this.eventNamespace )
				.removeData( this.widgetFullName );
			this.widget()
				.off( this.eventNamespace )
				.removeAttr( "aria-disabled" );

			// Clean up events and states
			this.bindings.off( this.eventNamespace );
		},

		_destroy: $.noop,

		widget: function() {
			return this.element;
		},

		option: function( key, value ) {
			var options = key;
			var parts;
			var curOption;
			var i;

			if ( arguments.length === 0 ) {

				// Don't return a reference to the internal hash
				return $.widget.extend( {}, this.options );
			}

			if ( typeof key === "string" ) {

				// Handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
				options = {};
				parts = key.split( "." );
				key = parts.shift();
				if ( parts.length ) {
					curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
					for ( i = 0; i < parts.length - 1; i++ ) {
						curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
						curOption = curOption[ parts[ i ] ];
					}
					key = parts.pop();
					if ( arguments.length === 1 ) {
						return curOption[ key ] === undefined ? null : curOption[ key ];
					}
					curOption[ key ] = value;
				} else {
					if ( arguments.length === 1 ) {
						return this.options[ key ] === undefined ? null : this.options[ key ];
					}
					options[ key ] = value;
				}
			}

			this._setOptions( options );

			return this;
		},

		_setOptions: function( options ) {
			var key;

			for ( key in options ) {
				this._setOption( key, options[ key ] );
			}

			return this;
		},

		_setOption: function( key, value ) {
			if ( key === "classes" ) {
				this._setOptionClasses( value );
			}

			this.options[ key ] = value;

			if ( key === "disabled" ) {
				this._setOptionDisabled( value );
			}

			return this;
		},

		_setOptionClasses: function( value ) {
			var classKey, elements, currentElements;

			for ( classKey in value ) {
				currentElements = this.classesElementLookup[ classKey ];
				if ( value[ classKey ] === this.options.classes[ classKey ] ||
					!currentElements ||
					!currentElements.length ) {
					continue;
				}

				// We are doing this to create a new jQuery object because the _removeClass() call
				// on the next line is going to destroy the reference to the current elements being
				// tracked. We need to save a copy of this collection so that we can add the new classes
				// below.
				elements = $( currentElements.get() );
				this._removeClass( currentElements, classKey );

				// We don't use _addClass() here, because that uses this.options.classes
				// for generating the string of classes. We want to use the value passed in from
				// _setOption(), this is the new value of the classes option which was passed to
				// _setOption(). We pass this value directly to _classes().
				elements.addClass( this._classes( {
					element: elements,
					keys: classKey,
					classes: value,
					add: true
				} ) );
			}
		},

		_setOptionDisabled: function( value ) {
			this._toggleClass( this.widget(), this.widgetFullName + "-disabled", null, !!value );

			// If the widget is becoming disabled, then nothing is interactive
			if ( value ) {
				this._removeClass( this.hoverable, null, "ui-state-hover" );
				this._removeClass( this.focusable, null, "ui-state-focus" );
			}
		},

		enable: function() {
			return this._setOptions( { disabled: false } );
		},

		disable: function() {
			return this._setOptions( { disabled: true } );
		},

		_classes: function( options ) {
			var full = [];
			var that = this;

			options = $.extend( {
				element: this.element,
				classes: this.options.classes || {}
			}, options );

			function processClassString( classes, checkOption ) {
				var current, i;
				for ( i = 0; i < classes.length; i++ ) {
					current = that.classesElementLookup[ classes[ i ] ] || $();
					if ( options.add ) {
						current = $( $.unique( current.get().concat( options.element.get() ) ) );
					} else {
						current = $( current.not( options.element ).get() );
					}
					that.classesElementLookup[ classes[ i ] ] = current;
					full.push( classes[ i ] );
					if ( checkOption && options.classes[ classes[ i ] ] ) {
						full.push( options.classes[ classes[ i ] ] );
					}
				}
			}

			this._on( options.element, {
				"remove": "_untrackClassesElement"
			} );

			if ( options.keys ) {
				processClassString( options.keys.match( /\S+/g ) || [], true );
			}
			if ( options.extra ) {
				processClassString( options.extra.match( /\S+/g ) || [] );
			}

			return full.join( " " );
		},

		_untrackClassesElement: function( event ) {
			var that = this;
			$.each( that.classesElementLookup, function( key, value ) {
				if ( $.inArray( event.target, value ) !== -1 ) {
					that.classesElementLookup[ key ] = $( value.not( event.target ).get() );
				}
			} );
		},

		_removeClass: function( element, keys, extra ) {
			return this._toggleClass( element, keys, extra, false );
		},

		_addClass: function( element, keys, extra ) {
			return this._toggleClass( element, keys, extra, true );
		},

		_toggleClass: function( element, keys, extra, add ) {
			add = ( typeof add === "boolean" ) ? add : extra;
			var shift = ( typeof element === "string" || element === null ),
				options = {
					extra: shift ? keys : extra,
					keys: shift ? element : keys,
					element: shift ? this.element : element,
					add: add
				};
			options.element.toggleClass( this._classes( options ), add );
			return this;
		},

		_on: function( suppressDisabledCheck, element, handlers ) {
			var delegateElement;
			var instance = this;

			// No suppressDisabledCheck flag, shuffle arguments
			if ( typeof suppressDisabledCheck !== "boolean" ) {
				handlers = element;
				element = suppressDisabledCheck;
				suppressDisabledCheck = false;
			}

			// No element argument, shuffle and use this.element
			if ( !handlers ) {
				handlers = element;
				element = this.element;
				delegateElement = this.widget();
			} else {
				element = delegateElement = $( element );
				this.bindings = this.bindings.add( element );
			}

			$.each( handlers, function( event, handler ) {
				function handlerProxy() {

					// Allow widgets to customize the disabled handling
					// - disabled as an array instead of boolean
					// - disabled class as method for disabling individual parts
					if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
						return;
					}
					return ( typeof handler === "string" ? instance[ handler ] : handler )
						.apply( instance, arguments );
				}

				// Copy the guid so direct unbinding works
				if ( typeof handler !== "string" ) {
					handlerProxy.guid = handler.guid =
						handler.guid || handlerProxy.guid || $.guid++;
				}

				var match = event.match( /^([\w:-]*)\s*(.*)$/ );
				var eventName = match[ 1 ] + instance.eventNamespace;
				var selector = match[ 2 ];

				if ( selector ) {
					delegateElement.on( eventName, selector, handlerProxy );
				} else {
					element.on( eventName, handlerProxy );
				}
			} );
		},

		_off: function( element, eventName ) {
			eventName = ( eventName || "" ).split( " " ).join( this.eventNamespace + " " ) +
				this.eventNamespace;
			element.off( eventName ).off( eventName );

			// Clear the stack to avoid memory leaks (#10056)
			this.bindings = $( this.bindings.not( element ).get() );
			this.focusable = $( this.focusable.not( element ).get() );
			this.hoverable = $( this.hoverable.not( element ).get() );
		},

		_delay: function( handler, delay ) {
			function handlerProxy() {
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}
			var instance = this;
			return setTimeout( handlerProxy, delay || 0 );
		},

		_hoverable: function( element ) {
			this.hoverable = this.hoverable.add( element );
			this._on( element, {
				mouseenter: function( event ) {
					this._addClass( $( event.currentTarget ), null, "ui-state-hover" );
				},
				mouseleave: function( event ) {
					this._removeClass( $( event.currentTarget ), null, "ui-state-hover" );
				}
			} );
		},

		_focusable: function( element ) {
			this.focusable = this.focusable.add( element );
			this._on( element, {
				focusin: function( event ) {
					this._addClass( $( event.currentTarget ), null, "ui-state-focus" );
				},
				focusout: function( event ) {
					this._removeClass( $( event.currentTarget ), null, "ui-state-focus" );
				}
			} );
		},

		_trigger: function( type, event, data ) {
			var prop, orig;
			var callback = this.options[ type ];

			data = data || {};
			event = $.Event( event );
			event.type = ( type === this.widgetEventPrefix ?
				type :
				this.widgetEventPrefix + type ).toLowerCase();

			// The original event may come from any element
			// so we need to reset the target on the new event
			event.target = this.element[ 0 ];

			// Copy original event properties over to the new event
			orig = event.originalEvent;
			if ( orig ) {
				for ( prop in orig ) {
					if ( !( prop in event ) ) {
						event[ prop ] = orig[ prop ];
					}
				}
			}

			this.element.trigger( event, data );
			return !( $.isFunction( callback ) &&
				callback.apply( this.element[ 0 ], [ event ].concat( data ) ) === false ||
				event.isDefaultPrevented() );
		}
	};

	$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
		$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
			if ( typeof options === "string" ) {
				options = { effect: options };
			}

			var hasOptions;
			var effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;

			options = options || {};
			if ( typeof options === "number" ) {
				options = { duration: options };
			}

			hasOptions = !$.isEmptyObject( options );
			options.complete = callback;

			if ( options.delay ) {
				element.delay( options.delay );
			}

			if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
				element[ method ]( options );
			} else if ( effectName !== method && element[ effectName ] ) {
				element[ effectName ]( options.duration, options.easing, callback );
			} else {
				element.queue( function( next ) {
					$( this )[ method ]();
					if ( callback ) {
						callback.call( element[ 0 ] );
					}
					next();
				} );
			}
		};
	} );

	var widget = $.widget;


	/*!
     * jQuery UI Keycode 1.12.1
     * http://jqueryui.com
     *
     * Copyright jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */

//>>label: Keycode
//>>group: Core
//>>description: Provide keycodes as keynames
//>>docs: http://api.jqueryui.com/jQuery.ui.keyCode/


	var keycode = $.ui.keyCode = {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	};




// This file is deprecated
	var ie = $.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

	/*!
     * jQuery UI Mouse 1.12.1
     * http://jqueryui.com
     *
     * Copyright jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */

//>>label: Mouse
//>>group: Widgets
//>>description: Abstracts mouse-based interactions to assist in creating certain widgets.
//>>docs: http://api.jqueryui.com/mouse/



	var mouseHandled = false;
	$( document ).on( "mouseup", function() {
		mouseHandled = false;
	} );

	var widgetsMouse = $.widget( "ui.mouse", {
		version: "1.12.1",
		options: {
			cancel: "input, textarea, button, select, option",
			distance: 1,
			delay: 0
		},
		_mouseInit: function() {
			var that = this;

			this.element
				.on( "mousedown." + this.widgetName, function( event ) {
					return that._mouseDown( event );
				} )
				.on( "click." + this.widgetName, function( event ) {
					if ( true === $.data( event.target, that.widgetName + ".preventClickEvent" ) ) {
						$.removeData( event.target, that.widgetName + ".preventClickEvent" );
						event.stopImmediatePropagation();
						return false;
					}
				} );

			this.started = false;
		},

		// TODO: make sure destroying one instance of mouse doesn't mess with
		// other instances of mouse
		_mouseDestroy: function() {
			this.element.off( "." + this.widgetName );
			if ( this._mouseMoveDelegate ) {
				this.document
					.off( "mousemove." + this.widgetName, this._mouseMoveDelegate )
					.off( "mouseup." + this.widgetName, this._mouseUpDelegate );
			}
		},

		_mouseDown: function( event ) {

			// don't let more than one widget handle mouseStart
			if ( mouseHandled ) {
				return;
			}

			this._mouseMoved = false;

			// We may have missed mouseup (out of window)
			( this._mouseStarted && this._mouseUp( event ) );

			this._mouseDownEvent = event;

			var that = this,
				btnIsLeft = ( event.which === 1 ),

				// event.target.nodeName works around a bug in IE 8 with
				// disabled inputs (#7620)
				elIsCancel = ( typeof this.options.cancel === "string" && event.target.nodeName ?
					$( event.target ).closest( this.options.cancel ).length : false );
			if ( !btnIsLeft || elIsCancel || !this._mouseCapture( event ) ) {
				return true;
			}

			this.mouseDelayMet = !this.options.delay;
			if ( !this.mouseDelayMet ) {
				this._mouseDelayTimer = setTimeout( function() {
					that.mouseDelayMet = true;
				}, this.options.delay );
			}

			if ( this._mouseDistanceMet( event ) && this._mouseDelayMet( event ) ) {
				this._mouseStarted = ( this._mouseStart( event ) !== false );
				if ( !this._mouseStarted ) {
					event.preventDefault();
					return true;
				}
			}

			// Click event may never have fired (Gecko & Opera)
			if ( true === $.data( event.target, this.widgetName + ".preventClickEvent" ) ) {
				$.removeData( event.target, this.widgetName + ".preventClickEvent" );
			}

			// These delegates are required to keep context
			this._mouseMoveDelegate = function( event ) {
				return that._mouseMove( event );
			};
			this._mouseUpDelegate = function( event ) {
				return that._mouseUp( event );
			};

			this.document
				.on( "mousemove." + this.widgetName, this._mouseMoveDelegate )
				.on( "mouseup." + this.widgetName, this._mouseUpDelegate );

			event.preventDefault();

			mouseHandled = true;
			return true;
		},

		_mouseMove: function( event ) {

			// Only check for mouseups outside the document if you've moved inside the document
			// at least once. This prevents the firing of mouseup in the case of IE<9, which will
			// fire a mousemove event if content is placed under the cursor. See #7778
			// Support: IE <9
			if ( this._mouseMoved ) {

				// IE mouseup check - mouseup happened when mouse was out of window
				if ( $.ui.ie && ( !document.documentMode || document.documentMode < 9 ) &&
					!event.button ) {
					return this._mouseUp( event );

					// Iframe mouseup check - mouseup occurred in another document
				} else if ( !event.which ) {

					// Support: Safari <=8 - 9
					// Safari sets which to 0 if you press any of the following keys
					// during a drag (#14461)
					if ( event.originalEvent.altKey || event.originalEvent.ctrlKey ||
						event.originalEvent.metaKey || event.originalEvent.shiftKey ) {
						this.ignoreMissingWhich = true;
					} else if ( !this.ignoreMissingWhich ) {
						return this._mouseUp( event );
					}
				}
			}

			if ( event.which || event.button ) {
				this._mouseMoved = true;
			}

			if ( this._mouseStarted ) {
				this._mouseDrag( event );
				return event.preventDefault();
			}

			if ( this._mouseDistanceMet( event ) && this._mouseDelayMet( event ) ) {
				this._mouseStarted =
					( this._mouseStart( this._mouseDownEvent, event ) !== false );
				( this._mouseStarted ? this._mouseDrag( event ) : this._mouseUp( event ) );
			}

			return !this._mouseStarted;
		},

		_mouseUp: function( event ) {
			this.document
				.off( "mousemove." + this.widgetName, this._mouseMoveDelegate )
				.off( "mouseup." + this.widgetName, this._mouseUpDelegate );

			if ( this._mouseStarted ) {
				this._mouseStarted = false;

				if ( event.target === this._mouseDownEvent.target ) {
					$.data( event.target, this.widgetName + ".preventClickEvent", true );
				}

				this._mouseStop( event );
			}

			if ( this._mouseDelayTimer ) {
				clearTimeout( this._mouseDelayTimer );
				delete this._mouseDelayTimer;
			}

			this.ignoreMissingWhich = false;
			mouseHandled = false;
			event.preventDefault();
		},

		_mouseDistanceMet: function( event ) {
			return ( Math.max(
					Math.abs( this._mouseDownEvent.pageX - event.pageX ),
					Math.abs( this._mouseDownEvent.pageY - event.pageY )
				) >= this.options.distance
			);
		},

		_mouseDelayMet: function( /* event */ ) {
			return this.mouseDelayMet;
		},

		// These are placeholder methods, to be overriden by extending plugin
		_mouseStart: function( /* event */ ) {},
		_mouseDrag: function( /* event */ ) {},
		_mouseStop: function( /* event */ ) {},
		_mouseCapture: function( /* event */ ) { return true; }
	} );


	/*!
     * jQuery UI Slider 1.12.1
     * http://jqueryui.com
     *
     * Copyright jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */

//>>label: Slider
//>>group: Widgets
//>>description: Displays a flexible slider with ranges and accessibility via keyboard.
//>>docs: http://api.jqueryui.com/slider/
//>>demos: http://jqueryui.com/slider/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/slider.css
//>>css.theme: ../../themes/base/theme.css



	var widgetsSlider = $.widget( "ui.slider", $.ui.mouse, {
		version: "1.12.1",
		widgetEventPrefix: "slide",

		options: {
			animate: false,
			classes: {
				"ui-slider": "ui-corner-all",
				"ui-slider-handle": "ui-corner-all",

				// Note: ui-widget-header isn't the most fittingly semantic framework class for this
				// element, but worked best visually with a variety of themes
				"ui-slider-range": "ui-corner-all ui-widget-header"
			},
			distance: 0,
			max: 100,
			min: 0,
			orientation: "horizontal",
			range: false,
			step: 1,
			value: 0,
			values: null,

			// Callbacks
			change: null,
			slide: null,
			start: null,
			stop: null
		},

		// Number of pages in a slider
		// (how many times can you page up/down to go through the whole range)
		numPages: 5,

		_create: function() {
			this._keySliding = false;
			this._mouseSliding = false;
			this._animateOff = true;
			this._handleIndex = null;
			this._detectOrientation();
			this._mouseInit();
			this._calculateNewMax();

			this._addClass( "ui-slider ui-slider-" + this.orientation,
				"ui-widget ui-widget-content" );

			this._refresh();

			this._animateOff = false;
		},

		_refresh: function() {
			this._createRange();
			this._createHandles();
			this._setupEvents();
			this._refreshValue();
		},

		_createHandles: function() {
			var i, handleCount,
				options = this.options,
				existingHandles = this.element.find( ".ui-slider-handle" ),
				handle = "<span tabindex='0'></span>",
				handles = [];

			handleCount = ( options.values && options.values.length ) || 1;

			if ( existingHandles.length > handleCount ) {
				existingHandles.slice( handleCount ).remove();
				existingHandles = existingHandles.slice( 0, handleCount );
			}

			for ( i = existingHandles.length; i < handleCount; i++ ) {
				handles.push( handle );
			}

			this.handles = existingHandles.add( $( handles.join( "" ) ).appendTo( this.element ) );

			this._addClass( this.handles, "ui-slider-handle", "ui-state-default" );

			this.handle = this.handles.eq( 0 );

			this.handles.each( function( i ) {
				$( this )
					.data( "ui-slider-handle-index", i )
					.attr( "tabIndex", 0 );
			} );
		},

		_createRange: function() {
			var options = this.options;

			if ( options.range ) {
				if ( options.range === true ) {
					if ( !options.values ) {
						options.values = [ this._valueMin(), this._valueMin() ];
					} else if ( options.values.length && options.values.length !== 2 ) {
						options.values = [ options.values[ 0 ], options.values[ 0 ] ];
					} else if ( $.isArray( options.values ) ) {
						options.values = options.values.slice( 0 );
					}
				}

				if ( !this.range || !this.range.length ) {
					this.range = $( "<div>" )
						.appendTo( this.element );

					this._addClass( this.range, "ui-slider-range" );
				} else {
					this._removeClass( this.range, "ui-slider-range-min ui-slider-range-max" );

					// Handle range switching from true to min/max
					this.range.css( {
						"left": "",
						"bottom": ""
					} );
				}
				if ( options.range === "min" || options.range === "max" ) {
					this._addClass( this.range, "ui-slider-range-" + options.range );
				}
			} else {
				if ( this.range ) {
					this.range.remove();
				}
				this.range = null;
			}
		},

		_setupEvents: function() {
			this._off( this.handles );
			this._on( this.handles, this._handleEvents );
			this._hoverable( this.handles );
			this._focusable( this.handles );
		},

		_destroy: function() {
			this.handles.remove();
			if ( this.range ) {
				this.range.remove();
			}

			this._mouseDestroy();
		},

		_mouseCapture: function( event ) {
			var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle,
				that = this,
				o = this.options;

			if ( o.disabled ) {
				return false;
			}

			this.elementSize = {
				width: this.element.outerWidth(),
				height: this.element.outerHeight()
			};
			this.elementOffset = this.element.offset();

			position = { x: event.pageX, y: event.pageY };
			normValue = this._normValueFromMouse( position );
			distance = this._valueMax() - this._valueMin() + 1;
			this.handles.each( function( i ) {
				var thisDistance = Math.abs( normValue - that.values( i ) );
				if ( ( distance > thisDistance ) ||
					( distance === thisDistance &&
						( i === that._lastChangedValue || that.values( i ) === o.min ) ) ) {
					distance = thisDistance;
					closestHandle = $( this );
					index = i;
				}
			} );

			allowed = this._start( event, index );
			if ( allowed === false ) {
				return false;
			}
			this._mouseSliding = true;

			this._handleIndex = index;

			this._addClass( closestHandle, null, "ui-state-active" );
			closestHandle.trigger( "focus" );

			offset = closestHandle.offset();
			mouseOverHandle = !$( event.target ).parents().addBack().is( ".ui-slider-handle" );
			this._clickOffset = mouseOverHandle ? { left: 0, top: 0 } : {
				left: event.pageX - offset.left - ( closestHandle.width() / 2 ),
				top: event.pageY - offset.top -
					( closestHandle.height() / 2 ) -
					( parseInt( closestHandle.css( "borderTopWidth" ), 10 ) || 0 ) -
					( parseInt( closestHandle.css( "borderBottomWidth" ), 10 ) || 0 ) +
					( parseInt( closestHandle.css( "marginTop" ), 10 ) || 0 )
			};

			if ( !this.handles.hasClass( "ui-state-hover" ) ) {
				this._slide( event, index, normValue );
			}
			this._animateOff = true;
			return true;
		},

		_mouseStart: function() {
			return true;
		},

		_mouseDrag: function( event ) {
			var position = { x: event.pageX, y: event.pageY },
				normValue = this._normValueFromMouse( position );

			this._slide( event, this._handleIndex, normValue );

			return false;
		},

		_mouseStop: function( event ) {
			this._removeClass( this.handles, null, "ui-state-active" );
			this._mouseSliding = false;

			this._stop( event, this._handleIndex );
			this._change( event, this._handleIndex );

			this._handleIndex = null;
			this._clickOffset = null;
			this._animateOff = false;

			return false;
		},

		_detectOrientation: function() {
			this.orientation = ( this.options.orientation === "vertical" ) ? "vertical" : "horizontal";
		},

		_normValueFromMouse: function( position ) {
			var pixelTotal,
				pixelMouse,
				percentMouse,
				valueTotal,
				valueMouse;

			if ( this.orientation === "horizontal" ) {
				pixelTotal = this.elementSize.width;
				pixelMouse = position.x - this.elementOffset.left -
					( this._clickOffset ? this._clickOffset.left : 0 );
			} else {
				pixelTotal = this.elementSize.height;
				pixelMouse = position.y - this.elementOffset.top -
					( this._clickOffset ? this._clickOffset.top : 0 );
			}

			percentMouse = ( pixelMouse / pixelTotal );
			if ( percentMouse > 1 ) {
				percentMouse = 1;
			}
			if ( percentMouse < 0 ) {
				percentMouse = 0;
			}
			if ( this.orientation === "vertical" ) {
				percentMouse = 1 - percentMouse;
			}

			valueTotal = this._valueMax() - this._valueMin();
			valueMouse = this._valueMin() + percentMouse * valueTotal;

			return this._trimAlignValue( valueMouse );
		},

		_uiHash: function( index, value, values ) {
			var uiHash = {
				handle: this.handles[ index ],
				handleIndex: index,
				value: value !== undefined ? value : this.value()
			};

			if ( this._hasMultipleValues() ) {
				uiHash.value = value !== undefined ? value : this.values( index );
				uiHash.values = values || this.values();
			}

			return uiHash;
		},

		_hasMultipleValues: function() {
			return this.options.values && this.options.values.length;
		},

		_start: function( event, index ) {
			return this._trigger( "start", event, this._uiHash( index ) );
		},

		_slide: function( event, index, newVal ) {
			var allowed, otherVal,
				currentValue = this.value(),
				newValues = this.values();

			if ( this._hasMultipleValues() ) {
				otherVal = this.values( index ? 0 : 1 );
				currentValue = this.values( index );

				if ( this.options.values.length === 2 && this.options.range === true ) {
					newVal =  index === 0 ? Math.min( otherVal, newVal ) : Math.max( otherVal, newVal );
				}

				newValues[ index ] = newVal;
			}

			if ( newVal === currentValue ) {
				return;
			}

			allowed = this._trigger( "slide", event, this._uiHash( index, newVal, newValues ) );

			// A slide can be canceled by returning false from the slide callback
			if ( allowed === false ) {
				return;
			}

			if ( this._hasMultipleValues() ) {
				this.values( index, newVal );
			} else {
				this.value( newVal );
			}
		},

		_stop: function( event, index ) {
			this._trigger( "stop", event, this._uiHash( index ) );
		},

		_change: function( event, index ) {
			if ( !this._keySliding && !this._mouseSliding ) {

				//store the last changed value index for reference when handles overlap
				this._lastChangedValue = index;
				this._trigger( "change", event, this._uiHash( index ) );
			}
		},

		value: function( newValue ) {
			if ( arguments.length ) {
				this.options.value = this._trimAlignValue( newValue );
				this._refreshValue();
				this._change( null, 0 );
				return;
			}

			return this._value();
		},

		values: function( index, newValue ) {
			var vals,
				newValues,
				i;

			if ( arguments.length > 1 ) {
				this.options.values[ index ] = this._trimAlignValue( newValue );
				this._refreshValue();
				this._change( null, index );
				return;
			}

			if ( arguments.length ) {
				if ( $.isArray( arguments[ 0 ] ) ) {
					vals = this.options.values;
					newValues = arguments[ 0 ];
					for ( i = 0; i < vals.length; i += 1 ) {
						vals[ i ] = this._trimAlignValue( newValues[ i ] );
						this._change( null, i );
					}
					this._refreshValue();
				} else {
					if ( this._hasMultipleValues() ) {
						return this._values( index );
					} else {
						return this.value();
					}
				}
			} else {
				return this._values();
			}
		},

		_setOption: function( key, value ) {
			var i,
				valsLength = 0;

			if ( key === "range" && this.options.range === true ) {
				if ( value === "min" ) {
					this.options.value = this._values( 0 );
					this.options.values = null;
				} else if ( value === "max" ) {
					this.options.value = this._values( this.options.values.length - 1 );
					this.options.values = null;
				}
			}

			if ( $.isArray( this.options.values ) ) {
				valsLength = this.options.values.length;
			}

			this._super( key, value );

			switch ( key ) {
				case "orientation":
					this._detectOrientation();
					this._removeClass( "ui-slider-horizontal ui-slider-vertical" )
						._addClass( "ui-slider-" + this.orientation );
					this._refreshValue();
					if ( this.options.range ) {
						this._refreshRange( value );
					}

					// Reset positioning from previous orientation
					this.handles.css( value === "horizontal" ? "bottom" : "left", "" );
					break;
				case "value":
					this._animateOff = true;
					this._refreshValue();
					this._change( null, 0 );
					this._animateOff = false;
					break;
				case "values":
					this._animateOff = true;
					this._refreshValue();

					// Start from the last handle to prevent unreachable handles (#9046)
					for ( i = valsLength - 1; i >= 0; i-- ) {
						this._change( null, i );
					}
					this._animateOff = false;
					break;
				case "step":
				case "min":
				case "max":
					this._animateOff = true;
					this._calculateNewMax();
					this._refreshValue();
					this._animateOff = false;
					break;
				case "range":
					this._animateOff = true;
					this._refresh();
					this._animateOff = false;
					break;
			}
		},

		_setOptionDisabled: function( value ) {
			this._super( value );

			this._toggleClass( null, "ui-state-disabled", !!value );
		},

		//internal value getter
		// _value() returns value trimmed by min and max, aligned by step
		_value: function() {
			var val = this.options.value;
			val = this._trimAlignValue( val );

			return val;
		},

		//internal values getter
		// _values() returns array of values trimmed by min and max, aligned by step
		// _values( index ) returns single value trimmed by min and max, aligned by step
		_values: function( index ) {
			var val,
				vals,
				i;

			if ( arguments.length ) {
				val = this.options.values[ index ];
				val = this._trimAlignValue( val );

				return val;
			} else if ( this._hasMultipleValues() ) {

				// .slice() creates a copy of the array
				// this copy gets trimmed by min and max and then returned
				vals = this.options.values.slice();
				for ( i = 0; i < vals.length; i += 1 ) {
					vals[ i ] = this._trimAlignValue( vals[ i ] );
				}

				return vals;
			} else {
				return [];
			}
		},

		// Returns the step-aligned value that val is closest to, between (inclusive) min and max
		_trimAlignValue: function( val ) {
			if ( val <= this._valueMin() ) {
				return this._valueMin();
			}
			if ( val >= this._valueMax() ) {
				return this._valueMax();
			}
			var step = ( this.options.step > 0 ) ? this.options.step : 1,
				valModStep = ( val - this._valueMin() ) % step,
				alignValue = val - valModStep;

			if ( Math.abs( valModStep ) * 2 >= step ) {
				alignValue += ( valModStep > 0 ) ? step : ( -step );
			}

			// Since JavaScript has problems with large floats, round
			// the final value to 5 digits after the decimal point (see #4124)
			return parseFloat( alignValue.toFixed( 5 ) );
		},

		_calculateNewMax: function() {
			var max = this.options.max,
				min = this._valueMin(),
				step = this.options.step,
				aboveMin = Math.round( ( max - min ) / step ) * step;
			max = aboveMin + min;
			if ( max > this.options.max ) {

				//If max is not divisible by step, rounding off may increase its value
				max -= step;
			}
			this.max = parseFloat( max.toFixed( this._precision() ) );
		},

		_precision: function() {
			var precision = this._precisionOf( this.options.step );
			if ( this.options.min !== null ) {
				precision = Math.max( precision, this._precisionOf( this.options.min ) );
			}
			return precision;
		},

		_precisionOf: function( num ) {
			var str = num.toString(),
				decimal = str.indexOf( "." );
			return decimal === -1 ? 0 : str.length - decimal - 1;
		},

		_valueMin: function() {
			return this.options.min;
		},

		_valueMax: function() {
			return this.max;
		},

		_refreshRange: function( orientation ) {
			if ( orientation === "vertical" ) {
				this.range.css( { "width": "", "left": "" } );
			}
			if ( orientation === "horizontal" ) {
				this.range.css( { "height": "", "bottom": "" } );
			}
		},

		_refreshValue: function() {
			var lastValPercent, valPercent, value, valueMin, valueMax,
				oRange = this.options.range,
				o = this.options,
				that = this,
				animate = ( !this._animateOff ) ? o.animate : false,
				_set = {};

			if ( this._hasMultipleValues() ) {
				this.handles.each( function( i ) {
					valPercent = ( that.values( i ) - that._valueMin() ) / ( that._valueMax() -
						that._valueMin() ) * 100;
					_set[ that.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
					$( this ).stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );
					if ( that.options.range === true ) {
						if ( that.orientation === "horizontal" ) {
							if ( i === 0 ) {
								that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
									left: valPercent + "%"
								}, o.animate );
							}
							if ( i === 1 ) {
								that.range[ animate ? "animate" : "css" ]( {
									width: ( valPercent - lastValPercent ) + "%"
								}, {
									queue: false,
									duration: o.animate
								} );
							}
						} else {
							if ( i === 0 ) {
								that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
									bottom: ( valPercent ) + "%"
								}, o.animate );
							}
							if ( i === 1 ) {
								that.range[ animate ? "animate" : "css" ]( {
									height: ( valPercent - lastValPercent ) + "%"
								}, {
									queue: false,
									duration: o.animate
								} );
							}
						}
					}
					lastValPercent = valPercent;
				} );
			} else {
				value = this.value();
				valueMin = this._valueMin();
				valueMax = this._valueMax();
				valPercent = ( valueMax !== valueMin ) ?
					( value - valueMin ) / ( valueMax - valueMin ) * 100 :
					0;
				_set[ this.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
				this.handle.stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );

				if ( oRange === "min" && this.orientation === "horizontal" ) {
					this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
						width: valPercent + "%"
					}, o.animate );
				}
				if ( oRange === "max" && this.orientation === "horizontal" ) {
					this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
						width: ( 100 - valPercent ) + "%"
					}, o.animate );
				}
				if ( oRange === "min" && this.orientation === "vertical" ) {
					this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
						height: valPercent + "%"
					}, o.animate );
				}
				if ( oRange === "max" && this.orientation === "vertical" ) {
					this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
						height: ( 100 - valPercent ) + "%"
					}, o.animate );
				}
			}
		},

		_handleEvents: {
			keydown: function( event ) {
				var allowed, curVal, newVal, step,
					index = $( event.target ).data( "ui-slider-handle-index" );

				switch ( event.keyCode ) {
					case $.ui.keyCode.HOME:
					case $.ui.keyCode.END:
					case $.ui.keyCode.PAGE_UP:
					case $.ui.keyCode.PAGE_DOWN:
					case $.ui.keyCode.UP:
					case $.ui.keyCode.RIGHT:
					case $.ui.keyCode.DOWN:
					case $.ui.keyCode.LEFT:
						event.preventDefault();
						if ( !this._keySliding ) {
							this._keySliding = true;
							this._addClass( $( event.target ), null, "ui-state-active" );
							allowed = this._start( event, index );
							if ( allowed === false ) {
								return;
							}
						}
						break;
				}

				step = this.options.step;
				if ( this._hasMultipleValues() ) {
					curVal = newVal = this.values( index );
				} else {
					curVal = newVal = this.value();
				}

				switch ( event.keyCode ) {
					case $.ui.keyCode.HOME:
						newVal = this._valueMin();
						break;
					case $.ui.keyCode.END:
						newVal = this._valueMax();
						break;
					case $.ui.keyCode.PAGE_UP:
						newVal = this._trimAlignValue(
							curVal + ( ( this._valueMax() - this._valueMin() ) / this.numPages )
						);
						break;
					case $.ui.keyCode.PAGE_DOWN:
						newVal = this._trimAlignValue(
							curVal - ( ( this._valueMax() - this._valueMin() ) / this.numPages ) );
						break;
					case $.ui.keyCode.UP:
					case $.ui.keyCode.RIGHT:
						if ( curVal === this._valueMax() ) {
							return;
						}
						newVal = this._trimAlignValue( curVal + step );
						break;
					case $.ui.keyCode.DOWN:
					case $.ui.keyCode.LEFT:
						if ( curVal === this._valueMin() ) {
							return;
						}
						newVal = this._trimAlignValue( curVal - step );
						break;
				}

				this._slide( event, index, newVal );
			},
			keyup: function( event ) {
				var index = $( event.target ).data( "ui-slider-handle-index" );

				if ( this._keySliding ) {
					this._keySliding = false;
					this._stop( event, index );
					this._change( event, index );
					this._removeClass( $( event.target ), null, "ui-state-active" );
				}
			}
		}
	} );

}(jQuery));


/*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011–2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function ($) {

  // Detect touch support
  $.support.touch = 'ontouchend' in document;

  // Ignore browsers without touch support
  if (!$.support.touch) {
    return;
  }

  var mouseProto = $.ui.mouse.prototype,
      _mouseInit = mouseProto._mouseInit,
      _mouseDestroy = mouseProto._mouseDestroy,
      touchHandled;

  /**
   * Simulate a mouse event based on a corresponding touch event
   * @param {Object} event A touch event
   * @param {String} simulatedType The corresponding mouse event
   */
  function simulateMouseEvent (event, simulatedType) {

    // Ignore multi-touch events
    if (event.originalEvent.touches.length > 1) {
      return;
    }

    event.preventDefault();

    var touch = event.originalEvent.changedTouches[0],
        simulatedEvent = document.createEvent('MouseEvents');
    
    // Initialize the simulated mouse event using the touch event's coordinates
    simulatedEvent.initMouseEvent(
      simulatedType,    // type
      true,             // bubbles                    
      true,             // cancelable                 
      window,           // view                       
      1,                // detail                     
      touch.screenX,    // screenX                    
      touch.screenY,    // screenY                    
      touch.clientX,    // clientX                    
      touch.clientY,    // clientY                    
      false,            // ctrlKey                    
      false,            // altKey                     
      false,            // shiftKey                   
      false,            // metaKey                    
      0,                // button                     
      null              // relatedTarget              
    );

    // Dispatch the simulated event to the target element
    event.target.dispatchEvent(simulatedEvent);
  }

  /**
   * Handle the jQuery UI widget's touchstart events
   * @param {Object} event The widget element's touchstart event
   */
  mouseProto._touchStart = function (event) {

    var self = this;

    // Ignore the event if another widget is already being handled
    if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
      return;
    }

    // Set the flag to prevent other widgets from inheriting the touch event
    touchHandled = true;

    // Track movement to determine if interaction was a click
    self._touchMoved = false;

    // Simulate the mouseover event
    simulateMouseEvent(event, 'mouseover');

    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');

    // Simulate the mousedown event
    simulateMouseEvent(event, 'mousedown');
  };

  /**
   * Handle the jQuery UI widget's touchmove events
   * @param {Object} event The document's touchmove event
   */
  mouseProto._touchMove = function (event) {

    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Interaction was not a click
    this._touchMoved = true;

    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');
  };

  /**
   * Handle the jQuery UI widget's touchend events
   * @param {Object} event The document's touchend event
   */
  mouseProto._touchEnd = function (event) {

    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Simulate the mouseup event
    simulateMouseEvent(event, 'mouseup');

    // Simulate the mouseout event
    simulateMouseEvent(event, 'mouseout');

    // If the touch interaction did not move, it should trigger a click
    if (!this._touchMoved) {

      // Simulate the click event
      simulateMouseEvent(event, 'click');
    }

    // Unset the flag to allow other widgets to inherit the touch event
    touchHandled = false;
  };

  /**
   * A duck punch of the $.ui.mouse _mouseInit method to support touch events.
   * This method extends the widget with bound touch event handlers that
   * translate touch events to mouse events and pass them to the widget's
   * original mouse event handling methods.
   */
  mouseProto._mouseInit = function () {
    
    var self = this;

    // Delegate the touch handlers to the widget's element
    self.element.bind({
      touchstart: $.proxy(self, '_touchStart'),
      touchmove: $.proxy(self, '_touchMove'),
      touchend: $.proxy(self, '_touchEnd')
    });

    // Call the original $.ui.mouse init method
    _mouseInit.call(self);
  };

  /**
   * Remove the touch event handlers
   */
  mouseProto._mouseDestroy = function () {
    
    var self = this;

    // Delegate the touch handlers to the widget's element
    self.element.unbind({
      touchstart: $.proxy(self, '_touchStart'),
      touchmove: $.proxy(self, '_touchMove'),
      touchend: $.proxy(self, '_touchEnd')
    });

    // Call the original $.ui.mouse destroy method
    _mouseDestroy.call(self);
  };

})(jQuery);


/*!
Waypoints - 4.0.1
Copyright © 2011-2016 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
*/
(function() {
  'use strict'

  var keyCounter = 0
  var allWaypoints = {}

  /* http://imakewebthings.com/waypoints/api/waypoint */
  function Waypoint(options) {
    if (!options) {
      throw new Error('No options passed to Waypoint constructor')
    }
    if (!options.element) {
      throw new Error('No element option passed to Waypoint constructor')
    }
    if (!options.handler) {
      throw new Error('No handler option passed to Waypoint constructor')
    }

    this.key = 'waypoint-' + keyCounter
    this.options = Waypoint.Adapter.extend({}, Waypoint.defaults, options)
    this.element = this.options.element
    this.adapter = new Waypoint.Adapter(this.element)
    this.callback = options.handler
    this.axis = this.options.horizontal ? 'horizontal' : 'vertical'
    this.enabled = this.options.enabled
    this.triggerPoint = null
    this.group = Waypoint.Group.findOrCreate({
      name: this.options.group,
      axis: this.axis
    })
    this.context = Waypoint.Context.findOrCreateByElement(this.options.context)

    if (Waypoint.offsetAliases[this.options.offset]) {
      this.options.offset = Waypoint.offsetAliases[this.options.offset]
    }
    this.group.add(this)
    this.context.add(this)
    allWaypoints[this.key] = this
    keyCounter += 1
  }

  /* Private */
  Waypoint.prototype.queueTrigger = function(direction) {
    this.group.queueTrigger(this, direction)
  }

  /* Private */
  Waypoint.prototype.trigger = function(args) {
    if (!this.enabled) {
      return
    }
    if (this.callback) {
      this.callback.apply(this, args)
    }
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/destroy */
  Waypoint.prototype.destroy = function() {
    this.context.remove(this)
    this.group.remove(this)
    delete allWaypoints[this.key]
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/disable */
  Waypoint.prototype.disable = function() {
    this.enabled = false
    return this
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/enable */
  Waypoint.prototype.enable = function() {
    this.context.refresh()
    this.enabled = true
    return this
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/next */
  Waypoint.prototype.next = function() {
    return this.group.next(this)
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/previous */
  Waypoint.prototype.previous = function() {
    return this.group.previous(this)
  }

  /* Private */
  Waypoint.invokeAll = function(method) {
    var allWaypointsArray = []
    for (var waypointKey in allWaypoints) {
      allWaypointsArray.push(allWaypoints[waypointKey])
    }
    for (var i = 0, end = allWaypointsArray.length; i < end; i++) {
      allWaypointsArray[i][method]()
    }
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/destroy-all */
  Waypoint.destroyAll = function() {
    Waypoint.invokeAll('destroy')
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/disable-all */
  Waypoint.disableAll = function() {
    Waypoint.invokeAll('disable')
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/enable-all */
  Waypoint.enableAll = function() {
    Waypoint.Context.refreshAll()
    for (var waypointKey in allWaypoints) {
      allWaypoints[waypointKey].enabled = true
    }
    return this
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/refresh-all */
  Waypoint.refreshAll = function() {
    Waypoint.Context.refreshAll()
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/viewport-height */
  Waypoint.viewportHeight = function() {
    return window.innerHeight || document.documentElement.clientHeight
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/viewport-width */
  Waypoint.viewportWidth = function() {
    return document.documentElement.clientWidth
  }

  Waypoint.adapters = []

  Waypoint.defaults = {
    context: window,
    continuous: true,
    enabled: true,
    group: 'default',
    horizontal: false,
    offset: 0
  }

  Waypoint.offsetAliases = {
    'bottom-in-view': function() {
      return this.context.innerHeight() - this.adapter.outerHeight()
    },
    'right-in-view': function() {
      return this.context.innerWidth() - this.adapter.outerWidth()
    }
  }

  window.Waypoint = Waypoint
}())
;(function() {
  'use strict'

  function requestAnimationFrameShim(callback) {
    window.setTimeout(callback, 1000 / 60)
  }

  var keyCounter = 0
  var contexts = {}
  var Waypoint = window.Waypoint
  var oldWindowLoad = window.onload

  /* http://imakewebthings.com/waypoints/api/context */
  function Context(element) {
    this.element = element
    this.Adapter = Waypoint.Adapter
    this.adapter = new this.Adapter(element)
    this.key = 'waypoint-context-' + keyCounter
    this.didScroll = false
    this.didResize = false
    this.oldScroll = {
      x: this.adapter.scrollLeft(),
      y: this.adapter.scrollTop()
    }
    this.waypoints = {
      vertical: {},
      horizontal: {}
    }

    element.waypointContextKey = this.key
    contexts[element.waypointContextKey] = this
    keyCounter += 1
    if (!Waypoint.windowContext) {
      Waypoint.windowContext = true
      Waypoint.windowContext = new Context(window)
    }

    this.createThrottledScrollHandler()
    this.createThrottledResizeHandler()
  }

  /* Private */
  Context.prototype.add = function(waypoint) {
    var axis = waypoint.options.horizontal ? 'horizontal' : 'vertical'
    this.waypoints[axis][waypoint.key] = waypoint
    this.refresh()
  }

  /* Private */
  Context.prototype.checkEmpty = function() {
    var horizontalEmpty = this.Adapter.isEmptyObject(this.waypoints.horizontal)
    var verticalEmpty = this.Adapter.isEmptyObject(this.waypoints.vertical)
    var isWindow = this.element == this.element.window
    if (horizontalEmpty && verticalEmpty && !isWindow) {
      this.adapter.off('.waypoints')
      delete contexts[this.key]
    }
  }

  /* Private */
  Context.prototype.createThrottledResizeHandler = function() {
    var self = this

    function resizeHandler() {
      self.handleResize()
      self.didResize = false
    }

    this.adapter.on('resize.waypoints', function() {
      if (!self.didResize) {
        self.didResize = true
        Waypoint.requestAnimationFrame(resizeHandler)
      }
    })
  }

  /* Private */
  Context.prototype.createThrottledScrollHandler = function() {
    var self = this
    function scrollHandler() {
      self.handleScroll()
      self.didScroll = false
    }

    this.adapter.on('scroll.waypoints', function() {
      if (!self.didScroll || Waypoint.isTouch) {
        self.didScroll = true
        Waypoint.requestAnimationFrame(scrollHandler)
      }
    })
  }

  /* Private */
  Context.prototype.handleResize = function() {
    Waypoint.Context.refreshAll()
  }

  /* Private */
  Context.prototype.handleScroll = function() {
    var triggeredGroups = {}
    var axes = {
      horizontal: {
        newScroll: this.adapter.scrollLeft(),
        oldScroll: this.oldScroll.x,
        forward: 'right',
        backward: 'left'
      },
      vertical: {
        newScroll: this.adapter.scrollTop(),
        oldScroll: this.oldScroll.y,
        forward: 'down',
        backward: 'up'
      }
    }

    for (var axisKey in axes) {
      var axis = axes[axisKey]
      var isForward = axis.newScroll > axis.oldScroll
      var direction = isForward ? axis.forward : axis.backward

      for (var waypointKey in this.waypoints[axisKey]) {
        var waypoint = this.waypoints[axisKey][waypointKey]
        if (waypoint.triggerPoint === null) {
          continue
        }
        var wasBeforeTriggerPoint = axis.oldScroll < waypoint.triggerPoint
        var nowAfterTriggerPoint = axis.newScroll >= waypoint.triggerPoint
        var crossedForward = wasBeforeTriggerPoint && nowAfterTriggerPoint
        var crossedBackward = !wasBeforeTriggerPoint && !nowAfterTriggerPoint
        if (crossedForward || crossedBackward) {
          waypoint.queueTrigger(direction)
          triggeredGroups[waypoint.group.id] = waypoint.group
        }
      }
    }

    for (var groupKey in triggeredGroups) {
      triggeredGroups[groupKey].flushTriggers()
    }

    this.oldScroll = {
      x: axes.horizontal.newScroll,
      y: axes.vertical.newScroll
    }
  }

  /* Private */
  Context.prototype.innerHeight = function() {
    /*eslint-disable eqeqeq */
    if (this.element == this.element.window) {
      return Waypoint.viewportHeight()
    }
    /*eslint-enable eqeqeq */
    return this.adapter.innerHeight()
  }

  /* Private */
  Context.prototype.remove = function(waypoint) {
    delete this.waypoints[waypoint.axis][waypoint.key]
    this.checkEmpty()
  }

  /* Private */
  Context.prototype.innerWidth = function() {
    /*eslint-disable eqeqeq */
    if (this.element == this.element.window) {
      return Waypoint.viewportWidth()
    }
    /*eslint-enable eqeqeq */
    return this.adapter.innerWidth()
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/context-destroy */
  Context.prototype.destroy = function() {
    var allWaypoints = []
    for (var axis in this.waypoints) {
      for (var waypointKey in this.waypoints[axis]) {
        allWaypoints.push(this.waypoints[axis][waypointKey])
      }
    }
    for (var i = 0, end = allWaypoints.length; i < end; i++) {
      allWaypoints[i].destroy()
    }
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/context-refresh */
  Context.prototype.refresh = function() {
    /*eslint-disable eqeqeq */
    var isWindow = this.element == this.element.window
    /*eslint-enable eqeqeq */
    var contextOffset = isWindow ? undefined : this.adapter.offset()
    var triggeredGroups = {}
    var axes

    this.handleScroll()
    axes = {
      horizontal: {
        contextOffset: isWindow ? 0 : contextOffset.left,
        contextScroll: isWindow ? 0 : this.oldScroll.x,
        contextDimension: this.innerWidth(),
        oldScroll: this.oldScroll.x,
        forward: 'right',
        backward: 'left',
        offsetProp: 'left'
      },
      vertical: {
        contextOffset: isWindow ? 0 : contextOffset.top,
        contextScroll: isWindow ? 0 : this.oldScroll.y,
        contextDimension: this.innerHeight(),
        oldScroll: this.oldScroll.y,
        forward: 'down',
        backward: 'up',
        offsetProp: 'top'
      }
    }

    for (var axisKey in axes) {
      var axis = axes[axisKey]
      for (var waypointKey in this.waypoints[axisKey]) {
        var waypoint = this.waypoints[axisKey][waypointKey]
        var adjustment = waypoint.options.offset
        var oldTriggerPoint = waypoint.triggerPoint
        var elementOffset = 0
        var freshWaypoint = oldTriggerPoint == null
        var contextModifier, wasBeforeScroll, nowAfterScroll
        var triggeredBackward, triggeredForward

        if (waypoint.element !== waypoint.element.window) {
          elementOffset = waypoint.adapter.offset()[axis.offsetProp]
        }

        if (typeof adjustment === 'function') {
          adjustment = adjustment.apply(waypoint)
        }
        else if (typeof adjustment === 'string') {
          adjustment = parseFloat(adjustment)
          if (waypoint.options.offset.indexOf('%') > - 1) {
            adjustment = Math.ceil(axis.contextDimension * adjustment / 100)
          }
        }

        contextModifier = axis.contextScroll - axis.contextOffset
        waypoint.triggerPoint = Math.floor(elementOffset + contextModifier - adjustment)
        wasBeforeScroll = oldTriggerPoint < axis.oldScroll
        nowAfterScroll = waypoint.triggerPoint >= axis.oldScroll
        triggeredBackward = wasBeforeScroll && nowAfterScroll
        triggeredForward = !wasBeforeScroll && !nowAfterScroll

        if (!freshWaypoint && triggeredBackward) {
          waypoint.queueTrigger(axis.backward)
          triggeredGroups[waypoint.group.id] = waypoint.group
        }
        else if (!freshWaypoint && triggeredForward) {
          waypoint.queueTrigger(axis.forward)
          triggeredGroups[waypoint.group.id] = waypoint.group
        }
        else if (freshWaypoint && axis.oldScroll >= waypoint.triggerPoint) {
          waypoint.queueTrigger(axis.forward)
          triggeredGroups[waypoint.group.id] = waypoint.group
        }
      }
    }

    Waypoint.requestAnimationFrame(function() {
      for (var groupKey in triggeredGroups) {
        triggeredGroups[groupKey].flushTriggers()
      }
    })

    return this
  }

  /* Private */
  Context.findOrCreateByElement = function(element) {
    return Context.findByElement(element) || new Context(element)
  }

  /* Private */
  Context.refreshAll = function() {
    for (var contextId in contexts) {
      contexts[contextId].refresh()
    }
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/context-find-by-element */
  Context.findByElement = function(element) {
    return contexts[element.waypointContextKey]
  }

  window.onload = function() {
    if (oldWindowLoad) {
      oldWindowLoad()
    }
    Context.refreshAll()
  }


  Waypoint.requestAnimationFrame = function(callback) {
    var requestFn = window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      requestAnimationFrameShim
    requestFn.call(window, callback)
  }
  Waypoint.Context = Context
}())
;(function() {
  'use strict'

  function byTriggerPoint(a, b) {
    return a.triggerPoint - b.triggerPoint
  }

  function byReverseTriggerPoint(a, b) {
    return b.triggerPoint - a.triggerPoint
  }

  var groups = {
    vertical: {},
    horizontal: {}
  }
  var Waypoint = window.Waypoint

  /* http://imakewebthings.com/waypoints/api/group */
  function Group(options) {
    this.name = options.name
    this.axis = options.axis
    this.id = this.name + '-' + this.axis
    this.waypoints = []
    this.clearTriggerQueues()
    groups[this.axis][this.name] = this
  }

  /* Private */
  Group.prototype.add = function(waypoint) {
    this.waypoints.push(waypoint)
  }

  /* Private */
  Group.prototype.clearTriggerQueues = function() {
    this.triggerQueues = {
      up: [],
      down: [],
      left: [],
      right: []
    }
  }

  /* Private */
  Group.prototype.flushTriggers = function() {
    for (var direction in this.triggerQueues) {
      var waypoints = this.triggerQueues[direction]
      var reverse = direction === 'up' || direction === 'left'
      waypoints.sort(reverse ? byReverseTriggerPoint : byTriggerPoint)
      for (var i = 0, end = waypoints.length; i < end; i += 1) {
        var waypoint = waypoints[i]
        if (waypoint.options.continuous || i === waypoints.length - 1) {
          waypoint.trigger([direction])
        }
      }
    }
    this.clearTriggerQueues()
  }

  /* Private */
  Group.prototype.next = function(waypoint) {
    this.waypoints.sort(byTriggerPoint)
    var index = Waypoint.Adapter.inArray(waypoint, this.waypoints)
    var isLast = index === this.waypoints.length - 1
    return isLast ? null : this.waypoints[index + 1]
  }

  /* Private */
  Group.prototype.previous = function(waypoint) {
    this.waypoints.sort(byTriggerPoint)
    var index = Waypoint.Adapter.inArray(waypoint, this.waypoints)
    return index ? this.waypoints[index - 1] : null
  }

  /* Private */
  Group.prototype.queueTrigger = function(waypoint, direction) {
    this.triggerQueues[direction].push(waypoint)
  }

  /* Private */
  Group.prototype.remove = function(waypoint) {
    var index = Waypoint.Adapter.inArray(waypoint, this.waypoints)
    if (index > -1) {
      this.waypoints.splice(index, 1)
    }
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/first */
  Group.prototype.first = function() {
    return this.waypoints[0]
  }

  /* Public */
  /* http://imakewebthings.com/waypoints/api/last */
  Group.prototype.last = function() {
    return this.waypoints[this.waypoints.length - 1]
  }

  /* Private */
  Group.findOrCreate = function(options) {
    return groups[options.axis][options.name] || new Group(options)
  }

  Waypoint.Group = Group
}())
;(function() {
  'use strict'

  var $ = jQuery
  var Waypoint = window.Waypoint

  function JQueryAdapter(element) {
    this.$element = $(element)
  }

  $.each([
    'innerHeight',
    'innerWidth',
    'off',
    'offset',
    'on',
    'outerHeight',
    'outerWidth',
    'scrollLeft',
    'scrollTop'
  ], function(i, method) {
    JQueryAdapter.prototype[method] = function() {
      var args = Array.prototype.slice.call(arguments)
      return this.$element[method].apply(this.$element, args)
    }
  })

  $.each([
    'extend',
    'inArray',
    'isEmptyObject'
  ], function(i, method) {
    JQueryAdapter[method] = $[method]
  })

  Waypoint.adapters.push({
    name: 'jquery',
    Adapter: JQueryAdapter
  })
  Waypoint.Adapter = JQueryAdapter
}())
;(function() {
  'use strict'

  var Waypoint = window.Waypoint

  function createExtension(framework) {
    return function() {
      var waypoints = []
      var overrides = arguments[0]

      if (framework.isFunction(arguments[0])) {
        overrides = framework.extend({}, arguments[1])
        overrides.handler = arguments[0]
      }

      this.each(function() {
        var options = framework.extend({}, overrides, {
          element: this
        })
        if (typeof options.context === 'string') {
          options.context = framework(this).closest(options.context)[0]
        }
        waypoints.push(new Waypoint(options))
      })

      return waypoints
    }
  }

  if (jQuery) {
    jQuery.fn.waypoint = createExtension(jQuery)
  }
  if (window.Zepto) {
    window.Zepto.fn.waypoint = createExtension(window.Zepto)
  }
}());
