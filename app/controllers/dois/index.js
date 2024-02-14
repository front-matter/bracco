import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  flashMessages: service(),

  queryParams: [ 'query', 'resource-type-id', 'provider-id', 'client-id', 'person-id', 'affiliation-id', 'prefix', 'year', 'created', 'registered', 'state', 'source', 'link-check-status', 'sort', 'schema-version', 'certificate', 'page', 'size', 'affiliation', 'publisher' ],
  query: null,
  'resource-type-id': null,
  'provider-id': null,
  'client-id': null,
  'person-id': null,
  'affiliation-id': null,
  prefix: null,
  year: null,
  created: null,
  registered: null,
  state: null,
  source: null,
  'link-check-status': null,
  sort: null,
  'schema-version': null,
  certificate: null,
  page: 1,
  size: 25,
  affiliation: true,
  publisher: true,
  composite: true,
});
