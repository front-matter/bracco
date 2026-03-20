import Component from '@glimmer/component';
import ENV from 'bracco/config/environment';
import { action } from '@ember/object';

export default class MetadataDashboardButton extends Component {

  get metadataDashboardUrl() {
    return ENV.METADATA_DASHBOARD_URL + (this.args.dashboardId ? "/" + this.args.dashboardId.toLowerCase() : '');
  }

  get fabricaDeployTarget() {
    return ENV.fabricaDeployTarget;
  }

  @action
  openLink(url) {
    document.activeElement.blur(); // Remove focus from the button after clicking to ultimately clear the styles when the user returns to the page.
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
