import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
import Route from '@ember/routing/route';

@classic
export default class DoisRoute extends Route {
  @service
  can;

  @service
  router;

  @service
  store;

  model(params) {
    let user = this.modelFor('users/show');
    params = Object.assign(params, {
      page: {
        number: params.page,
        size: params.size
      },
      'user-id': user.get('id'),

      facets:
        'affiliations,certificates,citations,clients,created,downloads,fieldsOfScience,licenses,linkChecksStatus,prefixes,providers,published,registered,resourceTypes,schemaVersions,states,subjects,views',

      'disable-facets': 'false'
    });

    return hash({
      user,
      dois: this.store
        .query('doi', params)
        .then(function (result) {
          return result;
        })
        .catch(function (reason) {
          console.debug(reason);
          return null;
        })
    });
  }

  queryParams = {
    page: {
      refreshModel: true
    },
    size: {
      refreshModel: true
    }
  };

  afterModel() {
    if (this.can.cannot('read user', this.modelFor('users/show').user)) {
      this.router.transitionTo('index');
    }
  }
}
