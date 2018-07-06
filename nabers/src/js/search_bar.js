/**
 * @file
 * Header Search Field.
 */

(function($, Drupal, window, document, undefined) {

  var $widget = null;
  var $button = null;
  var search_toggle_enabled = null;

  function search_bar_resize() {
    var w = window.innerWidth || document.documentElement.clientWidth;
    if (w >= large_tablet_breakpoint && (search_toggle_enabled || search_toggle_enabled === null)) {
      // Desktop.
      search_toggle_enabled = false;
      $('#header__nav').after($widget).after($button);
    }
    else if (w < large_tablet_breakpoint && (!search_toggle_enabled || search_toggle_enabled === null)) {
      // Mobile.
      search_toggle_enabled = true;
      $('#header__nav').before($button).before($widget);
    }
  }

  function toggle_search(e) {
    var was_open = $widget.hasClass('search-open');
    $widget.toggleClass('search-open');
    if (was_open) {
      $widget.attr('aria-hidden', 'true');
      $button.removeClass('search-open').attr('aria-expanded', 'false');
      $('.header').removeClass('header__search-open');
    }
    else {
      $widget.attr('aria-hidden', 'false');
      $button.addClass('search-open').attr('aria-expanded', 'true');
      $('.header').addClass('header__search-open');
      $('.search-open .form-text').focus();
    }
    e.stopPropagation();
    return false;
  }

  Drupal.behaviors.govcms_ui_kit_search = {
    attach: function(context, settings) {
      $widget = $('#header__search', context);
      if ($widget.length > 0) {
        $button = $('<button class="mobile-expand-search" aria-controls="' + $widget.attr('id') + '" aria-expanded="false"><span>Toggle search form</span></button>');
        $button.unbind('click', toggle_search).bind('click', toggle_search);
        $(window).unbind('resize', search_bar_resize).bind('resize', search_bar_resize);
        search_bar_resize();
      }
    }
  };

})(jQuery, Drupal, this, this.document);
