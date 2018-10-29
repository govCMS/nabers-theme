import apiFieldMapping from './apiFieldMapping'
import wasteTypesMapping from './wasteTypesMapping'
import apiHelper from './apiHelper'

export default class Results {
  success = false
  message = null
  data = {}
  errors = []
  payload = {}

  constructor () {
  }

  go (value) {
    this.message = value
    this.success = true
  }

  getResults () {
    const self = this;
    const apiPayload = self.processPayload();

    // Get the access token then fetch results.
    return apiHelper.getToken().then((access_token) => {
      return apiHelper.fetchResults(apiPayload, access_token).then((apiResponse) => {
        self.data = apiResponse;
        return true;
      }).catch(e => {
        this.errors.push(e)
      });
    }).catch(e => {
      this.errors.push(e)
    })
  }

  processPayload(){
    const self = this;
    const payload = self.payload;
    let apiPayload = {
      'Control': {
        'Postcode': self.getPostcode(payload.postcode),
        'PremiseType': self.getPremiseType(payload.buildingtype),
        'RatingScope': self.getRatingScope(payload.ratingscope),
        'RatingType': self.getRatingType(payload.ratingtype)
      },
      'RatingInputs': {}
    }

    // Special handling required for Waste data.
    if (payload.ratingtype === 'waste') {
      apiPayload.RatingInputs['WasteInputs'] = {'lstWasteData': []}
      const weights = payload.data.wasteWeights
      const contaminationRates = payload.data.wasteContaminationRates
      for (let item in weights) {
        const totalWeight = weights[item]
        if (totalWeight !== '') {
          const waste = {
            'WasteType': wasteTypesMapping[item],
            'TotalWeight': weights[item]
          }
          if (typeof contaminationRates[item] !== 'undefined') {
            waste['ContaminationRate'] = contaminationRates[item]
          }
          apiPayload.RatingInputs['WasteInputs']['lstWasteData'].push(waste)
        }
      }
    }
    else {
      for (let property in apiFieldMapping) {
        let inputFieldName = apiFieldMapping[property]
        // If it is an object,  process its sub-fields.
        if (inputFieldName === Object(inputFieldName)) {
          const subFields = {}
          for (let sub in inputFieldName) {
            let subFieldName = inputFieldName[sub]
            if (payload.data.hasOwnProperty(subFieldName)) {
              subFields[sub] = payload.data[subFieldName]
            }
          }
          if (typeof subFields !== 'undefined' && Object.keys(subFields).length > 0) {
            apiPayload.RatingInputs[property] = subFields
          }
        }
        else {
          if (payload.data.hasOwnProperty(inputFieldName)) {
            apiPayload.RatingInputs[property] = payload.data[inputFieldName]
          }
        }
      }
    }
    return apiPayload
  }

  getPremiseType (premiseType) {
    const premiseTypeMapping = {
      'office': 'Office',
      'data_centre': 'DataCentre',
      'shopping_centre': 'ShoppingCentre',
      'hotel': 'Hotel',
      'apartment_building': 'ApartmentBuilding'
    }
    return premiseTypeMapping[premiseType]
  }

  getRatingScope (ratingScope) {
    const ratingScopeMapping = {
      'whole_building': 'Whole',
      'whole_facility': 'Whole',
      'base_building': 'Base',
      'tenancy': 'Tenancy',
      'infrastructure': 'Infrastructure',
      'it_equipment': 'ITEquipment'
    }
    return ratingScopeMapping[ratingScope] !== undefined ? ratingScopeMapping[ratingScope] : ''
  }

  getRatingType (ratingType) {
    var ratingTypeMapping = {
      'energy': 'Energy',
      'water': 'Water',
      'waste': 'Waste',
      'indoor_environment': 'IE'
    }
    return ratingTypeMapping[ratingType]
  }

  getPostcode () {
    // Postcode is not required for indoor environment,
    // so return a dummy postcode.
    return this.payload.ratingtype === 'indoor_environment' ? '2000' : this.payload.postcode
  }
}
