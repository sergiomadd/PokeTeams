import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeamService } from '../../features/team/services/team.service';
import { LogInDTO } from '../../models/DTOs/login.dto';
import { SignUpDTO } from '../../models/DTOs/signup.dto';
import { UserUpdateDTO } from '../../models/DTOs/userUpdate.dto';
import { AuthResponseDTO } from '../types/authResponse.dto';
import { JWTResponse } from '../types/jwtResponse.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService 
{
  private apiUrl = 'https://localhost:7134/api/auth/';

  generateTeam: TeamService = inject(TeamService)

  constructor(private http: HttpClient) { }

  refreshTokens(tokens: JWTResponse) : Observable<JWTResponse>
  {
    let url = this.apiUrl + 'refresh';
    return this.http.post<JWTResponse>(url, tokens, {headers:{skip:"true"}, withCredentials: true});
  }

  getLogged() : Observable<JWTResponse>
  {
    let url = this.apiUrl + 'logged';
    return this.http.get<JWTResponse>(url, {withCredentials: true});
  }

  logIn(form: LogInDTO) : Observable<JWTResponse>
  {
    let url = this.apiUrl + 'login';
    return this.http.post<JWTResponse>(url, form, {withCredentials: true});
  }

  signUp(data: SignUpDTO) : Observable<JWTResponse>
  {
    let url = this.apiUrl + 'signup';
    return this.http.post<JWTResponse>(url, data, {withCredentials: true});
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

  changeName(updateDTO: UserUpdateDTO) : Observable<JWTResponse>
  {
    console.log("changing name")
    let url = this.apiUrl + 'update/name';
    return this.http.post<JWTResponse>(url, updateDTO, {withCredentials: true});
  }

  changeUserName(updateDTO: UserUpdateDTO) : Observable<JWTResponse>
  {
    let url = this.apiUrl + 'update/username';
    return this.http.post<JWTResponse>(url, updateDTO, {withCredentials: true});
  }

  changeEmail(updateDTO: UserUpdateDTO) : Observable<JWTResponse>
  {
    let url = this.apiUrl + 'update/email';
    return this.http.post<JWTResponse>(url, updateDTO, {withCredentials: true});
  }

  changePassword(updateDTO: UserUpdateDTO) : Observable<JWTResponse>
  {
    let url = this.apiUrl + 'update/password';
    return this.http.post<JWTResponse>(url, updateDTO, {withCredentials: true});
  }

  changePicture(updateDTO: UserUpdateDTO) : Observable<JWTResponse>
  {
    let url = this.apiUrl + 'update/picture';
    return this.http.post<JWTResponse>(url, updateDTO, {withCredentials: true});
  }

  changeCountry(updateDTO: UserUpdateDTO) : Observable<JWTResponse>
  {
    let url = this.apiUrl + 'update/country';
    return this.http.post<JWTResponse>(url, updateDTO, {withCredentials: true});
  }

  changeVisibility(updateDTO: UserUpdateDTO) : Observable<JWTResponse>
  {
    let url = this.apiUrl + 'update/visibility';
    return this.http.post<JWTResponse>(url, updateDTO, {withCredentials: true});
  }
}
