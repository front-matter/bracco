/// <reference types="cypress" />
/* eslint-disable no-undef */

function escapeRE(string) {
  //return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

describe('ACCEPTANCE: CLIENT_ADMIN | DOIS', () => {
  const waitTime = 1000;
  const waitTime2 = 2000;
  const prefix = '10.80225';
  const dayjs = require('dayjs');
  const yearInRange = dayjs().add(Cypress.env('max_mint_future_offset'), 'year').format('YYYY');
  const yearOutOfRange = String(Number(yearInRange) + 1);

  const creator = 'Miller, Elizabeth';

  before(function () {
    cy.login(Cypress.env('client_admin_username'), Cypress.env('client_admin_password'));
    cy.setCookie('_consent', 'true');
    cy.wait(waitTime2);
  });

  beforeEach(() => {
    // TBD - set up test environment
  });

  after(function () {
    // TBD - Clean up any resources created for the test. (only local dev and stage).
    // cy.log('TBD - CLEAN UP RESOURCES AFTER TEST');
    cy.clearAllSessionStorage()
  });

  it('is logged in to dois page', () => {
    cy.visit('/repositories/datacite.test/dois');
    cy.url().should('include', '/repositories/datacite.test/dois').then (() => {

      // Has Fabrica logo
      cy.get('img.fabrica-logo').should('exist').should('have.attr', 'src').should('include', 'fabrica-logo.svg');
      
      // Has upper right user profile link.
      cy.get('h2.work').contains('DataCite Test Repository');
      cy.get('a#account_menu_link').should('contain', 'DATACITE.TEST');

      // Has tabs with correct one activated.
      cy.get('ul.nav-tabs li a').contains(/Info/i)
        .and('have.attr', 'href').and('include', '/repositories/datacite.test');
      cy.get('ul.nav-tabs li a').contains(/Settings/i)
        .and('have.attr', 'href').and('include', '/repositories/datacite.test/settings');
      cy.get('ul.nav-tabs li a').contains(/Prefixes/i)
        .and('have.attr', 'href').and('include', '/repositories/datacite.test/prefixes');
      cy.get('ul.nav-tabs li.active a').contains(/DOIs/i)
        .and('have.attr', 'href').and('include', '/repositories/datacite.test/dois');

      // Has left sidebar buttons.
      cy.get('[data-test-left-sidebar]').should('be.visible').within(($sidebar) => {
        // Create DOI button - would like to do more testing but seems impossible in Cypress.
        cy.get('.create-doi-button').contains(/Create DOI/i);
        cy.get('.create-doi-button button.dropdown-toggle').click({ force: true }).then(($obj) => {
          //cy.get('.create-doi-button ul.dropdown-menu')
          //cy.get('.create-doi-button ul.dropdown-menu ul li a').contains(/DOI\s*Form/i);
          //cy.get('.create-doi-button ul.dropdown-menu ul li a').contains(/File\s*Upload/i);
        });
      });

      cy.get('button.export-basic-metadata').should('exist');

      // Has left sidebar facets.
      cy.get('.facets h4').contains(/Resource\s*Type/i);
      cy.get('.facets h4').contains(/Year\s*created/i);
      cy.get('.facets h4').contains(/Prefix/i);
      cy.get('.facets h4').contains(/Schema\s*Version/i);

      // Has search form
      cy.get('form #search').within(($searchBar) => {
        cy.get('input[name="query"]')
          .and('have.attr', 'placeholder').should('match', /Type\sto\ssearch\.\sFor\sexample\s10\.4121\/17185607\.v1/i);
        cy.get('button').contains(/Search/i);
      });
    });
  });

  it('is creating a doi - FORM', () => {
    cy.visit('/repositories/datacite.test/dois/new');
    cy.url().should('include', '/repositories/datacite.test/dois/new').then(() => {

      ////////// FILL IN FORM

      // Leave state at 'draft'.

      // Set 'url'.
      cy.get('div#url .form-text').contains('Should be a https URL — within the allowed domain(s) of your repository if domain restrictions are enabled in the repository settings. Http and ftp are also supported. For example http://example.org')
      cy.get('input#url-field').should('be.visible').type('https://example.org', { force: true });

      // Set creator.
      cy.get('.help-block.name-identifier-field').should('be.visible').should('have.text','Use name identifier expressed as URL. Uniquely identifies an individual or legal entity, according to various schemas, e.g. ORCID, ROR or ISNI. The Given Name, Family Name, and Name will automatically be filled out for ORCID and ROR identifiers.')
      cy.get('input[data-test-name]').should('be.visible').type(creator, { force: true });
      cy.get('#toggle-creators').should('be.visible').click({ force: true }).then(($toggle) => {
        cy.get('#toggle-creators').contains('Show 1 creator');
      });

      // Set title.
      cy.get('input.title-field').should('be.visible').type('The title', { force: true });
      cy.get('#toggle-titles').should('be.visible').click({ force: true }).then(($toggle) => {
        cy.get('#toggle-titles').contains('Show 1 title');
      });

      // Set publisher.
      cy.get('[data-test-doi-publisher]').click({ waitForAnimations: true }).then(($dropdown) => {
        // Creates a new publisher
        cy.get('input.ember-power-select-search-input').type('something{enter}', { force: true });
        cy.get('[data-test-doi-publisher] .ember-power-select-selected-item').contains("something")
      });

      // Set state to 'registered'. Test out-of-range year.

      cy.get('#registered-radio').check({ waitForAnimations: true });
      cy.get('#publication-year-field').should('be.visible').type(yearOutOfRange, { force: true, waitForAnimations: true });
      cy.get('body').click(0,0);
      cy.get('div#publication-year-form-group').should('have.class', 'has-error')

      // Test in-range year.

      cy.get('#publication-year-field').should('be.visible').clear({ force: true, waitForAnimations: true });
      cy.get('#publication-year-field').should('be.visible').type(yearInRange, { force: true, waitForAnimations: true });
      cy.get('body').click(0,0);
      cy.get('input#publication-year-field').should('have.class', 'is-valid')
      cy.get('div#publication-year .form-text').contains('Must be a year between 1000 and ' + yearInRange + '.');

      // Set state back to draft

      cy.get('#draft-radio').check({ waitForAnimations: true });
    
      // Set resource type.
      // Causes the aria dropdown to be populated and displayed so that selection can be made.
      cy.get('div#resource-type-general div[role="combobox"]').click({ force: true }).then(($dropdown) => {
        // Makes the selection.
        cy.get("ul.ember-power-select-options li").contains("Text").click({ force: true });
      });

      // Set language.
      // Causes the aria dropdown to be populated and displayed so that selection can be made.
      cy.get('div#doi-language div[role="combobox"]').click({ waitForAnimations: true }).then(($dropdown) => {
        // Creates a new invalid language.
        cy.get('input.ember-power-select-search-input').type('Borgesian{enter}', { force: true });
        cy.get('.invalid-feedback').contains('Must be a valid Language code.');
      });
      cy.get('div#doi-language div[role="combobox"]').click({ waitForAnimations: true }).then(($dropdown) => {
        // Creates a new valid language.
        cy.get('input.ember-power-select-search-input').type('pre-US{enter}', { force: true });
        cy.get('.form-text').contains('The default Language vocabulary is provided by ISO 639-1. Any new language should be provided using two-letter or three-letter language codes.');
      });
      cy.get('div#doi-language div[role="combobox"]').click({ waitForAnimations: true }).then(($dropdown) => {
        // Makes a default selection.
        cy.get("ul.ember-power-select-options li").contains("English").click({ waitForAnimations: true });
        cy.get('.form-text').contains('The default Language vocabulary is provided by ISO 639-1. Any new language should be provided using two-letter or three-letter language codes.');
      });

      // Set geolocation.
      cy.get('#add-geolocation').click({ force: true }).then(($subform) => {
        cy.get('[data-test-geo-location-place]').should('be.visible').type('Amsterdam, Novoravis hotel', { force: true });
        cy.get('#toggle-geolocations').should('be.visible').click({ force: true }).then(($toggle) => {
          cy.get('#toggle-geolocations').contains('Show 1 geolocation');
        });
      });

      // Set subject.
      cy.get('#add-subject').click({ force: true }).then(($subform) => {
        cy.get('.ember-power-select-placeholder').contains('Search Subject from the OECD Fields of Science and Technology (FOS) OR create a new keyword');
        // Causes the aria dropdown to be populated and displayed so that selection can be made.
        cy.get('[data-test-doi-subject] div[role="combobox"]').first().click({ force: true }).then(($dropdown) => {
          // Makes the selection from the dropdown.
          cy.get('input.ember-power-select-search-input').type('Optics{enter}', { force: true });
          cy.get('input.subject-classification-code-field').first().type('O123', { force: true });
          cy.get('#toggle-subjects').should('be.visible').click({ force: true }).then(($toggle) => {
            cy.get('#toggle-subjects').contains('Show 1 subject');
          });
        });
      });

      // Set contributor.
      cy.get('#add-contributor').click({ waitForAnimations: true }).then(($subform) => {
        cy.get('.help-block.name-identifier-field').should('be.visible').should('have.text','Use name identifier expressed as URL. Uniquely identifies an individual or legal entity, according to various schemas, e.g. ORCID, ROR or ISNI. The Given Name, Family Name, and Name will automatically be filled out for ORCID and ROR identifiers.')
        // Causes the aria dropdown to be populated and displayed so that selection can be made.
        cy.get('[doi-contributor-type] div[role="combobox"]').click({ waitForAnimations: true }).then(($dropdown) => {
          // Makes the selection from the dropdown.
          cy.get("ul.ember-power-select-options li").contains("Data collector").click({ waitForAnimations: true });
          cy.get('#toggle-contributors').should('be.visible').click({ waitForAnimations: true }).then(($toggle) => {
            cy.get('#toggle-contributors').contains('Show 1 contributor');
          })
        })
      });

      // Set version.
      cy.get('#version-field').should('be.visible').type('67', { force: true });

      // Set format.
      cy.get('#add-format').click({ force: true }).then(($subform) => {
        // cy.get('.ember-power-select-placeholder').contains('Search standard formats OR create a new format');
        // Causes the aria dropdown to be populated and displayed so that selection can be made.
        cy.get('[doi-format] div[role="combobox"]').click({ force: true }).then(($dropdown) => {
          // Makes the selection from the dropdown.
          cy.get('input.ember-power-select-search-input').type('Optics{enter}', { force: true });
          cy.get('#toggle-formats').should('be.visible').click({ force: true }).then(($toggle) => {
            cy.get('#toggle-formats').contains('Show 1 format');
          });
        });
      });

      // Set alternate identifier.
      cy.get('#add-alternate-identifier').click({ force: true }).then(($subform) => {
        cy.get('[data-test-alternate-identifier-type] div[role="combobox"]').click({ force: true }).then(($dropdown) => {
          cy.get("ul.ember-power-select-options li").contains("DOI").click({ force: true });
          cy.get('#toggle-alternate-identifiers').should('be.visible').click({ waitForAnimations: true }).then(($toggle) => {
            cy.get('#toggle-alternate-identifiers').contains('Show 1 alternate identifier');
          });
        });
      });

      // Set related identifier.
      cy.get('#add-related-identifier').click({ force: true }).then(($subform) => {
        cy.get('[data-test-related-identifier]').should('be.visible').type('10.0330/skv0002', { force: true }).then(() => {
          cy.get('[data-test-related-identifier-type] .ember-power-select-selected-item').contains('DOI');
        });
        cy.get('[data-test-related-identifier]').should('be.visible').type('{selectAll}https://doi.org/10.1080/00393630.2018.1504449', { force: true }).then(() => {
          cy.get('[data-test-related-identifier-type] .ember-power-select-selected-item').contains('DOI');
        });
        // Causes the aria dropdown to be populated and displayed so that selection can be made.
        cy.get('[data-test-related-relation-type] div[role="combobox"]').click({ force: true }).then(() => {
          // Makes the selection from the dropdown. (Type it.)
          cy.get('input.ember-power-select-search-input').type('References{enter}', { force: true }).then(() => {

            // Causes the aria dropdown to be populated and displayed so that selection can be made.
            cy.get('[data-test-related-resource-type] div[role="combobox"]').click({ force: true }).then(() => {
              // Makes the selection from the dropdown. (Type or click on it.  Since choices change as you type, that is the better method.)
              cy.get('input.ember-power-select-search-input').first().type('Text{enter}', { force: true }).then(() => {
                cy.get('#toggle-related-identifiers').should('be.visible').click({ force: true }).then(($toggle) => {
                  cy.get('#toggle-related-identifiers').contains('Show 1 related identifier');
                });
              });
            });
          });
        });
      });

      // Set funding reference.
      cy.get('#add-funding-reference').click({ force: true }).then(($subform) => {
        // Causes the aria dropdown to be populated and displayed so that selection can be made.
        cy.get('[data-test-funder-name] div[role="combobox"]').click({ waitForAnimations: true,force: true }).then(() => {
          // Makes the selection from the dropdown. (Type it.)
          cy.get('input.ember-power-select-search-input').type('Action for M.E.{enter}', { force: true }).then(() => {

            // BUG: This field should be disabled as a result of selecting 'Action for...' from the dropdown.
            // cy.get('[data-test-funder-identifier]').should('be.disabled');
            // cy.get('[data-test-funder-identifier]').should('have.attr', 'disabled');

            cy.get('[data-test-funder-identifier-type] div[role="combobox"]').within(($obj) => {
              // cy.wrap($obj).should('have.attr', 'aria-disabled');
              // cy.wrap($obj).get('.ember-power-select-selected-item').contains('Crossref Funder ID');
            });
          });
        }).then(() => {
          cy.get('[data-test-award-number]').should('be.visible').type('G2342342', { force: true });
          cy.get('[data-test-award-uri]').should('be.visible').type('https://schema.datacite.org/meta/kernel-4', { force: true });
        }).then(() => {
          cy.get('#toggle-funding-references').should('be.visible').click({ force: true }).then(($toggle) => {
            cy.get('#toggle-funding-references').contains('Show 1 funding reference');
          });
        });
      });

      // Set related item.
      cy.get('#add-related-item').click({ force: true}).then(($subform) => {
        // Fill in the title
        cy.get('[data-test-related-item-title]').should('be.visible').type('HEPP Yearly', { force: true });
        // Select the type
        cy.get('[data-test-related-item-type] div[role="combobox"]').click({ force: true}).then(($dropdown) => {
          cy.get("ul.ember-power-select-options li").contains("Journal").click({ waitForAnimations: true, force: true });
        })
        // Add related item identifier
        cy.get('[data-test-related-item-identifier]').should('be.visible').type('10.12345/example').then(() => {
          // Check that the type is set
          cy.get('[data-test-related-item-identifier-type]').contains('DOI')
        })
        cy.get('[data-test-related-item-identifier]').should('be.visible').type('{selectAll}https://doi.org/10.1080/00393630.2018.1504449').then(() => {
          // Check that the type is set
          cy.get('[data-test-related-item-identifier-type]').contains('DOI')
        })
        // Check the toggle
        cy.get('#toggle-related-items').should('be.visible').click({ force: true }).then(($toggle) => {
          cy.get('#toggle-related-items').contains('Show 1 related item');
        });
      })

      // Set 'prefix'. Random suffix.
      cy.get('#prefix-field div[role="combobox"]').click({ force: true }).then(() => {
        cy.wait(waitTime);
        cy.get('div.ember-power-select-dropdown').within(() => {
          cy.get("ul.ember-power-select-options li").contains(prefix).click({ force: true });
        });
      });

    }).then(() => {
      // Get the suffix for later tests
      cy.get("#suffix-field").invoke('val').then( (value) => {
        Cypress.env('suffix', value)
      });

      ////////// DONE FILLING IN FORM.  PRESS THE CREATE BUTTON.

      cy.get('button#doi-create').should('be.visible').click();
      cy.wait(waitTime);
      cy.location('pathname').should('contain', '/dois/' + prefix)

      // We need to test the success page (the DOI summary page) to make sure the DOI was created correctly.
      
      // Cypress form bug? The suffix is not always available from the form field (above).  Get it from the url.
      cy.url().then( (url) => {
        Cypress.env('suffix', decodeURIComponent(url).split('/').pop())
      })
      
    });
  });

  it('is editing a doi - FORM', () => {
    cy.visit('/dois/' + encodeURIComponent(prefix + '/' + Cypress.env('suffix')) + '/edit');
    cy.url().should('include', '/dois/' + encodeURIComponent(prefix + '/' + Cypress.env('suffix')) + '/edit').then(() => {

      cy.wait(waitTime);
      // Get entered creator.
      cy.get('input[data-test-name]').should('be.visible').should('have.value', creator)
      cy.get('.add-name-identifier').should('be.visible')
      cy.get('.add-affiliation').should('be.visible')

    })
  });

  it('is creating a doi - FILE UPLOAD', () => {
    cy.visit('/repositories/datacite.test/dois/upload');
    cy.url().should('include', '/repositories/datacite.test/dois/upload').then(() => {

      // Leave state at 'draft'.

      // Set 'url'.
      cy.wait(waitTime);
      cy.get('div#url .form-text').contains('Should be a https URL — within the allowed domain(s) of your repository if domain restrictions are enabled in the repository settings. Http and ftp are also supported. For example http://example.org')
      cy.get('input#url-field').should('be.visible').type('https://example.org', { force: true })
        .clickOutside();
      cy.get('#url-field').should('have.class', 'is-valid');

      // Do the file upload. (just xml for now).  (Wow. That was easy!)
      cy.fixture('doi_sample_1.xml').then(fileContent => {
        cy.get('input#upload-file[type="file"]').attachFile({
            fileContent: fileContent.toString(),
            fileName: 'doi_sample_1.xml',
            mimeType: 'application/xml'
        });
      });

      // Set 'prefix'. Random suffix.
      cy.get('#prefix-field div[role="combobox"]').click({ force: true }).then(() => {
        cy.wait(waitTime);
        cy.get('div.ember-power-select-dropdown').within(() => {
          cy.get("ul.ember-power-select-options li").contains(prefix).click({ force: true });
        });
      });
    }).then(() => {
      ////////// DONE FILLING IN FORM.  PRESS THE CREATE BUTTON.
      cy.wait(waitTime);
      cy.get('button#doi-create').should('be.visible').click();
      cy.wait(waitTime);
      cy.location('pathname').should('contain', '/dois/' + prefix)
    });
  });

  it('is deleting a doi', () => {
    cy.getCookie('_jwt').then((cookie) => {

      // Create a doi to be deleted.
      cy.createDoi(prefix, Cypress.env('api_url'), cookie.value).then((id) => {
        cy.log('DOI: ' + id);
        const uri = 'dois/' +  encodeURIComponent(id) + '/delete';
        const target_uri = '/repositories/datacite.test/dois';

        cy.visit(uri);
        cy.url().should('include', uri).then(() => {

          cy.wait(waitTime);
          cy.get('#confirm-doi-field').click({ force: true }).type(id, { force: true });
          cy.wait(waitTime);
          cy.get('#confirm-doi-field').should('have.class', 'is-valid');
        }).then (() => {
          cy.get('button#delete-doi').click({force: true});
          cy.wait(waitTime);

          cy.url().should('include', target_uri);
        });
      });
    });
  });

  it('is updating a doi - FORM', () => {
    cy.getCookie('_jwt').then((cookie) => {

      // Create a doi to be updated.
      cy.createDoi(prefix, Cypress.env('api_url'), cookie.value).then((id) => {
        cy.log('DOI: ' + id);
        const uri = 'dois/' +  encodeURIComponent(id) + '/edit';
        const target_uri = '/dois/' +  encodeURIComponent(id);

        cy.visit(uri);
        cy.url().should('include', uri).then(() => {
          cy.wait(waitTime);
        }).then(() => {

          ////////// DONE FILLING IN FORM.  PRESS THE UPDATE BUTTON.
          cy.get('button#doi-update').should('be.visible').click({force: true});
          cy.wait(waitTime);
          cy.location('pathname').should('match', (new RegExp(escapeRE(target_uri) + '$')));
        });
      });
    });
  });

  it('is updating a doi - FILE UPLOAD', () => {
    cy.getCookie('_jwt').then((cookie) => {

      cy.createDoiXmlUpload(prefix, 'doi_sample_1.xml', Cypress.env('api_url'), cookie.value).then((id) => {
        cy.log('DOI: ' + id);
        const uri = 'dois/' +  encodeURIComponent(id) + '/modify';
        const target_uri = '/dois/' +  encodeURIComponent(id);

        cy.visit(uri);
        cy.url().should('include', uri).then(() => {

          cy.get('#metadata textarea').clear({force: true}).then((textarea) => {
            cy.wait(waitTime);
            // Do the file upload. (just xml for now).  (Wow. That was easy!)
            cy.fixture('doi_sample_1-update.xml').then((fileContent) => {
              cy.get('input#upload-file[type="file"]').attachFile({
                  fileContent: fileContent.toString(),
                  fileName: 'doi_sample_1-update.xml',
                  mimeType: 'application/xml'
              });
            });
            cy.wait(waitTime2);
          }).then(() => {
            ////////// DONE FILLING IN FORM.  PRESS THE CREATE BUTTON.
            cy.get('button#doi-modify').should('be.visible').click({force: true});
            cy.wait(waitTime);
            cy.location('pathname').should('match', (new RegExp(escapeRE(target_uri) + '$')));
            cy.wait(waitTime);

            // Do a gross check for the updated text.
            cy.contains('Updated Full DataCite XML Example');
          });
        });
      });
    });
  });

  it('visiting specific doi', () => {
    cy.getCookie('_jwt').then((cookie) => {

      // Create a doi to be visited.
      cy.createDoi(prefix, Cypress.env('api_url'), cookie.value).then((id) => {
        cy.log('DOI: ' + id);
        const uri = 'dois/' +  encodeURIComponent(id) + '/edit';
        const target_uri = '/dois/' +  encodeURIComponent(id);

        cy.visit(uri);
        cy.url().should('include', uri);
      });
    });
  });

  it('visiting specific doi with uppercase identifier in URL subdirectory', () => {
    cy.getCookie('_jwt').then((cookie) => {

      // Create a doi to be visited.
      cy.createDoi(prefix, Cypress.env('api_url'), cookie.value).then((id) => {
        cy.log('DOI: ' + id);
        const uri = 'dois/' +  encodeURIComponent(id).toUpperCase() + '/edit';
        const target_uri = '/dois/' +  encodeURIComponent(id);

        cy.visit(uri);
        cy.url().should('include', uri);
      });
    });
  });

  it('can see dois when using capitalized identifier URL subdirectory', () => {
    cy.visit('/repositories/DATACITE.TEST/dois');
    cy.url().should('include', '/repositories/DATACITE.TEST/dois').then(() => {

      // Prefix page should be populated.
      cy.contains('No DOIs found.').should('not.exist')
    });
  });
});
