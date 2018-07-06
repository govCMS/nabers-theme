/**
 * @file
 * Mobile Menu.
 */

(function($, Drupal, window, document, undefined) {

  var CLASS_MENU_OPEN = 'body--menu-open';
  var side_menu = null;

  var $widget = null;
  var $button = null;
  var $nav_wrapper = null;
  var menu_toggle_enabled = false;

  function menu_bar_resize() {
    var w = window.innerWidth || document.documentElement.clientWidth;
    if (w >= large_tablet_breakpoint && menu_toggle_enabled) {
      // Desktop.
      menu_toggle_enabled = false;
      $widget.removeClass('menu-toggle');
      $button.detach();
      disable_menu();
    }
    else if (w < large_tablet_breakpoint && !menu_toggle_enabled) {
      // Mobile.
      menu_toggle_enabled = true;
      $widget.addClass('menu-toggle');
      $nav_wrapper.prepend($button);
    }
  }

  function toggle_menu(e) {
    if (menu_toggle_enabled) {
      var was_open = $('body').hasClass(CLASS_MENU_OPEN);
      if (was_open) {
        disable_menu();
      }
      else {
        $('body').addClass(CLASS_MENU_OPEN);
        $widget.attr('aria-hidden', 'false');
        $button.addClass('menu-open').attr('aria-expanded', 'true');
      }
    }
    if (e != null) {
      e.stopPropagation();
    }
    return false;
  }

  function disable_menu() {
    if ($('body').hasClass(CLASS_MENU_OPEN)) {
      $('body').removeClass(CLASS_MENU_OPEN);
      $widget.attr('aria-hidden', 'true');
      $button.removeClass('menu-open').attr('aria-expanded', 'false');
    }
  }

  Drupal.behaviors.govcms_ui_kit_menu = {
    attach: function(context, settings) {

      // Mobile Menu.
      if (side_menu === null) {
        side_menu = new SideMenu();
        side_menu.menu_toggle = function() {
          toggle_menu();
        };
        side_menu.init(context);
      }

      $widget = $('.header__mobile-nav', context);
      if ($widget.length > 0) {
        var widget_id = 'header__mobile-nav';
        $widget.attr('id', widget_id);
        $button = $('<button class="mobile-expand-menu" aria-controls="' + widget_id + '" aria-expanded="false"><span>Toggle menu navigation</span></button>');
        $nav_wrapper = $('#header__nav');
        $button.unbind('click', toggle_menu).bind('click', toggle_menu);
        $(window).unbind('resize', menu_bar_resize).bind('resize', menu_bar_resize);
        menu_bar_resize();
      }
    }
  };

})(jQuery, Drupal, this, this.document);
