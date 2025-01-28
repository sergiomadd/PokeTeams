import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { Theme } from "../models/theme.model";
import { I18nService } from "../services/i18n.service";
import { ThemeService } from "../services/theme.service";
import { configActions } from "./config.actions";


@Injectable()
export class ConfigEffects
{
  actions$ = inject(Actions)
  themeService = inject(ThemeService);
  i18nService = inject(I18nService);

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
            console.log("Error toggleling theme: ", error)
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

  changeLang$ = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(configActions.changeLang),
      switchMap(({request}) =>
      {
        return this.i18nService.switchLanguage(request).pipe(
          map((lang: string) =>
          {
            return configActions.changeLangSuccess({lang});
          }),
          catchError((error) => 
          {
            console.log("Error switching language: ", error)
            return of(configActions.changeLangFailure(
              {
                error: error.message
              }
            ))
          })
        )
      })
    )
  });

  changeTeamsPerPage$ = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(configActions.changeTeamsPerPage),
      switchMap(({request}) =>
      {
        const newTeamsPerPage: number = Number(request);
        return of(configActions.changeTeamsPerPageSuccess({teamsPerPage: newTeamsPerPage}));
      })
    )
  });
}