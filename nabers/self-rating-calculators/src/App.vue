<template>
  <div class="self-rating-calculators">
    <div class="form-pages-list">
      <ul>
        <li :class="{ 'current first-step': currentStep == 1 }">
          <h3>Step 1</h3>Rating details
        </li>
        <template v-if="currentStep > 1">
          <li :class="{ current: currentStep == 2 }">
            <h3>Step 2</h3>Enter data
          </li>
          <template v-if="isRatingType('indoor_environment') && !isRatingScope('base_building')">
            <li :class="{ current: currentStep == 3 }">
              <h3>Step 3</h3>Occupant survey
            </li>
            <li :class="{ current: currentStep == 4 }">
              <h3>Step 4</h3>Results
            </li>
          </template>
          <template v-else>
            <li :class="{ current: currentStep == 3 }">
              <h3>Step 3</h3>Results
            </li>
          </template>
        </template>
      </ul>
    </div>
    <template v-if="currentStep === 2">
      <!-- Show  notes above the form in step 2 only. -->
      <!--  //  Energy - Data centre - IT equipment -->
      <div class="notes">
        <template v-if="isRatingScope('it_equipment')">
          The data you enter here should be based on a period of approximately one month.
        </template>
        <template v-else-if="isBuildingType('apartment_building')">
          This rating type assesses the {{ form.ratingType }} use of common property in a strata scheme. It doesn't include the {{ form.ratingType }} used within individual apartments.
        </template>
        <template v-else-if="isRatingType('indoor_environment')">
          Average data for office buildings is shown here. Edit the data to create your own rating.
        </template>
        <template v-else-if="!isRatingType('waste')">
          The data you enter here must be based on a 12 month period.
        </template>
      </div>
    </template>
    <div v-if="showGlobalError" class="error-message error-message--global">
      <p>{{ errorMessage }}</p>
    </div>
    <div v-if="!apiStatus" class="error-message error-message--global">
      <p>Sorry, this service is down while we fix some issues. We'll be back asap!</p>
    </div>
    <template v-if="currentStep === 1">
      <RatingDetails :form="form"></RatingDetails>
      <div class="action-buttons">
        <button @click.prevent="nextStep()" class="button">
          <loader-spinner v-if="awaitingAPIResponse !== false">Validating</loader-spinner>
          <template v-else>Continue to rating data<i class="icon-next"></i></template>
        </button>
      </div>
    </template>
    <template v-if="currentStep === 2">
      <template v-if="form.ratingType == 'energy'">
        <form-office-energy v-if="form.buildingType == 'office'" :ratingscope="form.ratingScope" :inputs="inputs" @submit="process($event)" @haserrors="hasErrors()" :awaitingAPIResponse="awaitingAPIResponse"></form-office-energy>
        <form-data-centre-energy v-if="form.buildingType == 'data_centre'" :ratingscope="form.ratingScope" :inputs="inputs" @submit="process($event)" @haserrors="hasErrors()"  :awaitingAPIResponse="awaitingAPIResponse"></form-data-centre-energy>
        <form-shopping-centre-energy v-if="form.buildingType == 'shopping_centre'" :inputs="inputs" @submit="process($event)" @haserrors="hasErrors()" :awaitingAPIResponse="awaitingAPIResponse"></form-shopping-centre-energy>
        <form-apartments v-else-if="isBuildingType('apartment_building')" :ratingtype="form.ratingType" :ratingscope="form.ratingScope" :inputs="inputs" @submit="process($event)" @haserrors="hasErrors()" :awaitingAPIResponse="awaitingAPIResponse"></form-apartments>
        <form-hotel v-if="form.buildingType == 'hotel'" :ratingtype="form.ratingType" :inputs="inputs" @submit="process($event)" @haserrors="hasErrors()" :awaitingAPIResponse="awaitingAPIResponse"></form-hotel>
      </template>

      <template v-if="form.ratingType == 'water'">
        <form-hotel v-if="form.buildingType == 'hotel'" :ratingtype="form.ratingType" :inputs="inputs" @submit="process($event)" @haserrors="hasErrors()" :awaitingAPIResponse="awaitingAPIResponse"></form-hotel>
        <form-shopping-centre-water v-else-if="form.buildingType == 'shopping_centre'" :ratingtype="form.ratingType" :inputs="inputs" @submit="process($event)" @haserrors="hasErrors()" :awaitingAPIResponse="awaitingAPIResponse"></form-shopping-centre-water>
        <form-apartments v-else-if="isBuildingType('apartment_building')" :ratingtype="form.ratingType" :ratingscope="form.ratingScope" :inputs="inputs" @submit="process($event)" @haserrors="hasErrors()" :awaitingAPIResponse="awaitingAPIResponse"></form-apartments>
        <form-water v-else :buildingtype="form.buildingType" :ratingscope="form.ratingScope" :inputs="inputs" @submit="process($event)" @haserrors="hasErrors()" :awaitingAPIResponse="awaitingAPIResponse"></form-water>
      </template>

      <template v-if="form.ratingType == 'waste'">
        <form-waste :ratingscope="form.ratingScope" :inputs="inputs" @submit="process($event)" @haserrors="hasErrors()" :awaitingAPIResponse="awaitingAPIResponse"></form-waste>
      </template>

      <template v-if="form.ratingType == 'indoor_environment' && form.buildingType == 'office'">
        <form-office-indoor :step="currentStep" :ratingscope="form.ratingScope" :inputs="inputs" @submit="process($event)" @haserrors="hasErrors()" :awaitingAPIResponse="awaitingAPIResponse"></form-office-indoor>
      </template>
      <div class="action-buttons">
        <button @click.prevent="prevStep()" class="action-button  action-button--back-to">Back to rating details</button>
      </div>
    </template>

    <template v-if="currentStep > 2">
      <template v-if="isRatingType('indoor_environment') && !isRatingScope('base_building') && currentStep == 3">
        <form-office-indoor :step="currentStep" :ratingscope="form.ratingScope" :inputs="inputs" @submit="process($event)" @haserrors="hasErrors()" :awaitingAPIResponse="awaitingAPIResponse"></form-office-indoor>
        <div class="action-buttons">
          <button @click.prevent="prevStep()" class="action-button action-button--back-to">Back to rating data</button>
        </div>
      </template>
      <template v-else>
        <RatingResults :selection="form" :inputs="inputs" :results="results"></RatingResults>
        <div class="action-buttons">
          <button @click.prevent="prevStep()" class="action-button action-button--back-to">
            <template v-if="isRatingType('indoor_environment') && !isRatingScope('base_building')">Back to occupant survey</template>
            <template v-else>Back to rating data</template>
          </button>
          <button @click.prevent="resetForm()" class="action-button action-button--restart">Estimate another rating</button>
        </div>
      </template>
    </template>

  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import VeeValidate from 'vee-validate';
  import RatingDetails from './components/RatingDetails'
  import RatingResults from './components/RatingResults'
  import FormOfficeEnergy from './components/FormOfficeEnergy';
  import FormOfficeIndoorEnvironment from './components/FormOfficeIndoorEnvironment';
  import FormDataCentreEnergy from './components/FormDataCentreEnergy';
  import FormWater from './components/FormWater';
  import FormHotel from './components/FormHotel';
  import FormShoppingCentreWater from './components/FormShoppingCentreWater';
  import FormShoppingCentreEnergy from './components/FormShoppingCentreEnergy';
  import FormApartments from './components/FormApartments';
  import FormWaste from './components/FormWaste';
  import LoaderSpinner from "./components/elements/LoaderSpinner"

  import Results from './services/Results'
  import apiHelper from './services/apiHelper'

  Vue.use(VeeValidate);

  function defaultErrorMessage(){
    return 'You need to fill out all of the fields to continue';
  }

  function initialState() {
    return {
      currentStep: 1,
      form: {
        ratingType: null,
        buildingType: null,
        ratingScope: null,
        postcode: null,
      },
      workflow: null,
      apiStatus: true,
      previousWorkflow: null,
      inputs: {},
      results: new Results(),
      showGlobalError: false,
      errorMessage: '',
      isValidPostcode: false,
      awaitingAPIResponse: false
    }
  }

  export default {
    name: 'Calculator',
    components: {
      RatingDetails: RatingDetails,
      RatingResults: RatingResults,
      'form-office-energy': FormOfficeEnergy,
      'form-office-indoor': FormOfficeIndoorEnvironment,
      'form-data-centre-energy': FormDataCentreEnergy,
      'form-water': FormWater,
      'form-hotel': FormHotel,
      'form-shopping-centre-water': FormShoppingCentreWater,
      'form-shopping-centre-energy': FormShoppingCentreEnergy,
      'form-apartments': FormApartments,
      'form-waste': FormWaste,
      'loader-spinner': LoaderSpinner,
    },
    data: function () {
      return initialState();
    },
    methods: {
      resetForm() {
        Object.assign(this.$data, initialState())
        this.scrollToTop();
      },
      clearInputs() {
        this.inputs = {};
      },
      prevStep() {
        this.currentStep--;
        this.showGlobalError = false;
        this.scrollToTop();
      },
      empty(value) {
        return value == '' || value == null ? true : false;
      },
      validatePostcodeValue(value){
        // Check postcode is 4 digits.
        const re = /\b\d{4}\b/;
        return re.test(value);
      },
      step1Valid() {
        var valid = true;
        this.errorMessage = defaultErrorMessage();
        if (this.empty(this.form.ratingType)
          || this.empty(this.form.buildingType)
          || (!this.isRatingType('indoor_environment') && this.empty(this.form.postcode))
        ) {
          valid = false;
        }
        //  Only Office & Data centre require a rating scope
        else if (['office','data_centre'].indexOf(this.form.buildingType) > -1
          && this.empty(this.form.ratingScope)
        ) {
          valid = false;
        }
        else if (!this.isRatingType('indoor_environment') && !this.validatePostcodeValue(this.form.postcode)) {
          this.errorMessage = 'Postcode must be four digits';
          valid = false;
        }
        return valid;
      },
      nextStep() {
        if (this.currentStep === 1 && !this.step1Valid()) {
          this.showGlobalError = true;
          this.scrollToTop();
          return;
        }
        else if (this.shouldValidatePostcode()) {
          // Hide any error message from the previous step.
          this.showGlobalError = false;
          // Validate postcode from the api.
          apiHelper.validatePostcode(this.form.postcode).then(response => {
            if (response === true) {
              this.isValidPostcode = true
              this.nextStep()
            }
            else {
              this.showGlobalError = true;
              this.errorMessage = 'Please enter a valid Australian postcode.'
              this.scrollToTop()
              return;
            }
          }).catch(e => {
            console.log(e)
            return;
          })
        }
        else {
          this.showGlobalError = false;
          this.trackWorkflow();
          this.currentStep++;
          this.scrollToTop();
        }
      },
      trackWorkflow() {
        //  A common object `inputs` is used to receive and process entries from each of the different forms
        //  When switching to a different workflow, the inputs from previous forms need to be cleared, but
        //  when navigation back & forth without changing the workflow, the inputs must be retained..
        this.workflow = this.form.ratingType + this.form.buildingType + this.form.ratingScope;
        if (this.previousWorkflow == null
          || this.workflow !== this.previousWorkflow
        ) {
          this.previousWorkflow = this.workflow;
          this.clearInputs();
        }
      },
      scrollToTop() {
        var formTop = jQuery(".form-pages-list");
        var $stickyHeader = jQuery(".header__inner");
        var stickyHeaderOffset = 0;
        if ($stickyHeader.length > 0) {
          stickyHeaderOffset = $stickyHeader.outerHeight(true);
        }
        jQuery('html,body').animate({scrollTop: formTop.offset().top - stickyHeaderOffset}, "fast");
      },
      hasErrors() {
        this.showGlobalError = true;
        this.errorMessage = defaultErrorMessage();
        this.scrollToTop();
      },
      process: function(inputs) {
        this.inputs = inputs;
        this.showGlobalError = false;
        if (this.isRatingType('indoor_environment')
          && !this.isRatingScope('base_building')
          && this.currentStep === 2
        ) {
          this.nextStep();
          return;
        }
        //  Combine Rating Type + Building Type + Rating Scope + Postcode + form inputs
        var payload = {
          ratingtype: this.form.ratingType,
          buildingtype: this.form.buildingType,
          ratingscope: this.form.ratingScope,
          postcode: this.form.postcode,
          data: inputs
        };
        this.results.payload = payload;
        this.results.getResults().then(response =>{
          this.currentStep++;
          this.scrollToTop();
        }).catch(e =>{
          console.log(e);
        });
      },
      isBuildingType(value) {
        return this.form.buildingType == value;
      },
      isRatingScope(value) {
        return this.form.ratingScope == value;
      },
      isRatingType(value) {
        return this.form.ratingType == value;
      },
      isFourSteps() {
        return (this.form.ratingType == 'indoor_environment'
          && (this.form.ratingScope == 'whole_building' || this.form.ratingScope == 'tenancy'));
      },
      shouldValidatePostcode () {
        return this.currentStep === 1
          && this.step1Valid()
          && !this.isValidPostcode
          && !this.isRatingType('indoor_environment')
      }
    },
    mounted: function () {
      var self = this;

      // Add request interceptor to add loader
      // spinner.
      axios.interceptors.request.use(function (config) {
        if(typeof config['showLoader'] !== 'undefined') {
          self.awaitingAPIResponse = 'show';
        }
        return config
      }, function (error) {
        return Promise.reject(error);
      });

      // Add response interceptor to remove loader
      // spinner.
      axios.interceptors.response.use(function (response) {
        self.awaitingAPIResponse = false;
        return response
      }, function (error) {
        return Promise.reject(error);
      });
      // Check the API status and disable the inputs
      // if it is not available.
      apiHelper.checkAPIStatus().then(response =>{
        this.apiStatus = response
        const inputs = this.$el.querySelectorAll('input, button')
        inputs.forEach(function(item){
          item.disabled = !response
        })
      });
    },
    watch: {
      // Force re-validating postcode whenever
      // it's changed.
      'form.postcode': function (val, oldVal) {
        this.isValidPostcode = false;
      }
    },
  }
</script>
<style lang="scss">
  .self-rating-calculators {
    padding: 30px 0;
  }
</style>