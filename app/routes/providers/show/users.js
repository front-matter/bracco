import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';
import ENV from 'bracco/config/environment';

export default Ember.Route.extend(RouteMixin, {
  perPage: 25,

  model(params) {
    params.paramMapping = { page: "page[number]",
                            perPage: "page[size]",
                            total_pages: "total-pages" };

    let provider = this.modelFor('providers/show');
    if (provider.get('id') === 'sandbox') {
      params = Ember.merge(params, { 'sandbox': true });
    } else {
      params = Ember.merge(params, { 'provider-id': this.modelFor('providers/show').get('id') });
    }
    return this.findPaged('user', params);
  },
  actions: {
    queryParamsDidChange: function() {
      this.refresh();
    },
    refreshCurrentRoute(){
      this.refresh();
    }
  }
});
