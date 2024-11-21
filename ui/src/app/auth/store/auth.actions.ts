import { createAction, createActionGroup, emptyProps, props } from "@ngrx/store";
import { AuthResponseDTO } from "src/app/auth/types/authResponse.dto";
import { LogInDTO } from "src/app/models/DTOs/login.dto";
import { SignUpDTO } from "src/app/models/DTOs/signup.dto";
import { UserUpdateDTO } from "src/app/models/DTOs/userUpdate.dto";

export enum AuthActionTypes
{
  LOGIN = "[Auth] Login"
}

export const signUp = createAction(AuthActionTypes.LOGIN, props<{ request: LogInDTO }>());

export const authActions = createActionGroup(
  {
    source: "Auth",
    events:
    {
      signUp: props<{request: SignUpDTO}>(),
      "signUp success": props<{authResponse: AuthResponseDTO}>(),
      "signUp failure": props<{error: string}>(),
      logIn: props<{request: LogInDTO}>(),
      "logIn success": props<{authResponse: AuthResponseDTO}>(),
      "logIn failure": props<{error: string}>(),
      getLogged: emptyProps(),
      "getLogged success": props<{authResponse: AuthResponseDTO}>(),
      "getLogged failure": props<{error: string}>(),
      logOut: emptyProps(),
      "logOut success": emptyProps(),
      "logOut failure": props<{error: string}>(),
      deleteAccount: emptyProps(),
      "deleteAccount success": emptyProps(),
      "deleteAccount failure": props<{error: string}>(),
      changeName: props<{request: UserUpdateDTO}>(),
      "changeName success": props<{authResponse: AuthResponseDTO}>(),
      "changeName failure": props<{error: string}>(),
      changeUserName: props<{request: UserUpdateDTO}>(),
      "changeUserName success": props<{authResponse: AuthResponseDTO}>(),
      "changeUserName failure": props<{error: string}>(),
      changeEmail: props<{request: UserUpdateDTO}>(),
      "changeEmail success": props<{authResponse: AuthResponseDTO}>(),
      "changeEmail failure": props<{error: string}>(),
      changePassword: props<{request: UserUpdateDTO}>(),
      "changePassword success": props<{authResponse: AuthResponseDTO}>(),
      "changePassword failure": props<{error: string}>(),
      changePicture: props<{request: UserUpdateDTO}>(),
      "changePicture success": props<{authResponse: AuthResponseDTO}>(),
      "changePicture failure": props<{error: string}>(),
      changeCountry: props<{request: UserUpdateDTO}>(),
      "changeCountry success": props<{authResponse: AuthResponseDTO}>(),
      "changeCountry failure": props<{error: string}>(),
      changeVisibility: props<{request: UserUpdateDTO}>(),
      "changeVisibility success": props<{authResponse: AuthResponseDTO}>(),
      "changeVisibility failure": props<{error: string}>()
    },
  }
)