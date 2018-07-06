/**
 * @file
 * Side Bar Facets.
 */

(function($, Drupal) {
  Drupal.behaviors.govcms_ui_kit_sidebar_facets = {
    attach: function(context) {
      var $button = $('.block-facetapi button', context);
      if ($button.length > 0) {
        const winWidth = document.documentElement.clientWidth;
        var self = this;
        $button.each(function() {
          const $elem = $(this);
          if (winWidth < 1024) {
            self.hideFilters($elem);
          }
          $elem.bind('click', function() {
            self.toggleFilters($elem);
          });
        })
      }
      // Facetapi puts labels before checkboxes by default. We're re-ordering
      // the two elements to make it easier to apply rounded checkboxes style.
      var $checkboxes = $('.block-facetapi li input', context);
      if ($checkboxes.length > 0) {
        $checkboxes.each(function() {
          var $label = $(this).prev();
          $label.removeClass('element-invisible');
          $(this).insertBefore($label);
        });
      }
    },
    hideFilters: function($elem) {
      $elem.parent().siblings('.content').hide();
      $elem.parent().addClass('collapsed');
    },
    toggleFilters: function($elem) {
      $elem.parent().siblings('.content').slideToggle();
      $elem.parent().toggleClass('collapsed');
    }
  };

})(jQuery, Drupal);
