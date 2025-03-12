import { createReducer, on } from "@ngrx/store";
import { configActions } from "./config.actions";
import { initialConfigState } from "./configState.model";

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
  on(configActions.changeLang, (state) => (
    {
      ...state,
    }
  )),
  on(configActions.changeLangSuccess, (state, action) => (
    {
      ...state,
      lang: action.lang
    }
  )),
  on(configActions.changeLangFailure, (state) => (
    {
      ...state,
      lang: "en"
    }
  )),
  on(configActions.changeTeamsPerPage, (state) => (
    {
      ...state,
    }
  )),
  on(configActions.changeTeamsPerPageSuccess, (state, action) => (
    {
      ...state,
      teamsPerPage: action.teamsPerPage
    }
  )),
  on(configActions.changeTeamsPerPageFailure, (state) => (
    {
      ...state,
      teamsPerPage: 10 
    }
  )),
)