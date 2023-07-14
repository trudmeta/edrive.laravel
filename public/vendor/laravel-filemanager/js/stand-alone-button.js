(function( $ ){

  $.fn.filemanager = function(type, options) {
    type = type || 'file';

    this.on('click', function(e) {
      let $this = $(this);
      let route_prefix = (options && options.prefix) ? options.prefix : '/filemanager';
      let target_input = $('#' + $(this).data('input'));
      let target_preview = $('#' + $(this).data('preview'));
      let isOneImage = !!target_preview.is('.js-preview-one');
      let $form = $this.closest('.form');
      let $imgCard = $form.find('.js-image-template').find('>:first-child').clone();

      window.open(route_prefix + '?type=' + type, 'FileManager', 'width=900,height=600');
      window.SetUrl = function (items) {
        let file_path = items.map(function (item) {
          return item.url;
        }).join(',');

        // set the value of the desired input to image url
        target_input.val('').val(file_path).trigger('change');

        // clear previous preview
        (!$imgCard.length || isOneImage) && target_preview.html('');

        // set or change the preview image src
        items.forEach(function (item) {
          let $img = $('<img>').attr('src', item.thumb_url);

          //attach image
          if ($imgCard.length) {

            //create card image
            if (!$form.find('.js-model_id').length) {

              $imgCard.find('img').attr('src', item.url).after('<input type="hidden" name="imagesUrl[]" value="' + item.url + '">');
              $imgCard.find('a.btn').addClass('js-popup').attr('href', item.url);
              target_preview.append(
                  $imgCard
              );

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
              return;
            }

            //edit
            let data = {
              eloquentModel: $form.find('.js-eloquentModel').val(),
              models: $form.find('.js-models').val(),
              modelId: $form.find('.js-model_id').val(),
              url: item.url
            };

            $.ajax({
              url: '/admin/ajaxImageAdd',
              method: 'POST',
              data: data,
              success:function(response) {

                if (response && typeof response['image'] !== 'undefined') {
                  let image = response['image'];
                  $imgCard.find('img').attr('src', '/'+image.url);
                  $imgCard.find('a.btn').addClass('js-popup').attr('href', '/'+image.url);
                  $imgCard.find('.js-image-delete').attr('data-image-id', image.id);
                  $img = $imgCard;
                  target_preview.append(
                      $img
                  );
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
                }

              },
              error: function(response) {

              }
            });
          } else {
            target_preview.append(
                $img
            );
          }

        });

        // trigger change event
        target_preview.trigger('change');
      };
      return false;
    });
  }

})(jQuery);
