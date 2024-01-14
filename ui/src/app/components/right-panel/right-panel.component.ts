import { Component, Input } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent 
{
  @Input() user?: User;

  ngOnInit()
  {
    //this.user = undefined;
  }


}
