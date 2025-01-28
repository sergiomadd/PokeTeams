import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ConfigState } from "../models/configState.model";

const selectConfig = createFeatureSelector<ConfigState>('config');
export const selectTheme = createSelector(selectConfig, (config) => config.theme);
export const selectLang = createSelector(selectConfig, (config) => config.lang);
export const selectTeamsPerPage = createSelector(selectConfig, (config) => config.teamsPerPage);

