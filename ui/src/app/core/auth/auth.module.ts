import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { authReducers } from './store/auth.reducers';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './store/auth.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature("auth", authReducers),
    EffectsModule.forFeature([AuthEffects]),
  ]
})
export class AuthModule { }
