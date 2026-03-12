import Component from '@glimmer/component';
import ENV from 'bracco/config/environment';

export default class MetadataDashboardButton extends Component {
  get metadataDashboardUrl() {
    return ENV.METADATA_DASHBOARD_URL;
  }
  get fabricaDeployTarget() {
    return ENV.fabricaDeployTarget;
  }
}
