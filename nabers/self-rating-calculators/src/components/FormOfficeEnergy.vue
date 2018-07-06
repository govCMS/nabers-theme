<template>
  <div>
    <form @submit.prevent="validateBeforeSubmit">
    <div class="rating-data form-container">
        <div class="building-details">
          <h2>Building details</h2>
          <h3>What is the floor space of the <span v-if="isTenancy()">tenancy</span><span v-else>building</span>?
          </h3>
          <fieldset>
            <label>
              <input v-validate="'required|decimal:2'" name="floorspace" type="text" v-model.number="inputs.floorspace" @change="autoCalculateComputers()"/>
              m<sup>2</sup>
            </label>
            <error-message v-if="errors.has('floorspace')">Please enter a numeric value for floor space</error-message>
            <small>Enter the total net lettable area of office space within the <span v-if="isTenancy()">tenancy</span><span v-else>building</span>.</small>
          </fieldset>
          <h3>How many hours per week is the <span v-if="isTenancy()">tenancy</span><span v-else>building</span> occupied?</h3>
          <fieldset>
            <label>
              <input v-validate="'required|integer'" name="hoursOccupiedPerWeek" type="text" v-model.number="inputs.hoursOccupiedPerWeek"/>
              hours
            </label>
            <error-message v-if="errors.has('hoursOccupiedPerWeek')">Please enter a numeric value for hours</error-message>
            <small>{{ isWholeBuilding() ? 'Enter' : 'Use' }} the standard business hours of the {{ isTenancy() ? 'tenancy' : 'building' }}.</small>
          </fieldset>
          <div v-if="isTenancy() || isWholeBuilding()">
            <h3>How many computers are normally switched on when the <span v-if="isTenancy()">tenancy</span><span v-else>building</span> is occupied?
              <ToolTip>
                <p>A computer is defined as a system unit and at least one screen and one keyboard. Additional monitors, screens or keyboards do not change the number of computers.</p>
              </ToolTip>
            </h3>
            <fieldset>
              <label>
                <input v-validate="'required|integer'" name="numberOfComputers" type="text" v-model.number="inputs.numberOfComputers"/>
                computers
              </label>
              <error-message  v-if="errors.has('numberOfComputers')">Please enter a numeric value for number of computers</error-message>
              <small>An estimate of 1 computer per 15m<sup>2</sup> is included here. If you know the actual number of computers, please enter it.</small>
            </fieldset>
          </div>
        </div>
    </div>
    <div class="energy-details form-container">
      <h2>Energy use</h2>
      <h3>Total electricity use for 12 months</h3>
      <fieldset>
        <label>
          <input v-validate="'required|decimal:2'" name="totalElectricityUse" type="text" v-model.number="inputs.totalElectricityUse"/>
          kWh
        </label>
        <error-message  v-if="errors.has('totalElectricityUse')">Please enter a numeric value for the total electricity use</error-message>
      </fieldset>
      <h3>What percentage of the total electricity use is GreenPower?</h3>
      <fieldset>
        <label>
          <input v-validate="'required|integer'" name="greenPowerPercentage" type="text" v-model.number="inputs.greenPowerPercentage" class="half-width"/>
          %
        </label>
        <error-message  v-if="errors.has('greenPowerPercentage')">Please enter the percentage of accredited GreenPower</error-message>
        <small>Enter the percentage of accredited GreenPower shown on your electricity bill.</small>
      </fieldset>
      <h3>Total natural gas use for 12 months</h3>
      <fieldset>
        <label>
          <input v-validate="'required|integer'" name="totalNaturalGas" type="text" v-model.number="inputs.totalNaturalGas"/>
          MJ
        </label>
        <error-message  v-if="errors.has('totalNaturalGas')">Please enter a numeric value for natural gas use</error-message>
      </fieldset>
    </div>
      <submit-button  :awaitingAPIResponse="awaitingAPIResponse" />
    </form>
  </div>
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
      resetForm: function () {
        Object.assign(this.$data, initialState())
      },
      isTenancy: function () {
        return this.ratingscope == 'tenancy';
      },
      isWholeBuilding: function () {
        return this.ratingscope == 'whole_building';
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
      autoCalculateComputers: function () {
        var floorspace = parseInt(this.inputs.floorspace);
        var numberOfComputers = parseInt(this.inputs.numberOfComputers || 0);
        if (floorspace > 0 && numberOfComputers < 1) {
          this.inputs.numberOfComputers = Math.ceil(floorspace / 15);
        }
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
