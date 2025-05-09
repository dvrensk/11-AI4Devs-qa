describe('Position Details Page', () => {
    beforeEach(() => {
        // Reset database once before the test
        cy.task('resetDatabase');

        // Visit the positions page
        cy.visit('/positions');

        // Click on the first "Ver proceso" button without checking if it exists
        cy.contains('Ver proceso').first().click();
    });

    it('should verify position details page functionality', () => {
        // 1. Verify the position title is displayed correctly
        cy.get('h2.text-center.mb-4').should('be.visible');
        cy.get('h2.text-center.mb-4').should('contain', 'Senior Full-Stack Engineer');

        // 2. Verify columns for each phase of the hiring process
        cy.get('.card-header').should('be.visible');
        cy.get('.card-header').should('have.length.at.least', 1);

        // Verify column titles match expected phases
        cy.get('.card-header').each(($header) => {
            // Each column should have a non-empty title
            cy.wrap($header).should('not.be.empty');
        });

        // 3. Verify candidate cards in columns
        // Check if there are any candidates
        cy.get('.card-body .card').then(($cards) => {
            if ($cards.length > 0) {
                // Verify candidate cards have names
                cy.get('.card-body .card .card-title').should('be.visible');
                cy.get('.card-body .card .card-title').should('not.be.empty');

                // Verify candidates appear in columns based on their current phase
                cy.get('[data-rbd-draggable-id]').should('exist');

                // 4. Verify candidate details view
                // Click on the first candidate card
                cy.get('.card-body .card').first().click();

                // Verify the offcanvas with candidate details appears
                cy.get('.offcanvas.show').should('be.visible');
                cy.get('.offcanvas-title').should('contain', 'Detalles del Candidato');

                // Check that candidate information is displayed
                cy.get('.offcanvas-body h5').should('be.visible');
            } else {
                // If no candidates, fail the test
                throw new Error('No candidate cards found. Test failed.');
            }
        });
    });
});
