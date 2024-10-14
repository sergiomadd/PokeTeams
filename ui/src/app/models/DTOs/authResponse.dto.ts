import { User } from "../../features/user/models/user.model"

export interface AuthResponseDTO
{
  user: User | undefined | null,
  success: boolean,
  errors: string[]
}