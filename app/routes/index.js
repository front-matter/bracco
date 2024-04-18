import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { w } from '@ember/string';

export default Route.extend({
  can: service(),
  currentUser: service(),
  flashMessages: service(),
  prefixes: service(),
  router: service(),
  store: service(),

  model() {
    if (this.can.can('read index')) {
      let self = this;
      return this.store
        .findRecord('provider', 'admin')
        .then(function (admin) {
          return admin;
        })
        .catch(function (reason) {
          console.debug(reason);

          self.get('flashMessages').warning(reason);
          self.router.transitionTo('index');
        });
    }
  },

  afterModel() {
    if (this.get('currentUser.role_id') === 'staff_admin') {
      var self = this;

      this.prefixes.available().then(
        function (value) {
          if (
            self.get('flashMessages').isDestroying ||
            self.get('flashMessages').isDestroyed
          ) {
            return;
          }

          if (value <= 0) {
            self.get('flashMessages').danger(self.prefixes.msg_zero);
          } else if (value < self.prefixes.min) {
            self.get('flashMessages').warning(self.prefixes.msg_min);
          }
        },
        function (reason) {
          console.debug(reason);
        }
      );

      this.router.transitionTo('/');
    } else if (
      w('provider_admin consortium_admin client_admin user').includes(
        this.get('currentUser.role_id')
      )
    ) {
      let home = this.currentUser.get('home');
      this.router.transitionTo(home.route, home.id);
    } else if (this.get('currentUser.role_id') === 'temporary') {
      this.router.transitionTo('password');
    }
  }
});
