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
        cy.get('.card-header').should('have.length.at.least', 3);

        // Verify specific column titles match expected phases
        cy.get('.card-header').eq(0).should('contain', 'Initial Screening');
        cy.get('.card-header').eq(1).should('contain', 'Technical Interview');
        cy.get('.card-header').eq(2).should('contain', 'Manager Interview');

        // 3. Verify specific candidate names in columns
        // Check Initial Screening column for Carlos García
        cy.get('.card-header').eq(0).parent().find('.card-body .card .card-title')
          .should('contain', 'Carlos García');

        // Check Technical Interview column for Jane Smith and John Doe
        cy.get('.card-header').eq(1).parent().find('.card-body .card .card-title')
          .then(($candidates) => {
              expect($candidates.text()).to.include('Jane Smith');
              expect($candidates.text()).to.include('John Doe');
          });

        // 4. Verify candidate details view
        // Click on the first candidate card
        cy.get('.card-body .card').first().click();

        // Verify the offcanvas with candidate details appears
        cy.get('.offcanvas.show').should('be.visible');
        cy.get('.offcanvas-title').should('contain', 'Detalles del Candidato');

        // Check that candidate information is displayed
        cy.get('.offcanvas-body h5').should('be.visible');
    });
});
