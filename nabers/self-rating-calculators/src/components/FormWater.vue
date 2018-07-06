<template>
  <div>
    <form @submit.prevent="validateBeforeSubmit">
      <div class="rating-data form-container">
        <div class="building-details">
          <h2>Building details</h2>
          <template>
            <h3>What is the floor space of the building?</h3>
            <fieldset>
              <label>
                <input v-validate="'required|decimal:2'" name="floorspace" type="text" v-model.number="inputs.floorspace"/>
                m<sup>2</sup>
              </label>
              <error-message  v-if="errors.has('floorspace')">Please enter a numeric value for floorspace</error-message>
              <small>Enter the total net lettable area of office space within the building.</small>
            </fieldset>
            <h3>How many hours per week is the building occupied?</h3>
            <fieldset>
              <label>
                <input v-validate="'required|integer'" name="hoursOccupiedPerWeek" type="text" v-model.number="inputs.hoursOccupiedPerWeek"/>
                hours
              </label>
              <error-message  v-if="errors.has('hoursOccupiedPerWeek')">Please enter a numeric value for hours</error-message>
              <small>Use the standard business hours of the building.</small>
            </fieldset>
          </template>
        </div>
      </div>
      <div class="water-use-data form-container">
        <div class="water-use ">
          <h2>Water use</h2>
          <h3>Total water consumption for 12 months</h3>
          <fieldset>
            <label>
              <input v-validate="'required|decimal:2'" name="totalWaterUse" type="text" v-model.number="inputs.totalWaterUse"/>
              kL
            </label>
            <error-message  v-if="errors.has('totalWaterUse')">Please enter a numeric value for the total water use</error-message>
            <small>Include mains and groundwater sources. Exclude rain water captured onsite.</small>
          </fieldset>

          <h3>What percentage of the total water consumption is externally supplied recycled water?</h3>
          <fieldset>
            <label>
              <input v-validate="'required|integer'" name="recycledWaterPercentage" type="text" v-model.number="calculateRecycledWater" class="half-width"/>
              %
            </label>
            <error-message  v-if="errors.has('recycledWaterPercentage')">Please enter the percentage of recycled water</error-message>
          </fieldset>
        </div>
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
      isHotel: function () {
        return this.buildingtype == 'hotel';
      },
    },
    created: function () {
      //  Set the defaults (if specified)
      if (!this.inputs.hasOwnProperty('recycledWaterPercentage')) {
        this.inputs.recycledWaterPercentage = 0;
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
    props: ['buildingtype', 'ratingscope', 'inputs', 'awaitingAPIResponse'],
  }
</script>
