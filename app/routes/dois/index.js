import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

@classic
export default class IndexRoute extends Route {
  @service
  can;

  @service
  currentUser;

  @service
  flashMessages;

  @service
  prefixes;

  @service
  router;

  @service
  store;

  model(params) {
    params = Object.assign(params, {
      page: {
        number: params.page,
        size: params.size
      },
      include: 'client',
      sort: params.sort || '-updated',

      facets:
        'affiliations,certificates,citations,clients,created,downloads,fieldsOfScience,licenses,linkChecksStatus,prefixes,providers,published,registered,resourceTypes,schemaVersions,states,subjects,views',

      'disable-facets': 'false'
    });

    return this.store
      .query('doi', params)
      .then(function (result) {
        return result;
      })
      .catch(function (reason) {
        console.debug(reason);
        return null;
      });
  }

  afterModel() {
    if (this.can.cannot('read index')) {
      this.router.transitionTo('index');
    }
  }

  queryParams = {
    page: {
      refreshModel: true
    },
    size: {
      refreshModel: true
    },
    state: {
      refreshModel: true
    },
    'resource-type-id': {
      refreshModel: true
    },
    year: {
      refreshModel: true
    },
    registered: {
      refreshModel: true
    },
    'client-id': {
      refreshModel: true
    },
    'affiliation-id': {
      refreshModel: true
    },
    prefix: {
      refreshModel: true
    },
    'schema-version': {
      refreshModel: true
    },
    source: {
      refreshModel: true
    },
    'link-check-status': {
      refreshModel: true
    }
  };
}
