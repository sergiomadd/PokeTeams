import { User } from "../../features/user/models/user.model";

export interface AuthState
{
  loggedUser: User | null | undefined,
  validationErrors: string[] | null,
  isSubmitting: boolean
}