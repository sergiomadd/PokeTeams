import { Component, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.component.html',
  styleUrls: ['./user-options.component.scss']
})
export class UserOptionsComponent 
{
  userService = inject(UserService);
  user?: User | null;

  deleteAccount()
  {
    
  }

  
  async logOut()
  {
    await this.userService.logOut()
    localStorage.removeItem(".AspNetCore.Identity.Application");
    this.clearCookies();
    this.user = null;
  }

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
}
