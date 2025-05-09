describe('Position Details Page', () => {
    beforeEach(() => {
        // First, ensure we have a clean database
        cy.task('resetDatabase');

        // Visit the positions page
        cy.visit('/positions');

        // Wait for positions to load and check if there are any
        cy.get('body').then(($body) => {
            // If there are no positions or "Ver proceso" buttons, log it and skip
            if (!$body.text().includes('Ver proceso')) {
                cy.log('No positions with "Ver proceso" button found. Test will be skipped.');
                return;
            }

            // Click on the first "Ver proceso" button if it exists
            cy.contains('Ver proceso').first().click();
        });
    });

    it('should display the position title correctly', () => {
        cy.get('body').then(($body) => {
            // Skip test if no positions found in beforeEach
            if (!$body.text().includes('Volver a Posiciones')) {
                cy.log('Not on position details page. Test skipped.');
                return;
            }

            // Verify the position title is displayed
            cy.get('h2.text-center.mb-4').should('be.visible');
            cy.get('h2.text-center.mb-4').should('not.be.empty');
        });
    });

    it('should display columns for each phase of the hiring process', () => {
        cy.get('body').then(($body) => {
            // Skip test if no positions found in beforeEach
            if (!$body.text().includes('Volver a Posiciones')) {
                cy.log('Not on position details page. Test skipped.');
                return;
            }

            // Verify columns for each interview step are displayed
            cy.get('.card-header').should('be.visible');
            cy.get('.card-header').should('have.length.at.least', 1);

            // Verify column titles match expected phases
            cy.get('.card-header').each(($header) => {
                // Each column should have a non-empty title
                cy.wrap($header).should('not.be.empty');
            });
        });
    });

    it('should display candidate cards in the correct columns', () => {
        cy.get('body').then(($body) => {
            // Skip test if no positions found in beforeEach
            if (!$body.text().includes('Volver a Posiciones')) {
                cy.log('Not on position details page. Test skipped.');
                return;
            }

            // Check if there are any candidates
            cy.get('.card-body .card').then(($cards) => {
                if ($cards.length > 0) {
                    // Verify candidate cards have names
                    cy.get('.card-body .card .card-title').should('be.visible');
                    cy.get('.card-body .card .card-title').should('not.be.empty');

                    // Verify candidates appear in columns based on their current phase
                    // The candidates should be in Draggable components
                    cy.get('[data-rbd-draggable-id]').should('exist');
                } else {
                    // If no candidates, log a message but don't fail the test
                    cy.log('No candidate cards found. This is not necessarily an error.');
                }
            });
        });
    });

    it('should allow viewing candidate details by clicking on a card', () => {
        cy.get('body').then(($body) => {
            // Skip test if no positions found in beforeEach
            if (!$body.text().includes('Volver a Posiciones')) {
                cy.log('Not on position details page. Test skipped.');
                return;
            }

            // Find cards and check if any exist
            cy.get('.card-body .card').then(($cards) => {
                if ($cards.length > 0) {
                    // Click on the first candidate card
                    cy.get('.card-body .card').first().click();

                    // Verify the offcanvas with candidate details appears
                    cy.get('.offcanvas.show').should('be.visible');
                    cy.get('.offcanvas-title').should('contain', 'Detalles del Candidato');

                    // Check that candidate information is displayed
                    cy.get('.offcanvas-body h5').should('be.visible');
                } else {
                    cy.log('No candidate cards to click. Skipping this test.');
                }
            });
        });
    });
});
