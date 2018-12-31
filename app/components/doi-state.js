import Component from '@ember/component';

const stateList = {
  draft: ['draft', 'registered', 'findable'],
  registered: ['registered', 'findable'],
  findable: ['registered', 'findable']
}

export default Component.extend({
  draft: true,
  registered: true,
  findable: true,

  stateList,
  state: null,

  didReceiveAttrs() {
    this._super(...arguments);

    this.selectState(this.model.get('state'));
  },

  selectState(state) {
    this.set('state', state);
    this.model.set('state', state);
    this.setStates(state)
  },
  setStates(state) {
    if (state == '' || state == 'undetermined') {
      state = 'draft';
    }
    let states = [];
    // demo prefix uses only draft state
    if (this.model.get('prefix') === '10.5072') {
      states = ['draft'];
      this.set('registered', true);
      this.set('findable', true);
    } else {
      states = stateList[state];
    }
    states.forEach((item) => {
      this.set(item, false);
    });
  },

  actions: {
    selectState(state) {
      this.selectState(state);
    },
    setStates(state) {
      this.setStates(state);
    }
  }
});
