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
