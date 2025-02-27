import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, lastValueFrom, timeout } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async (route, state) => 
{
  const authService = inject(AuthService);
  const router = inject(Router);
  const teamID = route.params["id"];
  if(await lastValueFrom(authService.doesLoggedUserOwnTeam(teamID).pipe(catchError(() => [false]), timeout(5000))))
  {
    return true;
  }
  router.navigate(['']);
  return false;
};
