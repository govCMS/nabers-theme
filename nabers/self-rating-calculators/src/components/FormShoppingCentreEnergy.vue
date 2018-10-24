<template>
  <form @submit.prevent="validateBeforeSubmit">
    <div class="rating-data form-container">
      <div class="building-details">
        <h2>Building details</h2>
        <h3>Is the shopping centre single or multi storey?</h3>
        <fieldset>
          <div class="radio-groups" role="group">
            <div class="radio-groups__group">
              <input v-validate="'required'" name="multiStorey" value="single" type="radio" id="singleStorey" v-model="inputs.multiStorey"/>
              <label for="singleStorey">Single storey</label>
            </div>
            <div class="radio-groups__group">
              <input v-validate="'required'" name="multiStorey" value="multi" type="radio"  id="multiStorey" v-model="inputs.multiStorey"/>
              <label for="multiStorey">Multi storey</label>
            </div>
            <error-message  v-if="errors.has('multiStorey')">Please select a value for single or multi storey</error-message>
            <small>A centre is considered multi storey when two or more large retail floors are located directly above each other.</small>
          </div>
        </fieldset>

        <h3>What is the total Gross Lettable Area Retail (GLAR) of the shopping centre?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|decimal:1'" name="grossLettableAreaRetail" type="text" v-model.number="inputs.grossLettableAreaRetail"/>
            m<sup>2</sup>
          </label>
          <error-message  v-if="errors.has('grossLettableAreaRetail')">Please enter a numeric value up to 1 decimal place</error-message>
        </fieldset>

        <h3>What is the total centrally serviced area of the shopping centre?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|decimal:1'" name="totalCentrallyServicedArea" type="text" v-model.number="inputs.totalCentrallyServicedArea"/>
            m<sup>2</sup>
          </label>
          <error-message  v-if="errors.has('totalCentrallyServicedArea')">Please enter a numeric value up to 1 decimal place</error-message>
          <small>Enter the total GLAR of all tenancies that are provided with air conditioning services from the shopping centre plant.</small>
        </fieldset>

        <h3>What is the annual number of trading days?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|integer'" name="tradingDays" type="text" v-model.number="inputs.tradingDays"/>
            days
          </label>
          <error-message  v-if="errors.has('tradingDays')">Please enter a numeric value for annual number of trading days</error-message>
        </fieldset>

        <h3>How many hours per week is the shopping centre operated?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|integer'" name="hoursOperatedPerWeek" type="text" v-model.number="inputs.hoursOperatedPerWeek"/>
            hours
          </label>
          <error-message  v-if="errors.has('hoursOperatedPerWeek')">Please enter a numeric value for hours per week is the shopping centre operated</error-message>
          <small>Enter the amount of hours that centrally serviced tenancies are operated.</small>
        </fieldset>

        <h3>How many mechanically ventilated car spaces are there?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|integer'" name="mechanicallyVentilatedCarSpaces" type="text" v-model.number="inputs.mechanicallyVentilatedCarSpaces"/>
            car spaces
          </label>
          <error-message  v-if="errors.has('mechanicallyVentilatedCarSpaces')">Please enter a numeric value for mechanically ventilated car spaces</error-message>
          <small>Enter the number of car spaces in areas ventilated by supply and/or exhaust.</small>
        </fieldset>

        <h3>How many naturally ventilated car spaces are there?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|integer'" name="naturallyVentilatedCarSpaces" type="text" v-model.number="inputs.naturallyVentilatedCarSpaces"/>
            car spaces
          </label>
          <error-message  v-if="errors.has('naturallyVentilatedCarSpaces')">Please enter a numeric value for naturally ventilated car spaces</error-message>
        </fieldset>
      </div>
    </div>
    <div class="energy-details form-container">
      <h2>Energy use</h2>
      <h3>Total electricity use for 12 months</h3>
      <fieldset>
        <label>
          <input v-validate="'required|decimal:1'" name="totalElectricityUse" type="text" v-model.number="inputs.totalElectricityUse"/>
          kWh
        </label>
        <error-message  v-if="errors.has('totalElectricityUse')">Please enter a numeric value up to 1 decimal place</error-message>
      </fieldset>

      <h3>What percentage of the total electricity use is GreenPower?</h3>
      <fieldset>
        <label>
          <input v-validate="'required|decimal:1|max_value:100'" name="greenPowerPercentage" type="text" v-model.number="inputs.greenPowerPercentage"/>
          %
        </label>
        <error-message  v-if="errors.has('greenPowerPercentage')">Please enter a numeric value up to 1 decimal place</error-message>
        <small>Enter the percentage of accredited GreenPower shown on your electricity bill.</small>
      </fieldset>

      <h3>Total natural gas use for 12 months</h3>
      <fieldset>
        <label>
          <input v-validate="'required|decimal:1'" name="totalNaturalGas" type="text" v-model.number="inputs.totalNaturalGas"/>
          MJ
        </label>
        <error-message  v-if="errors.has('totalNaturalGas')">Please enter a numeric value up to 1 decimal place</error-message>
      </fieldset>

      <h3>Total diesel use for 12 months</h3>
      <fieldset>
        <label>
          <input v-validate="'required|decimal:1'" name="totalDieselUse" type="text" v-model.number="inputs.totalDieselUse"/>
          L
        </label>
        <error-message v-if="errors.has('totalDieselUse')">Please enter a numeric value up to 1 decimal place</error-message>
      </fieldset>

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
            this.$emit('submit', this.inputs);
            return;
          }
          this.$emit('haserrors', this.inputs);
        });
      },
    },
    created: function () {
      //  Set the defaults (if specified)
      if (!this.inputs.hasOwnProperty('greenPowerPercentage')) {
        this.inputs.greenPowerPercentage = 0;
      }
    },
    props: ['inputs', 'awaitingAPIResponse'],
  }
</script>
