import axios from 'axios';

class API {
  constructor() {
    this._api = axios.create( { baseURL : 'https://remine-interview-api.herokuapp.com' } );
  }

  getLocations() {
    return this._api.get( 'locations' );
  }

  getLocation( id ) {
    return this._api.get( `locations/${id}` );
  }

  getBuildingTypes() {
    return [
      { key : 'multiFamily', text : 'Multi Family', value : 'multiFamily' },
      { key : 'condo', text : 'Condo', value : 'condo' },
      { key : 'business', text : 'Business', value : 'business' },
      { key : 'office', text : 'Office', value : 'office' },
      { key : 'singleFamily', text : 'Single Family', value : 'singleFamily' }
    ]
  }
}

export default new API();