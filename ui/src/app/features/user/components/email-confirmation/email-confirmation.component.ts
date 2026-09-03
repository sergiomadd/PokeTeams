import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { FeedbackColors } from '../../../../core/models/misc/colors';
import { UserUpdateDTO } from '../../../../core/models/user/userUpdate.dto';
import { authActions } from '../../../../core/store/auth/auth.actions';
import { selectError, selectIsSubmitting, selectSuccess } from '../../../../core/store/auth/auth.selectors';

@Component({
    selector: 'app-email-confirmation',
    templateUrl: './email-confirmation.component.html',
    styleUrl: './email-confirmation.component.scss',
    imports: [RouterLink, TranslatePipe]
})
export class EmailConfirmationComponent
{
  route = inject(ActivatedRoute);
  store = inject(Store);

  isSubmitting = this.store.selectSignal(selectIsSubmitting);
  backendError = this.store.selectSignal(selectError);
  success = this.store.selectSignal(selectSuccess);

  readonly feedbackColors = FeedbackColors;

  email = signal<string | undefined>(undefined);
  token = signal<string | undefined>(undefined);

  ngOnInit()
  {
    this.confirmEmail();
  }

  confirmEmail()
  {
    this.email.set(this.route.snapshot.queryParams['email']);
    this.token.set(this.route.snapshot.queryParams['token']);

    if(this.email() && this.token())
    {
      const confirmUpdateDTO: UserUpdateDTO =
      {
        emailConfirmationCode: this.token()
      }
      this.store.dispatch(authActions.confirmEmail({request: confirmUpdateDTO}))
    }
  }
}
