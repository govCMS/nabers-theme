<template>
  <div :class="expandedClass()">
    <button @click="toggle()" class="rating-detail__rating-type">NABERS {{ rating.RatingType }}</button>
    <!--For Water the following fields always display in the non-expanded view:-->
    <!--If [WaterRecycled] = YES, show:-->
    <template v-if="rating.WaterRecycled">
      <div class="row row--group">
        <div class="row row--blue" v-if="!empty('WaterStarRatingValue')">
          <div class="value">{{ helper.oneDP(rating.WaterStarRatingValue) }} star</div>
          <div class="label">with recycled water</div>
        </div>
        <div class="row" v-if="!empty('WaterStarRatingValueNoRW')">
          <div class="value">{{ helper.oneDP(rating.WaterStarRatingValueNoRW) }} star</div>
          <div class="label">without recycled water</div>
        </div>
      </div>
    </template>
    <!--If [WaterRecycled] = NO, show:-->
    <template v-else>
      <div class="row" v-if="!empty('WaterStarRatingValueNoRW')">
        <div class="value">{{ helper.oneDP(rating.WaterStarRatingValueNoRW) }} star</div>
        <div class="label">Rating</div>
      </div>
    </template>

    <rating-detail-expiry-date :rating="rating"></rating-detail-expiry-date>
    <rating-detail-reference-number :rating="rating"></rating-detail-reference-number>

    <!-- //  WATER EXPANDED-->
    <template v-if="expanded">
      <!--For the Hotel Building Type only, the following additional data will display for Energy & Water Ratings as the first item in the expanded view:-->
      <!--[AAAStarRatingValue] - Label: Hotel quality rating-->
      <div class="row" v-if="premiseType('hotel')">
        <div class="value">{{ helper.oneDP(rating.AAAStarRatingValue) }} star</div>
        <div class="label">Hotel quality rating</div>
      </div>
      <!--For Water the following fields always display in the expanded view additionally:-->
      <div class="row row--blue">
        <div class="value">{{ empty('WaterRecycledPercent') ? 0 : rating.WaterRecycledPercent }}%</div>
        <div class="label">Externally supplied water that is recycled</div>
      </div>
      <!--If [WaterRecycled] = YES, show:-->
      <template v-if="rating.WaterRecycled">
          <div class="row row--group">
            <div class="row row--blue" v-if="!empty('WaterConsumption')">
              <div class="value">{{ rating.WaterConsumption }} kL p.a.</div>
              <div class="label">Total water consumption with recycled water</div>
            </div>
            <div class="row" v-if="!empty('WaterConsumptionWoRW')">
              <div class="value">{{ rating.WaterConsumptionWoRW }} kL p.a.</div>
              <div class="label">Total water consumption without recycled water</div>
            </div>
          </div>
          <template v-if="premiseType('hotel')">
            <div class="row row--group">
              <div class="row row--blue" v-if="!empty('WaterConsumptionPerRoom')">
                <div class="value">{{ rating.WaterConsumptionPerRoom }} kL/room p.a.</div>
                <div class="label">Total water consumption per room with recycled water</div>
              </div>
              <div class="row" v-if="!empty('WaterConsumptionPerRoomNoRW')">
                <div class="value">{{ rating.WaterConsumptionPerRoomNoRW }} kL/room p.a.</div>
                <div class="label">Total water consumption per room without recycled water</div>
              </div>
            </div>
          </template>
          <div class="row row--group">
            <div class="row row--blue" v-if="!empty('WaterIntensity')">
              <div class="value">{{ rating.WaterIntensity }} kL/m² p.a.</div>
              <div class="label">Water intensity with recycled water</div>
            </div>
            <div class="row" v-if="!empty('WaterIntensityNoRW')">
              <div class="value">{{ rating.WaterIntensityNoRW }} kL/m² p.a.</div>
              <div class="label">Water intensity without recycled water</div>
            </div>
          </div>
      </template>
      <!--If [WaterRecycled] = NO, show:-->
      <template v-else>
        <div class="row" v-if="!empty('WaterConsumptionWoRW')">
          <div class="value">{{ rating.WaterConsumptionWoRW }} kL p.a.</div>
          <div class="label">Total water consumption</div>
        </div>
        <div v-if="premiseType('hotel')">
          <div class="row" v-if="!empty('WaterConsumptionPerRoomNoRW')">
            <div class="value">{{ rating.WaterConsumptionPerRoomNoRW }} kL/room p.a.</div>
            <div class="label">Total water consumption per room</div>
          </div>
        </div>
        <div class="row" v-if="!empty('WaterIntensityNoRW')">
          <div class="value">{{ rating.WaterIntensityNoRW }} kL/m² p.a.</div>
          <div class="label">Water intensity</div>
        </div>
      </template>
    </template>
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
        helper: new Helper()
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