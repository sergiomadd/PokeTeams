import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

import { authActions } from '../../../../core/store/auth/auth.actions';
import {
  selectError,
  selectIsSubmitting,
  selectSuccess,
} from '../../../../core/store/auth/auth.selectors';
import { EmailConfirmationComponent } from './email-confirmation.component';

@Component({
  standalone: true,
  imports: [EmailConfirmationComponent],
  template: `<app-email-confirmation />`,
})
class HostComponent {}

const activatedRouteMock = {
  snapshot: {
    queryParams: {
      email: 'test@test.com',
      token: 'CONFIRM_TOKEN',
    },
  },
};

describe('EmailConfirmationComponent (Host)', () => {
  let fixture: ComponentFixture<HostComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectIsSubmitting, value: false },
            { selector: selectSuccess, value: null },
            { selector: selectError, value: null },
          ],
        }),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    const component = fixture.debugElement.query(
      By.directive(EmailConfirmationComponent)
    );
    expect(component).toBeTruthy();
  });

  it('should dispatch confirmEmail action on init when email & token exist', () => {
    expect(store.dispatch).toHaveBeenCalledWith(
      authActions.confirmEmail({
        request: {
          emailConfirmationCode: 'CONFIRM_TOKEN',
        },
      })
    );
  });

  it('should show spinner while submitting', () => {
    store.overrideSelector(selectIsSubmitting, true);
    store.refreshState();
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('.pokemon-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should show success feedback when success=true', () => {
    store.overrideSelector(selectSuccess, true);
    store.overrideSelector(selectError, null);
    store.refreshState();
    fixture.detectChanges();

    const successIcon = fixture.debugElement.query(By.css('svg.feedback'));
    expect(successIcon).toBeTruthy();
  });

  it('should show backend error message', () => {
    store.overrideSelector(selectSuccess, false);
    store.overrideSelector(selectError, 'Invalid token');
    store.refreshState();
    fixture.detectChanges();

    const errorText = fixture.debugElement.query(By.css('.formFeedbackError'));
    expect(errorText.nativeElement.textContent).toContain('Invalid token');
  });

  it('should show incorrect credentials feedback when no success and no backend error', () => {
    store.overrideSelector(selectSuccess, false);
    store.overrideSelector(selectError, null);
    store.refreshState();
    fixture.detectChanges();

    const errorText = fixture.debugElement.query(By.css('.formFeedbackError'));
    expect(errorText).toBeTruthy();
  });
});