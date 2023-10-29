import { Component, Input } from '@angular/core';
import { EditorOption } from 'src/app/models/editorOption.model';
import { EditorOptions } from 'src/app/models/editorOptions.model';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})

export class OptionComponent 
{
  @Input() editorOptions!: EditorOptions;
  @Input() editorOptionsSwitchSelector!: string;
  @Input() selectData?: EditorOption[];
  @Input() selectDisable?: boolean;
  @Input() editorOptionsSelectSelector?: string;
  @Input() label?: string;

  selectedOption: EditorOption = <EditorOption>{};

  checkEvent($event)
  {
    this.editorOptions[this.editorOptionsSwitchSelector] = $event;
  }

  selectEvent(value)
  {
    const option = value as HTMLSelectElement;
    if(this.editorOptionsSelectSelector && this.selectData)
    {
      this.editorOptions[this.editorOptionsSelectSelector] = this.selectData[option.selectedIndex];
    }
  }
}
