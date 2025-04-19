describe('Test Scenario 3', () => {
  it('Should contain a paragraph', () => {
    cy.visit('https://example.com');
    cy.get('p').should('exist');
  });
});
