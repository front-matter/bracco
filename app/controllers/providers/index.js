import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['query', 'region', 'organization-type', 'focus-area', 'include-deleted', 'year', 'sort', 'page', 'perPage'],
  query: null,
  region: null,
  'organization-type': null,
  'focus-area': null,
  'include-deleted': null,
  year: null,
  sort: null
});
