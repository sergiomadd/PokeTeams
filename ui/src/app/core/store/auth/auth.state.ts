import { User } from "src/app/features/user/models/user.model";

export interface AuthState
{
  loggedUser: User | null
  error: string | null,
  isAuthenticated: boolean,
  isSubmitting: boolean,
  success: boolean
}

export const initialAuthState: AuthState = 
{
  loggedUser: null,
  error: null,
  isAuthenticated: false,
  isSubmitting: false,
  success: false
};