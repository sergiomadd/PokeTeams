import { AuthResponseDTO } from "../../models/DTOs/authResponse.dto";
import { User } from "../../models/user.model";

export interface AuthState
{
  loggedUser: User | null | undefined,
  validationErrors: string[] | null,
  isSubmitting: boolean
}