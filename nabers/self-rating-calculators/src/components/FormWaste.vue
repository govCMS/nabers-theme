<template>
  <form @submit.prevent="validateBeforeSubmit">
    <div class="waste-types form-container">
      <h2>Waste types</h2>
      <h3>Select the waste types you’d like to enter data for.</h3>
      <p><small>You will need to enter the weight in kilograms for each waste type you select.</small></p>
      <div>
        <h4>
          <small>Don't have waste weights?</small>
          <ToolTip>
          <p>You can estimate weight with this formula:</p>
          <p>Total weight = bin count x bin volume x density</p>
          <p>If you don't know the density of each of your waste types, try a quick internet search for average waste densities.</p>
          </ToolTip>
        </h4>
      </div>
      <div class="waste-types-list">
        <!-- // Column One  -->
        <div class="radio-groups">
          <div v-for="(option, index, key) in wasteTypes" v-if="key < 8" class="radio-groups__group">
            <input :key="index" :id="index" type="checkbox" :value="index" v-model="selectedWasteTypes"/>
            <label :for="index">
              {{option}}
            </label>
          </div>
        </div>
        <!-- // Column Two  -->
        <div class="radio-groups">
          <div v-for="(option, index, key) in wasteTypes" v-if="key >= 8" class="radio-groups__group">
            <input :key="index" :id="index" type="checkbox" :value="index" v-model="selectedWasteTypes"/>
            <label :for="index">
              {{option}}
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="waste-weights form-container">
      <h2>Waste weights</h2>
      <div class="notes">
        Choose a period of time, and enter the total weight for each waste type during that period. The minimum amount of time recommended for a meaningful rating estimate is one month.
      </div>
      <template v-for="selectedOption in selectedWasteTypes">
        <template v-if="selectedOption != null">
          <h3>{{ wasteTypes[selectedOption] }}</h3>
          <fieldset>
            <label>
              <span>Total weight</span>
              <span class="input-with-suffix">
                <input v-validate="'integer'" :name="'tw_' + selectedOption" type="text" v-model="inputs.wasteWeights[selectedOption]"/> kg
              </span>
            </label>
            <error-message v-if="errors.has('tw_' + selectedOption)">Please enter a numeric value</error-message>
          </fieldset>
        </template>
      </template>
    </div>

    <div class="waste-contamination form-container" v-if="showContaminationSection()">
      <h2>Waste contamination</h2>
      <p><small>Some types of recyclable waste tend to have contamination. Contamination is taken into account when the NABERS rating is calculated.</small></p>
      <p><small>The average contamination rate is shown for each of your applicable waste types. If you’ve done a site audit to evaluate your contamination rates, please edit this data.</small></p>
      <template v-for="(wasteType, index) in wasteTypes">
        <template v-if="contaminableWasteTypes.indexOf(index) > -1 && selectedWasteTypes.indexOf(index) > -1 && inputs.wasteWeights[index] != ''">
          <fieldset>
            <h3>{{ wasteType }}</h3>
            <label>
              <span>Contamination rate</span>
              <span class="input-with-suffix">
                <input v-validate="'integer|max_value:100'" :name="'cr_' + index" type="text" v-model="inputs.wasteContaminationRates[index]"/> %
              </span>
            </label>
            <error-message v-if="errors.has('cr_' + index)">Please enter a valid percentage</error-message>
          </fieldset>
        </template>
      </template>
    </div>

    <submit-button  :awaitingAPIResponse="awaitingAPIResponse" />

  </form>
</template>

<script>
  import ToolTip from "./ToolTip"
  import ErrorMessage from "./elements/ErrorMessage"
  import wasteTypesMapping from "../services/wasteTypesMapping"
  import SubmitButton from "./elements/SubmitButton"

  export default {
    components: {
      ToolTip: ToolTip,
      "error-message": ErrorMessage,
      "submit-button": SubmitButton,
    },
    data: function () {
      return {
        selectedWasteTypes: [],
        wasteTypes: wasteTypesMapping,
        contaminableWasteTypes: [
          'mixed_recycling',
          'paper_and_cardboard',
          'cardboard_compacted',
          'cardboard',
          'paper',
          'organics',
          'glass',
          'soft_plastics',
          'polystyrene'
        ],
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
      showContaminationSection(){
        let show = false;
        const self = this;
        show = self.selectedWasteTypes.some(function (item) {
          return self.contaminableWasteTypes.indexOf(item) > -1
        })
        return show
      },
      setInputDefault(property, value) {
        if (!this.inputs.hasOwnProperty(property)) {
          this.$set(this.inputs, property, value);
        }
      },
    },
    created: function () {
      this.setInputDefault('wasteWeights', {});
      this.setInputDefault('wasteContaminationRates', {
        'mixed_recycling': 30,
        'paper_and_cardboard': 5,
        'cardboard_compacted': 2,
        'cardboard': 2,
        'paper': 5,
        'organics': 2,
        'glass': 2,
        'soft_plastics': 2,
        'polystyrene': 2
      });

      //  Set the defaults (if specified)
      for (var property in this.wasteTypes) {
        if (this.wasteTypes.hasOwnProperty(property)) {
          this.$set(this.inputs.wasteWeights, property, '');
        }
      }
    },
    props: ['ratingscope', 'inputs', 'awaitingAPIResponse'],
  }
</script>
