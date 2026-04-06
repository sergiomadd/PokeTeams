// cypress/support/commands.ts
import { User } from '../../src/app/core/models/user/user.model';
import { AppState } from '../../src/app/core/store/app.state';

declare global {
  namespace Cypress {
    interface Chainable {
      login(user?: Partial<User>): void;
    }
  }
}

Cypress.Commands.add('login', (user?: Partial<User>) => {
  const fakeUser: User = {
    name: user?.name ?? 'TestName',
    username: user?.username ?? 'testusername',
    picture: user?.picture ?? 'https://poketeams.com/images/profile-pics/snorlax.png',
    country: user?.country,
    visibility: user?.visibility ?? true,
    email: user?.email ?? 'test@email.com',
    emailConfirmed: user?.emailConfirmed ?? true,
  };

  const fakeStore: AppState = {
    auth: {
      loggedUser: fakeUser,
      error: null,
      isAuthenticated: true,
      isSubmitting: false,
      success: true,
    },
    config: { theme: 'light', lang: 'en', teamsPerPage: 10 },
  };

  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.setItem('state', JSON.stringify(fakeStore));
    },
  });
});

export { };

