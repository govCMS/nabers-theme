<template>
  <div :class="expandedClass()">
    <button @click="toggle()" class="rating-detail__rating-type">NABERS {{ rating.RatingType }}</button>
    <div class="row" v-if="!empty('WasteStarRatingValue')">
      <div class="value">{{ helper.oneDP(rating.WasteStarRatingValue) }} star</div>
      <div class="label">Rating</div>
    </div>
    <rating-detail-expiry-date :rating="rating"></rating-detail-expiry-date>
    <rating-detail-reference-number :rating="rating"></rating-detail-reference-number>
    <!--//  WASTE EXPANDED-->
    <div v-if="expanded">
      <div class="row" v-if="!empty('RecycleRate')">
        <div class="value">{{ rating.RecycleRate }}%</div>
        <div class="label">Recycling rate</div>
      </div>
      <div class="row" v-if="!empty('WasteIntensity')">
        <div class="value">{{ rating.WasteIntensity }} kg/m² p.a.</div>
        <div class="label">Waste intensity</div>
      </div>
    </div>
    <more-details-button @toggle="toggle()" class="rating-detail__more-details" :expanded="expanded">{{ expanded ? 'Less' : 'More' }} detail</more-details-button>
  </div>
</template>

<script>
  import RatingDetailExpiryDate from './RatingDetailExpiryDate'
  import RatingDetailReferenceNo from './RatingDetailReferenceNo'
  import Helper from '../../services/Helper'
  import MoreDetailsButton from './MoreDetailsButton'

  export default {
    components: {
      'rating-detail-expiry-date': RatingDetailExpiryDate,
      'rating-detail-reference-number': RatingDetailReferenceNo,
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
      empty: function(property) {
        return this.rating[property] == '' ? true : false;
      },
      premiseType: function(premiseType) {
        return this.rating.PremiseType.toLowerCase().indexOf(premiseType) != -1 ? true : false;
      },
    },
    props: [
      'rating',
    ]
  }
</script>