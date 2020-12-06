import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  can: service(),

  model() {
    let self = this;
    return this.store
      .findRecord('user', this.modelFor('users/show').id
      .then(function (user) {
        return user;
      })
      .catch(function (reason) {
        console.debug(reason);

        self.flashMessages.add({
          message:
            'No results found. The ORCID record has not been linked to any DOIs. Contact the repository where your resources are deposited to request your ORCID record is linked to your contents DOIs. Or visit our support website, at https://support.datacite.org/docs/datacite-researcher-profiles, for more information.',
          href:
            'https://support.datacite.org/docs/datacite-researcher-profiles',
          type: 'warning'
        });
        self.transitionTo('/');
      });
  },

  afterModel() {
    if (this.can.cannot('read user', this.modelFor('users/show'))) {
      this.transitionTo('index');
    }
  },

  actions: {
    queryParamsDidChange() {
      this.refresh();
    }
  }
});
