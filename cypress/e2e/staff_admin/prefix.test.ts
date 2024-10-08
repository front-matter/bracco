/// <reference types="cypress" />
/* eslint-disable no-undef */

describe('Admin: Prefix', () => {
  const waitTime = 1000;
  const waitTime2 = 2000;

  before(function () {
    cy.login(Cypress.env('staff_admin_username'), Cypress.env('staff_admin_password'));
    cy.setCookie('_consent', 'true');
    cy.wait(waitTime2);
  })

  beforeEach(() => {
    // TBD - set up test environment
  });

  after(function () {
    // TBD - Clean up any resources created for the test. (only local dev and stage).
    // cy.log('TBD - CLEAN UP RESOURCES AFTER TEST');
    cy.clearAllSessionStorage()
  });

  it('search prefixes', () => {
    cy.visit('/prefixes');
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/prefixes');
    });
    cy.wait(waitTime2);
    cy.get('input[name="query"]')
      .type('10.5438{enter}', {waitForAnimations: true})
      .get('[data-test-prefix]')
      .should('contain', '10.5438');

    cy.get('h2.work').contains('DataCite');
    cy.get('li a.nav-link.active').contains('Prefixes');
    cy.get('div#search').should('exist');
    cy.get('div.panel.facets').should('exist');

    cy.get('a#add-prefixes').contains('Add Prefixes');

    // Create DOI button
    cy.get('.create-doi-button').should('not.exist');
  });

  it('filter prefixes', () => {
    cy.visit('/prefixes');
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/prefixes');
    });
    cy.get('a#prefix-with-repository')
      .click()
      .get('h3.member-results')
      .should('contain', 'Prefixes');

    cy.get('h2.work').contains('DataCite');
    cy.get('li a.nav-link.active').contains('Prefixes');
    cy.get('div#search').should('exist');
    cy.get('div.panel.facets').should('exist');

    cy.get('a#add-prefixes').contains('Add Prefixes');
  });

  it('visiting prefixes for member', () => {
    cy.visit('/providers/datacite/prefixes');
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/providers/datacite/prefixes');
    });
    cy.get('h2.work').contains('DataCite');
    cy.get('li a.nav-link.active').contains('Prefixes');
    cy.get('body').then(($body) => {
      if ($body.find('div.alert.alert-warning.show').length > 0) {
        cy.get('div.alert.alert-warning.show').contains('No prefixes found.');
      } else {
        cy.get('div#search').should('exist');
        cy.get('div.panel.facets').should('exist');
    
        cy.get('a#assign-prefix').contains('Assign Prefix');
      }
    })
  });
});
