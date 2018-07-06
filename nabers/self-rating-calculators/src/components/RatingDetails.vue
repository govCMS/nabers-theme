<template>
  <form>
    <div class="rating-details form-container">
      <h2>Rating details</h2>
      <h3>What type of rating would you like to estimate?</h3>
      <fieldset role="radiogroup">
        <div class="radio-groups" role="group">
          <div class="radio-groups__group">
            <input role="radio" name="ratingType" type="radio" id="energy" v-model="form.ratingType" value="energy"/>
            <label for="energy">Energy</label>
          </div>
          <div class="radio-groups__group">
            <input role="radio" name="ratingType" type="radio" id="water" v-model="form.ratingType" value="water"/>
            <label for="water">Water</label>
          </div>
          <div class="radio-groups__group">
            <input role="radio" name="ratingType" type="radio" id="waste" v-model="form.ratingType" value="waste"/>
            <label for="waste">Waste</label>
          </div>
          <div class="radio-groups__group">
            <input role="radio" name="ratingType" type="radio" id="indoor_environment" v-model="form.ratingType" value="indoor_environment"/>
            <label for="indoor_environment">Indoor environment</label>
          </div>
        </div>
      </fieldset>
      <h3>What type of building?</h3>
      <fieldset role="radiogroup">
        <div class="radio-groups" role="group">
          <div class="radio-groups__group">
            <input role="radio" name="buildingType" type="radio" id="office" v-model="form.buildingType" value="office"/>
            <label for="office">Office</label>
          </div>
          <template v-if="[null, 'energy', 'water'].indexOf(form.ratingType) > -1">
            <div class="radio-groups__group">
              <input role="radio" name="buildingType" type="radio" id="hotel" v-model="form.buildingType" value="hotel"/>
              <label for="hotel">Hotel</label>
            </div>
            <div class="radio-groups__group">
              <input role="radio" name="buildingType" type="radio" id="shopping_centre" v-model="form.buildingType" value="shopping_centre"/>
              <label for="shopping_centre">Shopping centre</label>
            </div>
            <template v-if="[null, 'energy'].indexOf(form.ratingType) > -1">
              <div class="radio-groups__group">
                <input role="radio" name="buildingType" type="radio" id="data_centre" v-model="form.buildingType" value="data_centre"/>
                <label for="data_centre">Data centre</label>
              </div>
            </template>
            <!--- Apartment building type is disabled for now until its rating calculation is added to the api.
            <div class="radio-groups__group" v-if="[null, 'energy', 'water'].indexOf(form.ratingType) > -1">
              <input role="radio" name="buildingType" type="radio" id="apartment_building" v-model="form.buildingType" value="apartment_building"/>
              <label for="apartment_building">Apartment building</label>
            </div>
            -->
          </template>
        </div>
      </fieldset>

      <template v-if="isBuildingType('office') || isBuildingType('data_centre')">
      <h3>What is the scope of your rating?
        <ToolTip v-if="form.buildingType == 'office'">
          <template v-if="isRatingType('energy') || isRatingType('water')">
            <p><strong>Base building</strong> assesses the central services of an office building. For example: lifts and common area lighting.</p>
            <p><strong>Whole building</strong> assesses the combined impact of office tenancies and base building services.</p>
            <p v-if="!isWater()"><strong>Tenancy</strong> assesses office tenancies. It doesn't include base building services.</p>
          </template>
          <template v-if="isRatingType('waste')">
            <p><strong>Base building</strong> assesses the central services of an office building. This does not include waste managed by office tenancies.</p>
            <p><strong>Whole building</strong> assesses the combined impact of waste managed by central services and office tenancies.</p>
          </template>
          <template v-if="isRatingType('indoor_environment')">
            <p><strong>Base building</strong> covers all office spaces within a building. It measures parameters that are under the control of the landlord.</p>
            <p><strong>Whole building</strong> measures all factors included in tenancy and base building ratings.</p>
            <p><strong>Tenancy</strong> covers a space that is occupied by a single tenant and under the control of that tenant.</p>
          </template>
        </ToolTip>
        <ToolTip v-else-if="form.buildingType == 'data_centre'">
          <p><strong>IT equipment</strong> assesses the impact of energy consumed by data centre IT equipment. It does not include any other infrastructure.</p>
          <p><strong>Whole facility</strong> assesses the combined impact of IT equipment and data centre infrastructure (e.g. air-conditioning and lighting).</p>
          <p><strong>Infrastructure</strong> assesses the impact of data centre infrastructure services. This includes air-conditioning and lighting, and power conditioning, distribution and back-up.</p>
        </ToolTip>
      </h3>
        <fieldset role="radiogroup">
        <div class="radio-groups" role="group">
          <template v-if="isBuildingType('office')">
            <div class="radio-groups__group">
              <input role="radio" name="ratingScope" type="radio" id="base_building" v-model="form.ratingScope" value="base_building"/>
              <label for="base_building">Base building</label>
            </div>
            <div class="radio-groups__group">
              <input role="radio" name="ratingScope" type="radio" id="whole_building" v-model="form.ratingScope" value="whole_building"/>
              <label for="whole_building">Whole building</label>
            </div>
            <div v-if="!isWater() && !isRatingType('waste')" class="radio-groups__group">
              <input role="radio" name="ratingScope" type="radio" id="tenancy" v-model="form.ratingScope" value="tenancy"/>
              <label for="tenancy">Tenancy</label>
            </div>
          </template>
          <template v-if="isBuildingType('data_centre')">
            <div class="radio-groups__group">
              <input role="radio" name="ratingScope" type="radio" id="it_equipment" v-model="form.ratingScope" value="it_equipment"/>
              <label for="it_equipment">IT equipment</label>
            </div>
            <div class="radio-groups__group">
              <input role="radio" name="ratingScope" type="radio" id="whole_facility" v-model="form.ratingScope" value="whole_facility"/>
              <label for="whole_facility">Whole facility</label>
            </div>
            <div class="radio-groups__group">
              <input role="radio" name="ratingScope" type="radio" id="infrastructure" v-model="form.ratingScope" value="infrastructure"/>
              <label for="infrastructure">Infrastructure</label>
            </div>
          </template>
        </div>
      </fieldset>
      </template>
      <template v-if="!isRatingType('indoor_environment')">
        <h3>What is the postcode of the building?</h3>
        <fieldset>
            <input type="text" v-model.number="form.postcode"/>
        </fieldset>
      </template>
    </div>
  </form>
</template>

<script>
  import ToolTip from "./ToolTip"

  export default {
    components: {
      ToolTip: ToolTip,
    },
    methods: {
      isWater: function () {
        return this.form.ratingType == 'water';
      },
      isRatingType: function (value) {
        return this.form.ratingType == value;
      },
      isBuildingType: function (value) {
        return this.form.buildingType == value;
      },
    },
    props: ['form'],
  }
</script>
