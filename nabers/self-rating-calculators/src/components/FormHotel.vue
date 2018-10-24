<template>
  <form @submit.prevent="validateBeforeSubmit">
    <div class="rating-data form-container">
      <div class="building-details">
        <h2>Building details</h2>
        <h3>What is the quality star rating of the hotel? <ToolTip><p>A wide range of services, features and facilities correlate with the hotel quality star rating, so it is very important in determining energy and water consumption.</p></ToolTip></h3>
        <fieldset>
          <div class="select-field">
            <select v-validate="'required'" name="qualityStarRating" v-model="inputs.qualityStarRating">
              <option value="">Select from drop-down</option>
              <option value="2">2</option>
              <option value="2.5">2.5</option>
              <option value="3">3</option>
              <option value="3.5">3.5</option>
              <option value="4">4</option>
              <option value="4.5">4.5</option>
              <option value="5">5</option>
            </select>
          </div>
          <error-message  v-if="errors.has('qualityStarRating')">Please select a value for quality star rating of the hotel</error-message>
          <small>Use the Star Ratings Australia hotel quality star rating.</small>
        </fieldset>
        <h3>How many rooms are there in the hotel?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|integer'" name="numberOfRooms" type="text" v-model.number="inputs.numberOfRooms"/>
            rooms
          </label>
          <error-message  v-if="errors.has('numberOfRooms')">Please enter a numeric value for number of rooms</error-message>
        </fieldset>
        <h3>How many rooms receive full service laundering on-site?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|integer'" name="roomsFullService" type="text" v-model.number="inputs.roomsFullService"/>
            rooms
          </label>
          <error-message  v-if="errors.has('roomsFullService')">Please enter a numeric value</error-message>
          <small>Full service laundering includes both towels and linen. If some laundering is sent off-site, adjust the number accordingly.</small>
        </fieldset>

        <h3>How many function room seats are there in the hotel?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|integer'" name="functionRoomSeats" type="text" v-model.number="inputs.functionRoomSeats"/>
            seats
          </label>
          <error-message  v-if="errors.has('functionRoomSeats')">Please enter a numeric value for number of function room seats</error-message>
          <small>Enter the maximum capacity of function and meeting rooms that are used at least once a week.</small>
        </fieldset>

        <template v-if="ratingtype == 'energy'">
          <h3>What is the total surface area of heated pools?</h3>
          <fieldset>
            <label>
              <input v-validate="'required|decimal:1'" name="surfaceAreaHeatedPools" type="text" v-model.number="inputs.surfaceAreaHeatedPools"/>
              m<sup>2</sup>
            </label>
            <error-message  v-if="errors.has('surfaceAreaHeatedPools')">Please enter a numeric value up to 1 decimal place</error-message>
            <small>A pool is ‘heated’ if it is heated for at least 6 months a year.</small>
          </fieldset>
        </template>
      </div>
    </div>
      <div v-if="ratingtype == 'energy'" class="energy-details form-container">
        <h2>Energy use</h2>
        <h3>Total electricity use for 12 months</h3>
        <fieldset>
          <label>
            <input v-validate="'required|decimal:1'" name="totalElectricityUse"  type="text" v-model.number="inputs.totalElectricityUse"/>
            kWh
          </label>
          <error-message  v-if="errors.has('totalElectricityUse')">Please enter a numeric value up to 1 decimal place</error-message>
        </fieldset>

        <h3>What percentage of the total electricity use is GreenPower?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|decimal:1'" name="greenPowerPercentage" type="text" v-model.number="inputs.greenPowerPercentage"/>
            %
          </label>
          <error-message  v-if="errors.has('greenPowerPercentage')">Please enter a numeric value up to 1 decimal place</error-message>
          <small>Enter the percentage of accredited GreenPower shown on your electricity bill.</small>
        </fieldset>

        <h3>Total natural gas use for 12 months</h3>
        <fieldset>
          <label>
            <input v-validate="'required|decimal:1'" name="totalNaturalGas"  type="text" v-model.number="inputs.totalNaturalGas"/>
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

      <div v-else-if="ratingtype == 'water'" class="water-use form-container">
        <h2>Water use</h2>
        <h3>Total water consumption for 12 months</h3>
        <fieldset>
          <label>
            <input v-validate="'required|decimal:1'" name="totalWaterUse"  type="text" v-model.number="inputs.totalWaterUse"/>
            kL
          </label>
          <error-message  v-if="errors.has('totalWaterUse')">Please enter a numeric value up to 1 decimal place</error-message>
          <small>Include mains and groundwater sources. Exclude rain water captured onsite.</small>
        </fieldset>

        <h3>What percentage of the total water consumption is externally supplied recycled water?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|decimal:1|max_value:100'" name="recycledWaterPercentage" type="text" v-model.number="calculateRecycledWater"/>
            %
          </label>
          <error-message  v-if="errors.has('recycledWaterPercentage')">Please enter a numeric value up to 1 decimal place</error-message>
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
    data: function () {
      return {
        recycledPercent: 0
      }
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
    created: function() {
      //  Set the defaults (if specified)
      if (!this.inputs.hasOwnProperty('recycledWaterPercentage')) {
        this.inputs.recycledWaterPercentage = 0;
      }
      if (!this.inputs.hasOwnProperty('greenPowerPercentage')) {
        this.inputs.greenPowerPercentage = 0;
      }
      if (!this.inputs.hasOwnProperty('qualityStarRating')) {
        this.inputs.qualityStarRating = '';
      }
    },
    computed: {
      calculateRecycledWater: {
        get: function () {
          return this.recycledPercent
        },
        set: function (value) {
          this.inputs.recycledWaterPercentage = (value / 100) * this.inputs.totalWaterUse
          this.recycledPercent = value
        }
      }
    },
    props: ['buildingtype', 'ratingtype', 'inputs', 'awaitingAPIResponse'],
  }
</script>
