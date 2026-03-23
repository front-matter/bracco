import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
import Route from '@ember/routing/route';

@classic
export default class NewRoute extends Route {
  @service
  can;

  @service
  store;

  model() {
    let provider = this.modelFor('providers/show');
    let repository = this.store.createRecord('repository', {
      provider,
      symbol: provider.id.toUpperCase() + '.',
      clientType: 'repository',
      language: [],
      repositoryType: [],
      certificate: [],
      issn: this.store.createFragment('issn'),
      serviceContact: this.store.createFragment('contact-fragment')
    });

    repository.get('language').pushObject('');
    repository.get('repositoryType').pushObject('');
    repository.get('certificate').pushObject('');

    return hash({
      provider,
      repository,
      'provider-prefix': null,
      'repository-prefix': this.store.createRecord('repositoryPrefix', {
        repository
      })
    });
  }

  setupController(controller, model) {
    // Call _super to maintain default behavior (controller.set('model', model))
    super.setupController(controller, model);

    // Custom setup: Set additional properties
    controller.set('isSoftwareFieldActive', false);
  }

  resetController(controller, isExiting, transition) {
    // If the user is exiting the route entirely, reset the transient properties
    if (isExiting) {
      controller.set('isSoftwareFieldActive', false);
    }

    // Calls the default resetController behavior (important for query params)
    super.resetController(controller, isExiting, transition);
  }
}
