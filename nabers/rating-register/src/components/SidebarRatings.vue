<template>
  <div v-if="selectedMarker" class="rating-register-sidebar rating-register-sidebar--ratings">
    <div class="rating-register-sidebar__header">
      <div class="rating-register-sidebar__buttons">
        <div v-if="isSearchWithFilters && !isPremiseIDSearch" class="rating-register-sidebar__back-to-results">
          <button @click="close">Search results</button>
        </div>
        <div v-if="!isSearchWithFilters || isPremiseIDSearch" class="rating-register-sidebar__clear-search">
          <button @click="clearSearch">Clear search</button>
        </div>
        <shareresults></shareresults>
      </div>
      <div class="rating-register-sidebar__title">
        <h3>
        <span v-if="!isDataCentre(selectedMarker)">
          {{ selectedMarker.StreetNumber }}
          {{ selectedMarker.StreetName }},
        </span>
          {{ selectedMarker.Suburb }}
          {{ selectedMarker.State }}
          {{ selectedMarker.Postcode }}
        </h3>
        <p class="rating-premise-details rating-premise-details--premise-name">{{ selectedMarker.PremisesName }}</p>
        <p class="rating-premise-details rating-premise-details--premise-type">{{ premiseTypes }}</p>
      </div>
    </div>
    <div class="rating-register-sidebar__details rating-register-sidebar__details--rating" :style="{ height: resultsContainerHeight }">
      <ul class="rating-register-scopes">
        <li v-for="(ratingScope, index) in ratingsByRatingScope" :key="index" class="rating-register-scopes__scope-item">
          <ratingscopeheading :label="ratingScope.label" @showDetails="ratingClick"></ratingscopeheading>
          <div v-if="ratingScope.label === 'Tenancy'" class="rating-scope-sublabel">{{ ratingScope.sublabel }}</div>
          <ul>
            <li v-for="(rating, index2) in ratingScope.values" :key="index2" class="rating-detail" :class="'rating-detail--' + getRatingTypeClassName(rating.RatingType)">
              <div class="rating-detail__inner">
                <button @click="ratingClick(rating.RatingReferenceNumber)" class="rating-detail__label">
                  <span>NABERS</span> <span>{{ rating.RatingType }}</span>
                </button>
                <div class="rating-detail__field" :class="{'rating-detail__field--green' : rating.EnergyGreenPower}">
                  <span class="text--bold">{{ rating.StarRating }} star</span>
                  <span v-if="!rating.EnergyGreenPower">Rating</span>
                  <span v-if="rating.EnergyGreenPower">with GreenPower</span>
                </div>
                <div v-if="rating.EnergyGreenPower" class="rating-detail__field">
                  <span class="text--bold">{{ helper.oneDP(rating.EnergyGPStarRatingValueNoGP) }} star</span>
                  <span>without GreenPower</span>
                </div>
                <div v-if="rating.EnergyGreenPower && premiseTypes.toString().toLowerCase() == 'office' " class="rating-detail__field rating-detail__field--cbd-tooltip">
                  <span>For CBD: use rating without GreenPower</span>
                  <tooltip :toggleButtonText="'Information about '">
                    <template slot="tooltip-body">GreenPower is not accounted for in the NABERS Energy rating that is used for a BEEC. GreenPower has a positive environmental impact, but it is not an energy efficiency action.</template>
                    </tooltip>
                </div>
                <div class="rating-detail__field rating-detail__field--expiry-date">
                  <span>{{ formattedDate(rating.CertificateValidTo) }}</span>
                  <span>Rating expiry</span>
                </div>
              </div>
            </li>
            <li class="rating-detail rating-detail--carbon-neutral" v-for="energyRating in energyRatingFromScope(ratingScope)" :key="energyRating.RatingReferenceNumber" v-if="energyRating.CarbonNeutral">
              <div class="rating-detail__inner">
                <button @click="ratingClick(energyRating)" class="rating-detail__label">
                  <span>Carbon neutral certification</span>
                </button>
                <div class="rating-detail__field rating-detail__field--expiry-date">
                  <span>{{ formattedDate(energyRating.CarbonNeutralExpiryDate) }}</span>
                  <span>Rating expiry</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="rating-register-sidebar__cta"><button @click="ratingClick()">View all rating details for this building</button></div>
  </div>
</template>

<script>
import * as moment from 'moment';
import FilterData from '../services/FilterData';
import ShareResults from './ShareResults';
import RatingScopeHeading from './RatingScopeHeading';
import tooltip from './Tooltip';
import Helper from '../services/Helper'

const filterData = new FilterData();

export default {
  components: {
    shareresults: ShareResults,
    ratingscopeheading: RatingScopeHeading,
    tooltip: tooltip,
  },
  data: function() {
    return {
      tooltipsHidden: false,
      helper: new Helper(),
    }
  },
  methods: {
    close: function() {
      this.$emit('close');
    },
    clearSearch: function () {
        this.$emit('reset');
    },
    ratingClick: function(ratingReferenceNumber = null) {
      this.$emit('showdetail', ratingReferenceNumber);
    },
    getGroupedRatings: function(groupByField, sortValueByField) {
      var rtn = [];
      var groups = {};
      // Group by field
      this.selectedMarker.Ratings.forEach(function(item) {
        if (groups[item[groupByField]] === undefined) {
          groups[item[groupByField]] = {
            label: item[groupByField],
            values: [item]
          }
        }
        else {
          groups[item[groupByField]].values.push(item);
        }
      });
      // Convert map into array
      for (var key in groups) {
        rtn.push(groups[key]);
      }
      // Sort Groups
      rtn.sort(function(a, b) {
        return filterData.getWeight(a.label) - filterData.getWeight(b.label);
      });
      // Sort values in each group
      if (sortValueByField) {
        rtn.forEach(function(item) {
          item.values.sort(function(a, b) {
            return filterData.getWeight(a[sortValueByField]) - filterData.getWeight(b[sortValueByField]);
          });
        });
      }
      return rtn;
    },
    formattedDate: function(date) {
      return moment(date, 'DD/MM/YYYY hh:mm:ss a').format('D MMM YYYY');
    },
    getRatingTypeClassName: function(ratingType) {
      return ratingType.replace(/\s+/g, '-').toLowerCase();
    },
    energyRatingFromScope: function(scope) {
      var energyRating = scope.values.filter(item => { return item.RatingType === 'Energy' });
      return energyRating;
    },
    isDataCentre: function(marker) {
      for (var i = 0; i < marker.Ratings.length; i++) {
        if (marker.Ratings[i].PremiseType === 'Data Centre') {
          return true;
        }
      }
      return false;
    }
  },
  computed: {
    premiseTypes: function() {
      var types = this.selectedMarker.Ratings.map(item => item.PremiseType);
      var unique = types.filter((type, index) => (types.indexOf(type) === index));
      var premiseType = unique.toString();
      if (premiseType.toLowerCase() === 'apartment') {
        return 'Apartment building';
      }
      else {
        return premiseType;
      }
    },
    ratingsByRatingScope: function () {
      var ratingsByRatingType = this.getGroupedRatings('RatingScope', 'RatingType')

      // Process tenancy ratings.
      const tenancyIndex = this.helper.getTenancyIndex(ratingsByRatingType)
      if (tenancyIndex >= 0) {
        ratingsByRatingType = this.helper.processTenancies(ratingsByRatingType, tenancyIndex)
      }

      return ratingsByRatingType
    }
  },
  mounted: function(){
    this.$emit('updateResultsHeight');
  },
  props: ['selectedMarker', 'resultsContainerHeight', 'isSearchWithFilters', 'isPremiseIDSearch']
}
</script>
