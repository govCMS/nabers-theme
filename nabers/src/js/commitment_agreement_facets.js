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
            const href = $(this).val()
            const redirect = new Drupal.facetapi.Redirect(href)
            redirect.gotoHref()
          })
          $facet.find('.content').append($select);
          $ul.remove();
          $filterLabel.remove();
        });
      }
    }
  };

})(jQuery, Drupal);
