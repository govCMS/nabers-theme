<template>
  <div :class="expandedClass()">
    <button @click="toggle()" class="rating-detail__rating-type">NABERS {{ rating.RatingType }}</button>

    <div class="row" v-if="isApartment()">
      <div class="description">This rating consists of measurements for common property in the apartment building. It does not include energy use within individual apartments.</div>
    </div>
    <div class="row row--group">
      <template v-if="rating.EnergyGreenPower">
        <div class="row row--green" v-if="!empty('EnergyStarRatingValue')">
          <div class="value">{{ helper.oneDP(rating.EnergyStarRatingValue) }} star</div>
          <div class="label">with GreenPower</div>
        </div>
        <div class="row" v-if="!empty('EnergyGPStarRatingValueNoGP')">
          <div class="value">{{ helper.oneDP(rating.EnergyGPStarRatingValueNoGP) }} star</div>
          <div class="label">without GreenPower</div>
        </div>
        <div class="row row--tooltip" v-if="isOffice()">
          <div class="value"></div>
          <div class="label">For CBD scheme, use rating without GreenPower <tooltip><template slot="tooltip-body">GreenPower is not accounted for in the NABERS Energy rating that is used for a BEEC. GreenPower has a positive environmental impact, but it is not an energy efficiency action.</template></tooltip></div>
        </div>
      </template>
      <template v-else>
        <div class="row" v-if="!empty('EnergyGPStarRatingValueNoGP')">
          <div class="value">{{ helper.oneDP(rating.EnergyGPStarRatingValueNoGP) }} star</div>
          <div class="label">Rating</div>
        </div>
      </template>
    </div>
    <rating-detail-expiry-date :rating="rating"></rating-detail-expiry-date>
    <rating-detail-reference-number :rating="rating"></rating-detail-reference-number>

    <!-- //  ENERGY EXPANDED-->
    <template v-if="expanded">
      <div class="row" v-if="isHospital() && !empty('HospitalPeerGroup')">
        <div class="value">{{ rating.HospitalPeerGroup }}</div>
        <div class="label">Hospital peer group <tooltip><template slot="tooltip-body">The Australian Institute of Health and Welfare classifies hospitals into peer groups. The peer group defines the type and nature of the hospital services provided.</template></tooltip></div>
      </div>
      <!--For the Hotel Building Type only, the following additional data will display for Energy & Water Ratings as the first item in the expanded view:-->
      <!--[AAAStarRatingValue] - Label: Hotel quality rating-->
      <div class="row" v-if="isHotel() && !empty('AAAStarRatingValue')">
        <div class="value">{{ helper.oneDP(rating.AAAStarRatingValue) }} star</div>
        <div class="label">Hotel quality rating</div>
      </div>
      <!--For Energy the following fields always display in the expanded view additionally:-->
      <div class="row row--green" v-if="!empty('EnergyGreenPowerPercent')">
        <div class="value">{{ rating.EnergyGreenPowerPercent }}%</div>
        <div class="label">GreenPower</div>
      </div>
      <div class="row" v-if="isDataCentre() && !empty('DataCentre_PUE') && rating.RatingScope.toLowerCase() != 'it equipment'">
        <div class="value">{{ helper.oneDP(rating.DataCentre_PUE) }}</div>
        <div class="label">PUE (Power Use Efficiency)</div>
      </div>
      <template v-if="isHotel()">
        <div class="row" v-if="!empty('EnergyIntensityByRoom')">
          <div class="value">{{ rating.EnergyIntensityByRoom }} MJ/room</div>
          <div class="label">Energy intensity per room</div>
        </div>
      </template>
      <template v-else>
        <div class="row" v-if="!empty('EnergyIntensityByM2')">
          <div class="value">{{ rating.EnergyIntensityByM2 }} MJ/m²</div>
          <div class="label">Energy intensity</div>
        </div>
      </template>
      <!--If [EnergyGreenPower] = YES , show-->
      <template v-if="rating.EnergyGreenPower">
        <div class="row row--group">
          <!--[GHGEmissionsScope123] CO₂-e p.a. - Label: Total greenhouse gas emissions with GreenPower-->
          <div class="row row--green" v-if="!empty('GHGEmissionsScope123')">
            <div class="value">{{ rating.GHGEmissionsScope123 }} CO₂-e p.a.</div>
            <div v-if="isOffice()" class="label">Total greenhouse gas emissions, scope 1, 2, and 3 with GreenPower <tooltip><template slot="tooltip-body">Scope 1 is emissions that are a direct result of activity at the building. Scopes 2 and 3 are indirect emissions, linked to the building, but generated in the wider economy. For example, emissions caused by the burning of coal to produce the electricity that this building uses and the transmission and distribution losses.</template></tooltip></div>
            <div v-else class="label">Total greenhouse gas emissions with GreenPower</div>
          </div>
          <!--[GHGEmissionsScope123NoGP] CO₂-e p.a. - Label: Total greenhouse gas emissions without GreenPower-->
          <div class="row" v-if="!empty('GHGEmissionsScope123NoGP')">
            <div class="value">{{ rating.GHGEmissionsScope123NoGP }} CO₂-e p.a.</div>
            <div v-if="isOffice()" class="label">Total greenhouse gas emissions, scope 1, 2, and 3 without GreenPower <tooltip><template slot="tooltip-body">Scope 1 is emissions that are a direct result of activity at the building. Scopes 2 and 3 are indirect emissions, linked to the building, but generated in the wider economy. For example, emissions caused by the burning of coal to produce the electricity that this building uses and the transmission and distribution losses.</template></tooltip></div>
            <div v-else class="label">Total greenhouse gas emissions without GreenPower</div>
          </div>
        </div>
        <!--//  HOTEL-->
        <template v-if="isHotel()">
          <div class="row row--group">
            <div class="row row--green" v-if="!empty('GHGEmissionsScope123PerRoom')">
              <div class="value">{{ rating.GHGEmissionsScope123PerRoom }} CO₂-e/room p.a.</div>
              <div class="label">Total greenhouse gas emissions per room with GreenPower</div>
            </div>
            <div class="row" v-if="!empty('GHGEmissionsScope123PerRoomNoGP')">
              <div class="value">{{ rating.GHGEmissionsScope123PerRoomNoGP }} CO₂-e/room p.a.</div>
              <div class="label">Total greenhouse gas emissions per room without GreenPower</div>
            </div>
          </div>
        </template>
        <!--//  SHOPPING CENTRE-->
        <template v-else-if="isShoppingCentre()" class="row-group">
          <div class="row row--group">
            <div class="row row--green" v-if="!empty('GHGEmissionsScope123PerM2')">
              <div class="value">{{ rating.GHGEmissionsScope123PerM2 }} CO₂-e/m² p.a.</div>
              <div class="label">Total greenhouse gas emissions per m² GLAR <tooltip><template slot="tooltip-body">Gross Lettable Area Retail</template></tooltip> with GreenPower</div>
            </div>
            <!--[GHGEmissionsScope123PerM2NoGP] CO₂-e/m² p.a. Label: Total greenhouse gas emissions per m² without GreenPower-->
            <div class="row" v-if="!empty('GHGEmissionsScope123PerM2NoGP')">
              <div class="value">{{ rating.GHGEmissionsScope123PerM2NoGP }} CO₂-e/m² p.a.</div>
              <div class="label">Total greenhouse gas emissions per m² GLAR <tooltip><template slot="tooltip-body">Gross Lettable Area Retail</template></tooltip> without GreenPower</div>
            </div>
          </div>
        </template>
        <!--//  OTHERS-->
        <template v-else>
          <div v-if="!empty('GHGEmissionsScope123PerM2') || !empty('GHGEmissionsScope123PerM2NoGP')" class="row row--group">
            <!--[GHGEmissionsScope123PerM2] CO₂-e/m² p.a. - Label: Total greenhouse gas emissions per m² with GreenPower-->
            <div class="row row--green" v-if="!empty('GHGEmissionsScope123PerM2')">
              <div class="value">{{ rating.GHGEmissionsScope123PerM2 }} CO₂-e/m² p.a.</div>
              <div class="label">Total greenhouse gas emissions per m² with GreenPower</div>
            </div>
            <!--[GHGEmissionsScope123PerM2NoGP] CO₂-e/m² p.a. Label: Total greenhouse gas emissions per m² without GreenPower-->
            <div class="row" v-if="!empty('GHGEmissionsScope123PerM2NoGP')">
              <div class="value">{{ rating.GHGEmissionsScope123PerM2NoGP }} CO₂-e/m² p.a.</div>
              <div class="label">Total greenhouse gas emissions per m² without GreenPower</div>
            </div>
          </div>
        </template>
      </template>
      <!--If [EnergyGreenPower] = NO , show-->
      <template v-else>
          <div class="row" v-if="!empty('GHGEmissionsScope123NoGP')">
            <div class="value">{{ rating.GHGEmissionsScope123NoGP }} CO₂-e p.a.</div>
            <div v-if="isOffice()" class="label">Total greenhouse gas emissions, scope 1, 2, and 3 <tooltip><template slot="tooltip-body">Scope 1 is emissions that are a direct result of activity at the building. Scopes 2 and 3 are indirect emissions, linked to the building, but generated in the wider economy. For example, emissions caused by the burning of coal to produce the electricity that this building uses and the transmission and distribution losses.</template></tooltip></div>
            <div v-else class="label">Total greenhouse gas emissions</div>
          </div>
          <!--//  HOTEL-->
          <template v-if="isHotel()">
            <div class="row" v-if="!empty('GHGEmissionsScope123PerRoomNoGP')">
              <div class="value">{{ rating.GHGEmissionsScope123PerRoomNoGP }} CO₂-e/room p.a.</div>
              <div class="label">Total greenhouse gas emissions per room</div>
            </div>
          </template>
          <!--//  SHOPPING CENTRE-->
          <template v-if="isShoppingCentre()">
            <div class="row" v-if="!empty('GHGEmissionsScope123PerM2NoGP')">
              <div class="value">{{ rating.GHGEmissionsScope123PerM2NoGP }} CO₂-e/m² p.a.</div>
              <div class="label">Total greenhouse gas emissions per m² GLAR <tooltip><template slot="tooltip-body">Gross Lettable Area Retail</template></tooltip></div>
            </div>
          </template>
          <!--//  OTHERS-->
          <template v-else>
            <div class="row" v-if="!empty('GHGEmissionsScope123PerM2NoGP')">
              <div class="value">{{ rating.GHGEmissionsScope123PerM2NoGP }} CO₂-e/m² p.a.</div>
              <div class="label">Total greenhouse gas emissions per m²</div>
            </div>
          </template>
      </template>
      <div class="row" v-if="!empty('TotalEnergyUse')">
          <div class="value">{{ rating.TotalEnergyUse }} MJ p.a.</div>
          <div v-if="isApartment()" class="label">Total energy use in common spaces</div>
          <div v-else class="label">Total energy use</div>
      </div>
    </template>
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
      empty: function(property) {
        return this.rating[property] == '' ? true : false;
      },
      premiseType: function(premiseType) {
        return this.rating.PremiseType.toLowerCase().indexOf(premiseType) != -1 ? true : false;
      },
      isOffice: function() {
        return this.premiseType('office');
      },
      isHospital: function() {
        return this.premiseType('hospital');
      },
      isHotel: function() {
        return this.premiseType('hotel');
      },
      isApartment: function() {
        return this.premiseType('apartment');
      },
      isDataCentre: function() {
        return this.premiseType('data centre');
      },
      isShoppingCentre: function() {
        return this.premiseType('shopping');
      },
    },
    props: [
      'rating',
    ]
  }
</script>
