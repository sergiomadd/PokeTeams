import { SocialAuthService } from '@abacritt/angularx-social-login';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { UtilService } from '../../../../core/helpers/util.service';
import { UserService } from '../../../../core/services/user.service';
import { authActions } from '../../../../core/store/auth/auth.actions';
import { AuthFormComponent } from './auth-form.component';

import { Directive } from '@angular/core';

@Directive({
  selector: 'asl-google-signin-button',
  standalone: true,
})
class MockGoogleSigninButtonDirective {}

describe('AuthFormComponent', () => {
  let component: AuthFormComponent;
  let fixture: ComponentFixture<AuthFormComponent>;
  let store: jest.Mocked<Store>;
  let userService: jest.Mocked<UserService>;

  const authState$ = new Subject<any>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: 
      [
        AuthFormComponent,
        TranslateModule.forRoot(),
        MockGoogleSigninButtonDirective
      ],
      providers: 
      [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            select: jest.fn().mockReturnValue(of(false)),
          },
        },
        {
          provide: SocialAuthService,
          useValue: {
            authState: of(null),
          },
        },
        {
          provide: UserService,
          useValue: {
            checkUserNameAvailable: jest.fn(),
            checkEmailAvailable: jest.fn(),
          },
        },
        {
          provide: UtilService,
          useValue: {
            passwordsMatch: () => jest.fn(),
          },
        },
      ],
    })
    .overrideComponent(AuthFormComponent, 
    {
      remove: {
        imports: [
          // REMOVE the real social login directive/module
          // (one of these will apply depending on how you imported it)
          // SocialLoginModule,
          // GoogleSigninButtonDirective
        ],
      },
      add: {
        imports: [MockGoogleSigninButtonDirective],
      },
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthFormComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(Store) as jest.Mocked<Store>;
    userService = TestBed.inject(UserService) as jest.Mocked<UserService>;

    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Form structure

  it('should create login form with controls', () => 
  {
    expect(component.logInForm.contains('userNameOrEmail')).toBe(true);
    expect(component.logInForm.contains('password')).toBe(true);
  });

  it('should create signup form with controls', () => 
  {
    expect(component.signUpForm.contains('username')).toBe(true);
    expect(component.signUpForm.contains('email')).toBe(true);
    expect(component.signUpForm.contains('password')).toBe(true);
    expect(component.signUpForm.contains('confirmPassword')).toBe(true);
  });

  it('should create forgot form with email control', () => 
  {
    expect(component.forgotForm.contains('email')).toBe(true);
  });

  //State switching
  it('should switch to signup form', () => 
  {
    component.showSignUpForm();

    expect(component.signup).toBe(true);
    expect(component.login).toBe(false);
    expect(component.forgot).toBe(false);
  });

  it('should switch to forgot form', () => 
  {
    component.showForgotForm();

    expect(component.forgot).toBe(true);
    expect(component.login).toBe(false);
    expect(component.signup).toBe(false);
  });

  it('should switch back to login form', () => 
  {
    component.showLogInForm();

    expect(component.login).toBe(true);
    expect(component.signup).toBe(false);
    expect(component.forgot).toBe(false);
  });

  //Login

  it('should dispatch logIn action when login form is valid', async () => 
  {
    component.logInForm.setValue({
      userNameOrEmail: 'test',
      password: 'password123',
    });

    await component.logIn();

    expect(store.dispatch).toHaveBeenCalledWith(
      authActions.logIn({
        request: {
          userNameOrEmail: 'test',
          password: 'password123',
          rememberMe: true,
        },
      })
    );
  });

  it('should not dispatch logIn action when login form is invalid', async () => 
  {
    component.logInForm.setValue({
      userNameOrEmail: '',
      password: '',
    });

    await component.logIn();

    expect(store.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: '[Auth] Log In' })
    );
  });

  //Signup

  it('should dispatch signUp action when signup form is valid', async () => 
  {
    component.signUpForm.setValue({
      username: 'user',
      email: 'test@test.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    await component.signUp();

    expect(store.dispatch).toHaveBeenCalledWith(
      authActions.signUp({
        request: {
          username: 'user',
          email: 'test@test.com',
          password: 'password123',
          confirmPassword: 'password123',
        },
      })
    );
  });

  //Forgot password

  it('should dispatch forgotPassword action when forgot form is valid', () => 
  {
    component.forgotForm.setValue({
      email: 'test@test.com',
    });

    component.forgotPassword();

    expect(store.dispatch).toHaveBeenCalledWith(
      authActions.forgotPassword({
        request: { currentEmail: 'test@test.com' },
      })
    );
  });

  //Availability

  it('should mark username as taken when not available', async () => 
  {
    userService.checkUserNameAvailable.mockResolvedValue(false);

    component.signUpForm.controls.username.setValue('takenName');

    await Promise.resolve();

    expect(component.userNameAvailable).toBe(false);
    expect(component.signUpForm.controls.username.errors).toEqual(
      expect.objectContaining({ usernameTaken: true })
    );
  });

  it('should mark email as taken when not available', async () => 
  {
    userService.checkEmailAvailable.mockResolvedValue(false);

    component.signUpForm.controls.email.setValue('test@test.com');

    await Promise.resolve();

    expect(component.emailAvailable).toBe(false);
    expect(component.signUpForm.controls.email.errors).toEqual(
      expect.objectContaining({ emailTaken: true })
    );
  });

  //Closing

  it('should emit close event and dispatch toggleAuthForm', () => 
  {
    jest.spyOn(component.close, 'emit');

    component.closeSelf();

    expect(component.close.emit).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(
      authActions.toggleAuthForm()
    );
  });

  //Password visibility

  it('should toggle login password visibility', () => 
  {
    expect(component.showLogInPassword).toBe(false);

    component.toggleShowPassword('logInPassword');

    expect(component.showLogInPassword).toBe(true);
  });
});
