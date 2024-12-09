import { MetaReducer } from "@ngrx/store";
import { AuthState } from "../auth/types/auth.state";
import { ConfigState } from "../config/models/configState.model";
import { hydrationMetaReducer } from "./hydration/hydration.reducer";

export interface AppState
{
  auth: AuthState,
  config: ConfigState
}

export const metaReducers: MetaReducer[] = [hydrationMetaReducer]