import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { isBlank } from '@ember/utils';
// import { computed } from '@ember/object';
import langs from 'langs';

const clientTypeList = [
  'repository',
  'periodical'
]
const softwareList = [
  'CKAN',
  'Dataverse',
  'DSpace',
  'EPrints',
  'Fedora',
  'Invenio',
  'Islandora',
  'Nesstar',
  'Open Journal Systems (OJS)',
  'Opus',
  'Samvera',
  'Other'
]

export default Component.extend({
  store: service(),

  tagName: 'div',
  classNames: ['row'],
  client: null,
  new: false,
  re3data: null,
  repositories: [],
  softwareList,
  softwares: softwareList,
  clientTypeList,
  clientTypes: clientTypeList,
  // availableClientCount: computed('model.provider', 'model.clients', function() {
  //   if (this.model.provider && this.model.provider.memberType === 'contractual_provider') {
  //     return 1 - this.model.clients.length;
  //   } else {
  //     return 500 - this.model.clients.length;
  //   }
  // }),

  selectRepository(re3data) {
    if (re3data) {
      let self = this;
      this.store.findRecord('re3data', re3data.id).then(function (repo) {
        self.set('re3data', repo)
        self.get('repository').set('clientType', 'repository');
        self.get('repository').set('re3data', 'https://doi.org/' + repo.get('id'));
        self.get('repository').set('name', repo.get('repositoryName'));
        self.get('repository').set('description', repo.get('description'));
        self.get('repository').set('alternateName', repo.get('additionalNames').get('firstObject').text);
        self.get('repository').set('url', repo.get('repositoryUrl'));
        if (repo.get('software').length > 0) {
          let software = repo.get('software')[0].name;
          if (software === "DataVerse") {
            software = "Dataverse";
          } else if (software === "unknown") {
            software = "Other";
          }
          self.get('repository').set('software', software.capitalize());
        }
        if (repo.get('repositoryLanguages').length > 0) {
          self.get('repository').set('language', repo.get('repositoryLanguages').map(function(l) {
            return langs.where("2", l.text)["1"];
          }));
        }
        if (repo.get('types').length > 0) {
          self.get('repository').set('repositoryType', repo.get('types').mapBy('text'));
        }
        if (repo.get('certificates').length > 0) {
          self.get('repository').set('certificate', repo.get('certificates').mapBy('text'));
        }
      });
    } else {
      this.repository.set('re3data', null);
    }
  },
  searchClientType(query) {
    var clientTypes = clientTypeList.filter(function(clientType) {
      return clientType.startsWith(query.toLowerCase());
    })
    this.set('clientTypes', clientTypes);
  },
  selectClientType(clientType) {
    this.repository.set('clientType', clientType);
    this.set('clientTypes', clientTypeList);
  },
  searchSoftware(query) {
    var softwares = softwareList.filter(function(software) {
      return software.toLowerCase().startsWith(query.toLowerCase());
    })
    this.set('softwares', softwares);
  },
  selectSoftware(software) {
    this.repository.set('software', software);
    this.set('softwares', softwareList);
  },
  reset() {
    this.set('client', null);
    this.set('new', false);
  },

  actions: {
    new(model) {
      let provider = this.store.peekRecord('provider', model.repositories.get('query.provider-id'));
      this.set('repository', this.store.createRecord('repository', { provider: provider, symbol: provider.id.toUpperCase() + '.', clientType: 'repository', language: [], repositoryType: [], certificate: [] }));
      this.repository.get('language').pushObject('');
      this.repository.get('repositoryType').pushObject('');
      this.repository.get('certificate').pushObject('');
      this.set('new', true);
    },
    searchRepository(query) {
      this.set('repositories', this.store.query('re3data', { 'query': query, 'page[size]': 25 }));
    },
    selectRepository(re3data) {
      this.selectRepository(re3data);
    },
    addLanguage() {
      this.repository.get('language').pushObject(null);
    },
    addCertificate() {
      this.repository.get('certificate').pushObject(null);
    },
    addRepositoryType() {
      this.repository.get('repositoryType').pushObject(null);
    },
    submit(repository) {
      let self = this;

      // Remove all whitespace on domains.
      if (repository.get('domains')) {
        var domains = repository.get('domains');
        repository.set('domains', domains.replace(/\s/g, ''));
      }

      repository.set('language', repository.get('language').filter(function(language) {
        return !isBlank(language);
      }));

      repository.set('repositoryType', repository.get('repositoryType').filter(function(repositoryType) {
        return !isBlank(repositoryType);
      }));

      repository.set('certificate', repository.get('certificate').filter(function(certificate) {
        return !isBlank(certificate);
      }));

      repository.save().then(function(repository) {
        self.router.transitionTo('repositories.show.settings', repository.id);
        self.set('new', false);
      }).catch(function(reason){
        if (console.debug) {
          console.debug(reason);
        } else {
          console.log(reason);
        }
      });
    },
    cancel() {
      this.repository.rollbackAttributes();
      this.reset();
    },
    searchClientType(query) {
      this.searchClientType(query);
    },
    selectClientType(clientType) {
      this.selectClientType(clientType);
    },
    searchSoftware(query) {
      this.searchSoftware(query);
    },
    selectSoftware(software) {
      this.selectSoftware(software);
    }
  }
});