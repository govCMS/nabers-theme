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
