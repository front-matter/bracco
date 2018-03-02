import Ember from 'ember';
const { service } = Ember.inject;
import fetch from 'fetch';
import ENV from 'bracco/config/environment';

const stateList = {
  inactive: ['inactive', 'registered', 'findable'],
  draft: ['draft', 'registered', 'findable'],
  registered: ['registered', 'findable'],
  findable: ['registered', 'findable']
}
const events = {
  "draft": "start",
  "registered": "register",
  "findable": "publish"
};

export default Ember.Component.extend({
  currentUser: service(),
  store: service(),

  edit: false,
  transfer: false,
  doi: null,
  client: null,
  clients: [],
  lines: 18,
  stateList,
  states: [],
  state: null,
  events,

  reset() {
    this.set('doi', null);
    this.set('edit', false);
    this.set('delete', false);
    this.set('transfer', false);
  },
  searchClient(query) {
    if (this.get('currentUser').get('isAdmin')) {
      this.set('clients', this.get('store').query('client', { 'query': query, sort: 'name', 'page[size]': 100 }));
    } else if (this.get('currentUser').get('isProvider')) {
      this.set('clients', this.get('store').query('client', { 'query': query, 'provider-id': this.get('currentUser').get('provider_id'), sort: 'name', 'page[size]': 100 }));
    }
  },
  selectClient(client) {
    this.set('client', client)
    this.get('doi').set('client', client);
    this.get('doi').set('provider', client.get('provider'));
  },
  countLines(xml) {
    this.set('lines', xml.split(/\r\n|\r|\n/).length + 1);
  },
  getStates(state) {
    // test prefix uses only draft state
    if (this.get('doi').get('doi').startsWith('10.5072')) {
      return ['draft'];
    } else if (state === 'inactive' && Ember.isEmpty(this.get('doi').get('registered'))) {
      return ['inactive', 'draft', 'registered', 'public'];
    } else {
      return stateList[state];
    }
  },
  convertContent(input) {
    let url = ENV.APP_URL + '/metadata/convert';
    return fetch(url, {
      method: 'post',
      headers: {
        'authorization': 'Bearer ' + this.get('currentUser').get('jwt'),
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          type: 'metadata',
          attributes: { xml: input }
        }
      })
    }).then(function(response) {
      if (response.ok) {
        return response.json().then(function(res) {
          return atob(res.data.attributes.xml);
        });
      } else {
        Ember.Logger.assert(false, response);
      }
    }).catch(function(error) {
      Ember.Logger.assert(false, error);
    });
  },

  actions: {
    edit: function(doi) {
      this.set('doi', doi);
      this.get('doi').set('confirmDoi', doi.get('doi'));
      this.searchClient(null);
      this.countLines(doi.get('xml'));
      this.set('states', this.getStates(doi.get('state')));
      this.set('state', this.get('states')[0]);
      this.set('edit', true);
    },
    transfer: function(doi) {
      this.set('doi', doi);
      this.get('doi').set('confirmDoi', doi.get('doi'));
      this.searchClient(null);
      this.set('state', this.get('states')[0]);
      this.set('transfer', true);
    },
    delete: function(doi) {
      this.set('doi', doi);
      this.get('doi').set('confirmDoi', null);
      this.set('delete', true);
    },
    searchClient(query) {
      this.searchClient(query);
    },
    selectClient(client) {
      this.selectClient(client);
    },
    didSelectFiles(files, resetInput) {
      var reader = new FileReader();
      let self = this;
      reader.onload = function(e) {
        var data = e.target.result;
        var input = data.split(",")[1];
        self.convertContent(input).then(function(xml) {
          self.countLines(xml);
          self.get('doi').set('xml', xml);
        });
      }
      reader.readAsDataURL(files[0]);

      resetInput();
    },
    submit: function(doi) {
      // change state via event if there is a change
      let stateChange = doi.changedAttributes().state;
      if (typeof stateChange !== 'undefined') {
        doi.set('event', this.get('events')[stateChange[1]]);
      }

      let self = this;
      doi.save().then(function() {
        self.set('edit', false);
        self.set('transfer', false);
      });
    },
    destroy: function(doi) {
      let self = this;
      this.set('client', this.get('doi').get('client'));
      this.get('store').findRecord("doi", doi.id, { backgroundReload: false }).then(function(doi) {
        doi.destroyRecord().then(function () {
          self.get('router').transitionTo('clients.show.dois', self.get('client'));
        });
      });
    },
    cancel: function() {
      this.reset();
    }
  }
});
