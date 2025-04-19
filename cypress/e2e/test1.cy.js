describe('Test Scenario 1', () => {
  it('Should visit example.com', () => {
    cy.visit('https://example.com');
    cy.title().should('include', 'Example Domain');
  });
});
