<template>
  <div class="rating-register-container" :class="{ 'rating-register-container--has-sidebar': showSidebar }">
    <ul class="debug" v-show="debug">
      <li>filterSearchTerm: {{ filterQuery.filterSearchTerm }}</li>
      <li>filterBuildingType: {{ filterQuery.filterBuildingType }}</li>
      <li>filterRatingScope: {{ filterQuery.filterRatingScope }}</li>
      <li>filterRatingType: {{ filterQuery.filterRatingType }}</li>
      <li>filterStarRatings: {{ filterQuery.filterStarRatings }}</li>
    </ul>
    <div id="rating-register-top"></div>
    <rating-detail v-if="showRatingDetail" :details="premiseDetails" :reference="ratingReferenceNumber" @back="closeRatingDetails" @reset="clearSearch()"></rating-detail>
    <div class="map-header" v-show="!showRatingDetail">
      <div class="filters">
        <search :markers="mapmarkers" :searchtext="searchinput" @selection="searchSelection($event)"></search>
        <filtercollection :helper="debug" :filterdata="filtersData" :filterquery="filterQuery" @update="setFilter()"></filtercollection>
      </div>
    </div>
    <div class="map-body" v-show="!showRatingDetail" :style="{height: containerHeight}">
      <div v-if="filterQuery.isEmpty() && !selectedMarker" class="search-help-message"><p class="notes">Start searching to retrieve results</p></div>
      <div class="map-body-map"  :class="{ 'map-body-map--with-sidebar': showSidebar }">
        <div v-if="!showSidebar && totalVisibleMakers > 0 " class="visible-markers-count">{{ totalVisibleMakers }} rated buildings in this search area</div>
        <gmap
          :mapoptions="mapoptions"
          :mapmarkers="filteredmarkers"
          :mappolygons="mappolygons"
          :assetsFolder="assetsFolder"
          :selectedMarker="selectedMarker"
          :containerHeight="containerHeight"
          @markerclick="markerClick($event)"
          @updateVisibleMarkersCount="updateTotalVisibleMarkers"
        ></gmap>
      </div>
      <div v-if="showSidebar" class="map-body-listing">
        <sideratings :selectedMarker="selectedMarker" :isPremiseIDSearch="isPremiseIDSearch" :isSearchWithFilters="!this.filterQuery.isEmpty()" @updateResultsHeight="updateResultsContainerHeight" :resultsContainerHeight="resultsContainerHeight" @close="closeSidebar" @showdetail="showRatingDetails($event)" @reset="clearSearch()"></sideratings>
        <sideresults v-if="!selectedMarker" :markers="filteredmarkers" @updateResultsHeight="updateResultsContainerHeight" :resultsContainerHeight="resultsContainerHeight" @reset="clearSearch()" @markerClick="listItemClick"></sideresults>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  // import axios from 'axios'
  import Filter from './services/Filter'
  import FilterData from './services/FilterData'
  import FilterQuery from './services/FilterQuery'
  import Geocode from './services/Geocode'
  import Gmap from './components/Gmap'
  import SearchField from './components/SearchField'
  import SidebarRatings from './components/SidebarRatings'
  import SidebarSearchResults from './components/SidebarSearchResults'
  import FilterCollection from './components/FilterCollection'
  import FilterReset from './components/FilterReset'
  import RatingDetail from './components/RatingDetail'

  const filter = new Filter()

  function initialGoogleMapSettings () {
    return {
      zoom: 4,
      maxZoom: 20,
      center: {lat: -25.734968, lng: 134.489563},
      scaleControl: true,
      fullscreenControl: false,
      styles: [{
        'featureType': 'administrative',
        'elementType': 'geometry',
        'stylers': [{
          'visibility': 'off'
        }]
      },
        {
          'featureType': 'poi',
          'stylers': [{
            'visibility': 'off'
          }]
        },
        {
          'featureType': 'road',
          'elementType': 'labels.icon',
          'stylers': [{
            'visibility': 'off'
          }]
        },
        {
          'featureType': 'transit',
          'stylers': [{
            'visibility': 'off'
          }]
        }
      ]
    }
  }

  const tablet_breakpoint = 768
  const map_max_height = tablet_breakpoint

  export default {
    name: 'App',
    components: {
      gmap: Gmap,
      search: SearchField,
      sideratings: SidebarRatings,
      sideresults: SidebarSearchResults,
      filtercollection: FilterCollection,
      'filter-reset': FilterReset,
      'rating-detail': RatingDetail,
    },
    data: function () {
      return {
        filtersData: new FilterData(),
        filterQuery: new FilterQuery(),
        mapoptions: initialGoogleMapSettings(),
        mapmarkers: [],
        mappolygons: [],
        selectedMarker: null,
        showSidebar: false,
        isPremiseIDSearch: false,
        zoomLevels: {
          State: 6,
          Postcode: 14,
          Suburb: 15,
          PremiseID: 18
        },
        debug: false,
        assetsFolder: './static',
        resultsContainerHeight: 'auto',
        totalVisibleMakers: 0,
        showRatingDetail: false,
        premiseDetails: null,
        ratingReferenceNumber: null,
        markerClicked: false,
        containerHeight: map_max_height + 'px',
      }
    },
    methods: {
      showRatingDetails: function (ratingReferenceNumber = null) {
        document.querySelector('#main-content').scrollIntoView({block: 'start'})
        this.premiseDetails = this.selectedMarker
        this.ratingReferenceNumber = ratingReferenceNumber
        this.showRatingDetail = true
        this.updateFilter()
      },
      initRatingDetails: function () {
        this.premiseDetails = null
        this.ratingReferenceNumber = null
        this.showRatingDetail = false
      },
      closeRatingDetails: function () {
        this.initRatingDetails()
        this.updateFilter()
      },
      closeSidebar: function () {
        this.selectedMarker = null
        this.closeRatingDetails()
      },
      searchSelection: function (e) {
        if (e === null) {
          // Clear search term filter
          this.filterQuery.filterSearchTerm = null
          this.clearSearch()
        }
        else {
          var searchType = Object.keys(e.filter)[0]
          var searchValue = e.filter[searchType]
          var searchLabel = e.label
          // Other filters are no longer relevant if a single premise is selected so we clear them first.
          if (searchType === 'PremiseID') {
            this.isPremiseIDSearch = true
            this.filterQuery.clearFilters()
          }

          this.filterQuery.filterSearchTerm = {
            field: searchType,
            value: [searchValue],
            label: searchLabel
          }

          var zoomLevel = (this.zoomLevels[searchType] !== undefined) ? this.zoomLevels[searchType] : 15
          Vue.set(this.mapoptions, 'zoom', zoomLevel)
          Vue.set(this.mapoptions, 'center', new google.maps.LatLng(e.location))
          this.showSidebar = true
          this.selectedMarker = null

          // Go to to details if only 1 result.
          if (this.filteredmarkers.length === 1) {
            this.showDetails(this.filteredmarkers[0])
          }
        }
        this.updateFilter()
      },
      resetFilter: function () {
        this.showSidebar = false
        this.updateFilter()
        this.setQueryVariables({})
      },
      clearSearch: function () {
        this.selectedMarker = null
        this.isPremiseIDSearch = false
        this.resetFilter()
        this.filterQuery.clearFilters()
        this.initRatingDetails()

        //  Reset all the filters to their default settings for visibility & disabled options
        this.filtersData.resetAllFiltersVisibility()
        this.filtersData.resetAllFiltersDisabledOptions()
        this.mapoptions = initialGoogleMapSettings()
      },
      setFilter: function () {
        if (this.markerClicked) {
          this.initRatingDetails()
          this.mapoptions = initialGoogleMapSettings()
          this.selectedMarker = null
          this.markerClicked = false
        }
        this.showSidebar = true
        this.updateFilter()
      },
      markerClick: function (event) {
        this.showSidebar = true
        this.markerClicked = true
        this.showDetails(event.item)
        this.updateFilter()
      },
      listItemClick: function (item) {
        this.showDetails(item)
        this.updateFilter()
      },
      updateFilter: function () {
        var obj = {
          buildingtype: this.filterQuery.filterBuildingType,
          ratingscope: this.filterQuery.filterRatingScope,
          ratingtype: this.filterQuery.filterRatingType,
          starratings: this.filterQuery.filterStarRatings.join(','),
        }
        if (this.selectedMarker && this.selectedMarker['PremiseID'] != undefined) {
          obj['premise'] = this.selectedMarker.PremiseID
          if (this.showRatingDetail) {
            obj['details'] = 1
          }
        }
        if (this.filterQuery.filterSearchTerm != null) {
          obj.search = this.filterQuery.getSearchTerm()
        }
        this.setQueryVariables(obj)
      },
      setFilterFromURL: function () {
        var q = this.getQueryVariables()
        this.filterQuery.filterBuildingType = q['buildingtype'] || ''
        this.filterQuery.filterRatingScope = q['ratingscope'] || ''
        this.filterQuery.filterRatingType = q['ratingtype'] || ''
        this.filterQuery.filterStarRatings = q['starratings'] ? q['starratings'].split(',') : []

        if (q['search']) {
          this.filterQuery.setSearchTerm(q['search'])
          var searchType = this.getSearchType()
          var itemsCount = this.filteredmarkers.length
          // if Search type = premise name or premise id, it means
          // we've a selected premise id so set isPremiseIDSearch to true.
          // Showing the rating details is handled in the following if statement.
          if (searchType === 'premisename' || searchType === 'premiseid') {
            this.isPremiseIDSearch = true
          }
          else if (itemsCount > 0) {
            const firstMarker = this.filteredmarkers[0]
            var location = ''
            var zoomLevel = 'State'
            switch (searchType) {
              case 'suburb':
                location = firstMarker.Suburb + ' ' + firstMarker.State
                zoomLevel = 'Suburb'
                break
              case 'postcode':
                location = firstMarker.Suburb + ' ' + firstMarker.Postcode
                zoomLevel = 'Postcode'
                break
              case 'state':
                location = firstMarker.State
                zoomLevel = 'State'
                break
            }
            if (location !== '') {
              this.centerMapWithoutCoordinates(location, zoomLevel)
            }
            this.isPremiseIDSearch = false
          }
        }

        // If we've a premise ID in the url, show the rating details.
        if (q['premise']) {
          var foundMarker = []
          // This is necessary to trigger filter update when
          // a search term and premise id are set.
          if (searchType === '' || searchType === 'premisename') {
            this.filterQuery.filterSearchTerm = {
              field: 'PremiseID',
              value: [q['premise']],
              label: q['search']
            }
            this.isPremiseIDSearch = true
            foundMarker = this.filteredmarkers
          }
          else {
            // This means no search term is set, thus no need
            // to update the filters so we do a simple array search.
            foundMarker = this.mapmarkers.filter(function (item) {
              return (item.PremiseID === q['premise'])
            })
          }
          if (foundMarker.length === 1) {
            this.showSidebar = true
            this.showDetails(foundMarker[0])
          }
          if (q['details']) {
            this.showRatingDetails()
          }
          else {
            this.initRatingDetails()
          }
        }
        else if (Object.keys(q).length > 0) {
          this.showSidebar = true
        }
      },
      getQueryVariables: function () {
        var o = {}
        var q = window.location.search.substring(1)
        if (q.length > 0) {
          var vars = q.split('&')
          for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=')
            o[decodeURI(pair[0])] = decodeURI(pair[1])
          }
        }
        return o
      },
      setQueryVariables: function (query_object) {
        var qs = '?'
        for (var key in query_object) {
          if (String(query_object[key]).length > 0) {
            if (qs.length > 1) {
              qs += '&'
            }
            qs += encodeURI(key) + '=' + encodeURI(query_object[key])
          }
        }
        history.pushState(query_object, '', qs)
      },
      showDetails: function (marker) {
        this.selectedMarker = marker
        this.markerClicked = true
        if (marker.Latitude === '' && marker.Longitude === '') {
          this.centerMapWithoutCoordinates(marker.Postcode, 'Postcode')
        }
        else {
          Vue.set(this.mapoptions, 'zoom', this.zoomLevels['PremiseID'])
          Vue.set(this.mapoptions, 'center', {
            lat: parseFloat(marker.Latitude),
            lng: parseFloat(marker.Longitude)
          })
        }
      },
      updateMapContainerHeight: function (event) {
        // If the visible area of the app is off screen,
        // adjust the height to eliminate the need for
        // vertical scrolling.
        const winWidth = document.documentElement.clientWidth
        const winHeight = document.documentElement.clientHeight
        const header = document.querySelector('#header')
        const appContainerHeight = this.$el.clientHeight
        const mapHeader = this.$el.querySelector('.map-header')

        // No map is shown on mobile screens.
        if (winWidth < tablet_breakpoint) {
          return
        }

        // Default height is 768px.
        let newHeight = map_max_height

        // Offset for the fixed page header.
        const offset = header !== null ? header.clientHeight : 0

        if (appContainerHeight > winHeight) {
          newHeight = (winHeight - mapHeader.clientHeight) - offset
        }
        this.containerHeight = newHeight + 'px'
      },
      updateResultsContainerHeight: function (event) {
        // The sidebar results list is scrollable on tablet/desktop so we need to
        // calculate the height needed for that.
        const winWidth = document.documentElement.clientWidth
        const sidebarHeader = this.$el.querySelector('.rating-register-sidebar__header')

        if (winWidth >= tablet_breakpoint && sidebarHeader) {
          const headerHeight = sidebarHeader.clientHeight
          this.resultsContainerHeight = (map_max_height - headerHeight) + 'px'
        }
        else {
          this.resultsContainerHeight = 'auto'
        }
      },
      updateTotalVisibleMarkers: function (count) {
        this.totalVisibleMakers = count
      },
      getSearchType () {
        var SearchTerm = this.filterQuery.filterSearchTerm
        var searchType = SearchTerm !== null ? SearchTerm['field'] : ''
        // Sometimes the field name from the data is PremisesName
        // instead of PremiseName, so we need to standardise it.
        if (searchType === 'PremisesName') {
          searchType = 'PremiseName'
        }
        return searchType.toLowerCase()
      },
      centerMapWithoutCoordinates (location, zoomLevel = 'Postcode') {
        // Center the map when we don't have specific
        // lat/lng coordinates.
        var g = new Geocode()
        g.search(location, (res) => {
          if (res.results.length > 0) {
            Vue.set(this.mapoptions, 'zoom', this.zoomLevels[zoomLevel])
            Vue.set(this.mapoptions, 'center', res.results[0].geometry.location)
          }
        })
      },
      isDrupalContext () {
        // Check if we are running the app in Drupal and not local dev environment.
        return typeof Drupal !== 'undefined'
      },
      isExternalDataSource () {
        // If we are reading rating register data from an external source.
        return this.isDrupalContext() && typeof Drupal.settings.govcms_ui_kit.rating_data_source !== 'undefined'
      },
      isInternalDataSource () {
        // If we are reading rating register data from a file uploaded in the content page.
        return this.isDrupalContext()
          && !this.isExternalDataSource()
          && typeof Drupal.settings.govcms_ui_kit.ratings_data !== 'undefined'
      }
    },
    mounted: function () {
      var self = this

      if (typeof Drupal !== 'undefined' && typeof Drupal.settings.govcms_ui_kit.ratings_assets_folder !== 'undefined') {
        self.assetsFolder = Drupal.settings.govcms_ui_kit.ratings_assets_folder
      }
      // Check if the json data available from Drupal.
      // If not, load from rating_register_data.js.
      if (self.isInternalDataSource()) {
        self.mapmarkers = Drupal.settings.govcms_ui_kit.ratings_data
        self.setFilterFromURL()
      }
      else {
        let scriptSource = './static/rating_register_data.js'
        if (self.isExternalDataSource()) {
          scriptSource = Drupal.settings.govcms_ui_kit.rating_data_source
        }

        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = scriptSource
        document.getElementsByTagName('head')[0].appendChild(script)

        // Load Markers via script file (JSONP).
        window.ratingRegisterParseResponse = function (response) {
          self.mapmarkers = response
          self.setFilterFromURL()
        }
      }
      this.updateMapContainerHeight()
      window.addEventListener('resize', this.updateMapContainerHeight)
      window.addEventListener('resize', this.updateResultsContainerHeight)
      window.onpopstate = this.setFilterFromURL
    },
    updated: function () {
      this.$nextTick(function () {
        this.updateResultsContainerHeight()

        if (this.filterQuery.isEmpty() && !this.selectedMarker) {
          this.showSidebar = false
        }
      })
    },
    computed: {
      filteredmarkers: function () {
        var filters = []

        if (this.filterQuery.filterSearchTerm !== null) {
          filters.push(this.filterQuery.filterSearchTerm)
        }
        if (this.filterQuery.filterBuildingType !== '') {
          filters.push({
            field: 'PremiseType',
            value: [this.filterQuery.filterBuildingType]
          })
        }
        if (this.filterQuery.filterRatingType.toLowerCase().indexOf('carbon') > -1) {
          filters.push({field: 'CarbonNeutral', value: true})
        }
        else if (this.filterQuery.filterRatingType !== '') {
          filters.push({
            field: 'RatingType',
            value: [this.filterQuery.filterRatingType]
          })
        }
        if (this.filterQuery.filterRatingScope !== '') {
          filters.push({
            field: 'RatingScope',
            value: [this.filterQuery.filterRatingScope]
          })
        }

        var starRatings = []
        this.filterQuery.filterStarRatings.forEach(function (element) {
          starRatings.push(element)
        })
        if (starRatings.length > 0) {
          filters.push({field: 'StarRating', value: starRatings})
        }

        return filter.filterData(this.mapmarkers, filters)
      },
      searchinput: function () {
        return this.filterQuery.getSearchTermForInput()
      }
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.updateMapContainerHeight)
      window.removeEventListener('resize', this.updateResultsContainerHeight)
    }
  }
</script>

<style lang="scss">

  $column-width: 1200px;

  $key-color: #565294;
  $key-color-2: #3ddc97;

  $button-disabled-grey: #e6e6e6;
  $blue: #4a90e2;
  $light-grey: #f6f7f8;

  $button-color: $key-color-2;

  $green: #27ae60;
  $yellow: #f1c40f;
  $blue: #3498db;

  @mixin breakpoint($class) {
    @if $class==desktop {
      @media (min-width: 1200px) {
        @content;
      }
    } @else if $class==large_tablet {
      @media (min-width: 1024px) {
        @content;
      }
    } @else if $class==tablet {
      @media (min-width: 768px) {
        @content;
      }
    } @else if $class==mobile {
      @media (max-width: 420px) {
        @content;
      }
    } @else {
      @warn "Breakpoint mixin supports: desktop, large_tablet, tablet, mobile";
    }
  }

  @mixin button {
    cursor: pointer;
    padding: 10px 20px;
    font-weight: 700;
    font-size: 17px;
    color: white;
    border: 0;
    border-radius: 0;
    background-color: $button-color;
  }

  @mixin button_small {
    @include button;
    min-width: 60px;
    height: 24px;
    padding: 2px 7px;
    font-size: 13px;
    background-color: $key-color;
  }

  @mixin button_small_disabled {
    @include button_small;
    color: #4a4a4a;
    font-weight: 400;
    background-color: $button-disabled-grey;
  }

  @mixin tab {
    background-color: transparent;
    border-radius: 0;
    border: 0;
    padding-bottom: 12px;
    font-size: 16px;
    font-weight: 700;
    &.active {
      border-bottom: 4px solid $key-color;
    }
  }

  .node-rating-register {
    padding: 15px;
    margin: 0 auto;
    max-width: 65rem;
    @include breakpoint(tablet) {
      padding: 30px;
    }
    .rating-register-container {
      margin: 0;
    }
  }

  .debug {
    background-color: #333333;
    color: white;
    display: flex;
    flex-flow: row wrap;
    font-size: 75%;
    list-style: none;
    margin: 0;
    li {
      width: 20%;
    }
  }
</style>
