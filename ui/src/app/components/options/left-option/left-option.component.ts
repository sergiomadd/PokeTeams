import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditorOption } from 'src/app/models/editorOption.model';
import { EditorOptions } from 'src/app/models/editorOptions.model';
import { Pokemon } from 'src/app/models/pokemon.model';
import { Sprite } from 'src/app/models/sprite.model';

@Component({
  selector: 'app-left-option',
  templateUrl: './left-option.component.html',
  styleUrls: ['./left-option.component.scss']
})
export class LeftOptionComponent 
{
  @Input() editorOptions!: EditorOptions;
  @Input() selectData?: EditorOption[];
  @Input() spritesData?: Sprite[];
  @Input() editorOptionsSelectSelector!: string;
  @Input() label!: string;

  @Output() selectEvent = new EventEmitter<object>();

  active?: EditorOption | undefined = undefined;
  open: boolean = false;
  hover: EditorOption | undefined  = <EditorOption>{};

  ngOnChanges()
  {
    this.active = this.editorOptions ? this.editorOptions[this.editorOptionsSelectSelector] : undefined;
  }

  onMouseEnter(icon: EditorOption | undefined)
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

  onSelectSprite(icon: Sprite, index: number)
  {
    this.editorOptions[this.editorOptionsSelectSelector] =
    {
      name: icon.name,
      identifier: index,
      path: icon.base
    };
    this.active = this.editorOptions[this.editorOptionsSelectSelector];
    //this.onMouseLeave();
    this.selectEvent.emit(icon);
  }

  formatName(name?: string)
  {
    return name?.split('/').join(' ');
  }
}
