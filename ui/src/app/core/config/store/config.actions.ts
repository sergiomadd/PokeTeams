import { createActionGroup, props } from "@ngrx/store";
import { Theme } from "../models/theme.model";

export const configActions = createActionGroup(
  {
    source: "Config",
    events:
    {
      toggleTheme: props<{request: string}>(),
      "toggleTheme success": props<{theme: Theme}>(),
      "toggleTheme failure": props<{error: string}>(),
      changeLang: props<{request: string}>(),
      "changeLang success": props<{lang: string}>(),
      "changeLang failure": props<{error: string}>(),
      changeTeamsPerPage: props<{request: number}>(),
      "changeTeamsPerPage success": props<{teamsPerPage: number}>(),
      "changeTeamsPerPage failure": props<{error: string}>(),
    },
  }
)