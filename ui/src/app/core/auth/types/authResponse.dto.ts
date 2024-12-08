
export interface AuthResponseDTO
{
  accessToken: string | null,
  refreshToken: string | null,
  username: string | null,
  success: boolean,
  error: string | null
}