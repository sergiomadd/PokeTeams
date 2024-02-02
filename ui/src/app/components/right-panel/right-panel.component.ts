import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent 
{
  user?: User | null = null;
  userService: UserService = inject(UserService);
  router = inject(Router)


  async ngOnInit()
  {
    this.user = await this.userService.getLoggedUser();
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
