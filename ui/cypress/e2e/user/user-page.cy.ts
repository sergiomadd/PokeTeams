describe('User Page E2E', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('View own profile', () => {
    it('shows profile with teams and settings tabs when logged in', () => {
      cy.login()
      cy.visit('/user/testusername')
      cy.get('[data-testid=user-profile]').should('exist')
      cy.get('[data-testid=teams-tab]').should('exist')
      cy.get('[data-testid=settings-tab]').should('exist')
    })

    it('shows teams tab by default', () => {
      cy.login()
      cy.visit('/user/testusername')
      cy.get('[data-testid=user-teams]').should('exist')
    })

    it('switches to settings tab', () => {
      cy.login()
      cy.visit('/user/testusername')
      cy.get('[data-testid=settings-tab]').click()
      cy.get('[data-testid=user-settings]').should('exist')
    })
  })

  describe('Not found user', () => {
    it('shows not found when user does not exist', () => {
      cy.visit('/user/nonexistentuser')
      cy.get('app-not-found').should('exist')
    })
  })

  describe('Loading state', () => {
    it('shows loading spinner while loading', () => {
      cy.visit('/user/testusername')
      cy.get('.pokemon-spinner').should('exist')
    })
  })
})
