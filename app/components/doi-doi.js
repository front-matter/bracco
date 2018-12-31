import { inject as service } from '@ember/service';
import Ember from 'ember';
import Component from '@ember/component';
import ENV from 'bracco/config/environment';
import fetch from 'fetch';

const stateList = {
  draft: ['draft', 'registered', 'findable'],
  registered: ['registered', 'findable'],
  findable: ['registered', 'findable']
}

export default Component.extend({
  currentUser: service(),
  store: service(),

  draft: true,
  registered: true,
  findable: true,

  stateList,
  state: null,

  prefixes: null,

  didReceiveAttrs() {
    this._super(...arguments);

    this.setDefaultPrefix();
  },

  setDefaultPrefix() {
    let self = this;
    this.store.query('prefix', { 'client-id': this.client.get('id'), sort: 'name', 'page[size]': 25 }).then(function(prefixes) {
      self.set('prefixes', prefixes);

      // use first prefix that is not 10.5072 if it exists
      prefixes = prefixes.mapBy('id').removeObject('10.5072')
      let prefix = prefixes.length > 0 ? prefixes.get('firstObject') : '10.5072';

      self.get('model').set('prefix', prefix);
      self.generate();
    });
  },
  generate() {
    let self = this;
    let url = ENV.API_URL + '/dois/random?prefix=' + this.model.get('prefix');
    return fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + this.currentUser.get('jwt')
      }
    }).then(function(response) {
      if (response.ok) {
        return response.json().then(function(data) {
          let suffix = data.doi.split('/', 2)[1]
          self.get('model').set('suffix', suffix);
          let doi = self.get('model').get('prefix') + '/' + suffix;
          self.get('model').set('doi', doi);
          self.selectState(self.get('model').get('state'));
          return suffix;
        });
      } else {
        Ember.Logger.assert(false, response)
        return null;
      }
    }).catch(function(error) {
      Ember.Logger.assert(false, error)
    });
  },
  selectState(state) {
    this.set('state', state);
    this.model.set('state', state);
    this.setStates(state)
  },
  setStates(state) {
    if (state == '' || state == 'undetermined') {
      state = 'draft';
    }
    let states = [];
    // demo prefix uses only draft state
    if (this.model.get('prefix') === '10.5072') {
      states = ['draft'];
      this.set('registered', true);
      this.set('findable', true);
    } else {
      states = stateList[state];
    }
    states.forEach((item) => {
      this.set(item, false);
    });
  },

  actions: {
    selectPrefix(prefix) {
      this.model.set('prefix', prefix.id);
      this.model.set('doi', prefix.id + '/' + this.model.get('suffix'));
      
      if (prefix.id === '10.5072') {
        this.model.set('state', 'draft');
      }
      this.selectState(this.model.get('state'));
    },
    selectSuffix(suffix) {
      this.model.set('suffix', suffix);
      this.model.set('doi', this.model.get('prefix') + '/' + suffix);
    },
    generate() {
      this.generate();
    },
    refresh() {
      this.generate();
    },
    clear() {
      this.model.set('suffix', null)
      this.$('input[type=text]:first').focus();
    },
    selectState(state) {
      this.selectState(state);
    }
  }
});