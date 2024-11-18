import { User } from "../../features/user/models/user.model"

export interface AuthResponseDTO
{
  token: string | null,
  user: User | null,
  success: boolean,
  error: string | null
}