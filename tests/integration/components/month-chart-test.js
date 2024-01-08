import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | month-chart', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`{{month-chart}}`);
    let currentYear = new Date().getFullYear();
    let startDate = (currentYear - 10).toString();

    assert.dom('h3.panel-title').hasText('Charts by month');
    assert.dom('div.panel-body').hasText(`0 January ${startDate}NaN`);
  });
});
