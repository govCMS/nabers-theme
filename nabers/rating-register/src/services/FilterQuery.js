export default class FilterQuery {
  filterSearchTerm = null;
  filterBuildingType = '';
  filterRatingScope = '';
  filterRatingType = '';
  filterStarRatings = [];

  filtersSet () {
    var selected = [];
    if (this.filterBuildingType !== '') {
      selected.push('buildingtype');
    }
    if (this.filterRatingType !== '') {
      selected.push('ratingtype');
    }
    if (this.filterRatingScope !== '') {
      selected.push('ratingscope');
    }
    return selected;
  }

  clearFilterProperty (property) {
    if (property == 'filterStarRatings') {
      this.filterStarRatings = [];
    }
    else {
      this[property] = '';
    }
  }

  isEmpty() {
    if (this.filterSearchTerm === null &&
      this.filterBuildingType === '' &&
      this.filterRatingScope === '' &&
      this.filterRatingType === '' &&
      this.filterStarRatings.length === 0) {
      return true;
    }
    return false;
  }

  clearFilters() {
    this.filterSearchTerm = null;
    this.filterBuildingType = '';
    this.filterRatingScope = '';
    this.filterRatingType = '';
    this.filterStarRatings = [];
  }

  getSearchTerm() {
    var search = this.filterSearchTerm;
    var prefix = '';
    if (search != null && search != {}) {
      var value = search.value;
      switch (search.field) {
        case 'Postcode':
        case 'State':
        case 'Suburb':
          prefix = search.field + ':';
          break;
        case 'PremiseID':
          value = search.label;
          break;
        default:
          break;
      }
      return prefix + value;
    }
    return '';
  }

  getSearchTermForInput() {
    return this.getSearchTerm().replace(/:/, ': ');
  }

  setSearchTerm(search) {
    var obj = { field: 'PremisesName', value: '' };
    if (search.indexOf(':') > -1) {
      var pair = search.split(':');
      obj.field = pair[0];
      obj.value = [pair[1]];
    }
    else {
      obj.value = [search];
    }
    this.filterSearchTerm = obj;
  }


  constructor () {
    console.log('*** FilterQuery constructor ***');
  }
}
