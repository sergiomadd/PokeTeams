import { AuthResponseDTO } from "./DTOs/authResponse.dto";
import { User } from "./user.model";

export interface AuthStateInterface
{
  loggedUser: User | null | undefined,
  validationErrors: string[] | null,
  isSubmitting: boolean
}