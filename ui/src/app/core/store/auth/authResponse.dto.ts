import { User } from "../../../features/user/models/user.model"

export interface AuthResponseDTO
{
  loggedUser: User | null
  success: boolean,
  error: string | null
}