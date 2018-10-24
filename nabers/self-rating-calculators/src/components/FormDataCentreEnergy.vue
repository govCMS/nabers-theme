<template>
  <form @submit.prevent="validateBeforeSubmit">
    <template v-if="isWholeFacility() || isITEquipment()">
      <div class="rating-data form-container">
        <h2>Facility details</h2>
        <h3>What is the processing capacity of the data centre?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|decimal:1'" name="processing_capacity" type="text" v-model.number="inputs.processingCapacity"/>
            GHz
          </label>
          <error-message  v-if="errors.has('processing_capacity')">Please enter a numeric value up to 1 decimal place</error-message>
          <small>Enter the sum of the server clock speed (in GHz) multiplied by the number of cores for every server.</small>
        </fieldset>
        <h3>What is the storage capacity of the data centre?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|decimal:1'" name="storage_capacity" type="text" v-model.number="inputs.storageCapacity"/>
            TB
          </label>
          <error-message  v-if="errors.has('storage_capacity')">Please enter a numeric value up to 1 decimal place</error-message>
          <small>Enter the sum of the unformatted storage terabytes for all storage devices.</small>
        </fieldset>
      </div>
    </template>
    <div class="energy-details form-container">

      <h2>Energy use</h2>

      <template v-if="isInfrastructure()">
        <h3>What is the total energy consumed by the IT equipment over the 12 month period?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|decimal:1'" name="total_energy_consumed" type="text" v-model.number="inputs.totalEnergyConsumed"/>
            kWh/year
          </label>
          <error-message  v-if="errors.has('total_energy_consumed')">Please enter a numeric value up to 1 decimal place</error-message>
          <small>IT equipment includes computer servers, storage equipment and network equipment.</small>
        </fieldset>
        <h3>What is the total data centre electricity use for 12 months?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|decimal:1'" name="total_data_centre_electricity" type="text" v-model.number="inputs.totalDataCentreElectricity"/>
            kWh
          </label>
          <error-message  v-if="errors.has('total_data_centre_electricity')">Please enter a numeric value up to 1 decimal place</error-message>
        </fieldset>
      </template>

      <template v-else-if="isWholeFacility()">
        <h3>Total electricity use for 12 months</h3>
        <fieldset>
          <label>
            <input v-validate="'required|decimal:1'" name="totalElectricityUse" type="text" v-model.number="inputs.totalElectricityUse"/>
            kWh
          </label>
          <error-message  v-if="errors.has('totalElectricityUse')">Please enter a numeric value up to 1 decimal place</error-message>
        </fieldset>
      </template>

      <template v-else-if="isITEquipment()">
        <div class="notes">The energy data you enter here should be based on a period of approximately one month.</div>
        <h3>Exactly how many days energy data will you enter?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|integer|min_value:28|max_value:40'" name="days_of_energy_data" type="text" v-model.number="inputs.daysOfEnergyData"/>
            days
          </label>
          <error-message  v-if="errors.has('days_of_energy_data')">Please enter a number between 28-40</error-message>
          <small>This must be between 28-40 days.</small>
        </fieldset>
        <h3>Total electricity use during this period</h3>
        <fieldset>
          <label>
            <input v-validate="'required|decimal:1'" name="totalElectricityUse" type="text" v-model.number="inputs.totalElectricityUse"/>
            kWh
          </label>
          <error-message  v-if="errors.has('totalElectricityUse')">Please enter a numeric value up to 1 decimal place</error-message>
        </fieldset>
      </template>

      <h3>What percentage of the total electricity use is GreenPower?</h3>
      <fieldset>
        <label>
          <input v-validate="'required|decimal:1|max_value:100'" name="greenPowerPercentage" type="text" v-model.number="inputs.greenPowerPercentage" class="half-width"/>
          %
        </label>
        <error-message  v-if="errors.has('greenPowerPercentage')">Please enter the percentage up to 1 decimal place</error-message>
        <small>Enter the percentage of accredited GreenPower shown on your electricity bill.</small>
      </fieldset>

      <template v-if="!isITEquipment()">
        <h3 v-if="ratingscope == 'whole_facility'">Total diesel use for 12 months</h3>
        <h3 v-else>What is the total data centre diesel use for 12 months?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|decimal:1'" name="total_diesel" type="text" v-model.number="inputs.totalDiesel"/>
            L
          </label>
          <error-message  v-if="errors.has('total_diesel')">Please enter a numeric value up to 1 decimal place</error-message>
        </fieldset>
      </template>
    </div>
    <submit-button  :awaitingAPIResponse="awaitingAPIResponse" />
  </form>
</template>

<script>
  import ToolTip from "./ToolTip"
  import ErrorMessage from "./elements/ErrorMessage"
  import SubmitButton from "./elements/SubmitButton"

  export default {
    components: {
      ToolTip: ToolTip,
      "error-message": ErrorMessage,
      "submit-button": SubmitButton,
    },
    methods: {
      validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            // eslint-disable-next-line
            this.$emit('submit', this.inputs);
            return;
          }
          this.$emit('haserrors', this.inputs);
        });
      },
      isWholeFacility() {
        return this.ratingscope == 'whole_facility';
      },
      isInfrastructure() {
        return this.ratingscope == 'infrastructure';
      },
      isITEquipment() {
        return this.ratingscope == 'it_equipment';
      }
    },
    created: function () {
      //  Set the defaults (if specified)
      if (!this.inputs.hasOwnProperty('greenPowerPercentage')) {
        this.inputs.greenPowerPercentage = 0;
      }
    },
    props: ['ratingscope', 'inputs', 'results', 'awaitingAPIResponse'],
  }
</script>
