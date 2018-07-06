const fs = require('fs')
const splitEasy = require('csv-split-easy')

// =============================================
// Variables and Methods
// =============================================
let isJsonP = false
let inputFile = './datav7_6.csv'
let outputFile = '../static/rating_register_data.' + (isJsonP ? 'js' : 'json')
let jsonpCallback = 'ratingRegisterParseResponse'

let ratingLabels = [
  'AAAStarRatingValue',
  'AcousticComfortScore',
  'AirQualityScore',
  'AltPremisesName',
  'CarbonNeutral',
  'CarbonNeutralExpiryDate',
  'CertificateValidTo',
  'DataCentre_PUE',
  'EnergyGPStarRatingValueNoGP',
  'EnergyGreenPower',
  'EnergyGreenPowerPercent',
  'EnergyIntensityByM2',
  'EnergyIntensityByRoom',
  'EnergyStarRatingValue',
  'GHGEmissionsScope123',
  'GHGEmissionsScope123NoGP',
  'GHGEmissionsScope123PerM2',
  'GHGEmissionsScope123PerM2NoGP',
  'GHGEmissionsScope123PerRoom',
  'GHGEmissionsScope123PerRoomNoGP',
  'HospitalPeerGroup',
  'IEQStarRatingValue',
  'LightingScore',
  'OfficeLayoutScore',
  'PremiseType',
  'RatingReferenceNumber',
  'RatingScope',
  'RatingType',
  'RecycleRate',
  'Shopping_totalEnergyUse',
  'TenancyFloorOrSuite',
  'ThermalComfortScore',
  'TotalEnergyUse',
  'WasteIntensity',
  'WasteStarRatingValue',
  'WaterConsumption',
  'WaterConsumptionPerRoom',
  'WaterConsumptionPerRoomNoRW',
  'WaterConsumptionWoRW',
  'WaterIntensity',
  'WaterIntensityNoRW',
  'WaterRecycled',
  'WaterRecycledPercent',
  'WaterStarRatingValue',
  'WaterStarRatingValueNoRW'
]

function stripRatingKeys (obj) {
  ratingLabels.forEach(label => {
    delete obj[label]
  })
}

function getRatingValues (obj) {
  let rtn = {}
  ratingLabels.forEach(label => {
    rtn[label] = obj[label]
  })
  return rtn
}

function prepareStarValue (rating) {
  switch (rating.RatingType) {
    case 'Energy':
      rating['StarRating'] = parseFloat(rating['EnergyStarRatingValue']).toString()
      break
    case 'Water':
      rating['StarRating'] = parseFloat(rating['WaterStarRatingValue']).toString()
      break
    case 'Waste':
      rating['StarRating'] = parseFloat(rating['WasteStarRatingValue']).toString()
      break
    case 'Indoor Environment':
      rating['StarRating'] = parseFloat(rating['IEQStarRatingValue']).toString()
      break
  }
  return rating
}

function filterData (key, value) {
  if (value === 'NULL') {
    value = ''
  }
  switch (key) {
    case 'Suburb':
      return value.replace(/\w\S*/g, txt => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
    case 'CarbonNeutral':
    case 'WaterRecycled':
    case 'EnergyGreenPower':
      switch (value) {
        case 'NO':
          return false
        case 'YES':
          return true
        default:
          return null
      }
    default:
      return value
  }
}

// =============================================
// Load CSV / Save JSON
// =============================================
//  Allow limiting the number of rows processed (to create a small test .json file)
let limit = 0
process.argv.forEach(function (val, index, array) {
  if (val.indexOf('limit') > -1) {
    let pair = val.split(':');
    limit = pair[1];
  }
});

fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) throw err

  let firstRecords = []
  let labels = []
  let rows = null

  // Split to line
  rows = splitEasy(data)

  rows.forEach((line, idx) => {
    // Split to column
    if (idx === 0) {
      labels = line
    } else {
      let o = {}
      line.forEach((col, icol) => {
        o[labels[icol]] = filterData(labels[icol], col)
      })
      if (limit == 0 || firstRecords.length <= limit)
        firstRecords.push(o)
    }
  })

  // Group by PremiseID
  let n = 0
  while (n < firstRecords.length) {
    firstRecords[n]['Ratings'] = [prepareStarValue(getRatingValues(firstRecords[n]))]
    stripRatingKeys(firstRecords[n])
    // Search other records
    let n2 = n + 1
    while (n2 < firstRecords.length) {
      if (firstRecords[n].PremiseID === firstRecords[n2].PremiseID) {
        firstRecords[n]['Ratings'].push(prepareStarValue(getRatingValues(firstRecords[n2])))
        firstRecords.splice(n2, 1)
      } else {
        n2++
      }
    }
    n++
  }

  // Write file
  var fileOutput = (isJsonP) ? (jsonpCallback + '(' + JSON.stringify(firstRecords) + ');') : (JSON.stringify(firstRecords))
  fs.writeFile(outputFile, fileOutput, (err) => {
    if (err) throw err
    console.log('The file has been saved!')
  })
})
