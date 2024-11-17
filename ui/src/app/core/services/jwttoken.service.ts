import { Injectable } from '@angular/core';
import { JwtPayload, jwtDecode } from 'jwt-decode';

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
}
