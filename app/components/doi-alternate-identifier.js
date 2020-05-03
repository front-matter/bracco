import Component from '@ember/component';
import { isBlank } from '@ember/utils';

const alternateIdentifierTypeList = [
  'ARK',
  'arXiv',
  'bibcode',
  'DOI',
  'EAN13',
  'EISSN',
  'Handle',
  'IGSN',
  'ISBN',
  'ISSN',
  'ISTC',
  'LISSN',
  'LSID',
  'PMID',
  'PURL',
  'UPC',
  'URL',
  'URN',
  'w3id',
];

export default Component.extend({
  alternateIdentifierTypeList,
  alternateIdentifierTypes: alternateIdentifierTypeList,
  selected: [],

  actions: {
    createOnEnter(select, e) {
      if (e.keyCode === 13 && select.isOpen && !select.highlighted && !isBlank(select.searchText)) {
        if (!this.selected.includes(select.searchText)) {
          this.alternateIdentifierTypes.push(select.searchText);
          select.actions.choose(select.searchText);
          this.fragment.set('alternativeIdentifierType', select.searchText);
          this.set('alternateIdentifierTypes', alternateIdentifierTypeList);
        }
      }
    },
    updateAlternateIdentifier(value) {
      this.fragment.set('alternateIdentifier', value);
    },
    updateAlternateIdentifierType(value) {
      this.fragment.set('alternativeIdentifierType', value);
    },
    selectAlternateIdentifierType(alternateIdentifierType) {
      this.fragment.set('alternativeIdentifierType', alternateIdentifierType);
      this.set('alternateIdentifierTypes', alternateIdentifierTypeList);
    },
    deleteIdentifier() {
      this.model.get('alternateIdentifiers').removeObject(this.fragment);
    },
  },
});
