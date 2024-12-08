
export interface AuthState
{
  accessToken: string | null,
  refreshToken: string | null,
  username: string | null,
  error: string | null,
  isAuthenticated: boolean,
  isSubmitting: boolean,
  success: boolean
}

export const initialAuthState: AuthState = 
{
  accessToken: null,
  refreshToken: null,
  username: null,
  error: null,
  isAuthenticated: false,
  isSubmitting: false,
  success: false
};