import { Injectable } from '@angular/core';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { AppState } from 'src/app/store/app.state';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService 
{

  constructor() { }
  
  decode(token: string): JwtPayload
  {
    return jwtDecode(token);
  }

  getTokenUsername(token: string): string | undefined
  {
    return jwtDecode(token).sub;
  }

  getToken(): string 
  {
    const storage: string | null = localStorage.getItem("state");
    if(storage)
    {
      const storageValue: AppState = JSON.parse(storage);
      return storageValue.auth.token ?? "";  
    }
    return "";
  }
}
