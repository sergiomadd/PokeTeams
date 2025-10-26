import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { UtilService } from '../../../../core/helpers/util.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { FeedbackColors } from '../../../../core/models/misc/colors';
import { authActions } from '../../../../core/store/auth/auth.actions';
import { selectError, selectIsSubmitting, selectSuccess } from '../../../../core/store/auth/auth.selectors';
import { UserUpdateDTO } from '../../../../features/user/models/userUpdate.dto';
import { NgClass, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss',
    imports: [FormsModule, ReactiveFormsModule, NgClass, RouterLink, NgTemplateOutlet, AsyncPipe, TranslatePipe]
})
export class ResetPasswordComponent 
{
  route = inject(ActivatedRoute);
  store = inject(Store);
  formBuilder = inject(FormBuilder);
  util = inject(UtilService);
  window = inject(WindowService);

  isSubmitting$ = this.store.select(selectIsSubmitting);
  backendError$ = this.store.select(selectError);
  success$ = this.store.select(selectSuccess);

  readonly feedbackColors = FeedbackColors;

  email?: string;
  token?: string;

  resetPasswordButtonClicked: boolean = false;
  resetPasswordSubmitted: boolean = false;
  resetPasswordForm = this.formBuilder.group(
    {
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.util.passwordsMatch()]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256), this.util.passwordsMatch()]],
  
    }, { updateOn: "submit" });

  ngOnInit()
  {
    this.email = this.route.snapshot.queryParams['email'];
    this.token = this.route.snapshot.queryParams['token'];
  }

  resetPassword()
  {
    this.resetPasswordButtonClicked = true;
    if(this.email && this.token && this.resetPasswordForm.valid)
    {
      this.resetPasswordSubmitted = true;
      const resetPasswordUpdateDTO: UserUpdateDTO = 
      {
        currentEmail: this.email,
        newPassword: this.resetPasswordForm.controls.password.value ?? undefined,
        passwordResetCode: this.token
      }
      this.store.dispatch(authActions.resetPassword({request: resetPasswordUpdateDTO}))
    }
  }

  
  isInvalid(key: string) : boolean
  {
    var control = this.resetPasswordForm.get(key);
    return (control?.errors && (control?.dirty || control?.touched || this.resetPasswordButtonClicked)) ?? false;
  }

  getError(key: string) : string
  {
    return this.util.getAuthFormError(this.resetPasswordForm.get(key));
  }
}
