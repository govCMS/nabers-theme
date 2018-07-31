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

      const IntroBlockID = '#block-bean-assessors-introduction'
      const searchQuery = window.location.search
      if ($(IntroBlockID).length > 0 && searchQuery !== '') {
        // If filters are selected, scroll to content.
        document.location.href = IntroBlockID
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
