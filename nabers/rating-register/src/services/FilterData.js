const carbonNeutralOptionID = 'carbon neutral';
const carbonNeutralProperty = 'CarbonNeutral';

export default class FilterData {
  filters = {
    buildingtype: {
      label: 'Building type',
      filterProperty: 'filterBuildingType',
      dataProperty: 'PremiseType',
      options: {
        'office': { value: 'office', label: 'Office' },
        'hotel': { value: 'hotel', label: 'Hotel' },
        'shopping centre': { value: 'shopping centre', label: 'Shopping centre' },
        'data centre': { value: 'data centre', label: 'Data centre' },
        'apartment': { value: 'apartment', label: 'Apartment building' },
        'hospital': { value: 'hospital', label: 'Hospital' }
      }
    },
    ratingscope: {
      label: 'Rating scope',
      filterProperty: 'filterRatingScope',
      dataProperty: 'RatingScope',
      options: {
        'base building': { value: 'base building', label: 'Base building' },
        'whole building': { value: 'whole building', label: 'Whole building' },
        'tenancy': { value: 'tenancy', label: 'Tenancy' },
        'infrastructure': { value: 'infrastructure', label: 'Infrastructure' },
        'whole facility': { value: 'whole facility', label: 'Whole facility' },
        'it equipment': { value: 'it equipment', label: 'IT equipment' }
      }
    },
    ratingtype: {
      label: 'Rating type',
      filterProperty: 'filterRatingType',
      dataProperty: 'RatingType',
      options: {
        'energy': { value: 'energy', label: 'NABERS Energy' },
        'water': { value: 'water', label: 'NABERS Water' },
        'waste': { value: 'waste', label: 'NABERS Waste' },
        'indoor environment': { value: 'indoor environment', label: 'NABERS Indoor environment' },
        'carbon neutral': { value: 'Carbon neutral', label: 'Carbon neutral certification'}
      }
    },
    starrating: {
      label: 'Star rating',
      filterProperty: 'filterStarRatings',
      multiselect: true,
      disabled: {
        default: false,
        current: false
      },
      expanded: false,
      visible: {
        default: false,
        current: false
      },
      options: [
        { value: '0', label: '0 star'},
        { value: '0.5', label: '0.5 star'},
        { value: '1', label: '1 star'},
        { value: '1.5', label: '1.5 star'},
        { value: '2', label: '2 star'},
        { value: '2.5', label: '2.5 star'},
        { value: '3', label: '3 star'},
        { value: '3.5', label: '3.5 star'},
        { value: '4', label: '4 star'},
        { value: '4.5', label: '4.5 star'},
        { value: '5', label: '5 star'},
        { value: '5.5', label: '5.5 star'},
        { value: '6', label: '6 star'},
      ]
    }
  };

  constructor () {
    // Define types.
    this.allBuildingTypes = [
      { value: 'Office', label: 'Office' },
      { value: 'Hotel', label: 'Hotel' },
      { value: 'Shopping Centre', label: 'Shopping Centre' },
      { value: 'Datacentre', label: 'Data Centre' },
      { value: 'Apartments', label: 'Apartments' }
    ]

    this.allRatingScopes = [
      { value: 'Base Building', label: 'Base building' },
      { value: 'Whole Building', label: 'Whole building' },
      { value: 'Tenancy', label: 'Tenancy' },
      { value: 'Infrastructure', label: 'Infrastructure' },
      { value: 'Whole Facility', label: 'Whole facility' },
      { value: 'IT equipment', label: 'IT equipment' }
    ]

    this.allRatingTypes = [
      { value: 'Energy', label: 'Energy' },
      { value: 'Water', label: 'Water' },
      { value: 'Waste', label: 'Waste' },
      { value: 'Indoor Environment', label: 'Indoor Environment' }
    ]

    // Store order (weighting) for sorting queries.
    this.weighting = {}
    this.allBuildingTypes.forEach(this.storeWeight.bind(this))
    this.allRatingScopes.forEach(this.storeWeight.bind(this))
    this.allRatingTypes.forEach(this.storeWeight.bind(this))

    //  Setup some default visibility properties for each Filter ("group")
    for (var groupID in this.filters) {
      if (this.filters.hasOwnProperty(groupID)) {
        var group = this.filters[groupID];
        if (!group.visible) {
          group['visible'] = { default: true, current: true };
        }
      }
      //  Setup some default "disabled" properties for each filter option (if not already defined)
      //  Override by adding option specific settings to the option element above..
      for (var optionID in group.options) {
        if (group.options.hasOwnProperty(optionID)) {
          var option = group.options[optionID];
          if (!option.disabled) {
            option.disabled = { default: false, current: false };
          }
        }
      }
    }
  }

  storeWeight (item, i) {
    this.weighting[item.value] = i
  }

  getWeight (value) {
    return this.weighting[value]
  }

  resetFilterVisibility (filterID) {
    var filter = this.filters[filterID];
    filter.visible.current = filter.visible.default;
  }

  resetAllFiltersVisibility () {
    for (var filterID in this.filters) {
      this.resetFilterVisibility(filterID);
    }
  }

  resetDisabledFilterOptions (filterID) {
    var filter = this.filters[filterID];
    if (!filter.multiselect) {
      for (var optionID in filter.options) {
        var option = filter.options[optionID];
        option.disabled.current = option.disabled.default;
      }
    }
  }

  resetAllFiltersDisabledOptions () {
    for (var filterID in this.filters) {
      this.resetDisabledFilterOptions(filterID);
    }
  }

  //  Loops through filtered rating data, pulling out available options for each of the filters
  extractAvailableOptions (data, exclusions, objTriggerFilter = '') {
    var filters = this.filters;
    var options = {};

    for (let i = 0; i < data.length; i++) {
      var ratings = data[i].Ratings;
      ratings.forEach(function(item) {
        // Loop through each of the searchFilters & extract unique values that
        // appear in the filtered ratings data..
        for (var filterID in filters) {
          //  Some filters we don't need to get a set of options for because we don't want to change them.
          if (exclusions.indexOf(filterID) >= 0 || filterID == 'starrating')
            continue;

          var property = filters[filterID].dataProperty;

          if (!options[filterID])
            options[filterID] = [];

          if (!item.hasOwnProperty(property))
            continue;

          var value = item[property].toLowerCase();

          if (options[filterID].indexOf(value) == -1) {
            if (objTriggerFilter != '') {
              if (item[objTriggerFilter.property].toLowerCase() == objTriggerFilter.value) {
                options[filterID].push(value);
              }
            }
            else {
              options[filterID].push(value);
            }
          }
          //  Carbon neutral is an option in the Rating type drop-down
          //  but it exists as a separate field in the data (`CarbonNeutral`)
          if (filterID == 'ratingtype' && options[filterID].indexOf(carbonNeutralOptionID) == -1) {
            if (item.hasOwnProperty(carbonNeutralProperty) && item.CarbonNeutral) {
              options[filterID].push(carbonNeutralOptionID);
            }
          }
        }
      });
    }
    return options;
  }

  //  Loops through filtered rating data, pulling out available options for each of the filters
  extractAvailableOptionsMultiple (data, filtersToApply, exclusions = '') {
    var filters = this.filters;
    var enabledOptions = {};

    if (exclusions == '') {
      //  Star rating is always excluded, i.e. we don't enable/disable Star rating options automatically
      exclusions = ['starrating'];

      filtersToApply.forEach(function(filterSet) {
        exclusions.push(filterSet.id);
      });
    }

    for (let i = 0; i < data.length; i++) {
      var ratings = data[i].Ratings;
      ratings.forEach(function(rating) {
        // Loop through each of the searchFilters & extract unique values that
        // appear in the filtered ratings data..
        for (var filterID in filters) {
          var property = filters[filterID].dataProperty;

          //  Some filters we don't need to get a set of options for because we don't want to change them.
          //  Or if the rating doesn't have the property we're checking
          if (exclusions.indexOf(filterID) > -1 || !rating.hasOwnProperty(property))
            continue;

          var value = rating[property].toLowerCase();

          if (!enabledOptions[filterID])
            enabledOptions[filterID] = [];

          //  Only add this option to the set of available options for the filter if it's not already in there
          //  AND if the other rating properties match the filter set
          if (enabledOptions[filterID].indexOf(value) == -1) {
            var enable = true;
            filtersToApply.forEach(function(filter) {
              var ratingProperty = filters[filter.id].dataProperty;
              if (!rating.hasOwnProperty(ratingProperty)
                || rating[ratingProperty].toLowerCase() != filter.value
              ) {
                enable = false;
              }
            });
            if (enable === true) {
              enabledOptions[filterID].push(value);
            }
          }

          //  Carbon neutral is an option in the Rating type drop-down
          //  but it exists as a separate field in the data (`CarbonNeutral`)
          if (filterID == 'ratingtype' && enabledOptions[filterID].indexOf(carbonNeutralOptionID) == -1) {
            if (rating.hasOwnProperty(carbonNeutralProperty) && rating.CarbonNeutral) {
              enabledOptions[filterID].push(carbonNeutralOptionID);
            }
          }
        }
      });
    }
    return enabledOptions;
  }

  //  Case insensitive method for finding a filter option based on an ID or value
  getOptionByID (filterID, optionID) {
    optionID = optionID.toLowerCase();
    var filter = this.filters[filterID];
    for (var currentOption in filter.options) {
      if (!filter.options.hasOwnProperty(currentOption))
        continue;
      if (currentOption.toLowerCase() == optionID || filter.options[currentOption].value.toLowerCase() == optionID) {
        return filter.options[currentOption];
      }
    }
  }

  //  This needs its own special method because it is not really a Rating Type, but sits within that select field
  toggleCarbonNeutral (filterQuery) {
    var filter = this.filters['ratingtype'];
    var option = this.getOptionByID('ratingtype', carbonNeutralOptionID);
    //  What are some of the rules?
    // 1. If any star rating is set - carbon neutral is disabled
    if (filterQuery.filterStarRatings.length > 0) {
      option.disabled.current = true;
    }
    //  2. If no filters are set and not star ratings
    else if (filterQuery.filterStarRatings.length == 0
      && filterQuery.filtersSet().length == 0
    ) {
      option.disabled.current = false;
    }
    //  3. It comes down to what filters are selected and the data needs to be scanned based on those filters..
    else if (false) {

    }
  }

  //  Star Ratings has a filter level "disabled" setting, as opposed to option level enable/disable
  //  If Carbon Neutral is selected as the Rating Type, we need to disable Star Rating as a whole
  toggleStarRating (triggerFilter, filterQuery) {
    if (triggerFilter == 'ratingtype' && filterQuery.filterRatingType.toLowerCase() == carbonNeutralOptionID) {
      //  If the star rating panel is open, close it
      if (this.filters.starrating.expanded) {
        this.filters.starrating.expanded = false;
      }
      filterQuery.clearFilterProperty('filterStarRatings');
      this.filters.starrating.disabled.current = true;
    }
    else {
      this.filters.starrating.disabled.current = false;
    }
  }
}
