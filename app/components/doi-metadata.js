import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { tagName } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import Component from '@ember/component';
import { isPresent } from '@ember/utils';
import vkbeautify from 'vkbeautify';
import ENV from 'bracco/config/environment';
import { UploadFile, UploadFileReader } from 'ember-file-upload';

@classic
@tagName('div')
export default class DoiMetadata extends Component {
  @service
  currentUser;

  hasMetadata = false;
  metadata = null;
  output = null;
  summary = true;

  didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);

    // show metadata if at least one of these attributes is set
    if (
      isPresent(this.get('model.publicationYear')) ||
      isPresent(this.get('model.titles')) ||
      isPresent(this.get('model.publisher')) ||
      isPresent(this.get('model.creators')) ||
      (this.get('model.types') instanceof Object &&
        !!this.get('model.types.resourceTypeGeneral')) ||
      (this.get('model.types') instanceof Object &&
        !!this.get('model.types.resourceType'))
    ) {
      this.set('hasMetadata', true);
    }

    let formats = {
      summary: 'Summary View',
      datacite: 'DataCite XML',
      datacite_json: 'DataCite JSON',
      schema_org: 'Schema.org JSON-LD',
      citeproc: 'Citeproc JSON',
      codemeta: 'Codemeta JSON',
      bibtex: 'BibTeX',
      ris: 'RIS',
      jats: 'JATS XML'
    };
    this.set('formats', formats);
  }

  showMetadata(metadata) {
    if (metadata === 'summary') {
      this.set('output', '');
    } else {
      this.set('output', '');
      let self = this;
      let url = ENV.API_URL + '/dois/' + this.model.get('doi');
      let acceptHeaders = {
        datacite: 'application/vnd.datacite.datacite+xml',
        datacite_json: 'application/vnd.datacite.datacite+json',
        schema_org: 'application/vnd.schemaorg.ld+json',
        citeproc: 'application/vnd.citationstyles.csl+json',
        codemeta: 'application/vnd.codemeta.ld+json',
        bibtex: 'application/x-bibtex',
        ris: 'application/x-research-info-systems',
        jats: 'application/vnd.jats+xml'
      };
      let headers = { Accept: acceptHeaders[metadata] };
      if (this.currentUser.get('jwt')) {
        headers = {
          Authorization: 'Bearer ' + this.currentUser.get('jwt'),
          Accept: acceptHeaders[metadata]
        };
      }
      let result = fetch(url, {
        headers
      }).then(function (response) {
        if (response.ok) {
          return response.blob();
        } else {
          return response.statusText;
        }
      });

      result.then(async function (response) {
        if (typeof response === 'string') {
          self.set('output', vkbeautify.json(JSON.stringify(response)));
        } else {
          let reader = UploadFile.fromBlob(response, 'blob')
          reader.readAsText().then(
            (result) => {
              self.set('output', vkbeautify.xml(result));
            },
            (err) => {
              console.error(err);
            }
          );
        }
      });
    }
    // this.get('router').transitionTo({ queryParams: { metadata: metadata } });
  }

  @action
  selectMetadata(metadata) {
    this.showMetadata(metadata);
  }
}
