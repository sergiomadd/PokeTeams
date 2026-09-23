import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { UtilService } from '../../../../core/helpers/util.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { FeedbackColors } from '../../../../core/models/misc/colors';
import { UserUpdateDTO } from '../../../../core/models/user/userUpdate.dto';
import { authActions } from '../../../../core/store/auth/auth.actions';
import { selectError, selectIsSubmitting, selectSuccess } from '../../../../core/store/auth/auth.selectors';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss',
    imports: [FormsModule, ReactiveFormsModule, NgClass, RouterLink, NgTemplateOutlet, TranslatePipe]
})
export class ResetPasswordComponent
{
  route = inject(ActivatedRoute);
  store = inject(Store);
  formBuilder = inject(FormBuilder);
  util = inject(UtilService);
  window = inject(WindowService);

  isSubmitting = this.store.selectSignal(selectIsSubmitting);
  backendError = this.store.selectSignal(selectError);
  success = this.store.selectSignal(selectSuccess);

  readonly feedbackColors = FeedbackColors;

  email = signal<string | undefined>(undefined);
  token = signal<string | undefined>(undefined);

  resetPasswordButtonClicked = signal<boolean>(false);
  resetPasswordSubmitted = signal<boolean>(false);
  resetPasswordForm = this.formBuilder.group(
    {
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.util.passwordsMatch()]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.util.passwordsMatch()]],

    }, { updateOn: "submit" });

  constructor()
  {
    this.email.set(this.route.snapshot.queryParams['email']);
    this.token.set(this.route.snapshot.queryParams['token']);
  }

  resetPassword()
  {
    this.resetPasswordButtonClicked.set(true);
    const email = this.email();
    const token = this.token();
    if(email && token && this.resetPasswordForm.valid)
    {
      this.resetPasswordSubmitted.set(true);
      const resetPasswordUpdateDTO: UserUpdateDTO =
      {
        currentEmail: email,
        newPassword: this.resetPasswordForm.controls.password.value ?? undefined,
        passwordResetCode: token
      }
      this.store.dispatch(authActions.resetPassword({request: resetPasswordUpdateDTO}))
    }
  }

  isInvalid(key: string) : boolean
  {
    var control = this.resetPasswordForm.get(key);
    return (control?.errors && (control?.dirty || control?.touched || this.resetPasswordButtonClicked())) ?? false;
  }

  getError(key: string) : string
  {
    return this.util.getAuthFormError(this.resetPasswordForm.get(key));
  }
}
