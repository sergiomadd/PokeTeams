import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { LogInDTO } from "src/app/features/user/models/login.dto";
import { SignUpDTO } from "src/app/features/user/models/signup.dto";
import { UserUpdateDTO } from "src/app/features/user/models/userUpdate.dto";
import { AuthResponseDTO } from "./authResponse.dto";

export const authActions = createActionGroup(
  {
    source: "Auth",
    events:
    {
      refresh: emptyProps(),
      "refresh success": props<{authResponse: AuthResponseDTO}>(),
      "refresh failure": props<{error: string}>(),
      logIn: props<{request: LogInDTO}>(),
      "logIn success": props<{authResponse: AuthResponseDTO}>(),
      "logIn failure": props<{error: string}>(),
      signUp: props<{request: SignUpDTO}>(),
      "signUp success": props<{authResponse: AuthResponseDTO}>(),
      "signUp failure": props<{error: string}>(),
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
      "changeVisibility failure": props<{error: string}>(),
      sendVerification: emptyProps(),
      "sendVerification success": emptyProps(),
      "sendVerification failure": props<{error: string}>(),
      confirmEmail: props<{request: UserUpdateDTO}>(),
      "confirmEmail success": props<{authResponse: AuthResponseDTO}>(),
      "confirmEmail failure": props<{error: string}>(),
      forgotPassword: props<{request: UserUpdateDTO}>(),
      "forgotPassword success": emptyProps(),
      "forgotPassword failure": props<{error: string}>(),
      resetPassword: props<{request: UserUpdateDTO}>(),
      "resetPassword success": emptyProps(),
      "resetPassword failure": props<{error: string}>()
    },
  }
)