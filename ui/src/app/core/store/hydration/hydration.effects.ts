import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType, OnInitEffects } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { distinctUntilChanged, map, switchMap, tap } from "rxjs";
import { ThemeService } from "../../config/services/theme.service";
import { AppState } from "../app.state";
import { hydrateActions } from "./hydration.actions";

@Injectable()
export class HydrationEffects implements OnInitEffects 
{
  themeService = inject(ThemeService);

  constructor(private actions$: Actions, private store: Store<AppState>) {}

  ngrxOnInitEffects(): Action 
  {
    return hydrateActions.hydrate();
  }

  hydrate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(hydrateActions.hydrate),
      map(() => 
      {
        const storageValue = localStorage.getItem("state");
        if (storageValue) 
        {
          try 
          {
            const state: AppState = JSON.parse(storageValue);
            state.auth.error = null;
            return hydrateActions.hydrateSuccess({ state });
          } 
          catch 
          {
            localStorage.removeItem("state");
          }
        }
        return hydrateActions.hydrateFailure();
      })
    )
  );

  serialize$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(hydrateActions.hydrateSuccess, hydrateActions.hydrateFailure),
        switchMap(() => this.store),
        distinctUntilChanged(),
        tap((state) => localStorage.setItem("state", JSON.stringify(state)))
      ),
    { dispatch: false }
  );
}