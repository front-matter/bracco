import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Controller from '@ember/controller';

@classic
export default class ModifyController extends Controller {
  queryParams = [
    'query',
    'resource-type-id',
    'provider-id',
    'client-id',
    'person-id',
    'affiliation-id',
    'prefix',
    'year',
    'created',
    'registered',
    'state',
    'sort',
    'source',
    'link-check-status',
    'schema-version',
    'certificate',
    'page',
    'size',
    'affiliation'
  ];
  query = null;
  'resource-type-id' = null;
  'provider-id' = null;
  'client-id' = null;
  'person-id' = null;
  'affiliation-id' = null;
  prefix = null;
  year = null;
  created = null;
  registered = null;
  state = null;
  source = null;
  'link-check-status' = null;
  sort = null;
  'schema-version' = null;
  certificate = null;
  page = 1;
  size = 25;
  affiliation = true;
};
