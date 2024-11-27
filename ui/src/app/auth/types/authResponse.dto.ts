import { User } from "../../features/user/models/user.model"

export interface AuthResponseDTO
{
  accessToken: string | null,
  refreshToken: string | null,
  user: User | null,
  success: boolean,
  error: string | null
}