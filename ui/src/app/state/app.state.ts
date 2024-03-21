import { AuthState } from "../auth/types/auth.state";
import { ActionReducer, ActionReducerMap, MetaReducer, createFeatureSelector, createSelector } from "@ngrx/store";
import { hydrationMetaReducer } from "./hydration/hydration.reducer";
//import { authReducers, logInReducer } from "./auth/auth.reducers";
import * as fromAuth from "../auth/store/auth.reducers";
import * as authEffects from "../auth/store/auth.effects";

export interface AppState
{
  auth: AuthState
}

export const metaReducers: MetaReducer[] = [hydrationMetaReducer]