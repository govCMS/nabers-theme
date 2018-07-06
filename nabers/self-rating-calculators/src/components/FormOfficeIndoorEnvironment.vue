<template>
  <form @submit.prevent="validateBeforeSubmit">
    <template v-if="step == 2">
      <template v-if="!isRatingScope('tenancy')">
        <div class="ieq-form form-container">
          <div class="ieq-form__header">
            <h3>Thermal Comfort</h3>
            <span><i></i>Better than average</span>
          </div>
          <div class="ieq-form__instructions">
            <p>Thermal comfort is assessed by monitoring conditions over the course of a year, and by taking spot measurements over the course of one day.</p>
          </div>
          <fieldset>
            <h4>Annual monitoring</h4>
            <p>Hourly records of space temperature are recorded during normal working hours for one year. The information is typically captured by a building management system.</p>
            <p>Enter the percentage of samples in your building that fall between 21–24.9 °C.</p>
            <div class="ieq-input">
              <label>
                <input type="text" v-validate="rules('annualMonitoring')" data-vv-validate-on="change" name="annual_monitoring" v-model="inputs.annualMonitoring" class="half-width"/> %
              </label>
              <static-slider :settings="fieldSettings.annualMonitoring" :reading="inputs.annualMonitoring"></static-slider>
              <error-message v-if="errors.has('annual_monitoring')">Please enter a numeric value between {{ fieldSettings.annualMonitoring.min }} and {{ fieldSettings.annualMonitoring.max }}</error-message>
            </div>
          </fieldset>
          <fieldset>
            <h4>Spot measurements</h4>
            <p>Spot measurements of temperature, radiant temperature, humidity and air speed are taken throughout the building over the course of one day.</p>
            <p>What percentage of the floor space of your building meets the thermal comfort requirements of ASHRAE 55?</p>
            <div class="ieq-input">
              <label>
                <input type="text" v-validate="rules('spotMeasurements')" data-vv-validate-on="change" name="spot_measurements" v-model="inputs.spotMeasurements" class="half-width"/> %
              </label>
              <static-slider :settings="fieldSettings.spotMeasurements" :reading="inputs.spotMeasurements"></static-slider>
              <error-message v-if="errors.has('spot_measurements')">Please enter a numeric value between {{ fieldSettings.spotMeasurements.min }} and {{ fieldSettings.spotMeasurements.max }}</error-message>
            </div>
            <p>NABERS uses the ASHRAE Predictive Mean Vote model for this figure. If you’re unsure about it, leave the pre-filled default value here.</p>
          </fieldset>
        </div>
      </template>
      <div class="ieq-form form-container">
        <div class="ieq-form__header">
          <h3>Indoor air quality</h3>
          <span><i></i>Better than average</span>
        </div>
        <div class="ieq-form__instructions">
          <p>The data for every item in this category is based on spot measurements taken throughout the building over the course of one day.</p>
        </div>
        <fieldset>
          <h4>Particulate matter (PM<sub>10</sub>)</h4>
          <p>This measures airborne particles less than 10 micrometres in diameter, which can be generated from a range of sources, such as mould, traffic and printers.</p>
          <p>Enter the average PM<sub>10</sub> concentration here.</p>
          <div class="ieq-slider">
            <div class="ieq-input">
              <label>
                <input type="text" v-validate="rules('particulateMatter')" data-vv-validate-on="change" name="particulate_matter" v-model="inputs.particulateMatter" class="half-width"/> µg/m<sup>3</sup>
              </label>
              <static-slider :settings="fieldSettings.particulateMatter" :reading="inputs.particulateMatter" :error="errors.has('particulate_matter')" ></static-slider>
              <error-message v-if="errors.has('particulate_matter')">Please enter a numeric value between {{ fieldSettings.particulateMatter.min }} and {{ fieldSettings.particulateMatter.max }}</error-message>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <h4>Ventilation effectiveness</h4>
          <p>This measures the amount of fresh air entering a building. We use the difference in CO<sub>2</sub> levels between inside and outside the building to determine ventilation effectiveness, as per ASHRAE 62.1. CO<sub>2</sub> levels outside are typically around 410 ppm.
          </p>
          <p>Enter the percentage of samples for which CO<sub>2</sub> levels inside the building are no more than 810 ppm.
          </p>
          <div class="ieq-input">
            <label>
              <input type="text" v-validate="rules('ventilationEffectiveness')" data-vv-validate-on="change" name="ventilation_effectiveness" v-model="inputs.ventilationEffectiveness" class="half-width"/> %
            </label>
            <static-slider :settings="fieldSettings.ventilationEffectiveness" :reading="inputs.ventilationEffectiveness" :error="errors.has('ventilation_effectiveness')"></static-slider>
            <error-message v-if="errors.has('ventilation_effectiveness')">Please enter a numeric value between {{ fieldSettings.ventilationEffectiveness.min }} and {{ fieldSettings.ventilationEffectiveness.max }}</error-message>
          </div>
        </fieldset>
        <template v-if="!isRatingScope('tenancy')">
          <fieldset>
            <h4>Carbon monoxide</h4>
            <p>Carbon monoxide is used as a measure of how clean the air entering a building is. This is typically measured inside the plant room.</p>
            <p>Enter the average CO reading here.</p>
            <div class="ieq-input">
              <label>
                <input type="text" v-validate="rules('carbonMonoxide')" data-vv-validate-on="change" name="carbon_monoxide" v-model="inputs.carbonMonoxide" class="half-width"/> ppm
              </label>
              <static-slider :settings="fieldSettings.carbonMonoxide" :reading="inputs.carbonMonoxide" :error="errors.has('carbon_monoxide')" ></static-slider>
              <error-message v-if="errors.has('carbon_monoxide')">Please enter a numeric value between {{ fieldSettings.carbonMonoxide.min }} and {{ fieldSettings.carbonMonoxide.max }}</error-message>
            </div>
          </fieldset>
        </template>

        <template v-if="!isRatingScope('base_building')">
          <fieldset>
            <h4>Total volatile organic compounds</h4>
            <p>Volatile organic compounds are released as a result of tenant activities and the materials selected for fit out, such as paint and carpet.</p>
            <p>Enter the average TVOC measurement here.</p>
            <div class="ieq-input">
              <label>
                <input type="text" v-validate="rules('totalVolatileOrganicCompounds')" data-vv-validate-on="change" name="total_volatile_organic_compounds" v-model="inputs.totalVolatileOrganicCompounds" class="half-width"/> ppm
              </label>
              <static-slider :settings="fieldSettings.totalVolatileOrganicCompounds" :reading="inputs.totalVolatileOrganicCompounds" :error="errors.has('total_volatile_organic_compounds')" ></static-slider>
              <error-message v-if="errors.has('total_volatile_organic_compounds')">Please enter a numeric value between {{ fieldSettings.totalVolatileOrganicCompounds.min }} and {{ fieldSettings.totalVolatileOrganicCompounds.max }}</error-message>
            </div>
          </fieldset>
          <fieldset>
            <h4>Formaldehyde</h4>
            <p>Formaldehyde is associated with the office fit out. It is emitted from flooring, furnishings and adhesives.</p>
            <p>Enter the average formaldehyde reading here.</p>
            <div class="ieq-input">
              <label>
                <input type="text" v-validate="rules('formaldehyde')" data-vv-validate-on="change" name="formaldehyde" v-model="inputs.formaldehyde" class="half-width"/> ppm
              </label>
              <static-slider :settings="fieldSettings.formaldehyde" :reading="inputs.formaldehyde" :error="errors.has('formaldehyde')" ></static-slider>
              <error-message v-if="errors.has('formaldehyde')">Please enter a numeric value between {{ fieldSettings.formaldehyde.min }} and {{ fieldSettings.formaldehyde.max }}</error-message>
            </div>
          </fieldset>
        </template>
      </div>
      <template v-if="!isRatingScope('base_building')">
        <div class="ieq-form form-container">
          <div class="ieq-form__header">
            <h3>Lighting</h3>
            <span><i></i>Better than average</span>
          </div>
          <div class="ieq-form__instructions">
            <p>The data for lighting is based on spot measurements taken throughout the building over the course of one day.</p>
          </div>
          <fieldset>
            <h4>Horizontal illuminance</h4>
            <p>Enter the percentage of samples for which horizontal light is 320 lux or greater.</p>
            <div class="ieq-input">
              <label>
                <input type="text" v-validate="rules('horizontalIlluminance')" data-vv-validate-on="change" name="horizontal_illuminance" v-model="inputs.horizontalIlluminance" class="half-width"/> %
              </label>
              <static-slider :settings="fieldSettings.horizontalIlluminance" :reading="inputs.horizontalIlluminance" :error="errors.has('horizontal_illuminance')"></static-slider>
              <error-message v-if="errors.has('horizontal_illuminance')">Please enter a numeric value between {{ fieldSettings.horizontalIlluminance.min }} and {{ fieldSettings.horizontalIlluminance.max }}</error-message>
            </div>
          </fieldset>
        </div>
      </template>
      </div>
      <div class="ieq-form form-container">
        <div class="ieq-form__header">
          <h3>Acoustic comfort</h3>
          <span><i></i>Better than average</span>
        </div>
        <p>The data for acoustic comfort is based on spot measurements taken throughout the building over the course of one day.</p>
        <fieldset>
          <h4>Acoustic measurement</h4>
          <template v-if="isRatingScope('base_building')">
            <p>Enter the average noise level in dB.</p>
            <div class="ieq-input">
              <label>
                <input type="text" v-validate="rules('acousticMeasurementDB')" data-vv-validate-on="change" name="acoustic_measurementDB" v-model="inputs.acousticMeasurementDB" class="half-width"/> dB
              </label>
              <static-slider :settings="fieldSettings.acousticMeasurementDB" :reading="inputs.acousticMeasurementDB" :error="errors.has('acoustic_measurementDB')" ></static-slider>
              <error-message v-if="errors.has('acoustic_measurementDB')">Please enter a numeric value between {{ fieldSettings.acousticMeasurementDB.min }} and {{ fieldSettings.acousticMeasurementDB.max }}</error-message>
            </div>
          </template>
          <template v-else>
            <p>Enter the percentage of readings that fall between 40-45 dB.</p>
            <div class="ieq-input">
              <label>
                <input type="text" v-validate="rules('acousticMeasurementPercentage')" data-vv-validate-on="change" name="acoustic_measurement_percentage" v-model="inputs.acousticMeasurementPercentage" class="half-width"/> %
              </label>
              <static-slider :settings="fieldSettings.acousticMeasurementPercentage" :reading="inputs.acousticMeasurementPercentage" :error="errors.has('acoustic_measurement_percentage')"></static-slider>
              <error-message v-if="errors.has('acoustic_measurement_percentage')">Please enter a numeric value between {{ fieldSettings.acousticMeasurementPercentage.min }} and {{ fieldSettings.acousticMeasurementPercentage.max }}</error-message>
            </div>
          </template>
        </fieldset>
      </div>
    </template>

    <template v-if="step == 3">
      <div class="notes">
        The Indoor Environment rating includes an occupant satisfaction survey. The survey determines satisfaction with aspects of the environment that can’t be measured quantitatively. It is carried out by independent providers.
      </div>
      <div class="ieq-form ieq-form--survey form-container">
        <div class="ieq-form__header">
          <h3>Occupant satisfaction survey</h3>
          <span><i></i>Better than average</span>
        </div>
        <div class="ieq-form__instructions">
          <p>If you don't have survey results, simply leave the average data here. But, note that survey results represent 50% of the total score in most categories.</p>
          <p>If you do have survey results, enter your score for each category here.</p>
        </div>
        <template v-if="!isRatingScope('tenancy')">
          <fieldset>
            <h4>Thermal comfort</h4>
            <div class="ieq-input">
              <label>
                <input type="text" v-validate="rules('thermalComfort')" data-vv-validate-on="change" name="thermal_comfort" v-model="inputs.thermalComfort" class="half-width"/> %
              </label>
              <static-slider :settings="fieldSettings.thermalComfort" :reading="inputs.thermalComfort" :error="errors.has('thermal_comfort')"></static-slider>
              <error-message v-if="errors.has('thermal_comfort')">Please enter a numeric value between {{ fieldSettings.thermalComfort.min }} and {{ fieldSettings.thermalComfort.max }}</error-message>
            </div>
          </fieldset>
        </template>
        <fieldset>
          <h4>Indoor air quality</h4>
          <div class="ieq-input">
            <label>
              <input type="text" v-validate="rules('indoorAirQuality')" data-vv-validate-on="change" name="indoor_air_quality" v-model="inputs.indoorAirQuality" class="half-width"/> %
            </label>
            <static-slider :settings="fieldSettings.indoorAirQuality" :reading="inputs.indoorAirQuality" :error="errors.has('indoor_air_quality')"></static-slider>
            <error-message v-if="errors.has('indoor_air_quality')">Please enter a numeric value between {{ fieldSettings.indoorAirQuality.min }} and {{ fieldSettings.indoorAirQuality.max }}</error-message>
          </div>
        </fieldset>
        <fieldset>
          <h4>Lighting</h4>
          <div class="ieq-input">
            <label>
              <input type="text" v-validate="rules('lighting')" data-vv-validate-on="change" name="lighting" v-model="inputs.lighting" class="half-width"/> %
            </label>
            <static-slider :settings="fieldSettings.lighting" :reading="inputs.lighting" :error="errors.has('lighting')"></static-slider>
            <error-message v-if="errors.has('lighting')">Please enter a numeric value between {{ fieldSettings.lighting.min }} and {{ fieldSettings.lighting.max }}</error-message>
          </div>
        </fieldset>
        <fieldset>
          <h4>Acoustics</h4>
          <div class="ieq-input">
            <label>
              <input type="text" v-validate="rules('acoustics')" data-vv-validate-on="change" name="acoustics" v-model="inputs.acoustics" class="half-width"/> %
            </label>
            <static-slider :settings="fieldSettings.acoustics" :reading="inputs.acoustics" :error="errors.has('acoustics')"></static-slider>
            <error-message v-if="errors.has('acoustics')">Please enter a numeric value between {{ fieldSettings.acoustics.min }} and {{ fieldSettings.acoustics.max }}</error-message>
          </div>
        </fieldset>
        <fieldset>
          <h4>Office layout</h4>
          <div class="ieq-input">
            <label>
              <input type="text" v-validate="rules('officeLayout')" data-vv-validate-on="change" name="office_layout" v-model="inputs.officeLayout" class="half-width"/> %
            </label>
            <static-slider :settings="fieldSettings.officeLayout" :reading="inputs.officeLayout" :error="errors.has('office_layout')"></static-slider>
            <error-message v-if="errors.has('office_layout')">Please enter a numeric value between {{ fieldSettings.officeLayout.min }} and {{ fieldSettings.officeLayout.max }}</error-message>
          </div>
        </fieldset>
      </div>
    </template>

    <button v-if="!isRatingScope('base_building') && step == 2" class="button is-primary button--occupant-survey" type="submit">Continue to occupant survey<i class="icon-next"></i></button>
    <submit-button  :awaitingAPIResponse="awaitingAPIResponse" v-else />

  </form>
</template>

<script>
  import ToolTip from "./ToolTip"
  import StaticSlider from "./elements/StaticSlider"
  import ErrorMessage from "./elements/ErrorMessage"
  import SubmitButton from "./elements/SubmitButton"

  export default {
    components: {
      ToolTip: ToolTip,
      'static-slider': StaticSlider,
      "error-message": ErrorMessage,
      "submit-button": SubmitButton,
    },
    data: function () {
      return {
        fieldSettings: {
          //  Defaults (set in `created` method below if omitted):
          //  min: 0
          //  max: 100
          //  better: 'larger'
          //  decimals: 2
          'annualMonitoring': {
            min: 70,
            avg: 91,
          },
          'spotMeasurements': {
            min: 75,
            avg: 91.4,
          },
          'particulateMatter': {
            max: 25,
            avg: 7,
            better: 'smaller',
          },
          'ventilationEffectiveness': {
            min: 60,
            avg: 87,
          },
          'carbonMonoxide': {
            max: 2,
            avg: 0.6,
            better: 'smaller',
          },
          'totalVolatileOrganicCompounds': {
            max: 1.6,
            avg: 0.8,
            better: 'smaller'
          },
          'formaldehyde': {
            max: 0.08,
            avg: 0.04,
            better: 'smaller',
          },
          'horizontalIlluminance': {
            min: 15,
            avg: 65,
          },
          'acousticMeasurementDB': {
            min: 35,
            max: 45,
            avg: 40.2,
            better: 'smaller',
          },
          'acousticMeasurementPercentage': {
            max: 70,
            avg: 35,
          },
          'thermalComfort': {
            avg: 50,
          },
          'indoorAirQuality': {
            avg: 50,
          },
          'lighting': {
            avg: 50,
          },
          'acoustics': {
            avg: 50,
          },
          'officeLayout': {
            avg: 50,
          },
        },
      }
    },
    methods: {
      isRatingScope: function (value) {
        return this.ratingscope == value;
      },
      validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.$emit('submit', this.inputs);
            return;
          }
          this.$emit('haserrors', this.inputs);
        });
      },
      //  Automates setting vee validation rules
      rules(field) {
        var rules = ['required'];
        var settings = this.fieldSettings;
        if (settings.hasOwnProperty(field)) {
          var field = settings[field];
          if (field.hasOwnProperty('decimals')) {
            rules.push('decimal:' + field.decimals);
          }
          else {
            rules.push('decimal:1');
          }
          if (field.hasOwnProperty('min')) {
            rules.push('min_value:' + field.min);
          }
          if (field.hasOwnProperty('max')) {
            rules.push('max_value:' + field.max);
          }
        }
        return rules.join('|');
      },
    },
    created: function () {
      //  Set the defaults for validation/display rules.
      //  These need to be set using this.$set for reactivity
      //  (ref.: https://vuejs.org/v2/guide/reactivity.html)
      for (var property in this.fieldSettings) {
        if (this.fieldSettings.hasOwnProperty(property)) {
          if (!this.inputs.hasOwnProperty(property)) {
            this.$set(this.inputs, property, this.fieldSettings[property].avg);
          }
          //  Set some defaults..
          if (!this.fieldSettings[property].hasOwnProperty('better')) {
            this.$set(this.fieldSettings[property], 'better', 'larger');
          }
          if (!this.fieldSettings[property].hasOwnProperty('min')) {
            this.$set(this.fieldSettings[property], 'min', 0);
          }
          if (!this.fieldSettings[property].hasOwnProperty('max')) {
            this.$set(this.fieldSettings[property], 'max', 100);
          }
          if (!this.fieldSettings[property].hasOwnProperty('decimals')) {
            this.$set(this.fieldSettings[property], 'decimals', 2);
          }
        }
      }
      // Custom average values in Base building scope.
      if (this.ratingscope === 'base_building') {
        const baseBuildingAverages = {
          'annualMonitoring': 94,
          'spotMeasurements': 94,
          'particulateMatter': 5.5,
          'ventilationEffectiveness': 93,
          'carbonMonoxide': 0.4
        }
        for (let property in baseBuildingAverages) {
          this.$set(this.fieldSettings[property], 'avg', baseBuildingAverages[property])
          this.$set(this.inputs, property, this.fieldSettings[property].avg)
        }
      }
    },
    props: ['step', 'ratingscope', 'inputs', 'awaitingAPIResponse'],
  }
</script>
