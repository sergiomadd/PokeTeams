import { createAction, createActionGroup, emptyProps, props } from "@ngrx/store";
import { AuthResponseDTO } from "src/app/models/DTOs/authResponse.dto";
import { LogInDTO } from "src/app/models/DTOs/login.dto";
import { SignUpDTO } from "src/app/models/DTOs/signup.dto";
import { UserUpdateDTO } from "src/app/models/DTOs/userUpdate.dto";

export const authActions = createActionGroup(
  {
    source: "Auth",
    events:
    {
      signUp: props<{request: SignUpDTO}>(),
      "signUp success": props<{response: AuthResponseDTO}>(),
      "signUp failure": props<{errors: string[]}>(),
      logIn: props<{request: LogInDTO}>(),
      "logIn success": props<{response: AuthResponseDTO}>(),
      "logIn failure": props<{errors: string[]}>(),
      getLogged: emptyProps(),
      "getLogged success": props<{response: AuthResponseDTO}>(),
      "getLogged failure": props<{errors: string[]}>(),
      logOut: emptyProps(),
      "logOut success": props<{response: AuthResponseDTO}>(),
      "logOut failure": props<{errors: string[]}>(),
      deleteAccount: emptyProps(),
      "deleteAccount success": props<{response: AuthResponseDTO}>(),
      "deleteAccount failure": props<{errors: string[]}>(),
      changeUserName: props<{request: UserUpdateDTO}>(),
      "changeUserName success": props<{response: AuthResponseDTO}>(),
      "changeUserName failure": props<{errors: string[]}>(),
      changeEmail: props<{request: UserUpdateDTO}>(),
      "changeEmail success": props<{response: AuthResponseDTO}>(),
      "changeEmail failure": props<{errors: string[]}>(),
      changePassword: props<{request: UserUpdateDTO}>(),
      "changePassword success": props<{response: AuthResponseDTO}>(),
      "changePassword failure": props<{errors: string[]}>()
    },
  }
)