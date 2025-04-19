describe('Test Scenario 2', () => {
  it('Should have a heading', () => {
    cy.visit('https://example.com');
    cy.get('h1').should('be.visible');
  });
});
