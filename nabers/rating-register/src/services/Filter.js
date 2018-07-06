export default class Filter {
  constructor () {
    this.ratingFields = [
      'PremiseType',
      'RatingType',
      'RatingScope',
      'StarRating',
      'CarbonNeutral'
    ]
  }

  /**
   * Alternate version of Rating Register search - Changes the loop order to:
   *  Building > Ratings > Filters
   * as opposed to:
   *  Building > Filters > Ratings
   * And accumulates the "passedTests" count at the rating level instead of the Building level.
   * @param {Array} dataArray
   * @param {Array} filters
   */
  filterData (dataArray, filters) {
    if (!filters.length > 0) {
      return dataArray;
    }

    return dataArray.filter(item => {
      // Search within ratings (any positive will result in a passed test)
      for (let j = 0; j < item.Ratings.length; j++) {
        let passedTests = 0;
        let rating = item.Ratings[j];

        // Test data against filters.
        for (let i = 0; i < filters.length; i++) {
          let filter = filters[i]
          let isCarbonNeutralFilter = filter.field.toLowerCase().indexOf('carbon') > -1 ? true : false
          let filterValue = isCarbonNeutralFilter ? [] : filter.value.map(item => item.toLowerCase())

          if (this.ratingFields.indexOf(filter.field) >= 0 && item.Ratings.length > 0) {
            // Nested if statement required because CarbonNeutral can be false, but we don't want it to fall
            // through to else because error will be thrown trying .toLowerCase() the boolean
            if (isCarbonNeutralFilter) {
              if (rating[filter.field] == true) {
                passedTests++
              }
            }
            else if (filterValue.indexOf(rating[filter.field].toLowerCase()) >= 0) {
              passedTests++
            }
          } else {
            // For searching on root of object.
            if (item.hasOwnProperty(filter.field) && filterValue.indexOf(item[filter.field].toLowerCase()) >= 0) {
              passedTests++
            }
          }
        }

        if (passedTests === filters.length) {
          return true;
        }
      }

      return false;
    });
  }
}
