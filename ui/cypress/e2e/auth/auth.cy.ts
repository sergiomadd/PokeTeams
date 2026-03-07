describe('Auth E2E', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Menu state', () => {
    it('shows login button when unauthenticated', () => {
      cy.get('[data-testid=login-btn]').should('exist')
      cy.get('[data-testid=logout-btn]').should('not.exist')
      cy.get('[data-testid=user-profile-link]').should('not.exist')
    })

    it('shows user button when logged in', () => {
      cy.login()
      cy.get('[data-testid=login-btn]').should('not.exist')
      cy.get('[data-testid=user-profile-link]').should('exist')
    })
  })

  describe('Auth modal', () => {
    it('opens login form when clicking login button', () => {
      cy.get('[data-testid=login-btn]').click()
      cy.get('[data-testid=auth-modal]').should('be.visible')
      cy.get('[data-testid=login-username]').should('be.visible')
      cy.get('[data-testid=login-password]').should('be.visible')
    })

    it('closes modal when clicking close button', () => {
      cy.get('[data-testid=login-btn]').click()
      cy.get('[data-testid=auth-close-btn]').click()
      cy.get('[data-testid=auth-modal]').should('not.exist')
    })

    it('switches to signup form when clicking signup link', () => {
      cy.get('[data-testid=login-btn]').click()
      cy.get('[data-testid=show-signup-btn]').click()
      cy.get('[data-testid=signup-username]').should('be.visible')
      cy.get('[data-testid=signup-email]').should('be.visible')
    })

    it('switches to forgot password form', () => {
      cy.get('[data-testid=login-btn]').click()
      cy.get('[data-testid=forgot-password-link]').click()
      cy.get('[data-testid=forgot-submit]').should('be.visible')
    })

    it('switches back to login from signup', () => {
      cy.get('[data-testid=login-btn]').click()
      cy.get('[data-testid=show-signup-btn]').click()
      cy.get('[data-testid=show-login-btn]').click()
      cy.get('[data-testid=login-username]').should('be.visible')
    })
  })

  describe('Session persistence', () => {
    it('session persists after page reload', () => {
      cy.login()
      cy.reload()
      cy.get('[data-testid=user-profile-link]').should('exist')
    })
  })
})
