import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { UtilService } from '../../../../core/helpers/util.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { authActions } from '../../../../core/store/auth/auth.actions';
import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let store: jest.Mocked<Store>;
  let utilService: jest.Mocked<UtilService>;
  let windowService: jest.Mocked<WindowService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ResetPasswordComponent,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        {
          provide: Store,
          useValue: {
            select: jest.fn().mockReturnValue(of(null)),
            dispatch: jest.fn(),
          },
        },
        {
          provide: UtilService,
          useValue: {
            passwordsMatch: jest.fn(() => () => null),
            getAuthFormError: jest.fn(() => 'Error message'),
          },
        },
        {
          provide: WindowService,
          useValue: { isMobile: jest.fn(() => false) },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: { email: 'test@test.com', token: '12345' }
            }
          }
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as jest.Mocked<Store>;
    utilService = TestBed.inject(UtilService) as jest.Mocked<UtilService>;
    windowService = TestBed.inject(WindowService) as jest.Mocked<WindowService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark password as invalid when empty and button clicked', () => 
  {
    component.resetPasswordButtonClicked = true;
    expect(component.isInvalid('password')).toBe(true);
  });

  it('should mark confirmPassword as invalid when empty and button clicked', () => 
  {
    component.resetPasswordButtonClicked = true;
    expect(component.isInvalid('confirmPassword')).toBe(true);
  });

  it('should call store.dispatch with resetPassword when form is valid', () => 
  {
    component.resetPasswordForm.setValue({ password: 'abc123', confirmPassword: 'abc123' });
    component.resetPassword();

    expect(component.resetPasswordSubmitted).toBe(true);
    expect(store.dispatch).toHaveBeenCalledWith(
      authActions.resetPassword({
        request: {
          currentEmail: 'test@test.com',
          newPassword: 'abc123',
          passwordResetCode: '12345',
        },
      })
    );
  });

  it('should not dispatch resetPassword if form is invalid', () => 
  {
    component.resetPasswordForm.setValue({ password: '', confirmPassword: '' });
    component.resetPassword();

    expect(component.resetPasswordSubmitted).toBe(false);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should return error from util.getAuthFormError', () => 
  {
    const error = component.getError('password');
    expect(error).toBe('Error message');
  });
});
