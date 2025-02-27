import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, timeout } from 'rxjs';
import { EmailDTO } from 'src/app/features/user/models/email.dto';
import { User } from 'src/app/features/user/models/user.model';
import { LogInDTO } from '../../../features/user/models/login.dto';
import { SignUpDTO } from '../../../features/user/models/signup.dto';
import { UserUpdateDTO } from '../../../features/user/models/userUpdate.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService 
{
  private apiUrl = 'https://localhost:7134/api/auth/';
  private dataTimeout = 5000;

  constructor(private http: HttpClient) { }

  refreshTokens() : Observable<void>
  {
    let url = this.apiUrl + 'refresh';
    return this.http.post<void>(url, {}, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  getLoggedUser() : Observable<User>
  {
    let url = this.apiUrl + 'logged';
    return this.http.get<User>(url, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  getLoggedUserEmail() : Observable<EmailDTO>
  {
    let url = this.apiUrl + 'email';
    return this.http.get<EmailDTO>(url, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  logIn(form: LogInDTO) : Observable<void>
  {
    let url = this.apiUrl + 'login';
    return this.http.post<void>(url, form, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  signUp(data: SignUpDTO) : Observable<void>
  {
    let url = this.apiUrl + 'signup';
    return this.http.post<void>(url, data, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  logOut() : Observable<void>
  {
    let url = this.apiUrl + 'logout';
    return this.http.get<void>(url, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  deleteAccount() : Observable<void>
  {
    let url = this.apiUrl + 'delete';
    return this.http.post<void>(url, null, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  changeName(updateDTO: UserUpdateDTO) : Observable<void>
  {
    console.log("changing name")
    let url = this.apiUrl + 'update/name';
    return this.http.post<void>(url, updateDTO, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  changeUserName(updateDTO: UserUpdateDTO) : Observable<void>
  {
    let url = this.apiUrl + 'update/username';
    return this.http.post<void>(url, updateDTO, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  changeEmail(updateDTO: UserUpdateDTO) : Observable<void>
  {
    let url = this.apiUrl + 'update/email';
    return this.http.post<void>(url, updateDTO, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  changePassword(updateDTO: UserUpdateDTO) : Observable<void>
  {
    let url = this.apiUrl + 'update/password';
    return this.http.post<void>(url, updateDTO, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  changePicture(updateDTO: UserUpdateDTO) : Observable<void>
  {
    let url = this.apiUrl + 'update/picture';
    return this.http.post<void>(url, updateDTO, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  changeCountry(updateDTO: UserUpdateDTO) : Observable<void>
  {
    let url = this.apiUrl + 'update/country';
    return this.http.post<void>(url, updateDTO, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  changeVisibility(updateDTO: UserUpdateDTO) : Observable<void>
  {
    let url = this.apiUrl + 'update/visibility';
    return this.http.post<void>(url, updateDTO, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  getEmailConfirmationCode() : Observable<void>
  {
    let url = this.apiUrl + 'code';
    return this.http.get<void>(url, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  confirmEmail(updateDTO: UserUpdateDTO) : Observable<void>
  {
    let url = this.apiUrl + 'update/code';
    return this.http.post<void>(url, updateDTO, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  doesLoggedUserOwnTeam(teamID: string) : Observable<boolean>
  {
    let url = this.apiUrl + 'own/' + teamID;
    return this.http.get<boolean>(url, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }
}
