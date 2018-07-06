import axios from 'axios'

export default class Geocode {
  googleKey = 'AIzaSyDSVxqTPfKWiOATtMYeXb5TGsHgeGbWca0'

  search (search, callback) {
    let uri = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURI(search) + '&region=AU&key=' + this.googleKey
    axios.get(uri).then((response) => {
      callback(response.data)
    })
  }
}
