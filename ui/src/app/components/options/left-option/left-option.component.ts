import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditorOption } from 'src/app/models/editorOption.model';
import { EditorOptions } from 'src/app/models/editorOptions.model';

@Component({
  selector: 'app-left-option',
  templateUrl: './left-option.component.html',
  styleUrls: ['./left-option.component.scss']
})
export class LeftOptionComponent 
{
  @Input() editorOptions!: EditorOptions;
  @Input() selectData!: EditorOption[];
  @Input() editorOptionsSelectSelector!: string;
  @Input() label!: string;

  @Output() selectEvent = new EventEmitter<object>();


  active: EditorOption = <EditorOption>{};
  open: boolean = false;
  hover: EditorOption = <EditorOption>{};

  ngOnInit()
  {
    console.log(this.editorOptions[this.editorOptionsSelectSelector])
    this.active = this.editorOptions[this.editorOptionsSelectSelector];
  }

  onMouseEnter(icon: EditorOption)
  {
    this.hover = icon;
  }

  onMouseLeave()
  {
    this.hover = <EditorOption>{};
  }

  onOpen()
  {
    this.open = !this.open;
  }

  onSelect(icon: EditorOption)
  {
    this.active = icon;
    this.editorOptions[this.editorOptionsSelectSelector] = icon;
    this.onMouseLeave();
    this.selectEvent.emit(icon);
  }
}
