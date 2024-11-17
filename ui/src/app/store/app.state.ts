import { MetaReducer } from "@ngrx/store";
import { AuthState } from "../auth/types/auth.state";
import { hydrationMetaReducer } from "./hydration/hydration.reducer";

export interface AppState
{
  authState: AuthState
}

export const metaReducers: MetaReducer[] = [hydrationMetaReducer]