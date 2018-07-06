<template>
  <div class="rating-data">
    <form @submit.prevent="validateBeforeSubmit">
      <div class="building-details form-container">
        <h2>Building details</h2>
        <h3>What is the total Gross Lettable Area Retail (GLAR) of the shopping centre?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|integer'" name="grossLettableAreaRetail" type="text" v-model.number="inputs.grossLettableAreaRetail"/>
            m<sup>2</sup>
          </label>
          <error-message  v-if="errors.has('grossLettableAreaRetail')">Please enter a numeric value for the total Gross Lettable Area Retail (GLAR)</error-message>
        </fieldset>
        <h3>How many food court seats are there within the shopping centre?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|integer'" name="foodCourtSeats" type="text" v-model.number="inputs.foodCourtSeats"/>
            seats
          </label>
          <error-message  v-if="errors.has('foodCourtSeats')">Please enter a numeric value for number of food court seats</error-message>
          <small>Enter the amount of seats that are located in areas adjacent to more than one food outlet, and intended for use by the customers of multiple food outlets.</small>
        </fieldset>
        <h3>How many cinema theatrettes are there within the shopping centre?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|integer'" name="cinemaTheatrettes" type="text" v-model.number="inputs.cinemaTheatrettes"/>
            theatrettes
          </label>
          <error-message  v-if="errors.has('cinemaTheatrettes')">Please enter a numeric value for number of cinema theatrettes</error-message>
        </fieldset>
        <h3>What is the total area of all gymnasiums within the shopping centre?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|integer'" name="totalAreaGymnasiums" type="text" v-model.number="inputs.totalAreaGymnasiums"/>
            m<sup>2</sup>
          </label>
          <error-message  v-if="errors.has('totalAreaGymnasiums')">Please enter a numeric value for total area of all gymnasiums</error-message>
        </fieldset>


        <template v-if="ratingtype == 'energy'">
          <h3>What is the total surface area of heated pools?</h3>
          <fieldset>
            <label>
              <input v-validate="'required|integer'" name="surfaceAreaHeatedPools" type="text" v-model.number="inputs.surfaceAreaHeatedPools"/>
              m<sup>2</sup>
            </label>
            <error-message  v-if="errors.has('surfaceAreaHeatedPools')">Please enter a numeric value for total surface area of heated pools</error-message>
            <small>A pool is ‘heated’ if it is heated for at least 6 months a year.</small>
          </fieldset>
        </template>
      </div>

      <div class="water-use form-container">
        <h2>Water use</h2>
        <h3>Total water consumption for 12 months</h3>
        <fieldset>
          <label>
            <input v-validate="'required|decimal:2'" name="totalWaterUse"  type="text" v-model.number="inputs.totalWaterUse"/>
            kL
          </label>
          <error-message  v-if="errors.has('totalWaterUse')">Please enter a numeric value for the total water use</error-message>
          <small>Include mains and groundwater sources. Exclude rain water captured onsite.</small>
        </fieldset>

        <h3>What percentage of the total water consumption is externally supplied recycled water?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|integer'" name="recycledWaterPercentage" type="text" v-model.number="calculateRecycledWater"/>
            %
          </label>
          <error-message  v-if="errors.has('recycledWaterPercentage')">Please enter the percentage of recycled water</error-message>
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
      if (!this.inputs.hasOwnProperty('cinemaTheatrettes')) {
        this.inputs.cinemaTheatrettes = 0;
      }
      if (!this.inputs.hasOwnProperty('totalAreaGymnasiums')) {
        this.inputs.totalAreaGymnasiums = 0;
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
    props: ['ratingtype', 'inputs', 'awaitingAPIResponse'],
  }
</script>
