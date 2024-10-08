import classic from 'ember-classic-decorator';
import BaseValidator from 'ember-cp-validations/validators/base';

@classic
class RepositoryId extends BaseValidator {
  validate(value, options, model) {
    let providerId = model.get('provider.id').toUpperCase() + '.';
    if (value.startsWith(providerId)) {
      return true;
    } else {
      let message = 'The Repository ID must begin with ' + providerId;
      return message;
    }
  }
}

RepositoryId.reopenClass({
  getDependentsFor() {
    return ['id'];
  }
});

export default RepositoryId;
