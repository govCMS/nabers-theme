<template>
  <div id="rating-detail-top" class="rating-details">
    <div class="actions">
      <div class="rating-details__back-to-results"><button @click="close">Back to ratings summary</button></div>
      <button class="rating-details__start-new-search" @click="reset">Start a new search</button>
      <share-rating>Share rating</share-rating>
    </div>

    <div class="rating-details__header">
      <h2 class="rating-details__title">
        <template v-if="details.Ratings[0].PremiseType.toLowerCase() !='data centre'">
          {{ details.StreetNumber }} {{ details.StreetName }},
        </template>
        {{ details.Suburb }} {{ details.State }}
        {{ details.Postcode }}
      </h2>
      <h3 class="rating-details__premise-name" v-if="details.PremisesName != ''">{{ details.PremisesName }}</h3>
      <h4 class="rating-details__premise-type">{{ premiseTypes }}</h4>
    </div>
    <div :key="index" v-for="(ratingScope, index) in sortedRatings" class="rating-details__scopes">
      <div :key="index" v-for="(rating, index) in ratingScope.values" class="rating-details__scope" :class="{ 'rating-details__scope--last' : index == ratingScope.values.length - 1 }">
        <div v-if="displayRatingScope(rating.RatingScope, index, rating)" class="rating-details__scope-header">
          <div class="rating-details__scope-title">
            <span class="scope-label">{{ rating.RatingScope }}</span>
            <tooltip v-if="rating.RatingScope.toLowerCase() == 'base building'"><template slot="tooltip-body">Base building assesses the central services of an office building. For example: lifts and common area lighting.</template></tooltip>
            <tooltip v-if="rating.RatingScope.toLowerCase() == 'whole building'"><template slot="tooltip-body">Whole building assesses the combined impact of office tenancies and base building services (e.g. lifts and common area lighting).</template></tooltip>
            <tooltip v-if="rating.RatingScope.toLowerCase() == 'it equipment'"><template slot="tooltip-body">IT equipment assesses the impact of energy consumed by data centre IT equipment. It does not include any other infrastructure.</template></tooltip>
            <tooltip v-if="rating.RatingScope.toLowerCase() == 'whole facility'"><template slot="tooltip-body">Whole facility assesses the combined impact of IT equipment and data centre infrastructure (e.g. air-conditioning and lighting).</template></tooltip>
            <tooltip v-if="rating.RatingScope.toLowerCase() == 'infrastructure'"><template slot="tooltip-body">Infrastructure assesses the impact of data centre infrastructure services. This includes air-conditioning and lighting, and power conditioning, distribution and back-up.</template></tooltip>
          </div>
          <div class="rating-details__scope-subtitle">
            <div v-if="rating.RatingScope.toLowerCase() == 'tenancy'" class="alt-premise-name">
              {{ rating.AltPremisesName }}
            </div>
            <div class="customer-name"><span>Customer:&nbsp;</span>{{ getCustomerName(ratingScope) }}</div>
          </div>
        </div>
        <div class="rating-detail" :class="'rating-detail--'+[rating.RatingType.replace(/\s+/g, '-').toLowerCase()]">
          <div class="rating-detail__inner">

            <!-- // ENERGY -->
            <rating-detail-energy v-if="rating.RatingType.toLowerCase() == 'energy'" :rating="rating"></rating-detail-energy>

            <!-- // WATER -->
            <rating-detail-water v-else-if="rating.RatingType.toLowerCase() == 'water'" :rating="rating"></rating-detail-water>

            <!-- // WASTE -->
            <rating-detail-waste v-else-if="rating.RatingType.toLowerCase() == 'waste'" :rating="rating"></rating-detail-waste>

            <!-- // INDOOR ENVIRONMENT -->
            <rating-detail-indoor-environment v-else-if="rating.RatingType.toLowerCase() == 'indoor environment'" :rating="rating"></rating-detail-indoor-environment>

          </div>
        </div>
      </div>
      <div v-if="ratingScope.carbonNeutral" class="rating-detail rating-detail--carbon-neutral">
        <div class="rating-detail__inner">
          <!-- // CARBON NEUTRAL -->
          <rating-detail-carbon-neutral :rating="ratingScope.carbonNeutralDetails"></rating-detail-carbon-neutral>
        </div>
      </div>
      <div class="back-to-top">
        <a @click="goTop">Back to top</a>
      </div>
    </div>

    <div class="actions">
      <div class="rating-details__back-to-results" >
        <button @click="close">Back to ratings summary</button>
      </div>
      <button class="rating-details__start-new-search" @click="reset">Start a new search</button>
      <share-rating>Share rating</share-rating>
    </div>

  </div>
</template>

<script>
  import RatingDetailEnergy from './details/RatingDetailEnergy'
  import RatingDetailWater from './details/RatingDetailWater'
  import RatingDetailWaste from './details/RatingDetailWaste'
  import RatingDetailIndoorEnvironment from './details/RatingDetailIndoorEnvironment'
  import RatingDetailCarbonNeutral from './details/RatingDetailCarbonNeutral'
  import ShareResults from './ShareResults';
  import Tooltip from './Tooltip'
  import FilterData from '../services/FilterData';
  import Helper from '../services/Helper';

  const filterData = new FilterData()
  const helper = new Helper()

  function goTop () {
    document.querySelector('#main-content').scrollIntoView({block: 'start'})
  }

  export default {
    components: {
      'rating-detail-energy': RatingDetailEnergy,
      'rating-detail-water': RatingDetailWater,
      'rating-detail-waste': RatingDetailWaste,
      'rating-detail-indoor-environment': RatingDetailIndoorEnvironment,
      'rating-detail-carbon-neutral': RatingDetailCarbonNeutral,
      'share-rating': ShareResults,
      'tooltip': Tooltip,
    },
    data: function () {
      return {
        sortedRatings: [],
        ratingScopesDisplayed: {},
        tenanciesDisplayed: {},
      }
    },
    methods: {
      close: function() {
        goTop();
        this.$emit('back');
      },
      reset: function() {
        goTop();
        this.$emit('reset');
      },
      goTop: function() {
        goTop();
      },
      displayRatingScope: function (ratingScope, index, rating) {
        if (ratingScope.toLowerCase() !== 'tenancy') {
          if (!this.ratingScopesDisplayed.hasOwnProperty(ratingScope)) {
            this.ratingScopesDisplayed[ratingScope] = index
            return true
          }
          else if (this.ratingScopesDisplayed[ratingScope] != index) {
            return false
          }
        }
        else {
          if (!this.tenanciesDisplayed.hasOwnProperty(rating.TenancyFloorOrSuite)) {
            this.tenanciesDisplayed[rating.TenancyFloorOrSuite] = index
            return true
          }
          else {
            return false
          }
        }
      },
      sortAndOrderRatings: function(ratings, groupByField, sortValueByField) {
        var rtn = [];
        var groups = {};
        // Group by field
        ratings.forEach(function(item) {
          //  Carbon Neutral applies at the Rating Scope level, but is assigned via the Energy rating in the data
          var carbonNeutral = item.CarbonNeutral == true ? true : false;
          if (groups[item[groupByField]] === undefined) {
            groups[item[groupByField]] = {
              label: item[groupByField],
              values: [item],
            }
          }
          else {
            groups[item[groupByField]].values.push(item);
          }
          if (carbonNeutral) {
            groups[item[groupByField]].carbonNeutral = true;
            groups[item[groupByField]].carbonNeutralDetails = {
              CertificateValidTo: item.CertificateValidTo,
              RatingReferenceNumber: item.RatingReferenceNumber,
            };
          }
        });

        // Convert map into array
        for (var key in groups) {
          rtn.push(groups[key])
        }
        // Sort Groups
        rtn.sort(function (a, b) {
          return filterData.getWeight(a.label) - filterData.getWeight(b.label)
        })
        // Sort values in each group
        if (sortValueByField) {
          rtn.forEach(function (item) {
            item.values.sort(function (a, b) {
              return filterData.getWeight(a[sortValueByField]) - filterData.getWeight(b[sortValueByField])
            })
          })
        }
        // Process tenancy ratings.
        const tenancyIndex = helper.getTenancyIndex(rtn)
        if (tenancyIndex >= 0) {
          rtn = helper.processTenancies(rtn, tenancyIndex)
        }

        return rtn
      },
      getCustomerName: function (ratingScope) {
        if (typeof ratingScope.sublabel !== 'undefined') {
          return ratingScope.sublabel
        }
        else {
          return this.details.Customer
        }
      }
    },
    mounted: function() {
      this.sortedRatings = this.sortAndOrderRatings(this.details.Ratings, 'RatingScope', 'RatingType');
    },
    computed: {
      premiseTypes: function () {
        var premiseType = this.details.Ratings[0].PremiseType;
        if (premiseType.toLowerCase() === 'apartment') {
          return 'Apartment building';
        }
        else {
          return premiseType;
        }
      }
    },
    props: [
      'details',
      'reference'
    ]
  }
</script>
