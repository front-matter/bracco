import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { clientTypeList } from 'bracco/models/repository';

@classic
export default class EditRoute extends Route {
  @service
  can;

  @service
  router;

  model() {
    let repository = this.modelFor('repositories/show');
    repository.set('confirmSymbol', repository.get('symbol'));
    return repository;
  }

  afterModel() {
    if (
      this.can.cannot('update repository', this.modelFor('repositories/show'))
    ) {
      this.router.transitionTo('index');
    }
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    const filteredClientTypeList =
      model.get('clientType') === 'igsnCatalog'
        ? clientTypeList.filter(function (object) {
            return object.value === 'igsnCatalog';
          })
        : clientTypeList.filter(function (object) {
            return object.value !== 'igsnCatalog';
          });

    controller.set('clientTypeList', filteredClientTypeList);
    controller.set('clientTypes', filteredClientTypeList);
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
