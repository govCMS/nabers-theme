<template>
  <div>
    <div class="rating-results form-container">
      <template v-if="isRatingType('energy')">
        <div class="rating-result rating-result--energy">
          <h3>Your estimated Energy rating is</h3>
          <h4>{{ getValue('StarRating') }} star<span v-if="inputs.greenPowerPercentage > 0"> with GreenPower</span>.</h4>
          <template v-if="isBuildingType('office')">
            <p>The energy intensity of the <span v-if="isRatingScope('tenancy')">tenancy</span><span v-else>building</span> is {{ getValue('EnergyIntensity') }} MJ/m<sup>2</sup>.</p>
          </template>
          <template v-else-if="isBuildingType('shopping_centre')">
            <p>The energy intensity of the shopping centre is {{ getValue('EnergyIntensity') }} MJ/m<sup>2</sup>.</p>
          </template>
          <template v-else-if="isBuildingType('hotel')">
            <p>The total energy use of each room is {{ getValue('TotalEnergyUse') }} MJ/room p.a.</p>
          </template>
          <template v-else-if="isBuildingType('apartment_building')">
            <p>The total estimated energy use is {{ getValue('TotalEnergyUse') }} MJ p.a.</p>
          </template>
          <template v-else-if="isDataCentre()">
            <p v-if="isRatingScope('it_equipment')">Total energy use during the rating period is {{ getValue('TotalEnergyUse') }} MJ.</p>
            <p v-else>The total energy use is {{ getValue('TotalEnergyUse') }} MJ<span v-if="selection.ratingScope != 'it_equipment'"> p.a</span>.</p>
          </template>
          <p v-if="inputs.greenPowerPercentage > 0">Your estimated rating without GreenPower is {{ getValue('NoGreenPowerStarRating') }} star.</p>
          <div v-if="isRatingScope('base_building') && inputs.greenPowerPercentage > 0" class="cbd-disclosure">
            <span>Commercial Building Disclosure: use rating without GreenPower</span>
            <ToolTip>For more details: <a href="http://cbd.gov.au/" target="_blank">Commercial Building Disclosure Program</a></ToolTip>
          </div>

          <div v-if="isBuildingType('apartment_building')" class="notes">
            This is an estimate only. Metering arrangements, and services that are shared with other strata schemes, such as common areas, pools, and lifts, will affect your real rating.
          </div>
        </div>
      </template>

      <template v-if="isRatingType('water')">
        <div class="rating-result rating-result--water">
          <h3>Your estimated Water rating is</h3>
          <h4>{{ getValue('WaterStarRating') }} star<span v-if="inputs.recycledWaterPercentage > 0"> with recycled water</span>.
          </h4>
          <template v-if="isBuildingType('hotel')">
            <p>The total water consumption per room is {{ getValue('WaterConsumption') }} kL/room p.a.</p>
          </template>
          <template v-else-if="isBuildingType('shopping_centre')">
            <p>The total water consumption of the shopping centre is {{ getValue('WaterConsumption') }} kL/m<sup>2</sup> p.a.</p>
          </template>
          <template v-else-if="isBuildingType('apartment_building')">
            <p>The total estimated water use is {{ getValue('WaterConsumption') }} kL p.a.</p>
          </template>
          <template v-else>
            <p>The normalised water consumption of the <span v-if="isRatingScope('base_building')">base </span>building is {{ getValue('WaterConsumption') }} kL/m<sup>2</sup> p.a.</p>
          </template>

          <p v-if="inputs.recycledWaterPercentage > 0">Your estimated rating without recycled water is {{ getValue('NoRecycleWaterStarRating') }} star.</p>

          <div v-if="isBuildingType('apartment_building')" class="notes">
            Note that this is an estimate only. Water metering arrangements, and services that are shared with other strata schemes, such as swimming pools and gyms, will affect your real rating.
          </div>
        </div>
      </template>

      <template v-if="isRatingType('waste')">
        <div class="rating-result rating-result--waste">
          <h3>Your estimated Waste rating is</h3>
          <h4>{{ getValue('WasteStarRating') }} star.</h4>
          <p>The recycling rate of the building is {{ getValue('RecyclingRate') }}%.</p>
        </div>
      </template>

      <template v-if="isRatingType('indoor_environment')">
        <div class="rating-result rating-result--indoor-environment">
          <h3>Your estimated Indoor Environment rating is</h3>
          <h4>{{ getValue('IndoorStarRating') }} star.</h4>
          <p class="notes">The scores for each category show your market position compared to other office buildings.</p>
          <div v-if="!isRatingScope('tenancy')" class="ieq-result">
            <h4>Thermal comfort</h4>
            <p>Overall score: {{ getValue('ThermalComfortOverallScore') }}%</p>
            <ul>
              <li>Annual monitoring: {{ getValue('AnnualMonitoringScore') }}%</li>
              <li>Spot measurements: {{ getValue('SpotMeasurementsScore') }}%</li>
              <li v-if="isRatingScope('whole_building')">Occupant satisfaction survey: {{ getValue('ThermalComfortOccupantSurveyScore') }}%</li>
            </ul>
          </div>
          <div class="ieq-result">
            <h4>Indoor air quality</h4>
            <p>Overall score: {{ getValue('IndoorAirQualityScore') }}%</p>
            <ul>
              <li>Particulate matter: {{ getValue('ParticulateMatterScore') }}%</li>
              <li>Ventilation effectiveness: {{ getValue('VentilationEffectivenessScore') }}%</li>
              <li v-if="!isRatingScope('tenancy')">Carbon monoxide: {{ getValue('CarbonMonoxideScore') }}%</li>
              <li v-if="!isRatingScope('base_building')">Total volatile organic compounds: {{ getValue('TotalVolatileOrganicCompoundsScore') }}%</li>
              <li v-if="!isRatingScope('base_building')">Formaldehyde: {{ getValue('FormaldehydeScore') }}%</li>
              <li v-if="!isRatingScope('base_building')">Occupant satisfaction survey: {{ getValue('IndoorAirQualityOccupantSurveyScore') }}%</li>
            </ul>
          </div>

          <div v-if="!isRatingScope('base_building')" class="ieq-result">
            <h4>Lighting</h4>
            <p>Overall score: {{ getValue('LightingScore') }}%</p>
            <ul>
              <li>Horizontal illuminance: {{ getValue('HorizontalIlluminanceScore') }}%</li>
              <li>Occupant satisfaction survey: {{ getValue('LightingOccupantSurveyScore') }}%</li>
            </ul>
          </div>

          <div class="ieq-result">
            <h4>Acoustics</h4>
            <p>Overall score: {{ getValue('AcousticsScore') }}%</p>
            <ul>
              <li>Acoustic measurement: {{ getValue('AcousticMeasurementScore') }}%</li>
              <li v-if="!isRatingScope('base_building')">Occupant satisfaction survey: {{ getValue('AcousticsOccupantSurveyScore') }}%</li>
            </ul>
          </div>

          <div v-if="!isRatingScope('base_building')" class="ieq-result">
            <h4>Office layout</h4>
            <p>Overall score: {{ getValue('OfficeLayoutScore') }}%</p>
            <ul>
              <li>Occupant satisfaction survey: {{ getValue('OfficeLayoutScore') }}%</li>
            </ul>
          </div>

        </div>
      </template>
    </div>
    <div class="action-buttons">
      <a href="/find-accredited-assessor" class="button">Find an accredited assessor</a>
    </div>
  </div>
</template>

<script>
  import ToolTip from "./ToolTip"

  export default {
    components: {
      ToolTip: ToolTip,
    },
    data: function () {
      return {}
    },
    methods: {
      isRatingType: function(value) {
        return this.selection.ratingType == value;
      },
      isBuildingType: function(value) {
        return this.selection.buildingType == value;
      },
      isRatingScope: function(value) {
        return this.selection.ratingScope == value;
      },
      isDataCentre: function() {
        return this.selection.buildingType == 'data_centre';
      },
      //  Generic helper method for extracting values from API results grouped by Rating Type
      getValue: function(property) {
        var parent = 'EnergyResults';
        switch (this.selection.ratingType) {
          case 'water':
            parent = 'WaterResults';
            break;
          case 'waste':
            parent = 'WasteResults';
            break;
          case 'indoor_environment':
            parent = 'IEResults';
            break;
          default:
            break;
        }
        if (this.results.data[parent].hasOwnProperty(property)) {
            return this.oneDP(this.results.data[parent][property]);
        }
        return null;
      },
      oneDP (value) {
        if (!isNaN(value) && (value % 1 !== 0)) {
          value = Number.parseFloat(value).toFixed(1)
        }
        return value
      }
    },
    props: ['selection', 'inputs', 'results']
  }
</script>
