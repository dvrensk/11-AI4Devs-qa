/// <reference types="cypress" />

Cypress.Commands.add('resetTestDatabase', () => {
  // Use cy.exec to run our test setup script
  cy.exec('cd ../backend && npm run test:db:setup');
});

declare global {
  namespace Cypress {
    interface Chainable {
      resetTestDatabase(): Chainable<void>
    }
  }
}
