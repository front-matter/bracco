import Component from '@glimmer/component';
import ENV from 'bracco/config/environment';
import { inject as service } from '@ember/service';

export default class MetadataDashboardButton extends Component {
  @service currentUser;
  @service router

  get metadataDashboardUrl() {
    return ENV.METADATA_DASHBOARD_URL + "/" + this.router.currentURL.split('/').pop();
  }

  get fabricaDeployTarget() {
    return ENV.fabricaDeployTarget;
  }
}
