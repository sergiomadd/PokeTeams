import { User } from "../user.model"

export interface AuthResponseDTO
{
  user: User | null,
  success: boolean,
  errors: string[]
}