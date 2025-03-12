import { User } from "src/app/features/user/models/user.model"

export interface AuthResponseDTO
{
  loggedUser: User | null
  success: boolean,
  error: string | null
}