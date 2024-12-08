import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { selectToken } from 'src/app/core/auth/store/auth.selectors';
import { JWTResponse } from 'src/app/core/auth/types/jwtResponse.dto';
import { AppState } from 'src/app/core/store/app.state';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService 
{

  store = inject(Store)

  token$ = this.store.select(selectToken)

  constructor() { }
  
  decode(token: string): JwtPayload
  {
    return jwtDecode(token);
  }

  getTokenUsername(token: string): string | undefined
  {
    return jwtDecode(token).sub;
  }

  getAccessToken(): string | null
  {
    const storage: string | null = localStorage.getItem("state");
    if(storage)
    {
      const storageValue: AppState = JSON.parse(storage);
      return storageValue.auth.accessToken ?? null;  
    }
    return null;
  }

  getRefreshToken(): string | null
  {
    const storage: string | null = localStorage.getItem("state");
    if(storage)
    {
      const storageValue: AppState = JSON.parse(storage);
      return storageValue.auth.refreshToken ?? null;  
    }
    return null;
  }

  isAccessTokenExpired(token: string | null): boolean 
  {
    if (token)
    {
      const decoded = jwtDecode(token);
      if(decoded && decoded.exp)
      {
        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        if (date)
        {
          return !(date.valueOf() > new Date().valueOf());
        }
      }
    }
    return true;
  }

  getTokens(): JWTResponse
  {
    const tokens: JWTResponse =
    {
      accessToken: this.getAccessToken() ?? "",
      refreshToken: this.getRefreshToken() ?? ""
    }
    return tokens;
  }
}
