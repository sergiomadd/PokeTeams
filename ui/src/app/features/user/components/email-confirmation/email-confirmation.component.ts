import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { authActions } from 'src/app/core/auth/store/auth.actions';
import { selectError, selectIsSubmitting, selectSuccess } from 'src/app/core/auth/store/auth.selectors';
import { FeedbackColors } from 'src/app/core/config/models/colors';
import { UserUpdateDTO } from 'src/app/features/user/models/userUpdate.dto';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.scss'
})
export class EmailConfirmationComponent 
{
  route = inject(ActivatedRoute);
  store = inject(Store);

  isSubmitting$ = this.store.select(selectIsSubmitting);
  backendError$ = this.store.select(selectError);
  success$ = this.store.select(selectSuccess);

  readonly feedbackColors = FeedbackColors;

  email?: string;
  token?: string;

  ngOnInit()
  {
    this.confirmEmail();
  }

  confirmEmail()
  {
    this.email = this.route.snapshot.queryParams['email'];
    this.token = this.route.snapshot.queryParams['token'];

    if(this.email && this.token)
    {
      const confirmUpdateDTO: UserUpdateDTO = 
      {
        currentEmail: this.email,
        emailConfirmationCode: this.token
      }
      this.store.dispatch(authActions.confirmEmail({request: confirmUpdateDTO}))
    }
  }
}
