/**
 * @file
 * SideMenu - Provides functionality to set up the multi-level menu.
 */

/* exported SideMenu */

var SideMenu = function() {
  'use strict';
  // Variables.
  var _self = this;
  var active_level = 0;
  var breadcrumb = [];
  var _context = null;
  var $menu = null;
  var $ = jQuery;
  var add_parent_link_to_list = false;
  var is_link_locked = false;
  var has_back_button = false;
  var has_description_on_links = false;
  var has_separate_button = true;
  var $back_button_element = null;
  var $root_close_button = null;
  var TRANSITION_DURATION = 500;

  // User Required.
  var MENU_CONTAINER = '.menu-block-govcms_menu_block-main-menu';
  var SKIP_LINK = '.skip-to';
  var BODY_OPEN_MENU_CLASS = 'body--menu-open';
  var CLASS_MENU_HEADER = 'menu__header';
  var CLASS_MENU_WITH_SUBMENU = 'expanded';

  // Internal element names.
  var CLASS_CURRENT_MENU = 'current-menu';
  var CLASS_MENU_BACK = 'menu__back';
  var CLASS_HIDE = 'sm-hide';
  var DATA_LEVEL_ATTR = 'data-level';

  /*
   * Displays back button above menu items using breadcrumbs.
   */
  function render_current_menu() {
    if (typeof breadcrumb[breadcrumb.length - 1] !== 'undefined') {
      $('.' + CLASS_MENU_HEADER + '-root').addClass(CLASS_HIDE);
      if (!has_back_button) {
        $('.' + CLASS_MENU_HEADER, _context).append($back_button_element);
        has_back_button = true;
      }
      $('.' + CLASS_CURRENT_MENU).html('<span class="top-menu-item"><span class="top-menu-item-prefix">Back to </span>' + breadcrumb[breadcrumb.length - 1].title + '</span>');
    }
    else {
      $('.' + CLASS_MENU_HEADER + '-root').removeClass(CLASS_HIDE);
      $back_button_element.remove();
      has_back_button = false;
    }
  }

  function scroll_to_top() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  // Initialize the menu - should only be called once.
  this.init = function(context) {
    _context = context;

    // Skip to navigation of IOS devices.
    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/i)) {
      $(SKIP_LINK + ' a').click(function() {
        _self.menu_toggle();
      });
    }

    // Set up top bar.
    $back_button_element = $('<button class="' + CLASS_MENU_BACK + '"><span class="' + CLASS_CURRENT_MENU + '"></span></button>');
    $root_close_button = $('<button class="' + CLASS_MENU_HEADER + '-close"><span>Close menu</span></button>');
    var $header = $('<div class="' + CLASS_MENU_HEADER + '"></div>');
    var $top_banner = $('<div class="sm-top-banner"><img src="' + Drupal.settings.basePath + Drupal.settings.pathToTheme + '/dist/images/png/mobile_logo.png" alt="Nabers" /></div>');
    $top_banner.append($root_close_button);

    $header.append($top_banner);
    $header.append($back_button_element);

    $menu = $(MENU_CONTAINER, _context);

    $menu.before($header);

    // Set back button status.
    _self.back();

    // Organize the .menu lists into levels based on hierarchy.
    $menu.find('.menu').each(function(idx, item) {
      // For each menu - set level.
      var levels = 0;

      function recursive_menu_check(menu_item) {
        var $level_up_menu = $(menu_item).parent().closest('.menu');
        if ($level_up_menu.length === 1) {
          levels++;
          recursive_menu_check($level_up_menu);
        }
      }

      recursive_menu_check(item);
      $(item).attr(DATA_LEVEL_ATTR, levels);
      if (levels > 0) {
        $(item).addClass(CLASS_HIDE);
      }
    });

    // Add description to title links.
    $menu.find('.menu').find('li > a').each(function() {
      var $link = $(this);
      var link_text = $link.html();
      var html = '<span class="menu-item__title">' + link_text + '</span>';
      if (has_description_on_links) {
        var desc = $link.attr('title');
        if (desc) {
          html += '<span class="menu-item__description">' + desc + '</span>';
        }
      }
      $link.html(html);
      if (has_separate_button && $link.parent().hasClass(CLASS_MENU_WITH_SUBMENU)) {
        $link.after('<button class="menu-item__expand"><span>Open menu for ' + link_text + '</span></button>');
      }
    });

    // Add parent links to children menus.
    if (add_parent_link_to_list) {
      $menu.find('.menu').find('.' + CLASS_MENU_WITH_SUBMENU + '').each(function() {
        var $link = $(this).children('a');
        var $sub = $(this).children('.menu');
        var $li = $('<li></li>');
        $li.append($link.clone());
        $sub.prepend($li);
      });
    }

    // Add Listeners.
    $('.' + CLASS_MENU_HEADER, _context).delegate('.' + CLASS_MENU_BACK, 'click', _self.back);
    $('.' + CLASS_MENU_HEADER, _context).delegate('.' + CLASS_MENU_BACK, 'keydown', _self.back_keypress);
    if (has_separate_button) {
      $menu.find('.menu-item__expand').bind('click', _self.view_sub_click);
      $menu.find('.menu-item__expand').bind('keydown', _self.view_sub_keypress);
    }
    else {
      $menu.find('.menu a').bind('click', _self.link_click);
      $menu.find('.menu a').bind('keydown', _self.link_keypress);
    }
    $(SKIP_LINK).bind('keydown', _self.menu_toggle_keypress);
    $('body').bind('keydown', _self.document_keypress);
    $root_close_button.bind('click', _self.menu_toggle);
  };

  this.document_keypress = function(e) {
    if (e.keyCode === 27) {
      if (active_level === 0 && $('body').hasClass(BODY_OPEN_MENU_CLASS)) {
        _self.menu_toggle();
        $(SKIP_LINK + ' a').focus();
      }
      else if (active_level > 0) {
        _self.back(_self.focus_on_current_menu);
      }
    }
  };

  this.link_keypress = function(e) {
    if (e.keyCode === 13 || e.keyCode == 32) {
      return _self.link_next(e.currentTarget, _self.focus_on_current_menu);
    }
  };

  this.link_click = function(e) {
    if (!is_link_locked) {
      // Lock to prevent additional clicks.
      is_link_locked = true;
      return _self.link_next(e.currentTarget, function() {
        // Release lock when animation completes.
        is_link_locked = false;
      });
    }
    else {
      return false;
    }
  };

  this.back_keypress = function(e) {
    if (e.keyCode === 13 || e.keyCode == 32) {
      return _self.back(_self.focus_on_current_menu);
    }
  };

  /**
   * Transition to the sub menu left position. Expects active level to be set.
   */
  this.update_menu_position = function() {
    $menu.children('.menu').css('transform', 'translateX(' + (active_level * -100) + '%' + ')');
  }

  this.set_height_of_root_menu = function() {
    if (active_level > 0) {
      var new_height = _self.get_active_menu().not('.sm-hide').height();
      $menu.children('.menu').height(new_height);
    }
    else {
      $menu.children('.menu').height('auto');
    }
  }

  this.get_active_menu = function() {
    return $menu.find('.menu[' + DATA_LEVEL_ATTR + '=' + active_level + ']');
  }

  this.focus_on_current_menu = function() {
    _self.get_active_menu().children('li:nth-child(1)').children('a').focus();
  }

  this.view_sub_click = function(e) {
    _self.link_next($(e.currentTarget).parent().children('a'));
  };

  this.view_sub_keypress = function(e) {
    if (e.keyCode === 13 || e.keyCode == 32) {
      _self.link_keypress({
        currentTarget: $(e.currentTarget).parent().children('a'),
        keyCode: e.keyCode
      });
      return false;
    }
  }

  /*
   * Show / Hide menu display.
   * Can override this with a custom function.
   */
  this.menu_toggle = function() {
    $('body').toggleClass(BODY_OPEN_MENU_CLASS);
  };

  this.menu_toggle_keypress = function(e) {
    if (e.keyCode === 13) {
      e.stopPropagation();
      _self.menu_toggle();
      _self.focus_on_current_menu();
      return false;
    }
  };

  // Move to the previous menu tree.
  this.back = function(callback) {
    if (active_level > 0) {
      breadcrumb.pop();
      render_current_menu();
      active_level--;
      var $active_menu = _self.get_active_menu();
      var $current_menu_list_items = $active_menu.children('li');
      $current_menu_list_items.children('a').removeClass(CLASS_HIDE);
      $current_menu_list_items.children('.menu-item__expand').removeClass(CLASS_HIDE);
      if (has_separate_button) {
        $current_menu_list_items.siblings().removeClass(CLASS_HIDE);
      }
      _self.update_menu_position();
      _self.set_height_of_root_menu();
      scroll_to_top();
      $('body').addClass('body--menu-animate');
      // On complete should hide.
      setTimeout(function() {
        $active_menu.find('.menu').addClass(CLASS_HIDE);
        $('body').removeClass('body--menu-animate');
        if (callback != null && typeof callback === 'function') {
          callback();
        }
      }, TRANSITION_DURATION);
    }
    else if (active_level === 0) {
      render_current_menu();
    }
    return false;
  };

  /*
   * Call on a link event - either proceeds to next menu
   * or follows a link.
   * Returns true if link should be followed, false if sub
   * menu exists.
   */
  this.link_next = function(link_element, callback) {
    var $child_menu = $(link_element).parent().children('.menu');
    $(link_element).parent().parent().find('.menu').addClass(CLASS_HIDE);

    // If child menu exists.
    if ($child_menu.length > 0) {
      $(link_element).parent().children('.menu').removeClass(CLASS_HIDE);
      // Add last link to breadcrumb.
      breadcrumb.push({
        title: $(link_element).find('.menu-item__title').html(),
        url: $(link_element).attr('href')
      });
      render_current_menu();
      active_level++;
      _self.update_menu_position();
      _self.set_height_of_root_menu();
      scroll_to_top();
      $('body').addClass('body--menu-animate');
      setTimeout(function() {
        $('body').removeClass('body--menu-animate');
        // Hide the path leading up to this link to avoid focuing behind.
        $(link_element).parent().siblings().addClass(CLASS_HIDE);
        $(link_element).addClass(CLASS_HIDE);
        if (has_separate_button) {
          $(link_element).parent().children('.menu-item__expand').addClass(CLASS_HIDE);
        }

        if (callback != null) {
          callback();
        }
      }, TRANSITION_DURATION);
      // Prevent clicks on expanded items.
      return false;
    }
    else {
      if (callback != null) {
        callback();
      }
      return true;
    }
  };
};
