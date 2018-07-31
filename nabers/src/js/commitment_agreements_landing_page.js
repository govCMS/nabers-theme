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

      const IntroBlockID = '#block-bean-commitment-agreements-intro'
      const searchQuery = window.location.search
      if ($(IntroBlockID).length > 0 && searchQuery !== '') {
        // If filters are selected, scroll to content.
        document.location.href = IntroBlockID
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

      // Show "clear search" button when filters/search term are active.
      let showClearSearch = false
      if (window.location.search !== '') {
        const queryParams = window.location.search.substring(1).split('&')
        const searchParams = ['f%5B', 'building', 'signatory']
        for (let i = 0; i < queryParams.length; i++) {
          const param = queryParams[i].split('=')
          for (let j = 0; j < searchParams.length; j++) {
            if (param[0].indexOf(searchParams[j]) > -1) {
              showClearSearch = true
              break;
            }
          }
        }
      }
      $('#commitment-agreements-clear-search').toggle(showClearSearch)
    }
  };

})(jQuery, Drupal);
