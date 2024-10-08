import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';

module('Integration | Component | landing page', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`{{landing-page}}`);

    assert.ok(
      /^DataCite Fabrica+/.test(find('*').textContent.trim()),
      'begins with "DataCite Fabrica"'
    );

    // Template block usage:
    await render(hbs`
      <LandingPage>

      </LandingPage>
    `);

    assert.ok(
      /^DataCite Fabrica+/.test(find('*').textContent.trim()),
      'begins with "DataCite Fabrica"'
    );
  });
});
