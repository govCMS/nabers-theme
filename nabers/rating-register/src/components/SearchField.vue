<template>
  <div class="rating-register-search">
    <div class="rating-register-search-field">
      <label id="search-field-label" for="rating-register-search-input">Search by address, suburb, postcode or building name. <span>Results appear in list below.</span></label>
      <input id="rating-register-search-input"
        type="text"
        v-model="searchinput"
        @keyup="inputKeypress($event)"
        :class="{
          'is-expanded': showPopup,
          'is-collapsed': !showPopup,
          'is-disabled': isResultSet
        }"
        :placeholder="searchFieldPlaceholderText"
        aria-labelledby="search-field-label" />
        <button class="rating-register-search-reset" v-if="isResultSet" @click="resetFilter()">
          <span>Clear search</span>
        </button>
    </div>
    <div v-if="showPopup" class="rating-register-search--results">
      <button class="close" @click="clearResults()">Close</button>
      <ul v-if="searchResults.length > 0">
        <li v-for="result in searchResults" :key="result.idx">
          <button @click="selectResult(result)">{{ result.label }}</button>
        </li>
      </ul>
      <div v-if="searchResults.length === 0 && isSearchComplete">
        No search results found.
      </div>
    </div>
  </div>
</template>

<script>
import Abbreviations from '../services/Abbreviations'
import Geocode from '../services/Geocode'

let searchFieldTimer = null;
let ignoreKeys = [9, 91, 16, 17, 18, 93, 40, 38, 37, 39]; // E.g. ctrl / alt / cmd / tab / shift / down / up / left / right
let abbreviationService = new Abbreviations();
let geocode = new Geocode();

export default {
  data: function() {
    return {
      searchinput: '',
      searchResults: [],
      isSearchComplete: false,
      showPopup: false,
      isResultSet: false,
      searchFieldPlaceholderText: 'Search by address, suburb, postcode or building name'
    }
  },
  methods: {
    inputKeypress: function(e) {
      if (e.keyCode === 13) { // Enter
        this.querySearch();
      }
      else if (e.keyCode === 27) { // Esc
        this.clearResults();
      }
      else if (ignoreKeys.indexOf(e.keyCode) === -1) {
        this.isSearchComplete = false;
        if (this.searchinput.length >= 3) {
          clearTimeout(searchFieldTimer);
          searchFieldTimer = setTimeout(this.runSearchAfterWait, 350);
          this.searchLock = true;
        }
        else if (this.searchinput.length === 0) {
          this.showPopup = false;
        }
      }
    },
    runSearchAfterWait: function() {
      // Prevent triggering multiple querySearch().
      if (this.searchLock) {
        this.querySearch();
      }
    },
    querySearch: function() {
      this.searchLock = false;
      this.searchResults = [];
      if (this.searchinput.length > 0) {
        this.queryGoogleForSuggestions(this.addMarkersToFilter);
      }
    },
    queryGoogleForSuggestions: function(callback) {
      // Check if the search type prefix is added to
      // the search term and remove it.
      var pair = this.searchinput.split(':');
      var searchTerm = '';
      if (pair.length === 2) {
        searchTerm = pair[1];
      }
      else {
        searchTerm = this.searchinput;
      }
      // If the user is searching for a postcode (4 digits),
      // add 'AU' to the search term to get more accurate results.
      var re = /\b\d{4}\b/;
      if (re.test(searchTerm)) {
        searchTerm = searchTerm + ' ' + 'AU';
      }

      // Search for string.
      geocode.search(searchTerm, (res) => {
        var results = res.results;
        if (results.length > 0) {
          // Validate this is an Australian address.
          if (results[0].address_components.length > 0) {
            var country = results[0].address_components.filter(function(item) {
              return (item.types[0] === 'country')
            });
            if (country[0].short_name === 'AU') {
              this.addGoogleSuggestionsToFilter(results[0], callback);
            }
            else {
              callback([]);
            }
          }
        }
        else {
          callback([]);
        }
      })
    },
    addGoogleSuggestionsToFilter: function(googleResult, callback) {
      var results = [];
      var latLng = googleResult.geometry.location;
      googleResult.address_components.forEach(item => {
        switch (item.types[0]) {
          case 'administrative_area_level_1': // State
            results.push({
              label: 'State: ' + item.long_name,
              filter: { 'State': item.short_name },
              location: latLng,
              sort: 0
            });
            break;
          case 'postal_code': // Postcode
            results.push({
              label: 'Postcode: ' + item.long_name,
              filter: { 'Postcode': item.long_name },
              location: latLng,
              sort: 1
            });
            break;
          case 'locality':
          case 'colloquial_area': // Suburb or city
            results.push({
              label: 'Suburb: ' + item.long_name,
              filter: { 'Suburb': item.long_name },
              location: latLng,
              sort: 2
            });
            break;
        }
      });
      // Sort results.
      results.sort(function(a, b) {
        return a.sort - b.sort;
      });
      callback(results);
    },
    _arrPushCheck: function(arr, value) {
      if (value != null && value.length > 0) {
        arr.push(value);
      }
    },
    generateLabelFromMarker: function(m) {
      var rtn = [];
      var first = [];
      this._arrPushCheck(first, m.PremisesName);
      this._arrPushCheck(rtn, first);
      var second = [];
      this._arrPushCheck(second, m.StreetNumber);
      this._arrPushCheck(second, m.StreetName);
      this._arrPushCheck(rtn, second.join(' '));
      var third = [];
      this._arrPushCheck(third, m.Suburb);
      this._arrPushCheck(third, m.State);
      this._arrPushCheck(third, m.Postcode);
      this._arrPushCheck(rtn, third.join(' '));
      return rtn.join(', ');
    },
    getMarkersByKeywords: function(keywords) {
      var rtn = [];
      var premiseMap = {};

      // Add keywords for abbreviations.
      keywords.forEach(function(word) {
        var abbr = abbreviationService.getFullFromAbbreviation(word);
        if (abbr !== null) {
          keywords.push(abbr);
        }
      });

      for (var j = 0; j < keywords.length; j++) {
        var keyword = keywords[j];
        for (var i = 0; i < this.markers.length; i++) {
          var m = this.markers[i];
          // Create marker address search string.
          var stateAbbr = abbreviationService.getFullFromAbbreviation(m.State) || '';
          var markerSearchString = m.PremisesName + m.StreetNumber + m.StreetName + m.Suburb + m.State + m.Postcode + stateAbbr;
          // Test keyword against string.
          if (markerSearchString.toLowerCase().indexOf(keyword) >= 0) {
            if (premiseMap[m.PremiseID] == undefined) {
              premiseMap[m.PremiseID] = {
                keywordMatches: 1,
                label: this.generateLabelFromMarker(m),
                data: m
              };
            }
            else {
              premiseMap[m.PremiseID].keywordMatches++;
            }
          }
        }
      }
      // Convert map into results array.
      for (var keys in premiseMap) {
        rtn.push(premiseMap[keys]);
      }
      // Place results with most matching keywords at top.
      rtn = rtn.sort(function(a, b) {
        return b.keywordMatches - a.keywordMatches;
      });
      return rtn;
    },
    addMarkersToFilter: function(results) {
      var keywords = this.searchinput.toLowerCase().split(' ');
      var markers = this.getMarkersByKeywords(keywords);
      // Add to results.
      for (var i = 0; i < markers.length; i++) {
        var marker = markers[i];
        results.push({
          idx: i,
          label: marker.label,
          filter: { 'PremiseID': marker.data.PremiseID },
          location: {
            lat: parseFloat(marker.data.Latitude),
            lng: parseFloat(marker.data.Longitude)
          }
        });
        if (i >= 4) {
          break;
        }
      }
      this.searchResults = results;
      this.isSearchComplete = true;
      this.showPopup = true;
    },
    selectResult: function(result) {
      this.isResultSet = true;
      this.$emit('selection', { filter: result.filter, location: result.location, label: result.label });
      this.clearResults();
    },
    clearResults: function() {
      this.showPopup = false;
      this.searchResults = [];
    },
    resetFilter: function() {
      this.clearResults();
      this.isResultSet = false;
      this.$emit('selection', null);
    },
    updateSearchFieldPlaceholder: function(){
      // Remove placeholder text on mobile screens.
      var winWidth = document.documentElement.clientWidth;
      var searchField = this.$el.querySelector('#rating-register-search-input');
      if (winWidth < 768 && searchField) {
        searchField.placeholder = '';
      }
      else {
        searchField.placeholder = this.searchFieldPlaceholderText;
      }
    }
  },
  mounted: function() {
    this.updateSearchFieldPlaceholder();
    window.addEventListener('resize', this.updateSearchFieldPlaceholder);
  },
  updated: function () {
    this.$nextTick(function() {
      this.updateSearchFieldPlaceholder();
    });
  },
  props: ['markers', 'searchtext'],
  watch: {
    searchtext: function(newVal, oldVal) {
      this.searchinput = newVal;
      this.isResultSet = (newVal.length > 0);
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateSearchFieldPlaceholder);
  }
}
</script>
