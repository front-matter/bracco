import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Ability | repository', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    var ability = this.owner.lookup('ability:repository');
    assert.ok(ability);
  });
});