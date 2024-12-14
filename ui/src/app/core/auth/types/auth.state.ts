
export interface AuthState
{
  accessToken: string | null,
  refreshToken: string | null,
  error: string | null,
  isAuthenticated: boolean,
  isSubmitting: boolean,
  success: boolean
}

export const initialAuthState: AuthState = 
{
  accessToken: null,
  refreshToken: null,
  error: null,
  isAuthenticated: false,
  isSubmitting: false,
  success: false
};