import { hash } from 'rsvp';
import { assign } from '@ember/polyfills';
import Route from '@ember/routing/route';
import { CanMixin } from 'ember-can';

export default Route.extend(CanMixin, {
  model(params) {
    params = assign(params, { 
      page: {
        number: params.page,
        size: params.size 
      },
      'provider-id': this.modelFor('providers/show').get('id')
    });

    return hash({
      provider: this.modelFor('providers/show'),
      prefixes: this.store.query('provider-prefix', params)
    });
  },

  queryParams: {
    page: {
      refreshModel: true
    },
    size: {
      refreshModel: true
    },
    state: {
      refreshModel: true
    },
    year: {
      refreshModel: true
    }
  },

  afterModel() {
    if (!this.can('read provider', this.modelFor('providers/show'))) {
      return this.transitionTo('index');
    }
  }
});
