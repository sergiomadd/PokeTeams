import { MetaReducer } from "@ngrx/store";
import { AuthState, initialAuthState } from "./auth/auth.state";
import { ConfigState, initialConfigState } from "./config/configState.model";
import { hydrationMetaReducer } from "./hydration/hydration.reducer";

export interface AppState
{
  auth: AuthState,
  config: ConfigState
}

export const initialAppState: AppState = 
{
  auth: initialAuthState,
  config: initialConfigState
}

export const metaReducers: MetaReducer[] = [hydrationMetaReducer]