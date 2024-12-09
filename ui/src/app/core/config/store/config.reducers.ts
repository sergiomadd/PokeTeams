import { createReducer, on } from "@ngrx/store";
import { initialConfigState } from "../models/configState.model";
import { configActions } from "./config.actions";

export const configReducers = createReducer(
  initialConfigState,
  on(configActions.toggleTheme, (state) => (
    {
      ...state,
    }
  )),
  on(configActions.toggleThemeSuccess, (state, action) => (
    {
      ...state,
      theme: action.theme.name
    }
  )),
  on(configActions.toggleThemeFailure, (state) => (
    {
      ...state,
      theme: "light"
    }
  )),
)