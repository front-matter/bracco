import Ember from 'ember';
import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  name: validator('presence', true),
  contact: validator('presence', true),
  email: [
    validator('presence', true),
    validator('format', { type: 'email' })
  ]
});

export default DS.Model.extend(Validations, {
  clients: DS.hasMany('client'),
  users: DS.hasMany('user'),

  name: DS.attr('string'),
  description: DS.attr('string'),
  region: DS.attr('string'),
  country: DS.attr('string'),
  year: DS.attr('number'),
  logoUrl: DS.attr('string'),
  contact: DS.attr('string'),
  email: DS.attr('string'),
  website: DS.attr('string'),
  phone: DS.attr('string'),
  isActive: DS.attr('boolean'),
  created: DS.attr('date'),
  updated: DS.attr('date'),

  uid: Ember.computed('id', function() {
    return this.get('id').toUpperCase();
  })
});
