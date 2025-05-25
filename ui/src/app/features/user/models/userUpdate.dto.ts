export interface UserUpdateDTO
{
  newUserName?: string,
  currentEmail?: string,
  newEmail?: string,
  emailConfirmationCode?: string,
  currentPassword?: string,
  newPassword?: string,
  passwordResetCode?: string,
  newPictureKey?: string,
  newCountryCode?: string,
  newName?: string,
  newVisibility?: boolean,
}      