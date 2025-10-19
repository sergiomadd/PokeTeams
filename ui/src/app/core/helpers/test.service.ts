import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TestService 
{
  private apiUrl = environment.apiUrl + 'testdata/';

  constructor(private http: HttpClient) { }

  getTestForms(): Observable<string>
  {
    let url = this.apiUrl + "forms";
    return this.http.get<string>(url, {withCredentials: true});
  }

  getTestPaste(key: string): Observable<string>
  {
    let url = this.apiUrl + "paste/" + key;
    return this.http.get<string>(url, {withCredentials: true});
  }
}
