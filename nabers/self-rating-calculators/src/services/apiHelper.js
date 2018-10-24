import axios from 'axios'
import querystring from 'querystring'

// If we are running this in Drupal,
// get the API details from theme settings.
var API = {}
if (typeof Drupal != 'undefined') {
   API = Drupal.settings.govcms_ui_kit.rating_calculators_api
  // Check we don't have empty data.
  let missingDetails = false
  for (let detail in API) {
    if (typeof detail === 'undefined' || detail === '') {
      missingDetails = true
    }
  }
  if (missingDetails) {
    console.log('Error: missing API settings.')
  }
}
else {
  // If we aren't in Drupal, use the test api.
  API.apiURL = 'https://api.nabers.gov.au/ratingcalculator/calculate'
  API.authURL = 'https://auth.nabers.gov.au/token'
  API.clientID = 'RatingCalculatorApi'
  API.clientSecret = 'NabersRatingCalculator'
}

export default class apiHelper {

  // Get access token from Authorisation API.
  static getToken () {
    const params = querystring.stringify({
      grant_type: 'client_credentials',
      client_id: API.clientID,
      client_secret: API.clientSecret
    })
    return axios({
      method: 'post',
      url: API.authURL,
      headers: {
        'content-Type': 'application/x-www-form-urlencoded'
      },
      data: params
    }).then(response => {
      return response.data.access_token
    }).catch(e => {
      return e
    })
  }

  // Fetch results from Calculators API.
  static fetchResults (payload, access_token) {
    return axios({
      method: 'post',
      url: API.apiURL,
      headers: {
        'content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      },
      data: payload,
      showLoader: 'true'
    }).then(response => {
      return response.data
    }).catch(e => {
      return e
    })
  }

  // We validate postcode by sending some dummy data and
  // the user submitted postcode to the api and checking
  // for the error message: Postcode climate zone not found.
  static validatePostcode (postcode) {
    const errorMessage = 'Postcode climate zone not found.';
    const dummy_payload = {
      'Control': {
        'Postcode': postcode,
        'PremiseType': 'office',
        'RatingScope': 'Whole Building'
      },
      'RatingInputs': {}
    }

    // Get the access token then fetch results.
    return this.getToken().then((access_token) => {
      return axios({
        method: 'post',
        url: API.apiURL,
        headers: {
          'content-Type': 'application/json',
          'Authorization': 'Bearer ' + access_token
        },
        data: dummy_payload,
        showLoader: 'true'
      }).then(response => {
        return response.data['lstErrors'].length === 0 || response.data['lstErrors'][0] !== errorMessage
      }).catch(e => {
        return e
      })
    }).catch(e => {
      return e
    })
  }

  // We check API status by sending a dummy data
  // and check the returned response.
  static checkAPIStatus (postcode) {
    const dummy_payload = {
      'Control': {
        'Postcode': 2000,
        'PremiseType': 'office',
        'RatingScope': 'Whole Building'
      },
      'RatingInputs': {}
    }

    // Get the access token then fetch results.
    return this.getToken().then((access_token) => {
      return axios({
        method: 'post',
        url: API.apiURL,
        timeout: 15000, // Timeout after 15 seconds.
        headers: {
          'content-Type': 'application/json',
          'Authorization': 'Bearer ' + access_token
        },
        data: dummy_payload
      }).then(response => {
        return response.data.length !== 0
      }).catch(e => {
        console.log(e)
        return false
      })
    }).catch(e => {
      console.log(e)
      return false
    })
  }
}
