<template>
  <div :class="expandedClass()">
    <button @click="toggle()" class="rating-detail__rating-type">NABERS {{ rating.RatingType }}</button>

    <!--For NABERS Indoor Environment the following fields always display in the non-expanded view:-->
    <!--[IEQStarRatingValue] star - Label: Rating-->
    <div class="row">
      <div class="value">{{ helper.oneDP(rating.IEQStarRatingValue) }} star</div>
      <div class="label">Rating</div>
    </div>

    <rating-detail-expiry-date :rating="rating"></rating-detail-expiry-date>
    <rating-detail-reference-number :rating="rating"></rating-detail-reference-number>

    <!-- //  INDOOR ENVIRONMENT EXPANDED-->
    <!--For NABERS Indoor Environment the following fields always display in the expanded view additionally:-->
    <div v-if="expanded">
      <!--[ThermalComfortScore] % - Label: Thermal comfort-->
      <div class="row">
        <div class="value" v-if="rating.ThermalComfortScore > 0">{{ rating.ThermalComfortScore }}%</div>
        <div class="value" v-else>N/A <tooltip><template slot="tooltip-body">Category is not relevant for this rating scope.</template></tooltip></div>
        <div class="label">Thermal comfort</div>
      </div>
      <!--[AirQualityScore] % - Label: Indoor air quality-->
      <div class="row">
        <div class="value" v-if="rating.AirQualityScore > 0">{{ rating.AirQualityScore }}%</div>
        <div class="value" v-else>N/A <tooltip><template slot="tooltip-body">Category is not relevant for this rating scope.</template></tooltip></div>
        <div class="label">Indoor air quality</div>
      </div>
      <!--[LightingScore] % - Label: Lighting-->
      <div class="row">
        <div class="value" v-if="rating.LightingScore > 0">{{ rating.LightingScore }}%</div>
        <div class="value" v-else>N/A <tooltip><template slot="tooltip-body">Category is not relevant for this rating scope.</template></tooltip></div>
        <div class="label">Lighting</div>
      </div>
      <!--[AcousticComfortScore] % - Label: Acoustics-->
      <div class="row">
        <div class="value" v-if="rating.AcousticComfortScore > 0">{{ rating.AcousticComfortScore }}%</div>
        <div class="value" v-else>N/A <tooltip><template slot="tooltip-body">Category is not relevant for this rating scope.</template></tooltip></div>
        <div class="label">Acoustics</div>
      </div>
      <!--[OfficeLayoutScore] % - Label: Office Layout-->
      <div class="row">
        <div class="value" v-if="rating.OfficeLayoutScore > 0">{{ rating.OfficeLayoutScore }}%</div>
        <div class="value" v-else>N/A <tooltip><template slot="tooltip-body">Category is not relevant for this rating scope.</template></tooltip></div>
        <div class="label">Office layout</div>
      </div>
      <!--If any of the 5 scores above do not return data in the data, please show N/A with the following tooltip "Category is not relevant for this rating scope."-->
      <div class="row">
        <div class="description">These scores show the performance of the building. To calculate the NABERS rating, we take these scores and weight them according to the results of a building occupant satisfaction survey.</div>
      </div>
    </div>

    <more-details-button @toggle="toggle()" class="rating-detail__more-details" :expanded="expanded">{{ expanded ? 'Less' : 'More' }} detail</more-details-button>
  </div>
</template>

<script>
  import RatingDetailExpiryDate from './RatingDetailExpiryDate'
  import RatingDetailReferenceNo from './RatingDetailReferenceNo'
  import Tooltip from '../Tooltip'
  import Helper from '../../services/Helper'
  import MoreDetailsButton from './MoreDetailsButton'

  export default {
    components: {
      'rating-detail-expiry-date': RatingDetailExpiryDate,
      'rating-detail-reference-number': RatingDetailReferenceNo,
      'tooltip': Tooltip,
      'more-details-button': MoreDetailsButton,
    },
    data: function () {
      return {
        expanded: false,
        helper: new Helper(),
      }
    },
    methods: {
      toggle: function() {
        this.expanded = !this.expanded;
      },
      expandedClass: function() {
        return this.expanded ? 'is-expanded' : 'is-collapsed';
      },
    },
    props: [
      'rating',
    ]
  }
</script>