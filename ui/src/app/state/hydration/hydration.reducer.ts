import { ActionReducer, INIT } from "@ngrx/store";
import { AppState } from "../app.state";

export const hydrationMetaReducer = (reducer: ActionReducer<AppState>): ActionReducer<AppState> => 
{
  return (state, action) => 
  {
    if (action.type === INIT) 
    {
      const storageValue = localStorage.getItem("state");
      if (storageValue) 
      {
        try 
        {
          const nextState = reducer(JSON.parse(storageValue), action);
          return nextState;
        } 
        catch 
        {
          localStorage.removeItem("state");
        }
      }
    }
    const nextState = reducer(state, action);
    localStorage.setItem("state", JSON.stringify(nextState));
    return nextState;
  };
};
