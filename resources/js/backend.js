import multi from "multi.js/dist/multi-es6.min.js";
import * as coreui from '@coreui/coreui';


function multiselect() {
    //multiselect
    $(".duallistbox").multi({
        "selected_header": false,
    });
}

(function($) {

    $(function() {

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        multiselect();

        //Delete model
        $('.btn-form-delete').on('click', function(e){
            let message = $(this).find('button').attr('title') || 'Delete?';
            if (confirm(message)) {
                return true;
            }
            return false;
        });


        $('.header-toggler-side').on('click', function(e){
            coreui.Sidebar.getInstance(document.querySelector('#sidebar')).hide()

            setTimeout(function() {
                $('.sidebar-nav').toggleClass('d-none');
                coreui.Sidebar.getInstance(document.querySelector('#sidebar')).show();
                $('.js-button-switch').removeClass('right')
            }, 500)
        });

        $('.js-button-switch').click(function(){
            coreui.Sidebar.getInstance(document.querySelector('#sidebar')).toggle()
            $(this).toggleClass("right");
        });

        //search
        $('.js-search-btn').on('click', function(e) {
            let $input = $(this).parent().find('.js-search');
            let value = $input.val() || '';
            if (!value || !value.length) {
                return false;
            }

            $(this).attr('href', document.location.origin + document.location.pathname + '?search=' + value)
        });

        //cars create/edit, mark's carModels
        let checkedCategory = parseInt($('#category_id').val(),10) || null;
        $('.js-marks-create').on('change', function(e) {
            if (!this.value) return;

            let value = parseInt(this.value, 10);

            let category = checkedCategory? categoriesJson.find(category => category.id === checkedCategory) : null;
            if (!category) return;

            let mark = category.marks.find(mark => mark.id === value);
            if (!mark) return;

            let $select = $('.js-models-create');
            $select.empty();

            $.each(mark['car_models'], function(key, value) {
                $select.append($("<option></option>")
                    .attr("value", value['id']).text(value['title']));
            });
        });


        //route backend."somemodel".index, change parent model
        $('.js-select-change-model').on('change', function(e) {
            let somemodel = $(this).attr('data-model');
            if (somemodel) {
                document.location.href = document.location.origin + document.location.pathname + `?${somemodel}=` + this.value;
            }
        });


        //cars create/edit, category specific attributes
        $('.js-category-create').on('change', function(e) {
            let value = this.value && parseInt(this.value, 10);
            if (!value) return;

            checkedCategory = value;
            let category =  categoriesJson.find(category => category.id === value);
            if (!category) return;

            //update category marks
            let $select = $('.js-marks-create');
            $select.empty().append($("<option></option>"));

            $('.js-models-create').empty();

            $.each(category['marks'], function(key, value) {
                $select.append($("<option></option>")
                    .attr("value", value['id']).text(value['title']));
            });


            //update category attributes
            $('.col-attributes').empty();
            $select = $('<select class="form-control js-add-attribute"><option value=""></option></select>');

            $.each(category['attributes'], function(key, value) {
                $select.append($("<option></option>")
                    .attr("value", value['id']).text(value['title']));
            });

            $('<div class="form-group form-group-create" style="margin-bottom: 10px"></div>')
                .append('<label>Add attribute</label>')
                .append($select)
                .appendTo('.col-attributes');
        });

        //adds new attribute in create/edit cars
        //in create/edit categories this functionality is implemented using alpinejs
        $(document).on('change', '.js-add-attribute', function() {
            let value = parseInt(this.value, 10);
            if (!checkedCategory || typeof categoriesJson === 'undefined' || typeof attributesTypes === 'undefined') return;

            let category =  categoriesJson.find(category => category.id === checkedCategory);
            let attribute =  category && category.attributes.find(attribute => attribute.id === value);
            if (!attribute || $('select#'+attribute['alias']).length) return;

            let id = attribute['alias'];
            let multiple = attribute['type'] === attributesTypes[0] ? '' : 'multiple';
            let $select = $('<select class="form-control" name="values[]" id="'+id+'" '+multiple+'><option value=""></option></select>');
            multiple && $select.addClass('duallistbox');
            $select.before('<label for="'+attribute['alias']+'"></label>');

            $.each(attribute['values'], function(key, value) {
                $select.append($("<option></option>")
                    .attr("value", value['id']).text(value['title']));
            });
            $('<div class="form-group" style="margin-bottom: 10px"></div>')
                .append('<label for="'+attribute['alias']+'">'+attribute['title']+'</label>')
                .append($select)
                .insertAfter('.form-group-create');

            multiselect();

        });

        //edit/create cars, image popup
        $('.js-popup').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true
            },
            image: {
                // options for image content type
                titleSrc: false
            }
        });

        //edit/create App\Models\*, image delete
        $('.js-image-delete').on('click', function(e) {
            e.preventDefault();

            let $this = $(this);
            let $form = $this.closest('.form');

            if (!$form.find('.js-model_id').length) {
                $this.closest('.images-wrapper').remove();
                return false;
            }

            let data = {
                eloquentModel: $form.find('.js-eloquentModel').val(),
                models: $form.find('.js-models').val(),
                modelId: $form.find('.js-model_id').val(),
                imageId: $this.data('image-id'),
            }

            $.ajax({
                url: '/admin/ajaxImageDelete',
                method: 'POST',
                data: data,
                success:function(response) {

                    if (response && typeof response['message'] !== 'undefined' && response['message'] === 'ok') {
                        $this.closest('.images-wrapper').remove()
                    }

                },
                error: function(response) {

                }
            });
            return false;
        });


        //route backend.attribute create/edit
        $('.js-add-value').on('click', function(e) {
            let $inputs = $(this).closest('.row').find('input:text');
            if ($inputs.length < 2 || $inputs.filter((key, input) => {return input.value.trim() === ''}).length > 0) return;

            let $duallistbox = $('.duallistbox');
            $duallistbox
                .append($("<option></option>").attr("value", $inputs[0].value + '.' + $inputs[1].value).text($inputs[0].value));

            $(".multi-wrapper").remove();
            $duallistbox.removeAttr("data-multijs");
            multiselect();

            $inputs.val('');
        })


    });//document ready

})(jQuery);


//resource edit page
(function($) {

    $(function() {

        if (!$.isFunction($.fn.summernote)) {
            return;
        }

        var lfm = function(options, cb) {
            var route_prefix = (options && options.prefix) ? options.prefix : '/laravel-filemanager';
            window.open(route_prefix + '?type=' + options.type || 'file', 'FileManager', 'width=900,height=600');
            window.SetUrl = cb;
        };

        //Define LFM summernote button
        var LFMButton = function(context) {
            var ui = $.summernote.ui;
            var button = ui.button({
                contents: '<i class="note-icon-picture"></i> ',
                tooltip: 'Insert image with filemanager',
                click: function() {

                    lfm({
                        type: 'image',
                        prefix: '/filemanager'
                    }, function(lfmItems, path) {
                        lfmItems.forEach(function(lfmItem) {
                            context.invoke('insertImage', lfmItem.url);
                        });
                    });

                }
            });
            return button.render();
        };

        $('.js-description').summernote({
            height: 150,
            toolbar: [
                ['style', ['style']],
                ['font', ['fontname', 'fontsize', 'bold', 'underline', 'clear']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'lfm', 'video']],
                ['view', ['codeview', 'undo', 'redo', 'help']],
            ],
            buttons: {
                lfm: LFMButton
            }
        });


        $('.js-button-image').filemanager('image');

    });//document ready

})(jQuery);