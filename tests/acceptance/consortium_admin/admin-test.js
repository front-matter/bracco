import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { currentURL, visit } from '@ember/test-helpers';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | consortium_admin | admin', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function() {
    await authenticateSession({
      uid: 'dc',
      name: 'DataCite Consortium',
      role_id: 'provider_admin',
      provider_id: 'dc',
    });
  });

  test('is logged in', async function(assert) {
    await visit('/');

    assert.dom('a#account_menu_link').hasText('DC');
  });

  test('visiting homepage', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/providers/dc');
    assert.dom('h2.work').hasText('DataCite Consortium');
  });

  // the following pages require authentication. Redirects to provider homepage otherwise
  test('visiting settings', async function(assert) {
    await visit('/settings');

    assert.equal(currentURL(), '/providers/dc');
    assert.dom('h2.work').hasText('DataCite Consortium');
  });

  test('visiting providers', async function(assert) {
    await visit('/providers');

    assert.equal(currentURL(), '/providers/dc');
    assert.dom('h2.work').hasText('DataCite Consortium');
  });

  test('visiting repositories', async function(assert) {
    await visit('/repositories');

    assert.equal(currentURL(), '/providers/dc');
    assert.dom('h2.work').hasText('DataCite Consortium');
  });

  test('visiting prefixes', async function(assert) {
    await visit('/prefixes');

    assert.equal(currentURL(), '/providers/dc');
    assert.dom('h2.work').hasText('DataCite Consortium');
  });

  test('visiting prefix 10.5038', async function(assert) {
    await visit('/prefixes/10.5038');

    assert.equal(currentURL(), '/prefixes/10.5038');
    assert.dom('div.alert-warning').includesText('The page was not found.');
  });

  test('visiting dois', async function(assert) {
    await visit('/dois');

    assert.equal(currentURL(), '/providers/dc');
    assert.dom('h2.work').hasText('DataCite Consortium');
  });

  // test('visiting specific doi', async function(assert) {
  //   await visit('/dois/10.70048%2Fe605-dg05');

  //   assert.equal(currentURL(), '/dois/10.70048%2Fe605-dg05');
  //   assert.dom('h2.work').hasText('10.70048/e605-dg05');
  // });

  test('visiting users', async function(assert) {
    await visit('/users');

    assert.equal(currentURL(), '/providers/dc');
    assert.dom('h2.work').hasText('DataCite Consortium');
  });

  test('visiting specific user', async function(assert) {
    await visit('/users/0000-0003-1419-2405');

    assert.equal(currentURL(), '/users/0000-0003-1419-2405');
    assert.dom('h2.work').hasText('Martin Fenner');
  });
});