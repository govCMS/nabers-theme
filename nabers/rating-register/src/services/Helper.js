export default class Helper {

  oneDP (value) {
    if (value.indexOf('.') > -1)
      value = Number.parseFloat(value).toFixed(1);
    return value;
  }

  getTenancyIndex (ratings) {
    let tenancyIndex = -1
    for (let i = 0; i < ratings.length; i++) {
      if (ratings[i].label.toLowerCase() === 'tenancy') {
        tenancyIndex = i
        break
      }
    }
    return tenancyIndex
  }

  processTenancies (ratings, tenancyIndex) {
    // Group an array of objects by a property.
    Array.prototype.groupBy = function (prop) {
      return this.reduce(function (groups, item) {
        const val = item[prop]
        groups[val] = groups[val] || []
        groups[val].push(item)
        return groups
      }, {})
    }

    var rtnTenancies = []
    // Group tenancy ratings by tenancy floor or suite.
    const tenancyRatings = ratings[tenancyIndex].values
    const groupedTenancyRatings = tenancyRatings.groupBy('TenancyFloorOrSuite')
    for (let item in groupedTenancyRatings) {
      let tenancy = groupedTenancyRatings[item]
      // Sort ratings by Energy rating.
      tenancy.sort(function (a, b) {
        return b.StarRating - a.StarRating
      })
      rtnTenancies.push({
        label: tenancy[0].RatingScope,
        sublabel: tenancy[0].AltPremisesName,
        TenancyFloorOrSuite: tenancy[0].TenancyFloorOrSuite,
        values: tenancy
      })
    }

    ratings.splice(tenancyIndex, 1)
    ratings = ratings.concat(rtnTenancies)
    return ratings
  }
}
