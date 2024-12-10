import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { AppState } from "../app.state";

export const hydrateActions = createActionGroup(
  {
    source: "Hydrate",
    events:
    {
      hydrate: emptyProps(),
      "hydrate success": props<{ state: AppState }>(),
      "hydrate failure": emptyProps(),
    },
  }
)