import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { authActions } from 'src/app/state/auth/auth.actions';

@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.component.html',
  styleUrls: ['./user-options.component.scss']
})
export class UserOptionsComponent 
{
  store = inject(Store);

  deleteAccount()
  {
    
  }

  
  async logOut()
  {
    localStorage.removeItem(".AspNetCore.Identity.Application");
    //this.clearCookies();
    this.store.dispatch(authActions.getLogged());
  }

  /*
  clearCookies()
  {
    console.log("local storage", localStorage)
    console.log("cookie", this.getCookie(".AspNetCore.Identity.Application"))
    console.log("doc", document.cookie)
    localStorage.removeItem(".AspNetCore.Identity.Application");
    this.delete_cookie(".AspNetCore.Identity.Application");
  }

  getCookie(name) {
    function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
  }
  delete_cookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
  */
}
