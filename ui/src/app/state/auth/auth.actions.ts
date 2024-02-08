import { createAction, createActionGroup, props } from "@ngrx/store";
import { AuthResponseDTO } from "src/app/models/DTOs/authResponse.dto";
import { LogInDTO } from "src/app/models/DTOs/login.dto";
import { SignUpDTO } from "src/app/models/DTOs/signup.dto";

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
      "logIn failure": props<{errors: string[]}>()
    },
  }
)