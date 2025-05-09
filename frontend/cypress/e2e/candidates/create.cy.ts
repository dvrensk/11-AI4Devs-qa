describe('Candidate Creation', () => {
    beforeEach(() => {
        cy.task('resetDatabase');
        cy.visit('/candidates/new');
    });

    it('should create a new candidate successfully', () => {
        cy.get('[data-testid="firstName"]').type('John');
        cy.get('[data-testid="lastName"]').type('Doe');
        cy.get('[data-testid="email"]').type('john.doe@example.com');
        cy.get('[data-testid="phone"]').type('1234567890');
        cy.get('[data-testid="submit"]').click();

        cy.url().should('include', '/candidates');
        cy.contains('John Doe').should('be.visible');
    });
});
