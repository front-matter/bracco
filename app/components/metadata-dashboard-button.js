import Component from '@glimmer/component';
import ENV from 'bracco/config/environment';
import { inject as service } from '@ember/service';

export default class MetadataDashboardButton extends Component {
  @service currentUser;

  get metadataDashboardUrl() {
    return ENV.METADATA_DASHBOARD_URL + "/" + this.currentUser.uid;
  }
  get fabricaDeployTarget() {
    return ENV.fabricaDeployTarget;
  }
}
