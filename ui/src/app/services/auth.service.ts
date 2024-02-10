import { Injectable, inject } from '@angular/core';
import { GenerateTeamService } from './generate-team.service';
import { HttpClient } from '@angular/common/http';
import { SignUpDTO } from '../models/DTOs/signup.dto';
import { AuthResponseDTO } from '../models/DTOs/authResponse.dto';
import { Observable } from 'rxjs';
import { getErrorMessage } from './util';
import { LogInDTO } from '../models/DTOs/login.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService 
{

  private apiUrl = 'https://localhost:7134/api/user/';

  generateTeam: GenerateTeamService = inject(GenerateTeamService)

  constructor(private http: HttpClient) { }

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

  //TODO
  getLogged() : Observable<AuthResponseDTO>
  {
    let url = this.apiUrl + 'logged';
    return this.http.get<AuthResponseDTO>(url, {withCredentials: true});
  }
}
