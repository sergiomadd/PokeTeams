import { User } from "src/app/features/user/models/user.model";

export interface AuthState
{
  token: string | null,
  user: User | null,
  errors: string[] | null,
  isAuthenticated: boolean,
  isSubmitting: boolean
}

export const initialAuthState: AuthState = 
{
  token: null,
  user: null,
  errors: null,
  isAuthenticated: false,
  isSubmitting: false,
};