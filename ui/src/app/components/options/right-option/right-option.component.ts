import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditorOptions } from 'src/app/models/editorOptions.model';


@Component({
  selector: 'app-right-option',
  templateUrl: './right-option.component.html',
  styleUrls: ['./right-option.component.scss']
})
export class RightOptionComponent 
{
  @Input() editorOptions!: EditorOptions;
  @Input() editorOptionsSwitchSelector!: string;
  @Input() label!: string;
  @Input() hoverText!: string;

  @Output() checkEvent = new EventEmitter<boolean>();

  hover: boolean = false;
  checked: boolean = false;

  ngOnInit()
  {
    this.checked = this.editorOptions[this.editorOptionsSwitchSelector];
  }

  clickEvent()
  {
    this.checked = !this.checked;
    this.editorOptions[this.editorOptionsSwitchSelector] = this.checked;
    this.checkEvent.emit(this.editorOptions.showIVs);
  }

  mouseEnter()
  {
    this.hover = true;
  }

  mouseLeave()
  {
    this.hover = false;
  }
}
