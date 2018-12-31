import Component from '@ember/component';
import { inject as service } from '@ember/service';
import Ember from 'ember';
import fetch from 'fetch';
import ENV from 'bracco/config/environment';

export default Component.extend({
  currentUser: service(),

  url: null,

  didReceiveAttrs() {
    this._super(...arguments);

    this.fetchURL();
  },

  fetchURL() {
    let self = this;
    let url = ENV.API_URL + '/dois/' + this.model.get('doi') + '/get-url';

    fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + self.get('currentUser').get('jwt'),
        'Accept': 'application/vnd.api+json'
      }
    }).then(function(response) {
      if (response.ok) {
        if (response.status == 204 ) {
          return "No URL found";
        }

        return response.json().then(function(data) {
          if (data.errors) {
            let message = data.errors[0].title;
            return message;
          } else {
            self.set('url', data.url);
            self.get('model').set('url', data.url);
          }
        });
      } else {
        Ember.Logger.assert(false, response);
      }
    }).catch(function(error) {
      Ember.Logger.assert(false, error);
    });
  }
});
