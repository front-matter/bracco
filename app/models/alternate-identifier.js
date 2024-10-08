import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { attr } from '@ember-data/model';
import Fragment from 'ember-data-model-fragments/fragment';
import { validator, buildValidations } from 'ember-cp-validations';
import { isBlank } from '@ember/utils';

const Validations = buildValidations({
  alternateIdentifierType: [
    validator('presence', {
      presence: true,
      message: 'Alternate Identifier must include Identifier Type',
      disabled: computed('model.alternateIdentifier', function () {
        return isBlank(this.model.get('alternateIdentifier'));
      })
    })
  ]
});

@classic
export default class AlternateIdentifier extends Fragment.extend(Validations) {
  @attr('string', { defaultValue: null })
  alternateIdentifier;

  @attr('string', { defaultValue: null })
  alternateIdentifierType;
}
