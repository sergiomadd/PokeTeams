import { User } from "../user.model"

export interface AuthResponseDTO
{
  user: User | undefined | null,
  success: boolean,
  errors: string[]
}