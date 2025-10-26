import { User } from "../../models/user/user.model"

export interface AuthResponseDTO
{
  loggedUser: User | null
  success: boolean,
  error: string | null
}