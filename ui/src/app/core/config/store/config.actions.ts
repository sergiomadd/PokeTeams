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
    },
  }
)