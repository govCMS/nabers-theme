<template>
  <div class="filtercollection">
    <div class="rating-filter-row">
      <div v-for="(group, key, index) in filterdata.filters"
           v-if="group.visible.current && !group.multiselect"
           :class="key"
           class="rating-filter">
        <select :id="key" v-model="filterquery[group.filterProperty]" @change="applyFilter($event)" :size="helper ? 8 : 1" :class="{ helper: helper }">
          <option value="">{{ group.label }}</option>
          <option v-for="(option, index) in group.options"
                  :value="option.value"
                  :disabled="option.disabled.current"
                  v-if="!option.hidden"
                  :class="{ disabled: option.disabled.current, enabled: !option.disabled.current }">{{ option.label }}</option>
        </select>
      </div>
      <div class="rating-filter"
           :class="{ 'is-disabled': filterdata.filters.starrating.disabled.current, 'is-expanded': filterdata.filters.starrating.expanded, 'is-collapsed': !filterdata.filters.starrating.expanded }"
           @click="toggleStarRatings">
        <button class="select">{{ starratings }}</button>
      </div>
    </div>
    <div class="rating-filter-row star-ratings" v-if="filterdata.filters.starrating.expanded">
      <div v-for="(option, index) in filterdata.filters.starrating.options">
        <input :id="index" class="styled-checkbox" type="checkbox" :value="option.value" v-model="filterquery[filterdata.filters.starrating.filterProperty]" @change="applyStarRatingFilters($event)">
        <label :for="index">{{ option.value }}</label>
      </div>
    </div>
  </div>
</template>

<script>
  import Filter from '../services/Filter'

  const filter = new Filter();

  export default {
    data: function () {
      return {}
    },
    methods: {
      initFilters: function() {
        //  Check the query string to see if the "helper" mode is enabled
        if (window.location.search.substring(1).indexOf('helper') > -1)
          this.$parent.debug = true;
      },
      setFilterVisibility: function(filterID, visible) {
        this.filterdata.filters[filterID].visible.current = visible;
        if (filterID == 'starrating' && !visible) {
          this.filterquery.filterStarRatings = [];
        }
        else if (!visible) {
          this.filterquery[this.filterdata.filters[filterID].filterProperty ] = '';
        }
      },
      disableFilterOption: function(filter, option) {
        option.disabled.current = true;
        //  If it is the currently selected value - we need to clear it..
        if (option.value == this.filterquery[filter.filterProperty]) {
          this.filterquery[filter.filterProperty] = '';
        }
      },
      toggleStarRatings: function() {
        var filter = this.filterdata.filters.starrating;
        if (filter.disabled.current == false) {
          filter.expanded = !filter.expanded;
        }
      },
      applyStarRatingFilters: function(event) {
        this.filterdata.toggleCarbonNeutral(this.filterquery);
        this.$emit('update');
      },
      setSearchFilterOptions: function(filterID, availableOptions) {
        var filter = this.filterdata.filters[filterID];
        for (var optionID in filter.options) {
          var option = filter.options[optionID];
          //  availableOptions are now sent in as lowercase
          if (availableOptions.indexOf(option.value.toLowerCase()) == -1) {
            this.disableFilterOption(filter, option);
          }
          else {
            option.disabled.current = false;
          }
        }
      },
      getFiltersToApply: function(filtersSet) {
        var filterQuery = this.filterquery;
        var filtersToApply = [];

        filtersSet.forEach(function(filterID) {
          var filter = this.filterdata.filters[filterID];
          var property = filter.filterProperty;
          if (filterQuery[property] !== '') {
            filtersToApply.push({ id: filterID, field: filter.dataProperty, value: [filterQuery[property]] });
          }
        }, this);
        return filtersToApply;
      },

      getOptionsSingular: function(filtersSet, exclusions, triggerFilter) {
        var filtersToApply = this.getFiltersToApply(filtersSet);
        //  Then grab a set of filtered Data..
        var filteredData = filter.filterData(this.$parent.mapmarkers, filtersToApply);
        return this.filterdata.extractAvailableOptions(filteredData, exclusions, triggerFilter);
      },

      getOptionsMultiple: function(filtersSet, exclusions = '') {
        var filtersToApply = this.getFiltersToApply(filtersSet);
        //  Then grab a set of filtered Data..
        var filteredData = filter.filterData(this.$parent.mapmarkers, filtersToApply);
        return this.filterdata.extractAvailableOptionsMultiple(filteredData, filtersToApply, exclusions);
      },

      setAvailableFilterOptionsViaSearch: function(triggerFilterID, searchFilters, filterQuerySettings) {
        var availableFilters = ['buildingtype', 'ratingtype', 'ratingscope'];
        var filtersSet = filterQuerySettings.filtersSet();
        //  The "TriggerFilter" is the one which invoked the change of filters.
        //  We pass details of its ID, Property, and selected Value to the subsequent logic
        var triggerFilter = '';

        if (filterQuerySettings[this.filterdata.filters[triggerFilterID].filterProperty] != '') {
          triggerFilter = {
            'id': triggerFilterID,
            'property': this.filterdata.filters[triggerFilterID].dataProperty,
            'value': filterQuerySettings[this.filterdata.filters[triggerFilterID].filterProperty]
          };
        }

        //  We need to handle the available options for filters in FOUR different ways...
        var enabledOptions = {};
        //  Filter IDs to be excluded from having their options updated..
        var exclusions = [];

        //  A. Going from 1 filter selection to None
        if (filtersSet.length == 0) {
          //  Reset all filter options
          this.filterdata.resetAllFiltersDisabledOptions();
          return;
        }
        //  B. SELECT ONE FILTER, e.g. WATER
        else if (filtersSet.length == 1) {
          exclusions = [filtersSet[0], 'starrating'];
          enabledOptions = this.getOptionsMultiple(filtersSet);
          //  Reset all filter options for the single filter selected..
          this.filterdata.resetDisabledFilterOptions(filtersSet[0]);
        }
        //  C. SELECT TWO FILTERS, e.g. WATER then HOTEL
        //  This means the option selected for Filter 1 determines options for Filter 2
        //  And the option selected for Filter 2 determines options enabled for Filter 1
        //  And Filter 3's options are determined by the combination of Filter 1 + Filter 2
        else if (filtersSet.length == 2) {
          //  These are the IDs of the filters, i.e. buildingtype, ratingscope, ratingtype
          var filter1 = null;
          var filter2 = null;

          //  If the triggerFilter is not one of the selected filters (i.e. deselecting/clearing a filter)
          //  ...need to handle it differently..
          if (filtersSet.indexOf(triggerFilterID) == -1) {
            //this.filterdata.resetAllFiltersDisabledOptions();
            this.filterdata.resetDisabledFilterOptions(triggerFilterID);
          }
          else {
            //  Filter 1 is the filter which triggered this event
            filter1 = triggerFilterID;
            //  Filter 2 is the other filter in filtersSet, which is not the triggerFilter
            filter2 = triggerFilterID != filtersSet[1] ? filtersSet[1] : filtersSet[0];

            //  Filter 2 sets Filter 1 options
            exclusions = [filter1, 'starrating'];
            enabledOptions = this.getOptionsSingular([filter1], exclusions, triggerFilter);
            this.setSearchFilterOptions(filter2, enabledOptions[filter2]);
          }

          //  Filters 1 & 2 set Filter 3 options
          enabledOptions = this.getOptionsMultiple(filtersSet);
        }
        //  D. Three filters selected - the "trigger" filter resets the context
        else {
          exclusions = [triggerFilterID, 'starrating'];
          enabledOptions = this.getOptionsMultiple(filtersSet, exclusions);
        }

        availableFilters.forEach(function(id) {
          if (exclusions.indexOf(id) == -1) {
            if (enabledOptions[id]) {
              this.setSearchFilterOptions(id, enabledOptions[id]);
            }
          }
        }, this);
      },

      applyFilter: function(event) {
        var triggerFilterID = event.target.id;

        console.log('*** applyFilter triggered by: ' + triggerFilterID);

        //  Don't show Star Rating checkboxes if Rating Type is Carbon Neutral
        //  I don't like putting specific rules in here, but this does not fit into the current structure of rule definitions
        this.filterdata.toggleStarRating(triggerFilterID, this.filterquery);

        //  METHOD #1: Using a 2D array of rules became to hard to reset filters, etc.
        //  METHOD #2: Determine filter options available by working through the Filter service
        // (i.e. Search Mechanism/Julie's suggestion)
        this.setAvailableFilterOptionsViaSearch(triggerFilterID, this.filterdata.filters, this.filterquery);

        //  Let the App know everything has been setup according to the rules
        this.$emit('update');
      }
    },
    mounted() {
      this.initFilters();
    },
    props: [
      'helper',
      'filterdata',
      'filterquery'
    ],
    watch: {},
    computed: {
      starratings: function () {
        var starRatings = this.filterquery.filterStarRatings;
        return starRatings.length > 0 ? starRatings.join(', ') : this.filterdata.filters.starrating.label;
      }
    }
  }
</script>

<style lang="scss">
  .helper {
    .disabled {
      background-color: #ffcccc;
    }
    .enabled {
      background-color: #ccffcc;
    }
  }
</style>
