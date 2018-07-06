<template>
  <div class="rating-register-sidebar rating-register-sidebar--results">
    <h2>Search Results</h2>
    <div class="rating-register-sidebar__header">
      <div class="rating-register-sidebar__buttons">
        <div class="rating-register-sidebar__clear-search">
          <filter-reset @reset="clearSearch()" buttonLabel="Clear search"></filter-reset>
        </div>
        <shareresults></shareresults>
      </div>
      <div class="rating-register-sidebar__title">
        <h3>
          {{ markers.length }} buildings match this search
        </h3>
      </div>
    </div>
    <div class="rating-register-sidebar__details rating-register-sidebar__details--results-list" :style="{ height: resultsContainerHeight }">
      <ul>
        <li v-for="item in limitedMarkers" :key="item.id" class="rating-register-result">
          <button @click="markerClick(item)">
              <span class="rating-register-result__address">
                <span v-if="!isDataCentre(item)">
                  {{ item.StreetNumber }} {{ item.StreetName }},
                </span>
                {{ item.Suburb }} {{ item.State }} {{item.Postcode }}
              </span>
            <span class="rating-register-result__premise-name">
                {{ item.PremisesName }}
              </span>
            <span class="rating-register-result__premise-type">
                {{ getPremiseTypes(item) }}
              </span>
            <span class="rating-register-result__data-centre" v-if="isDataCentre(item)">
                Nabers does not provide data centre location
              </span>
          </button>
        </li>
        <li v-if="limitDataset && markers.length > 100" class="rating-register-result rating-register-result--show-more">
          <button @click="limitDataset = false">Load all results</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import ShareResults from './ShareResults';
  import FilterReset from './FilterReset';

  export default {
    components: {
      shareresults: ShareResults,
      "filter-reset": FilterReset
    },
    data: function () {
      return {
        limitDataset: true
      }
    },
    methods: {
      markerClick: function (item) {
        this.$emit('markerClick', item);
      },
      getPremiseTypes: function (marker) {
        var types = marker.Ratings.map(item => item.PremiseType);
        var unique = types.filter((type, index) => (types.indexOf(type) === index));
        var premiseType = unique.toString();
        if (premiseType.toLowerCase() === 'apartment') {
          return 'Apartment building';
        }
        else {
          return premiseType;
        }
      },
      isDataCentre: function (marker) {
        for (var i = 0; i < marker.Ratings.length; i++) {
          if (marker.Ratings[i].PremiseType === 'Data Centre') {
            return true;
          }
        }
        return false;
      },
      clearSearch: function () {
        this.$emit('reset');
      }
    },
    computed: {
      limitedMarkers: function () {
        return (this.limitDataset) ? this.markers.slice(0, 100) : this.markers;
      }
    },
    mounted: function(){
      this.$emit('updateResultsHeight');
    },
    props: ['markers', 'resultsContainerHeight']
  }
</script>
