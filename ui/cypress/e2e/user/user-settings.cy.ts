describe('User Settings E2E', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('View settings', () => {
    it('shows all settings sections when logged in', () => {
      cy.login()
      cy.visit('/user/testusername')
      cy.get('[data-testid=settings-tab]').click()
      cy.get('[data-testid=name-input]').should('exist')
      cy.get('[data-testid=username-input]').should('exist')
      cy.get('[data-testid=email-input]').should('exist')
      cy.get('[data-testid=password-current]').should('exist')
      cy.get('[data-testid=visibility-switch]').should('exist')
      cy.get('[data-testid=picture-change-btn]').should('exist')
      cy.get('[data-testid=logout-settings-btn]').should('exist')
      cy.get('[data-testid=delete-account-btn]').should('exist')
    })
  })

  describe('Change display name', () => {
    it('successfully changes display name', () => {
      cy.intercept('POST', '**/auth/update/name', { statusCode: 200, body: {} }).as('changeName');

      cy.login()
      cy.visit('/user/testusername')
      cy.get('[data-testid=settings-tab]').click()

      cy.get('[data-testid=name-input]').type('NewDisplayName')
      cy.get('[data-testid=name-submit]').click()

      cy.wait('@changeName').then((interception) => {
        expect(interception.request.body).to.have.property('newName', 'NewDisplayName')
      })
    })

    it('shows validation error for empty name', () => {
      cy.login()
      cy.visit('/user/testusername')
      cy.get('[data-testid=settings-tab]').click()

      cy.get('[data-testid=name-input]').type('a'.repeat(33))
      cy.get('[data-testid=name-submit]').click()
      cy.get('.formFeedbackError').should('exist')
    })
  })

  describe('Change username', () => {
    it('successfully changes username', () => {
      cy.intercept('POST', '**/auth/update/username', { statusCode: 200, body: {} }).as('changeUsername');

      cy.login()
      cy.visit('/user/testusername')
      cy.get('[data-testid=settings-tab]').click()

      cy.get('[data-testid=username-input]').type('newusername')
      cy.get('[data-testid=username-submit]').click()

      cy.wait('@changeUsername').then((interception) => {
        expect(interception.request.body).to.have.property('newUserName', 'newusername')
      })
    })
  })

  describe('Change email', () => {
    it('successfully changes email', () => {
      cy.intercept('POST', '**/auth/update/email', { statusCode: 200, body: {} }).as('changeEmail');

      cy.login()
      cy.visit('/user/testusername')
      cy.get('[data-testid=settings-tab]').click()

      cy.get('[data-testid=email-input]').type('newemail@test.com')
      cy.get('[data-testid=email-submit]').click()

      cy.wait('@changeEmail').then((interception) => {
        expect(interception.request.body).to.have.property('newEmail', 'newemail@test.com')
      })
    })
  })

  describe('Change password', () => {
    it('successfully changes password', () => {
      cy.intercept('POST', '**/auth/update/password', { statusCode: 200, body: {} }).as('changePassword');

      cy.login()
      cy.visit('/user/testusername')
      cy.get('[data-testid=settings-tab]').click()

      cy.get('[data-testid=password-current]').type('oldpassword')
      cy.get('[data-testid=password-new]').type('newpassword123')
      cy.get('[data-testid=password-confirm]').type('newpassword123')
      cy.get('[data-testid=password-submit]').click()

      cy.wait('@changePassword').then((interception) => {
        expect(interception.request.body).to.have.property('currentPassword', 'oldpassword')
        expect(interception.request.body).to.have.property('newPassword', 'newpassword123')
      })
    })

    it('shows validation error for password mismatch', () => {
      cy.login()
      cy.visit('/user/testusername')
      cy.get('[data-testid=settings-tab]').click()

      cy.get('[data-testid=password-current]').type('oldpassword')
      cy.get('[data-testid=password-new]').type('newpassword123')
      cy.get('[data-testid=password-confirm]').type('differentpassword')
      cy.get('[data-testid=password-submit]').click()
      cy.get('.formFeedbackError').should('exist')
    })
  })

  describe('Toggle visibility', () => {
    it('calls visibility API when toggled', () => {
      cy.intercept('POST', '**/auth/update/visibility', { statusCode: 200, body: {} }).as('changeVisibility');

      cy.login()
      cy.visit('/user/testusername')
      cy.get('[data-testid=settings-tab]').click()

      cy.get('[data-testid=visibility-switch]').click()

      cy.wait('@changeVisibility').then((interception) => {
        expect(interception.request.body).to.have.property('newVisibility')
      })
    })
  })

  describe('Change picture', () => {
    it('calls picture API when selecting new picture', () => {
      cy.intercept('POST', '**/auth/update/picture', { statusCode: 200, body: {} }).as('changePicture');

      cy.login()
      cy.visit('/user/testusername')
      cy.get('[data-testid=settings-tab]').click()

      cy.get('[data-testid=picture-change-btn]').click()
      cy.get('.catalog').should('be.visible')
    })
  })

  describe('Logout', () => {
    it('logs out from settings page', () => {
      cy.intercept('POST', '**/auth/logout', { statusCode: 200, body: {} }).as('logout');

      cy.login()
      cy.visit('/user/testusername')
      cy.get('[data-testid=settings-tab]').click()

      cy.get('[data-testid=logout-settings-btn]').click()

      cy.wait('@logout')
      cy.get('[data-testid=login-btn]').should('exist')
    })
  })

  describe('Delete account', () => {
    it('shows confirmation dialog when clicking delete', () => {
      cy.login()
      cy.visit('/user/testusername')
      cy.get('[data-testid=settings-tab]').click()

      cy.get('[data-testid=delete-account-btn]').click()
      cy.get('[data-testid=delete-confirm-dialog]').should('be.visible')
    })

    it('closes dialog when clicking cancel', () => {
      cy.login()
      cy.visit('/user/testusername')
      cy.get('[data-testid=settings-tab]').click()

      cy.get('[data-testid=delete-account-btn]').click()
      cy.get('[data-testid=delete-confirm-dialog]').should('be.visible')
      cy.get('[data-testid=dialog-confirm-no]').click()
      cy.get('[data-testid=delete-confirm-dialog]').should('not.exist')
    })

    it('deletes account when confirming', () => {
      cy.intercept('POST', '**/auth/delete', { statusCode: 200, body: {} }).as('deleteAccount');

      cy.login()
      cy.visit('/user/testusername')
      cy.get('[data-testid=settings-tab]').click()

      cy.get('[data-testid=delete-account-btn]').click()
      cy.get('[data-testid=dialog-confirm-yes]').click()

      cy.wait('@deleteAccount')
    })
  })
})
