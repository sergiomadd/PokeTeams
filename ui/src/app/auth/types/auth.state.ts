import { User } from "src/app/features/user/models/user.model";

export interface AuthState
{
  token: string | null,
  user: User | null,
  error: string | null,
  isAuthenticated: boolean,
  isSubmitting: boolean
}

export const initialAuthState: AuthState = 
{
  token: null,
  user: null,
  error: null,
  isAuthenticated: false,
  isSubmitting: false,
};