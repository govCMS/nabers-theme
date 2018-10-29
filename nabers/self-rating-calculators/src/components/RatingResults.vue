<template>
  <div>
    <div class="rating-results form-container">
      <template v-if="isRatingType('energy')">
        <div class="rating-result rating-result--energy">
          <h3>Your estimated Energy rating is</h3>
          <h4>{{ getValue('starRating') }} star<span v-if="inputs.greenPowerPercentage > 0"> with GreenPower</span>.</h4>
          <template v-if="isBuildingType('office')">
            <p>The energy intensity of the <span v-if="isRatingScope('tenancy')">tenancy</span><span v-else>building</span> is {{ getValue('energyIntensity') }} MJ/m<sup>2</sup>.</p>
          </template>
          <template v-else-if="isBuildingType('shopping_centre')">
            <p>The energy intensity of the shopping centre is {{ getValue('energyIntensity') }} MJ/m<sup>2</sup>.</p>
          </template>
          <template v-else-if="isBuildingType('hotel')">
            <p>The total energy use of each room is {{ getValue('energyIntensity') }} MJ/room p.a.</p>
          </template>
          <template v-else-if="isBuildingType('apartment_building')">
            <p>The total estimated energy use is {{ getValue('totalEnergyUse') }} MJ p.a.</p>
          </template>
          <template v-else-if="isDataCentre()">
            <p v-if="isRatingScope('it_equipment')">Total energy use during the rating period is {{ getValue('totalEnergyUse') }} MJ.</p>
            <p v-else>The total energy use is {{ getValue('totalEnergyUse') }} MJ<span v-if="selection.ratingScope != 'it_equipment'"> p.a</span>.</p>
          </template>
          <p v-if="inputs.greenPowerPercentage > 0">Your estimated rating without GreenPower is {{ getValue('noGreenPowerStarRating') }} star.</p>
          <div v-if="isRatingScope('base_building') && inputs.greenPowerPercentage > 0" class="cbd-disclosure">
            <span>Commercial Building Disclosure: use rating without GreenPower</span>
            <ToolTip><p>For more details: <a href="http://cbd.gov.au/" target="_blank">Commercial Building Disclosure Program</a></p></ToolTip>
          </div>

          <div v-if="isBuildingType('apartment_building')" class="notes">
            This is an estimate only. Metering arrangements, and services that are shared with other strata schemes, such as common areas, pools, and lifts, will affect your real rating.
          </div>

          <div v-if="expanded" class="more-details-panel">
            <div class="row" :class="{'row--green' : inputs.greenPowerPercentage > 0}">
              <div class="value">{{ getValue('greenpowerPercentage') }} %</div>
              <div class="label">GreenPower</div>
            </div>

            <div v-if="isBuildingType('office')" class="row row--group">
              <div class="row row--green" v-if="inputs.greenPowerPercentage > 0">
                <div class="value">{{ getValue('greenhouseGasEmissionsScope12') }} kg CO₂-e p.a.</div>
                <div class="label">Total greenhouse gas emissions, scope 1 and 2 with GreenPower</div>
              </div>
              <div class="row">
                <div class="value">{{ getValue('noGreenPowerGHGEmissionsScope12') }} kg CO₂-e p.a.</div>
                <div class="label">Total greenhouse gas emissions, scope 1 and 2 without GreenPower</div>
              </div>
            </div>
            <div class="row row--group">
              <div class="row row--green" v-if="inputs.greenPowerPercentage > 0">
                <div class="value">{{ getValue('greenhouseGasEmissionsScope123') }} kg CO₂-e p.a.</div>
                <div class="label">Total greenhouse gas emissions, scope 1, 2 and 3 with GreenPower <ToolTip><p>Scope 1 is emissions that are a direct result of activity at the building. Scopes 2 and 3 are indirect emissions, linked to the building, but generated in the wider economy. For example, emissions caused by the burning of coal to produce the electricity that this building uses and the transmission and distribution losses.</p></ToolTip></div>
              </div>
              <div class="row">
                <div class="value">{{ getValue('noGreenPowerGHGEmissionsScope123') }} kg CO₂-e p.a.</div>
                <div class="label">Total greenhouse gas emissions, scope 1, 2 and 3 without GreenPower <ToolTip><p>Scope 1 is emissions that are a direct result of activity at the building. Scopes 2 and 3 are indirect emissions, linked to the building, but generated in the wider economy. For example, emissions caused by the burning of coal to produce the electricity that this building uses and the transmission and distribution losses.</p></ToolTip></div>
              </div>
            </div>
            <div v-if="isBuildingType('office')" class="row row--group">
              <div class="row row--green" v-if="inputs.greenPowerPercentage > 0">
                <div class="value">{{ getValue('greenhouseGasIntensityScope12') }} kg CO₂-e/m² p.a.</div>
                <div class="label">Greenhouse gas intensity, scope 1 and 2 with GreenPower</div>
              </div>
              <div class="row">
                <div class="value">{{ getValue('noGreenPowerGHGIntensityScope12') }} kg CO₂-e/m² p.a.</div>
                <div class="label">Greenhouse gas intensity, scope 1 and 2 without GreenPower</div>
              </div>
            </div>
            <div v-if="isBuildingType('office')" class="row row--group">
              <div class="row row--green" v-if="inputs.greenPowerPercentage > 0">
                <div class="value">{{ getValue('greenhouseGasIntensityScope123') }} kg CO₂-e/m² p.a.</div>
                <div class="label">Greenhouse gas intensity, scope 1, 2 and 3 with GreenPower <ToolTip><p>Scope 1 is emissions that are a direct result of activity at the building. Scopes 2 and 3 are indirect emissions, linked to the building, but generated in the wider economy. For example, emissions caused by the burning of coal to produce the electricity that this building uses and the transmission and distribution losses.</p></ToolTip></div>
              </div>
              <div class="row">
                <div class="value">{{ getValue('noGreenPowerGHGIntensityScope123') }} kg CO₂-e/m² p.a.</div>
                <div class="label">Greenhouse gas intensity, scope 1, 2 and 3 without GreenPower <ToolTip><p>Scope 1 is emissions that are a direct result of activity at the building. Scopes 2 and 3 are indirect emissions, linked to the building, but generated in the wider economy. For example, emissions caused by the burning of coal to produce the electricity that this building uses and the transmission and distribution losses.</p></ToolTip></div>
              </div>
            </div>
            <div v-if="isBuildingType('office')" class="row row--group">
              <div class="row row--green" v-if="inputs.greenPowerPercentage > 0">
                <div class="value">{{ getValue('benchmarkingFactor') }}</div>
                <div class="label">Benchmarking factor with GreenPower</div>
              </div>
              <div class="row">
                <div class="value">{{ getValue('noGreenPowerBenchmarkingFactor') }}</div>
                <div class="label">Benchmarking factor without GreenPower</div>
              </div>
            </div>
            <div v-if="isBuildingType('shopping_centre')" class="row row--group">
              <div class="row row--green" v-if="inputs.greenPowerPercentage > 0">
                <div class="value">{{ getValue('greenhouseGasIntensityScope123') }} kg CO2-e/m2 p.a.</div>
                <div class="label">Greenhouse gas emissions per m2 GLAR, scope 1, 2 and 3 with GreenPower</div>
              </div>
              <div class="row">
                <div class="value">{{ getValue('noGreenPowerGHGIntensityScope123') }} kg CO2-e/m2 p.a.</div>
                <div class="label">Greenhouse gas emissions per m2 GLAR, scope 1, 2 and 3 without GreenPower</div>
              </div>
            </div>
            <div v-if="isBuildingType('hotel')" class="row row--group">
              <div class="row row--green" v-if="inputs.greenPowerPercentage > 0">
                <div class="value">{{ getValue('greenhouseGasIntensityScope123') }} kg CO2-e/room p.a.</div>
                <div class="label">Actual greenhouse gas emissions per room, scope 1, 2 and 3 with GreenPower</div>
              </div>
              <div class="row">
                <div class="value">{{ getValue('noGreenPowerGHGIntensityScope123') }} kg CO2-e/room p.a.</div>
                <div class="label">Actual greenhouse gas emissions per room, scope 1, 2 and 3 without GreenPower</div>
              </div>
            </div>
          </div>

        </div>
      </template>

      <template v-if="isRatingType('water')">
        <div class="rating-result rating-result--water">
          <h3>Your estimated Water rating is</h3>
          <h4>{{ getValue('waterStarRating') }} star<span v-if="inputs.recycledWaterPercentage > 0"> with recycled water</span>.
          </h4>
          <template v-if="isBuildingType('hotel')">
            <p>The total water consumption per room is {{ getValue('waterConsumption') }} kL/room p.a.</p>
          </template>
          <template v-else-if="isBuildingType('shopping_centre')">
            <p>The total water consumption of the shopping centre is {{ getValue('waterConsumption') }} kL/m<sup>2</sup> p.a.</p>
          </template>
          <template v-else-if="isBuildingType('apartment_building')">
            <p>The total estimated water use is {{ getValue('waterConsumption') }} kL p.a.</p>
          </template>
          <template v-else>
            <p>The normalised water consumption of the <span v-if="isRatingScope('base_building')">base </span>building is {{ getValue('waterConsumption') }} kL/m<sup>2</sup> p.a.</p>
          </template>

          <p v-if="inputs.recycledWaterPercentage > 0">Your estimated rating without recycled water is {{ getValue('noRecycleWaterStarRating') }} star.</p>

          <div v-if="isBuildingType('apartment_building')" class="notes">
            Note that this is an estimate only. Water metering arrangements, and services that are shared with other strata schemes, such as swimming pools and gyms, will affect your real rating.
          </div>

          <div v-if="expanded" class="more-details-panel">
            <div class="row" :class="{'row--green' : inputs.recycledWaterPercentage > 0}">
              <div class="value">{{ getValue('recycledWaterPercent') }} %</div>
              <div class="label">Recycled water</div>
            </div>
            <div class="row row--group">
              <div class="row row--green" v-if="inputs.recycledWaterPercentage > 0">
                <div class="value">{{ getValue('waterConsumption') }} kL p.a.</div>
                <div class="label">Total water consumption with recycled water</div>
              </div>
              <div class="row">
                <div class="value">{{ getValue('noRecycleWaterConsumption') }} kL p.a.</div>
                <div class="label">Total water consumption without recycled water</div>
              </div>
            </div>
            <div v-if="isBuildingType('hotel')" class="row row--group">
              <div class="row row--green" v-if="inputs.recycledWaterPercentage > 0">
                <div class="value">{{ getValue('normalisedWaterConsumption') }} kL/room p.a.</div>
                <div class="label">Total water consumption per room with recycled water </div>
              </div>
              <div class="row">
                <div class="value">{{ getValue('noRecycleNormalisedWaterConsumption') }} kL/room p.a.</div>
                <div class="label">Total water consumption per room without recycled water</div>
              </div>
            </div>
            <div v-else class="row row--group">
              <div class="row row--green" v-if="inputs.recycledWaterPercentage > 0">
                <div class="value">{{ getValue('normalisedWaterConsumption') }} kL/m² p.a.</div>
                <div class="label">Normalised water consumption with recycled water</div>
              </div>
              <div class="row">
                <div class="value">{{ getValue('noRecycleNormalisedWaterConsumption') }} kL/m² p.a.</div>
                <div class="label">Normalised water consumption without recycled water</div>
              </div>
            </div>
          </div>

        </div>
      </template>

      <template v-if="isRatingType('waste')">
        <div class="rating-result rating-result--waste">
          <h3>Your estimated Waste rating is</h3>
          <h4>{{ getValue('wasteStarRating') }} star.</h4>
          <p>The recycling rate of the building is {{ getValue('recyclingRate') }}%.</p>
        </div>
      </template>

      <template v-if="isRatingType('indoor_environment')">
        <div class="rating-result rating-result--indoor-environment">
          <h3>Your estimated Indoor Environment rating is</h3>
          <h4>{{ getValue('indoorStarRating') }} star.</h4>
          <p class="notes">The scores for each category show your market position compared to other office buildings.</p>
          <div v-if="!isRatingScope('tenancy')" class="ieq-result">
            <h4>Thermal comfort</h4>
            <p>Overall score: {{ getValue('thermalComfortOverallScore') }}%</p>
            <ul>
              <li>Annual monitoring: {{ getValue('annualMonitoringScore') }}%</li>
              <li>Spot measurements: {{ getValue('spotMeasurementsScore') }}%</li>
              <li v-if="isRatingScope('whole_building')">Occupant satisfaction survey: {{ getValue('thermalComfortOccupantSurveyScore') }}%</li>
            </ul>
          </div>
          <div class="ieq-result">
            <h4>Indoor air quality</h4>
            <p>Overall score: {{ getValue('indoorAirQualityScore') }}%</p>
            <ul>
              <li>Particulate matter: {{ getValue('particulateMatterScore') }}%</li>
              <li>Ventilation effectiveness: {{ getValue('ventilationEffectivenessScore') }}%</li>
              <li v-if="!isRatingScope('tenancy')">Carbon monoxide: {{ getValue('carbonMonoxideScore') }}%</li>
              <li v-if="!isRatingScope('base_building')">Total volatile organic compounds: {{ getValue('totalVolatileOrganicCompoundsScore') }}%</li>
              <li v-if="!isRatingScope('base_building')">Formaldehyde: {{ getValue('formaldehydeScore') }}%</li>
              <li v-if="!isRatingScope('base_building')">Occupant satisfaction survey: {{ getValue('indoorAirQualityOccupantSurveyScore') }}%</li>
            </ul>
          </div>

          <div v-if="!isRatingScope('base_building')" class="ieq-result">
            <h4>Lighting</h4>
            <p>Overall score: {{ getValue('lightingScore') }}%</p>
            <ul>
              <li>Horizontal illuminance: {{ getValue('horizontalIlluminanceScore') }}%</li>
              <li>Occupant satisfaction survey: {{ getValue('lightingOccupantSurveyScore') }}%</li>
            </ul>
          </div>

          <div class="ieq-result">
            <h4>Acoustics</h4>
            <p>Overall score: {{ getValue('acousticsScore') }}%</p>
            <ul>
              <li>Acoustic measurement: {{ getValue('acousticMeasurementScore') }}%</li>
              <li v-if="!isRatingScope('base_building')">Occupant satisfaction survey: {{ getValue('acousticsOccupantSurveyScore') }}%</li>
            </ul>
          </div>

          <div v-if="!isRatingScope('base_building')" class="ieq-result">
            <h4>Office layout</h4>
            <p>Overall score: {{ getValue('officeLayoutScore') }}%</p>
            <ul>
              <li>Occupant satisfaction survey: {{ getValue('officeLayoutScore') }}%</li>
            </ul>
          </div>

        </div>
      </template>

      <div v-if="(isRatingType('energy') || isRatingType('water'))" class="rating-result more-details-button-row">
        <more-details-button @toggle="toggle()" class="rating-results__more-details" :expanded="expanded">{{ expanded ? 'Less' : 'More' }} details</more-details-button>
      </div>
    </div>
    <div class="action-buttons">
      <a href="/find-accredited-assessor" class="button">Find an accredited assessor</a>
    </div>
  </div>
</template>

<script>
  import ToolTip from './ToolTip'
  import MoreDetailsButton from './elements/MoreDetailsButton'

  export default {
    components: {
      ToolTip: ToolTip,
      'more-details-button': MoreDetailsButton,
    },
    data: function () {
      return {
        expanded: false,
      }
    },
    methods: {
      toggle: function() {
        this.expanded = !this.expanded;
      },
      expandedClass: function() {
        return this.expanded ? 'is-expanded' : 'is-collapsed';
      },
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
        var parent = 'energyResults';
        switch (this.selection.ratingType) {
          case 'water':
            parent = 'waterResults';
            break;
          case 'waste':
            parent = 'wasteResults';
            break;
          case 'indoor_environment':
            parent = 'ieResults';
            break;
          default:
            break;
        }
        if (typeof this.results.data[parent] !== 'undefined' && this.results.data[parent].hasOwnProperty(property)) {
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
