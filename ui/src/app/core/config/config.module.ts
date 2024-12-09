import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ConfigEffects } from './store/config.effects';
import { configReducers } from './store/config.reducers';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature("config", configReducers),
    EffectsModule.forFeature([ConfigEffects]),
  ]
})
export class ConfigModule { }
