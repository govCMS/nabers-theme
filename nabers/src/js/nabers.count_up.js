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
