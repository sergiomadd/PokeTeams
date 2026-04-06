describe('Team editor tests', () => 
{
  beforeEach(() => 
  {
    cy.visit('/')
  })

  describe('General', () => 
  {
    it('Fills out non smart inputs', () => 
    {
      cy.get('[data-testid="player-name-input"]')
        .clear()
        .type('Test Player')
        .should('have.value', 'Test Player')
      cy.get('[data-testid="rental-code-input"]')
        .clear()
        .type('956834')
        .should('have.value', '956834')
      cy.get('[data-testid="title-input"]')
        .clear()
        .type('Test team')
        .should('have.value', 'Test team')
    })

    it('shows player name validation error', () => 
    {
      cy.get('[data-testid=player-name-input]').type('ZtG8XyjcVPTaUvqo3BBgQAD1ga3GnDz3Fr')
      cy.get('[data-testid=player-name-input]').should('have.class', 'controlInvalid')
      cy.get('[data-testid="player-name-input-error"]').should('be.visible')
    })

    it('shows rental validation error', () => 
    {
      cy.get('[data-testid=rental-code-input]').type('ZtG8XyjcVPTaUvqo3BBgQAD1ga3GnDz3Fr')
      cy.get('[data-testid=rental-code-input]').should('have.class', 'controlInvalid')
    })

    it('shows title error', () => 
    {
      cy.get('[data-testid=title-input]').clear()
      .type("Z0dSVqoK16JDZShtoT76ee3Pnn4DentJpYT0bv9pHvjK0mWkK5FRwMzM2v7UESvdQQDJwDHjZ1RJQW1aHHN5fH3QmVpNnQbh7KS0ojnsdjodnfioajnv234rtwergevnsdfb");
      cy.get('[data-testid=title-input]').should('have.class', 'controlInvalid')
    })
  })

  describe('Anonymous', () =>
  {
    it('shows anonymous warning icon', () => 
    {
      cy.get('.anon-warning').should('exist')
    })

    it('does not show match user button', () => 
    {
      cy.get('[data-testid=match-user-button]').should('not.exist')
    })

    it('does not show team options buttons', () => 
    {
      cy.get('[data-testid=team-option-buttons]').should('not.exist')
    })
  })

  describe('Logged user', () =>
  {
    beforeEach(() => 
    {
      cy.login()
    })

    it('shows logged user filled input', () =>
    {
      cy.get('[data-testid=loggeduser-input]').should('exist')
    })

    it('shows match user button', () => 
    {
      cy.get('[data-testid=match-user-button]').should('exist')
    })

    it('auto-fills player when match button clicked', () => 
    {
      cy.get('[data-testid=player-name-input]').should('have.value', '')
      cy.get('[data-testid=match-user-button]').click()
      cy.get('[data-testid=player-name-input]').should('have.value', 'testusername')
    })

    it('shows team options buttons', () => 
    {
      cy.get('[data-testid=team-option-buttons]').should('exist')
    })
  })
})