import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { UtilService } from '../../../../core/helpers/util.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { User } from '../../../../core/models/user/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { QueryService } from '../../../../core/services/query.service';
import { UserService } from '../../../../core/services/user.service';
import { authActions } from '../../../../core/store/auth/auth.actions';
import { selectError, selectIsSubmitting, selectLoggedUser, selectSuccess } from '../../../../core/store/auth/auth.selectors';
import { UserPageService } from '../../services/user-page.service';
import { UserSettingsComponent } from './user-settings.component';

// Host Component for testing
@Component({
  template: `<app-user-settings></app-user-settings>`,
  standalone: true,
  imports: [UserSettingsComponent]
})
class HostComponent {}

describe('UserSettingsComponent', () => {
  let hostComponent: HostComponent;
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<HostComponent>;
  let store: MockStore;
  let authService: jest.Mocked<AuthService>;
  let userService: jest.Mocked<UserService>;
  let utilService: jest.Mocked<UtilService>;
  let windowService: jest.Mocked<WindowService>;
  let queryService: jest.Mocked<QueryService>;
  let userPageService: jest.Mocked<UserPageService>;
  let socialAuthService: jest.Mocked<SocialAuthService>;

  const mockUser: User = {
    id: '1',
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    picture: '/assets/pics/avatar1.png',
    visibility: true,
    country: {
      id: 'ES',
      name: 'Spain',
      code: 'ES',
      iconPath: '/assets/flags/es.png'
    }
  } as User;

  const initialState = {
    auth: {
      user: mockUser,
      isSubmitting: false,
      error: null,
      success: false
    }
  };

  beforeEach(async () => {
    const authServiceMock = {
      // Add auth service methods as needed
    };

    const userServiceMock = {
      getAllProfilePics: jest.fn().mockResolvedValue([
        '/assets/pics/avatar1.png',
        '/assets/pics/avatar2.png'
      ])
    };

    const utilServiceMock = {
      getAuthFormError: jest.fn().mockReturnValue('Validation error'),
      passwordsMatch: jest.fn().mockReturnValue(() => null)
    };

    const windowServiceMock = {
      isMobile: jest.fn().mockReturnValue(false),
      isTabletPortraitOrLess: jest.fn().mockReturnValue(false)
    };

    const queryServiceMock = {
      queryCountriesCallback: jest.fn(),
      countriesAllCallback: jest.fn()
    };

    const userPageServiceMock = {
      user: new BehaviorSubject<User | undefined>(mockUser),
      loggedUserEmail: {
        email: 'test@example.com',
        emailConfirmed: true
      }
    };

    const socialAuthServiceMock = {
      signOut: jest.fn().mockResolvedValue(undefined)
    };

    await TestBed.configureTestingModule({
      imports: [
        HostComponent, 
        UserSettingsComponent, 
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: UtilService, useValue: utilServiceMock },
        { provide: WindowService, useValue: windowServiceMock },
        { provide: QueryService, useValue: queryServiceMock },
        { provide: UserPageService, useValue: userPageServiceMock },
        { provide: SocialAuthService, useValue: socialAuthServiceMock }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    userService = TestBed.inject(UserService) as jest.Mocked<UserService>;
    utilService = TestBed.inject(UtilService) as jest.Mocked<UtilService>;
    windowService = TestBed.inject(WindowService) as jest.Mocked<WindowService>;
    queryService = TestBed.inject(QueryService) as jest.Mocked<QueryService>;
    userPageService = TestBed.inject(UserPageService) as jest.Mocked<UserPageService>;
    socialAuthService = TestBed.inject(SocialAuthService) as jest.Mocked<SocialAuthService>;

    // Configure store selectors
    store.overrideSelector(selectLoggedUser as any, mockUser);
    store.overrideSelector(selectIsSubmitting as any, false);
    store.overrideSelector(selectError as any, null);
    store.overrideSelector(selectSuccess as any, false);

    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.children[0].componentInstance;
    
    jest.spyOn(store, 'dispatch');
    
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
      expect(hostComponent).toBeTruthy();
    });

    it('should initialize user data from userPageService', () => {
      expect(component.user).toEqual(mockUser);
    });

    it('should load profile pictures on init', async () => {
      await fixture.whenStable();
      expect(userService.getAllProfilePics).toHaveBeenCalled();
      expect(component.pictures.length).toBeGreaterThan(0);
    });

    it('should initialize all forms with correct validators', () => {
      expect(component.changeNameForm).toBeDefined();
      expect(component.changeUserNameForm).toBeDefined();
      expect(component.changeEmailForm).toBeDefined();
      expect(component.changePasswordForm).toBeDefined();
    });
  });

  describe('Picture Management', () => {
    it('should toggle picture catalog visibility', () => {
      expect(component.showCatalog).toBe(false);
      component.clickPictureSelector();
      expect(component.showCatalog).toBe(true);
      component.clickPictureSelector();
      expect(component.showCatalog).toBe(false);
    });

    it('should extract picture key from path correctly', () => {
      const path = '/assets/pics/avatar1.png';
      const key = component.getPictureKey(path);
      expect(key).toBe('avatar1');
    });

    it('should dispatch changePicture action when selecting a different picture', () => {
      component.showCatalog = true; // Open catalog first
      const newPicture = '/assets/pics/avatar2.png';
      component.changePicture(newPicture);
      
      expect(store.dispatch).toHaveBeenCalledWith(
        authActions.changePicture({
          request: { newPictureKey: 'avatar2' }
        })
      );
      expect(component.changePictureSubmitted).toBe(true);
      expect(component.showCatalog).toBe(false);
    });

    it('should not dispatch action when selecting the same picture', () => {
      jest.clearAllMocks();
      component.showCatalog = true;
      component.changePicture(mockUser.picture!);
      
      expect(store.dispatch).not.toHaveBeenCalled();
      // Catalog should remain open when selecting same picture
      expect(component.showCatalog).toBe(true);
    });
  });

  describe('Country Management', () => {
    it('should dispatch changeCountry action', () => {
      const newCountry = { identifier: 'FR' };
      component.changeCountry(newCountry);
      
      expect(store.dispatch).toHaveBeenCalledWith(
        authActions.changeCountry({
          request: { newCountryCode: 'FR' }
        })
      );
      expect(component.changeCountrySubmitted).toBe(true);
    });
  });

  describe('Visibility Management', () => {
    it('should dispatch changeVisibility action with true', () => {
      component.changeVisibility(true);
      
      expect(store.dispatch).toHaveBeenCalledWith(
        authActions.changeVisibility({
          request: { newVisibility: true }
        })
      );
      expect(component.changeVisibilitySubmitted).toBe(true);
    });

    it('should dispatch changeVisibility action with false', () => {
      component.changeVisibility(false);
      
      expect(store.dispatch).toHaveBeenCalledWith(
        authActions.changeVisibility({
          request: { newVisibility: false }
        })
      );
    });
  });

  describe('Name Management', () => {
    it('should dispatch changeName action with valid input', () => {
      component.changeNameForm.controls.newName.setValue('New Name');
      component.changeName();
      
      expect(store.dispatch).toHaveBeenCalledWith(
        authActions.changeName({
          request: { newName: 'New Name' }
        })
      );
      expect(component.changeNameSubmitted).toBe(true);
      expect(component.changeNameButtonClicked).toBe(true);
    });

    it('should not dispatch action with invalid form', () => {
      jest.clearAllMocks();
      component.changeNameForm.controls.newName.setValue('');
      component.changeName();
      
      expect(store.dispatch).not.toHaveBeenCalled();
      expect(component.changeNameButtonClicked).toBe(true);
    });

    it('should reset form on success', async () => {
      component.changeNameForm.controls.newName.setValue('New Name');
      component.changeNameSubmitted = true;
      
      // Override the success selector to emit true
      store.overrideSelector(selectSuccess as any, true);
      store.refreshState();
      
      // Wait for the async subscription to process
      await fixture.whenStable();
      fixture.detectChanges();
      
      expect(component.changeNameForm.controls.newName.value).toBeNull();
      expect(component.changeNameForm.controls.newName.errors).toBeNull();
    });
  });

  describe('Username Management', () => {
    it('should dispatch changeUserName action with valid input', () => {
      component.changeUserNameForm.controls.newUserName.setValue('newusername');
      component.changeUserName();
      
      expect(store.dispatch).toHaveBeenCalledWith(
        authActions.changeUserName({
          request: { newUserName: 'newusername' }
        })
      );
      expect(component.changeUserNameSubmitted).toBe(true);
    });

    it('should validate username length', () => {
      const longUsername = 'a'.repeat(33);
      component.changeUserNameForm.controls.newUserName.setValue(longUsername);
      component.changeUserName();
      
      expect(component.changeUserNameForm.valid).toBe(false);
      expect(store.dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: authActions.changeUserName.type
        })
      );
    });

    it('should reset form on success', async () => {
      component.changeUserNameForm.controls.newUserName.setValue('newusername');
      component.changeUserNameSubmitted = true;
      
      store.overrideSelector(selectSuccess as any, true);
      store.refreshState();
      
      await fixture.whenStable();
      fixture.detectChanges();
      
      expect(component.changeUserNameForm.controls.newUserName.value).toBeNull();
      expect(component.changeUserNameForm.controls.newUserName.errors).toBeNull();
    });
  });

  describe('Email Management', () => {
    it('should dispatch changeEmail action with valid email', () => {
      component.changeEmailForm.controls.newEmail.setValue('newemail@example.com');
      component.changeEmail();
      
      expect(store.dispatch).toHaveBeenCalledWith(
        authActions.changeEmail({
          request: { newEmail: 'newemail@example.com' }
        })
      );
      expect(component.changeEmailSubmitted).toBe(true);
    });

    it('should not dispatch action with invalid email format', () => {
      jest.clearAllMocks();
      component.changeEmailForm.controls.newEmail.setValue('invalid-email');
      component.changeEmail();
      
      expect(component.changeEmailForm.valid).toBe(false);
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch sendVerification action', () => {
      component.sendEmailVerificationCode();
      
      expect(store.dispatch).toHaveBeenCalledWith(authActions.sendVerification());
      expect(component.sendEmailVerificationCodeSubmitted).toBe(true);
    });

    it('should reset form on success', async () => {
      component.changeEmailForm.controls.newEmail.setValue('newemail@example.com');
      component.changeEmailSubmitted = true;
      
      store.overrideSelector(selectSuccess as any, true);
      store.refreshState();
      
      await fixture.whenStable();
      fixture.detectChanges();
      
      expect(component.changeEmailForm.controls.newEmail.value).toBeNull();
      expect(component.changeEmailForm.controls.newEmail.errors).toBeNull();
    });
  });

  describe('Password Management', () => {
    it('should dispatch changePassword action with valid passwords', () => {
      component.changePasswordForm.controls.currentPassword.setValue('oldpass123');
      component.changePasswordForm.controls.password.setValue('newpass123');
      component.changePasswordForm.controls.confirmPassword.setValue('newpass123');
      
      component.changePassword();
      
      expect(store.dispatch).toHaveBeenCalledWith(
        authActions.changePassword({
          request: {
            currentPassword: 'oldpass123',
            newPassword: 'newpass123'
          }
        })
      );
      expect(component.changePasswordSubmitted).toBe(true);
    });

    it('should validate password minimum length', () => {
      component.changePasswordForm.controls.currentPassword.setValue('old');
      component.changePasswordForm.controls.password.setValue('new');
      component.changePasswordForm.controls.confirmPassword.setValue('new');
      
      component.changePassword();
      
      expect(component.changePasswordForm.valid).toBe(false);
    });

    it('should validate that new password is different from current', () => {
      component.changePasswordForm.controls.currentPassword.setValue('samepass123');
      component.changePasswordForm.controls.password.setValue('samepass123');
      
      const errors = component.samePassword()(
        component.changePasswordForm.controls.password
      );
      
      expect(errors).toBeTruthy();
      expect(errors?.['samePassword']).toBe(true);
    });

    it('should reset form on success', async () => {
      component.changePasswordForm.controls.currentPassword.setValue('oldpass123');
      component.changePasswordForm.controls.password.setValue('newpass123');
      component.changePasswordForm.controls.confirmPassword.setValue('newpass123');
      component.changePasswordSubmitted = true;
      
      store.overrideSelector(selectSuccess as any, true);
      store.refreshState();
      
      await fixture.whenStable();
      fixture.detectChanges();
      
      expect(component.changePasswordForm.controls.currentPassword.value).toBeNull();
      expect(component.changePasswordForm.controls.password.value).toBeNull();
      expect(component.changePasswordForm.controls.confirmPassword.value).toBeNull();
      expect(component.changePasswordForm.controls.currentPassword.errors).toBeNull();
      expect(component.changePasswordForm.controls.password.errors).toBeNull();
      expect(component.changePasswordForm.controls.confirmPassword.errors).toBeNull();
    });
  });

  describe('Account Management', () => {
    it('should toggle delete dialog', () => {
      expect(component.deleteDialog).toBe(false);
      component.tryDeleteAccout();
      expect(component.deleteDialog).toBe(true);
    });

    it('should delete account when confirmed', () => {
      component.deleteDialog = true;
      component.chooseEvent(true);
      
      expect(socialAuthService.signOut).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(authActions.deleteAccount());
      expect(component.deleteDialog).toBe(false);
    });

    it('should cancel delete when not confirmed', () => {
      jest.clearAllMocks();
      component.deleteDialog = true;
      component.chooseEvent(false);
      
      expect(socialAuthService.signOut).not.toHaveBeenCalled();
      expect(store.dispatch).not.toHaveBeenCalledWith(authActions.deleteAccount());
      expect(component.deleteDialog).toBe(false);
    });

    it('should log out user', () => {
      component.logOut();
      
      expect(socialAuthService.signOut).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(authActions.logOut());
    });
  });

  describe('Form Validation Helpers', () => {
    it('should correctly identify invalid controls', () => {
      component.changeNameForm.controls.newName.setValue('');
      component.changeNameForm.controls.newName.markAsTouched();
      
      const isInvalid = component.isInvalid('newName', 'changeNameForm');
      expect(isInvalid).toBe(true);
    });

    it('should return false for valid controls', () => {
      component.changeNameForm.controls.newName.setValue('Valid Name');
      
      const isInvalid = component.isInvalid('newName', 'changeNameForm');
      expect(isInvalid).toBe(false);
    });

    it('should get error message for control', () => {
      component.changeNameForm.controls.newName.setValue('');
      component.changeNameForm.controls.newName.markAsTouched();
      
      const error = component.getError('newName', 'changeNameForm');
      expect(utilService.getAuthFormError).toHaveBeenCalled();
      expect(error).toBe('Validation error');
    });

    it('should select correct control by form name', () => {
      const control = component.selectControl('newName', 'changeNameForm');
      expect(control).toBe(component.changeNameForm.controls.newName);
    });

    it('should return null for invalid form name', () => {
      const control = component.selectControl('newName', 'invalidForm');
      expect(control).toBeNull();
    });

    it('should select correct form submitted flag', () => {
      component.changeNameButtonClicked = true;
      const flag = component.selectFormSubmittedFlag('changeNameForm');
      expect(flag).toBe(true);
    });
  });

  describe('State Management', () => {
    it('should reset all submitted flags', () => {
      component.changePictureSubmitted = true;
      component.changeCountrySubmitted = true;
      component.changeVisibilitySubmitted = true;
      component.changeNameSubmitted = true;
      
      component.resetSubmitted();
      
      expect(component.changePictureSubmitted).toBe(false);
      expect(component.changeCountrySubmitted).toBe(false);
      expect(component.changeVisibilitySubmitted).toBe(false);
      expect(component.changeNameSubmitted).toBe(false);
    });

    it('should reset submitted flags before each action', () => {
      component.changePictureSubmitted = true;
      component.changeCountrySubmitted = true;
      
      component.changeName();
      
      expect(component.changePictureSubmitted).toBe(false);
      expect(component.changeCountrySubmitted).toBe(false);
    });
  });

  describe('Store Selectors', () => {
    it('should select logged user from store', () => {
      let result: User | null = null;
      const subscription = component.loggedUser$.subscribe(user => {
        result = user;
      });
      
      expect(result).toEqual(mockUser);
      subscription.unsubscribe();
    });

    it('should select isSubmitting state', () => {
      store.overrideSelector(selectIsSubmitting as any, true);
      store.refreshState();
      
      let result = false;
      const subscription = component.isSubmitting$.subscribe(isSubmitting => {
        result = isSubmitting;
      });

      expect(result).toBe(true);
      subscription.unsubscribe();
    });

    it('should select error state', () => {
      const errorMessage = 'Test error';
      store.overrideSelector(selectError as any, errorMessage);
      store.refreshState();

      let result: string | null = null;
      const subscription = component.backendError$.subscribe(error => {
        result = error;
      });
      
      expect(result).toBe(errorMessage);
      subscription.unsubscribe();
    });

    it('should select success state', () => {
      store.overrideSelector(selectSuccess as any, true);
      store.refreshState();

      let result = false;
      const subscription = component.success$.subscribe(success => {
        result = success;
      });
      
      expect(result).toBe(true);
      subscription.unsubscribe();
    });
  });
});