import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient) { }

  refreshTokens() : Observable<void>
  {
    let url = this.apiUrl + 'refresh';
    return this.http.post<void>(url, {}, {withCredentials: true});
  }

  getLoggedUser() : Observable<User>
  {
    let url = this.apiUrl + 'logged';
    return this.http.get<User>(url, {withCredentials: true});
  }

  logIn(form: LogInDTO) : Observable<void>
  {
    let url = this.apiUrl + 'login';
    return this.http.post<void>(url, form, {withCredentials: true});
  }

  signUp(data: SignUpDTO) : Observable<void>
  {
    let url = this.apiUrl + 'signup';
    return this.http.post<void>(url, data, {withCredentials: true});
  }

  logOut() : Observable<void>
  {
    let url = this.apiUrl + 'logout';
    return this.http.get<void>(url, {withCredentials: true});
  }

  deleteAccount() : Observable<void>
  {
    let url = this.apiUrl + 'delete';
    return this.http.post<void>(url, null, {withCredentials: true});
  }

  changeName(updateDTO: UserUpdateDTO) : Observable<void>
  {
    console.log("changing name")
    let url = this.apiUrl + 'update/name';
    return this.http.post<void>(url, updateDTO, {withCredentials: true});
  }

  changeUserName(updateDTO: UserUpdateDTO) : Observable<void>
  {
    let url = this.apiUrl + 'update/username';
    return this.http.post<void>(url, updateDTO, {withCredentials: true});
  }

  changeEmail(updateDTO: UserUpdateDTO) : Observable<void>
  {
    let url = this.apiUrl + 'update/email';
    return this.http.post<void>(url, updateDTO, {withCredentials: true});
  }

  changePassword(updateDTO: UserUpdateDTO) : Observable<void>
  {
    let url = this.apiUrl + 'update/password';
    return this.http.post<void>(url, updateDTO, {withCredentials: true});
  }

  changePicture(updateDTO: UserUpdateDTO) : Observable<void>
  {
    let url = this.apiUrl + 'update/picture';
    return this.http.post<void>(url, updateDTO, {withCredentials: true});
  }

  changeCountry(updateDTO: UserUpdateDTO) : Observable<void>
  {
    let url = this.apiUrl + 'update/country';
    return this.http.post<void>(url, updateDTO, {withCredentials: true});
  }

  changeVisibility(updateDTO: UserUpdateDTO) : Observable<void>
  {
    let url = this.apiUrl + 'update/visibility';
    return this.http.post<void>(url, updateDTO, {withCredentials: true});
  }

  getEmailConfirmationCode() : Observable<void>
  {
    let url = this.apiUrl + 'code';
    return this.http.get<void>(url);
  }

  confirmEmail(updateDTO: UserUpdateDTO) : Observable<void>
  {
    let url = this.apiUrl + 'update/code';
    return this.http.post<void>(url, updateDTO, {withCredentials: true});
  }
}
