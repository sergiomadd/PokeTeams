import { Action, ActionReducer } from "@ngrx/store";
import { AppState } from "../app.state";
import { hydrateActions } from "./hydration.actions";

function isHydrateSuccess(action: Action) : action is ReturnType<typeof hydrateActions.hydrateSuccess> 
{
  return action.type === hydrateActions.hydrateSuccess.type;
}

export const hydrationMetaReducer = (reducer: ActionReducer<AppState>) : ActionReducer<AppState> => 
{
  return (state, action) => 
  {
    if (isHydrateSuccess(action)) 
    {
      return action.state;
    } 
    else 
    {
      return reducer(state, action);
    }
  };
};