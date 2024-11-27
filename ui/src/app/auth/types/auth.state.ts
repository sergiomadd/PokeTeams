import { User } from "src/app/features/user/models/user.model";

export interface AuthState
{
  accessToken: string | null,
  refreshToken: string | null,
  user: User | null,
  error: string | null,
  isAuthenticated: boolean,
  isSubmitting: boolean,
  success: boolean
}

export const initialAuthState: AuthState = 
{
  accessToken: null,
  refreshToken: null,
  user: null,
  error: null,
  isAuthenticated: false,
  isSubmitting: false,
  success: false
};