import { Injectable, inject } from '@angular/core';
import { GenerateTeamService } from './generate-team.service';
import { HttpClient } from '@angular/common/http';
import { SignUpDTO } from '../models/DTOs/signup.dto';
import { AuthResponseDTO } from '../models/DTOs/authResponse.dto';
import { Observable } from 'rxjs';
import { getErrorMessage } from './util';
import { LogInDTO } from '../models/DTOs/login.dto';
import { UserUpdateDTO } from '../models/DTOs/userUpdate.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService 
{

  private apiUrl = 'https://localhost:7134/api/user/';

  generateTeam: GenerateTeamService = inject(GenerateTeamService)

  constructor(private http: HttpClient) { }

  getLogged() : Observable<AuthResponseDTO>
  {
    let url = this.apiUrl + 'logged';
    return this.http.get<AuthResponseDTO>(url, {withCredentials: true});
  }

  logIn(form: LogInDTO) : Observable<AuthResponseDTO>
  {
    let url = this.apiUrl + 'login';
    return this.http.post<AuthResponseDTO>(url, form, {withCredentials: true});
  }

  signUp(data: SignUpDTO) : Observable<AuthResponseDTO>
  {
    let url = this.apiUrl + 'signup';
    return this.http.post<AuthResponseDTO>(url, data, {withCredentials: true});
  }

  logOut() : Observable<AuthResponseDTO>
  {
    let url = this.apiUrl + 'logout';
    return this.http.get<AuthResponseDTO>(url, {withCredentials: true});
  }

  deleteAccount() : Observable<AuthResponseDTO>
  {
    let url = this.apiUrl + 'delete';
    return this.http.post<AuthResponseDTO>(url, null, {withCredentials: true});
  }

  changeUserName(updateDTO: UserUpdateDTO) : Observable<AuthResponseDTO>
  {
    let url = this.apiUrl + 'update/username';
    return this.http.post<AuthResponseDTO>(url, updateDTO, {withCredentials: true});
  }

  changeEmail(updateDTO: UserUpdateDTO) : Observable<AuthResponseDTO>
  {
    let url = this.apiUrl + 'update/email';
    return this.http.post<AuthResponseDTO>(url, updateDTO, {withCredentials: true});
  }

  changePassword(updateDTO: UserUpdateDTO) : Observable<AuthResponseDTO>
  {
    let url = this.apiUrl + 'update/password';
    return this.http.post<AuthResponseDTO>(url, updateDTO, {withCredentials: true});
  }

  changePicture(updateDTO: UserUpdateDTO) : Observable<AuthResponseDTO>
  {
    let url = this.apiUrl + 'update/picture';
    return this.http.post<AuthResponseDTO>(url, updateDTO, {withCredentials: true});
  }

  changeCountry(updateDTO: UserUpdateDTO) : Observable<AuthResponseDTO>
  {
    let url = this.apiUrl + 'update/country';
    return this.http.post<AuthResponseDTO>(url, updateDTO, {withCredentials: true});
  }
}
