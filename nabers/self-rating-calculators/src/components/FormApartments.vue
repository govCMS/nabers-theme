<template>
  <form @submit.prevent="validateBeforeSubmit">
    <div class="rating-data">
      <div class="building-details  form-container">
        <h2>Strata scheme details</h2>
        <h3>How many apartments are there in the strata scheme?</h3>
        <fieldset>
          <label>
            <input v-validate="'required|integer'" name="numApartments" type="text" v-model.number="inputs.numApartments"/>
            apartments
          </label>
          <error-message  v-if="errors.has('numApartments')">Please enter a numeric value for how many apartments</error-message>
        </fieldset>
        <p><small>There are three categories of {{ratingtype == 'water' ? 'water servicing' : 'air conditioning'}} in apartments. Enter numbers below to show how many of your apartments fall in each category.</small></p>
        <div :class="{ 'error-message error-message--inline-block': showApartmentSumError === true }">
          <p><small>The sum of the numbers entered here must be equal to your total number of apartments.</small></p>
        </div>
        <fieldset>
          <label>
            <input v-validate="'required|integer'" name="numCategoryOne" type="text" v-model.number="inputs.numCategoryOne"/>
            <template v-if="isWater()">
              apartments do not have a water meter. Their entire water use is paid for by the body corporate.
            </template>
            <template v-else>
              apartments are centrally air conditioned. <ToolTip>An apartment is centrally air conditioned if energy consumption for both heating and cooling is paid for by the body corporate.</ToolTip>
            </template>
          </label>
          <error-message  v-if="errors.has('numCategoryOne')">Please enter a numeric value</error-message>
        </fieldset>

        <fieldset>
          <label>
            <input v-validate="'required|integer'" name="numCategoryTwo" type="text" v-model.number="inputs.numCategoryTwo"/>
            <template v-if="isWater()">
              apartments have their own cold water meter. The body corporate supplies and pays for their hot water.
            </template>
            <template v-else>
              apartments are condenser water serviced. <ToolTip>An apartment is condenser water serviced if it is connected to a central condenser water system, but the body corporate does not pay for energy consumed by air conditioners in apartments.</ToolTip>
            </template>
          </label>
          <error-message  v-if="errors.has('numCategoryTwo')">Please enter a numeric value</error-message>
        </fieldset>

        <fieldset>
          <label>
            <input v-validate="'required|integer'" name="numCategoryThree" type="text" v-model.number="inputs.numCategoryThree"/>
            <template v-if="isWater()">
              apartments have their own water meter. No hot or cold water use is paid for by the body corporate.
            </template>
            <template v-else>
              apartments have no central air conditioning.
            </template>
          </label>
          <error-message  v-if="errors.has('numCategoryThree')">Please enter a numeric value</error-message>
        </fieldset>
        <template v-if="isWater()">
          <h3>How many apartments have central air conditioning?</h3>
          <fieldset>
            <label>
              <input v-validate="'required|integer'" name="numAirConApartments" type="text" v-model.number="inputs.numAirConApartments"/>
              apartments
            </label>
            <error-message  v-if="errors.has('numAirConApartments')">Please enter a numeric value for how many apartments have central air conditioning</error-message>
            <small>Include both centrally air-conditioned and condenser water serviced apartments.</small>
          </fieldset>
        </template>

        <template v-if="isEnergy()">
          <h3>Does the strata scheme have a lift?</h3>
          <fieldset role="radiogroup">
            <div class="radio-groups" role="group">
              <div class="radio-groups__group">
                <input role="radio" name="strataHasLift" type="radio" id="yesLift" v-model="inputs.strataHasLift" value="yes"/>
                <label for="yesLift">Yes</label>
              </div>
              <div class="radio-groups__group">
                <input role="radio" name="strataHasLift" type="radio" id="noLift" v-model="inputs.strataHasLift" value="no"/>
                <label for="noLift">No</label>
              </div>
              <error-message  v-if="errors.has('strataHasLift')">Please specify if the strata scheme has a lift</error-message>
            </div>
          </fieldset>

          <h3>Does the strata scheme have a pool?</h3>
          <fieldset role="radiogroup">
            <div class="radio-groups" role="group">
              <div class="radio-groups__group">
                <input role="radio" name="strataHasPool" type="radio" id="heatedPool" v-model="inputs.strataHasPool" value="heated"/>
                <label for="heatedPool">Heated pool</label>
              </div>
              <div class="radio-groups__group">
                <input role="radio" name="strataHasPool" type="radio" id="unheatedPool" v-model="inputs.strataHasPool" value="unheated"/>
                <label for="unheatedPool">Unheated pool</label>
              </div>
              <div class="radio-groups__group">
                <input role="radio" name="strataHasPool" type="radio" id="noPool" v-model="inputs.strataHasPool" value="no"/>
                <label for="noPool">No pool</label>
              </div>
              <error-message  v-if="errors.has('strataHasPool')">Please specify if the strata scheme has a pool</error-message>
            </div>
          </fieldset>

          <h3>Does the strata scheme have a gym?</h3>
          <fieldset role="radiogroup">
            <div class="radio-groups" role="group">
              <div class="radio-groups__group">
                <input role="radio" name="strataHasGym" type="radio" id="yesGym" v-model="inputs.strataHasGym" value="yes"/>
                <label for="yesGym">Yes</label>
              </div>
              <div class="radio-groups__group">
                <input role="radio" name="strataHasGym" type="radio" id="noGym" v-model="inputs.strataHasGym" value="no"/>
                <label for="noGym">No</label>
              </div>
              <error-message  v-if="errors.has('strataHasGym')">Please specify if the strata scheme has a gym</error-message>
            </div>
          </fieldset>

          <h3>Enter the number of car parking spaces in the strata scheme</h3>
          <fieldset>
            <label>
              <input v-validate="'required|integer'" name="mechanicallyVentilatedCarSpaces" type="text" v-model.number="inputs.mechanicallyVentilatedCarSpaces"/>
              mechanically ventilated car spaces.
            </label>
            <error-message  v-if="errors.has('mechanicallyVentilatedCarSpaces')">Please enter a numeric value for the number of mechanically ventilated car spaces</error-message>
          </fieldset>
          <fieldset>
            <label>
              <input v-validate="'required|integer'" name="naturallyVentilatedCarSpaces" type="text" v-model.number="inputs.naturallyVentilatedCarSpaces"/>
              naturally ventilated car spaces.
            </label>
            <error-message  v-if="errors.has('naturallyVentilatedCarSpaces')">Please enter a numeric value for the number of naturally ventilated car spaces</error-message>
          </fieldset>

        </template>
      </div>

      <div v-if="isWater()" class="water-use-data form-container">
        <div class="water-use ">
          <h2>Water use</h2>
          <h3>Total water consumption for 12 months</h3>
          <fieldset>
            <label>
              <input v-validate="'required|decimal:1'" name="totalWaterUse" type="text" v-model.number="inputs.totalWaterUse"/>
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
            <error-message  v-if="errors.has('recycledWaterPercentage')">Please enter a numeric value up to 1 decimal place</error-message>
          </fieldset>
        </div>
      </div>

      <div v-else-if="isEnergy()" class="energy-details form-container">
        <h2>Energy use</h2>
        <div class="notes">
          The data you enter here must be based on one 12 month period.
        </div>
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
            <input v-validate="'required|decimal:1|max_value:100'" name="greenPowerPercentage" type="text" v-model.number="inputs.greenPowerPercentage" class="half-width"/>
            %
          </label>
          <error-message  v-if="errors.has('greenPowerPercentage')">Please enter a numeric value up to 1 decimal place</error-message>
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
        showApartmentSumError: false,
        recycledPercent: 0
      };
    },
    methods: {
      validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            if (!this.validSumOfApartments()) {
              this.showApartmentSumError = true;
              this.$emit('haserrors', this.inputs);
              return;
            }
            else {
              this.showApartmentSumError = false;
              this.$emit('submit', this.inputs);
              return;
            }
          }
          this.$emit('haserrors', this.inputs);
        });
      },
      validSumOfApartments() {
        return this.inputs.numApartments == (
          this.inputs.numCategoryOne
          + this.inputs.numCategoryTwo
          + this.inputs.numCategoryThree);
      },
      isWater() {
        return this.ratingtype == 'water';
      },
      isEnergy() {
        return this.ratingtype == 'energy';
      },
      setInputDefault(property, value) {
        if (!this.inputs.hasOwnProperty(property)) {
          this.inputs[property] = value;
        }
      },
    },
    created: function () {
      //  Set the defaults (if specified)
      this.setInputDefault('numCategoryOne', 0);
      this.setInputDefault('numCategoryTwo', 0);
      this.setInputDefault('numCategoryThree', 0);

      if (this.isWater()) {
        this.setInputDefault('recycledWaterPercentage', 0);
      }
      else if (this.isEnergy()) {
        this.setInputDefault('greenPowerPercentage', 0);
        this.setInputDefault('numMechanicallyVentilated', 0);
        this.setInputDefault('numNaturallyVentilated', 0);
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
    props: ['ratingtype', 'ratingscope', 'inputs', 'awaitingAPIResponse'],
  }
</script>
