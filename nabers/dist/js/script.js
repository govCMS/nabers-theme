/**
 * @file
 * JS functionality for Find an assessor page.
 */

(function($, Drupal) {
  Drupal.behaviors.assessors_landing_page = {
    attach: function(context) {
      // Insert "Or" between the tabs in Assessors Search page.
      var $tabs = $('#assessor-search-filters .horizontal-tabs-list li', context);
      if ($tabs.length > 1) {
        var $or = $('<li>or</li>').addClass('horizontal-tab-button').addClass('horizontal-tab-button--or');
        $tabs.not(':last').after($or);
      }

      // Create Assessor table header.
      var $results = $('.view-assessor-search-api .views-row', context);
      if ($results.length > 0) {
        var $labels = [];
        $results.first().find('.field-label').each(function() {
          var $parentClass = $(this).parent().attr('class');
          var $newLabel = $(this).clone().addClass($parentClass);
          $labels.push($newLabel);
        });
        var $tableHeader = $('<div>').append($labels);
        $tableHeader.addClass('view-table-header');
        $results.first().before($tableHeader);
      }
    }
  };

})(jQuery, Drupal);


/**
 * @file
 * Convert Facet links in Commitment Agreement landing page to select tag.
 */

(function($, Drupal) {
  Drupal.behaviors.govcms_ui_kit_commitment_agreement_facets = {
    attach: function(context, settings) {
      // Get all facet blocks.
      const $facetBlocks = $('.commitment-agreement-facets .block-facetapi', context);
      if ($facetBlocks.length > 0) {
        $facetBlocks.each(function(index) {
          const $facet = $(this);
          const $ul = $facet.find('.content ul');
          const $filterLabel = $facet.find('h2');
          const $select = $('<select>', {
            id: $ul.attr('id'),
            name: 'f[' + index + ']',
            size: 1,
            class: 'facet-select'
          });

          // Set the first option to the facet field's label.
          const $firstOption = $('<option>', {
            text: $filterLabel.text(),
            selected: true
          });

          $select.append($firstOption);

          // Disable the select if the facet is empty (i.e. no links).
          if ($ul.length === 0) {
            $select.attr('disabled', true);
            $facet.addClass('facet-disabled');
          }
          // Iterate through facet links and add them as options to $select.
          $ul.find('a').each(function() {
            const $link = $(this);
            const href = $link.attr('href');
            const isActiveLink = $link.hasClass('facetapi-active');
            var label = $link.children('span').first().text();
            if (isActiveLink) {
              label = $link.next('.facetapi-label').text();
              // Facetapi  adds filter reset url to the active link.
              // So here we add it to the default option to allow the user
              // to remove this filter by selecting the default option.
              $select.children().first().attr('value', href);
            }
            $select.append($('<option>', {
              value: href,
              text: label,
              selected: isActiveLink
            }));
          });
          $select.on('change', function() {
            const href = $(this).val();
            var redirect = new Drupal.facetapi.Redirect(href);
            redirect.gotoHref();
          });
          $facet.find('.content').append($select);
          $ul.remove();
          $filterLabel.remove();
        });
      }
    }
  };

})(jQuery, Drupal);


/**
 * @file
 * JS functionality for Commitment Agreements landing page.
 */

(function($, Drupal) {
  Drupal.behaviors.commitment_agreement_landing_page = {
    attach: function(context) {
      // Insert "Or" between the tabs in Commitment Agreement Search page.
      var $tabs = $('#commitment-agreements-filters .horizontal-tabs-list li', context);
      if ($tabs.length > 1) {
        var $or = $('<li>or</li>').addClass('horizontal-tab-button').addClass('horizontal-tab-button--or');
        $tabs.not(':last').after($or);
      }

      // Create commitment agreement table header.
      var $results = $('.view-commitment-agreements .views-row', context);
      if ($results.length > 0) {
        var $labels = [];
        $results.first().find('.field-label').each(function() {
          var $parentClass = $(this).parent().attr('class');
          var $newLabel = $(this).clone().addClass($parentClass);
          $labels.push($newLabel);
        });
        var $tableHeader = $('<div>').append($labels);
        $tableHeader.addClass('view-table-header');
        $results.first().before($tableHeader);
      }
    }
  };

})(jQuery, Drupal);


/**
 * @file
 * External Link detector.
 */

(function($, Drupal, window, document, undefined) {

  var current_domain = '';
  var domainRe = /https?:\/\/((?:[\w\d-]+\.)+[\w\d]{2,})/i;

  function domain(url) {
    var arr = domainRe.exec(url);
    return (arr !== null) ? arr[1] : current_domain;
  }

  function isExternalRegexClosure(url) {
    return current_domain !== domain(url);
  }

  Drupal.behaviors.govcms_ui_kit_external_links = {
    attach: function(context, settings) {
      // Get current domain.
      current_domain = domain(location.href);

      // Find all links and apply a rel if external.
      $('a', context).each(function() {
        var $this = $(this);
        if (isExternalRegexClosure($this.attr('href'))) {
          $this.attr('target', '_blank');
          $this.attr('rel', 'external');
        }
      })
    }
  };

})(jQuery, Drupal, this, this.document);


/**
 * @file
 * Card features.
 */

(function($, Drupal, window, document, undefined) {

  Drupal.behaviors.govcms_ui_kit_listing_component = {
    attach: function(context, settings) {
      $('.listing-component.has-thumbnail', context).find('img').on('click', function() {
        var href = $(this).closest('.listing-component').find('a').attr('href');
        window.location.href = href;
      });
    }
  };

})(jQuery, Drupal, this, this.document);


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


/**
 * @file
 * A plugin to animate numbers counting up.
 */

(function($, Drupal) {
  'use strict';

  var self = Drupal.behaviors.nabers_count_up = {
    attach: function(context) {
      var $element = $(".field-name-field-statistics-figure .field-item", context);

      if ($element.length == 0) {
        return;
      }

      $element.each(function() {
        $(this).addClass("do-fade"),
          self.isElementVisible($(this)) && !$(this).hasClass("faded") && $(this).addClass("faded")
      });

      self.countUp($element);

      $(window).scroll(function() {
        self.countUp($element);
        $element.each(function() {
          self.isElementVisible($(this)) && !$(this).hasClass("faded") && $(this).addClass("faded")
        });
      });
    },
    countUp: function($elm) {
      $elm.each(function() {
        !self.isElementVisible($(this)) || $(this).hasClass("counted") || $(this).hasClass("counting") || (
          $(this).addClass("counting"),
          self.startCounter(this));
      });
    },
    isElementVisible: function(e) {
      var t = $(window).scrollTop();
      var n = t + $(window).height();
      var i = $(e).offset().top;
      var o = i + $(e).height();
      return o <= n && i >= t || !(o <= t) && !(i >= n);
    },
    startCounter: function(e) {
      var value = parseFloat($(e).text().replace(/,/g, ''));
      $(e).prop("Counter", 0).animate({
        Counter: value
      }, {
        duration: 1300,
        easing: "swing",
        step: function(t) {
          $(e).text(Math.ceil(t).toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').replace(/(.\d)$/g, ''))
        },
        complete: function() {
          $(e).addClass("counted"),
            $(e).removeClass("counting")
        }
      })
    }
  };

}(jQuery, Drupal));


/**
 * @file
 * Global variables.
 */

var desktop_breakpoint = 1200;
var large_tablet_breakpoint = 1024;
var tablet_breakpoint = 768;
var mobile_breakpoint = 420;

var desktop_column = 1170;

/**
 * GovCMS general bootstrapping.
 */
(function($, Drupal, window, document, undefined) {

  Drupal.behaviors.govcms_ui_kit = {
    attach: function(context, settings) {
      // Object Fit Polyfill for IE. Used on News Teaser Images.
      objectFitImages();
    }
  };

})(jQuery, Drupal, this, this.document);


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


/**
 * @file
 * Side Bar Menu.
 */

(function($, Drupal, window, document, undefined) {

  var $widget = null;
  var is_menu_desktop = true;

  // =========================================================
  // DESKTOP TOGGLES
  // =========================================================.
  function toggle_button_click(e) {
    var $button = $(e.currentTarget);
    var $menu = $button.parent().children('ul.menu');
    var was_closed = $button.hasClass('menu-closed');

    if (was_closed) {
      expand($menu, $button);
    }
    else {
      collapse($menu, $button);
    }
  }

  function collapse($menu, $button) {
    $menu.addClass('menu-closed').attr('aria-hidden', 'true');
    $button.addClass('menu-closed').attr('aria-expanded', 'false').attr('title', 'Expand menu');
  }

  function expand($menu, $button) {
    $menu.removeClass('menu-closed').attr('aria-hidden', 'false');
    $button.removeClass('menu-closed').attr('aria-expanded', 'true').attr('title', 'Collapse menu');
  }

  function add_toggle_buttons() {
    // Only add buttons to first level of menu items.
    $widget.find('.menu-block-wrapper > ul > li').each(function(idx) {
      var $list_item = $(this);
      var $sub_menu = $list_item.children('ul.menu');
      if ($sub_menu.length > 0) {
        var is_active_trail = $list_item.hasClass('active-trail');
        $sub_menu.attr('id', 'sidebar-submenu-' + idx);
        var $button = $('<button class="sidebar-toggle-menu" aria-controls="' + $sub_menu.attr('id') + '">Toggle sub menu</button>');
        if (is_active_trail) {
          expand($sub_menu, $button);
        }
        else {
          collapse($sub_menu, $button);
        }
        $list_item.children('a').after($button);
        $button.unbind('click', toggle_button_click).bind('click', toggle_button_click);
      }
    });
  }

  function remove_toggle_buttons() {
    // Clean up any elements and attributes created.
    $widget.find('.sidebar-toggle-menu').remove();
    $widget.find('[id^=sidebar-submenu]').removeAttr('id').removeAttr('aria-hidden').removeClass('menu-closed');
  }

  // =========================================================
  // MOBILE ACCORDION
  // =========================================================.
  function enable_mobile_accordion() {
    var display_text = $widget.children('h2').html();
    var $content = $widget.children('.content');
    $content.attr('id', 'sidebar-menu-content');
    var $button = $('<button aria-controls="sidebar-menu-content" aria-expanded="false">' + display_text + '</button>');
    $widget.children('h2').html($button);
    $button.unbind('click', sidebar_accordion_button_click).bind('click', sidebar_accordion_button_click);
  }

  function disable_mobile_accordion() {
    var display_text = $widget.children('h2').children('button').html();
    $widget.children('h2').empty().html(display_text);
    $widget.children('.content').removeAttr('id').removeClass('showing');
  }

  function sidebar_accordion_button_click(e) {
    var $button = $(e.currentTarget);
    var was_showing = $button.hasClass('showing');

    if (was_showing) {
      $button.removeClass('showing').attr('aria-expanded', 'false');
      $widget.children('.content').removeClass('showing');
    }
    else {
      $button.addClass('showing').attr('aria-expanded', 'true');
      $widget.children('.content').addClass('showing');
    }
  }

  // =========================================================
  // RESPONSIVE
  // =========================================================.
  function side_menu_responsive() {
    var w = window.innerWidth || document.documentElement.clientWidth;
    // Mobile (No toggles).
    if (w < large_tablet_breakpoint && is_menu_desktop) {
      // Disable menu toggles.
      is_menu_desktop = false;
      remove_toggle_buttons();
      enable_mobile_accordion();
    }
    // Desktop (Toggles).
    else if (w >= large_tablet_breakpoint && !is_menu_desktop) {
      is_menu_desktop = true;
      add_toggle_buttons();
      disable_mobile_accordion();
    }
  }

  Drupal.behaviors.govcms_ui_kit_sidebar = {
    attach: function(context, settings) {
      $widget = $('#block-menu-block-govcms-menu-block-sidebar', context);
      if ($widget.length > 0) {
        add_toggle_buttons();
        $(window).unbind('resize', side_menu_responsive).bind('resize', side_menu_responsive);
        side_menu_responsive();
      }
    }
  };

})(jQuery, Drupal, this, this.document);


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


/**
 * @file
 * Home page slider.
 *
 * An implementation of the Owl Carousel with custom controls.
 */

(function($, Drupal, window, document, undefined) {

  var $html = null;
  var $slider_controls = null;
  var $owl_carousel = null;

  function slider_responsive() {
    var w = window.innerWidth || document.documentElement.clientWidth;
    // Mobile (No Slider).
    if (w < tablet_breakpoint && is_slider_running) {
      // Disable Slick (and a little extra housekeeping).
      is_slider_running = false;
      owl.destroy();
      destroy_custom_controls();
      $slider.removeAttr('style').removeAttr('class');
    }
    // Desktop (Slider).
    else if (w >= tablet_breakpoint && !is_slider_running) {
      is_slider_running = true;
      $slider.owlCarousel(banner_settings).removeClass('mobile');
      owl = $slider.data('owlCarousel');
      owl.stop();
      create_custom_controls();
    }
  }

  // =========================================================
  // CUSTOM CONTROLS
  // =========================================================.
  function create_custom_controls() {
    var slides_len = $slider.find('li.views-row').length;

    // Generate page elements.
    var html = '<div class="slider-controls">';
    html += '<button class="slider-prev" title="Previous slide">Previous Slide</button>';
    html += '<ul class="slider-pagination">';
    for (var i = 0; i < slides_len; i++) {
      var num = (i + 1);
      html += '<li><button class="slider-dot" data-slide="' + i + '" aria-label="Slide ' + num + '" title="View slide ' + num + '">' + num + '</button></li>';
    }
    html += '</ul>';
    html += '<button class="slider-next" title="Next slide">Next Slide</button>';
    html += '<button class="slider-play paused" title="Play slideshow">Play</button>';
    html += '</div>';
    $slider_controls = $(html);
    $slider.after($slider_controls);

    // Apply listeners.
    $('.slider-prev').bind('click', previous_button_click);
    $('.slider-next').bind('click', next_button_click);
    $('.slider-dot').bind('click', dot_button_click);
    $('.slider-play').bind('click', play_button_click);
    update_dots_custom_controls();
    position_custom_controls();
  }

  function destroy_custom_controls() {
    $('.slider-controls').remove();
  }

  function update_dots_custom_controls() {
    if (owl !== null) {
      var dot_item = owl.currentItem;
      var $pagination = $('.slider-pagination');
      $pagination.find('.slider-dot').removeClass('active');
      $pagination.find('.slider-dot[data-slide="' + dot_item + '"]').addClass('active');
    }
  }

  function position_custom_controls() {
    // Positioning must also cater for html text_resize functionality.
    var base_scale = parseInt($html.css('font-size'));
    var scale_perc = base_scale / 16;
    var left = ($owl_carousel.width() * 0.5) - ((desktop_column * 0.5) * scale_perc);
    left = (left < 20) ? '20px' : (left / base_scale) + 'rem';
    $slider_controls.css('left', left);
  }

  function previous_button_click(e) {
    owl.prev();
  }

  function next_button_click(e) {
    owl.next();
  }

  function dot_button_click(e) {
    var target_slide = $(e.currentTarget).data('slide');
    if (target_slide !== owl.currentItem) {
      owl.goTo($(e.currentTarget).data('slide'));
    }
  }

  function play_button_click(e) {
    var $this = $(e.currentTarget);
    if ($this.hasClass('paused')) {
      owl.play();
      $this.removeClass('paused').html('Pause').attr('title', 'Pause slideshow');
    }
    else {
      owl.stop();
      $this.addClass('paused').html('Play').attr('title', 'Play slideshow');
    }
  }

  // =========================================================
  // SLIDER INITIALIZATION
  // =========================================================.
  var owl = null;
  var is_slider_running = true;
  var $slider = null;
  var banner_settings = {
    items: 1,
    mouseDrag: false,
    touchDrag: false,
    pagination: false,
    paginationNumbers: false,
    autoPlay: 5000,
    singleItem: true,
    navigation: false,
    slideSpeed: 900,
    navSpeed: 900,
    transitionStyle: "fade",
    afterAction: update_dots_custom_controls,
    afterUpdate: position_custom_controls
  };

  Drupal.behaviors.govcms_ui_kit_slider = {
    attach: function(context, settings) {
      $slider = $('.view-slideshow > div > ul', context);
      if ($slider.length > 0) {
        // Slider only initialized if more than 1 item present.
        if ($slider.children().length > 1) {
          $html = $('html');
          $slider.owlCarousel(banner_settings).removeClass('mobile');
          owl = $slider.data('owlCarousel');
          owl.stop();
          $owl_carousel = $('.owl-carousel');
          create_custom_controls();
          $(window).unbind('resize', slider_responsive).bind('resize', slider_responsive);
          slider_responsive();
          objectFitImages($slider.find('img'));

          // Add support for text resize widget.
          $html.on('font-size-change', position_custom_controls);
        }
      }
    }
  };

})(jQuery, Drupal, this, this.document);


/**
 * @file
 * Text Resize.
 */

(function($, Drupal, window, document, undefined) {

  function increase_font() {
    $('html').addClass('large-fonts').trigger('font-size-change');
    return false;
  }

  function decrease_font() {
    $('html').removeClass('large-fonts').trigger('font-size-change');
    return false;
  }

  Drupal.behaviors.govcms_ui_kit_text_resize = {
    attach: function(context, settings) {
      $widget = $('.block-govcms-text-resize', context);
      if ($widget.length > 0) {
        $widget.find('.font-large').unbind('click', increase_font).bind('click', increase_font);
        $widget.find('.font-small, a.reset').unbind('click', decrease_font).bind('click', decrease_font);
      }
    }
  };

})(jQuery, Drupal, this, this.document);


/**
 * @file
 * Theme twitter.
 *
 * Apply a custom theme to the twitter frame.
 * Based on https://github.com/kevinburke/customize-twitter-1.1
 * with an additional load event to trigger a resize of the module.
 */

(function($, Drupal, window, document, undefined) {

  function embedCss(frame, doc, url) {
    var $link = $('<link href="' + url + '" rel="stylesheet" type="text/css" />');

    $link.on('load', function() {
      // Force twitter frame height update.
      var outer_height = frame.frameElement.clientHeight;
      if (frame.document.body.childElementCount) {
        var inner_height = frame.document.body.children[0].clientHeight;
        if (inner_height !== outer_height) {
          $(frame.frameElement).height(inner_height);
        }
      }
    });

    $('head', doc).append($link);
  }

  Drupal.behaviors.govcms_ui_kit_twitter_theme = {
    attach: function(context, settings) {

      var initialize_attempts = 20;

      function alterTwitterWidget() {
        if (typeof twttr === 'undefined') {
          if (initialize_attempts > 0) {
            initialize_attempts--;
            setTimeout(alterTwitterWidget, 300);
          }
          return;
        }

        twttr.ready(function() {
          twttr.events.bind('loaded', function(event) {
            // Inject a custom stylesheet into the twitter frame.
            for (var i = 0; i < frames.length; i++) {
              var frame = frames[i];
              try {
                if (frame.frameElement.id.indexOf('twitter-widget') >= 0) {
                  embedCss(frame, frame.document, url);
                }
              }
              catch (e) {
                console.log("caught an error");
                console.log(e);
              }
            }
          });
        });
      }

      // Wait for twitter to load, then apply a custom style.
      var url = settings.basePath + settings.pathToTheme + "/dist/css/custom_twitter_theme.css";
      if ($('.twitter-timeline').length) {
        setTimeout(alterTwitterWidget, 300);
      }
    }
  };

})(jQuery, Drupal, this, this.document);


/**
 * @file
 * Form validation.
 */

(function($, Drupal, window, document, undefined) {

  // Set error messages.
  jQuery.extend(jQuery.validator.messages, {
    // required: "This field is required.",
    // remote: "Please fix this field.",.
    email: "Please enter a valid email address in the format of name@domain.com",
    // url: "Please enter a valid URL.",
    // date: "Please enter a valid date.",
    // dateISO: "Please enter a valid date (ISO).",
    // number: "Please enter a valid number.",
    // digits: "Please enter only digits.",
    // creditcard: "Please enter a valid credit card number.",
    // equalTo: "Please enter the same value again.",
    // accept: "Please enter a value with a valid extension.",
    // maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
    // minlength: jQuery.validator.format("Please enter at least {0} characters."),
    // rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
    // range: jQuery.validator.format("Please enter a value between {0} and {1}."),
    // max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
    // min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
  });

  // Email validation resembling filter_var (used in common.inc valid_email_address).
  // Regexp taken from: https://github.com/javazac/filter_var/blob/master/filter_var.php
  jQuery.validator.addMethod("email", function(value, element) {
    return this.optional(element) || /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9_](?:[a-zA-Z0-9_\-](?!\.)){0,61}[a-zA-Z0-9_-]?\.)+[a-zA-Z0-9_](?:[a-zA-Z0-9_\-](?!$)){0,61}[a-zA-Z0-9_]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/.test(value);
  }, jQuery.validator.messages.email);

  function get_label(ielem) {
    var $parent = null;
    if (ielem.hasClass('form-radio')) {
      // Radio buttons in grids.
      $parent = ielem.closest('.webform-component-radios, .webform-component-grid');
    }
    else if (ielem.hasClass('form-select') && (ielem.hasClass('day') || ielem.hasClass('month') || ielem.hasClass('year'))) {
      // Date field.
      $parent = ielem.closest('.webform-component-date');
    }
    else {
      // All other fields.
      $parent = ielem.closest('.form-item');
    }
    return $parent.children('label');
  }

  Drupal.behaviors.govcms_ui_kit_form_validation = {
    attach: function(context, settings) {
      // Webform validation.
      $('form.webform-client-form, form.contact-form', context).validate({
        errorElement: 'span',
        errorPlacement: function(error, element) {
          // No multiple error messages - strip any existing ones.
          get_label(element).children('.error').remove();
          // Place error msg within field label.
          error.appendTo(get_label(element));
        },
        showErrors: function(errorMap, errorList) {
          // Remove asterisk and display custom markup for error.
          $(errorList).each(function() {
            get_label($(this.element)).children('.form-required').remove();
            this.message = '(Error - ' + this.message + ')';
          });
          this.defaultShowErrors();
        }
      });
    }
  };

})(jQuery, Drupal, this, this.document);


/**
 * @file
 * Webform.js.
 */

(function($, Drupal, window, document, undefined) {

  var $grid_components = null;
  var is_overflowing = null;

  // Apply a class to grid element if table exceeds overflow width.
  function component_grid_resize() {
    for (var i = 0; i < $grid_components.length; i++) {
      var $grid = $($grid_components[i]);
      var $table = $grid.find('.webform-grid');
      var has_overflow = $grid.width() < $table.width();
      if (has_overflow && !is_overflowing) {
        is_overflowing = true;
        $grid.addClass('is-overflowing');
      }
      else if (!has_overflow && is_overflowing) {
        is_overflowing = false;
        $grid.removeClass('is-overflowing');
      }
    }
  }

  Drupal.behaviors.govcms_ui_kit_webform = {
    attach: function(context, settings) {
      // Flip the order of radio checkboxes with labels.
      // UI Kit styling only works if the label appears after.
      $('.webform-grid-option > .form-type-radio', context).each(function() {
        var $this = $(this);
        $this.append($this.children('label'));
      });

      // Grid overflow - check on resize.
      $grid_components = $('.webform-component-grid');
      $(window).unbind('resize', component_grid_resize);
      if ($grid_components.length > 0) {
        component_grid_resize();
        $(window).bind('resize', component_grid_resize);
      }
    }
  };

})(jQuery, Drupal, this, this.document);
