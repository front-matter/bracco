import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['query', 'region', 'consortium-id', 'organization-type', 'focus-area', 'include-deleted', 'year', 'sort', 'page', 'size'],
  query: null,
  region: null,
  'consortium-id': null,
  'organization-type': null,
  'focus-area': null,
  'include-deleted': null,
  year: null,
  sort: null,
  page: 1,
  size: 25
});