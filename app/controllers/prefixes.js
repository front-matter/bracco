import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

@classic
export default class PrefixesController extends Controller {
  @service
  features;
}
