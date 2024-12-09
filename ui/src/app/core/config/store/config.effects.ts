import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { Theme } from "../models/theme.model";
import { ThemeService } from "../services/theme.service";
import { configActions } from "./config.actions";


@Injectable()
export class ConfigEffects
{
  actions$ = inject(Actions)
  themeService = inject(ThemeService);

  toggleTheme$ = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(configActions.toggleTheme),
      switchMap(({request}) =>
      {
        return this.themeService.tryGetTheme(request).pipe(
          map((theme: Theme) =>
          {
            this.themeService.applyTheme(theme);
            return configActions.toggleThemeSuccess({theme});
          }),
          catchError((error) => 
          {
            console.log(error)
            console.log("Error toggleling themes")
            return of(configActions.toggleThemeFailure(
              {
                error: error.message
              }
            ))
          })
        )
      })
    )
  });
}