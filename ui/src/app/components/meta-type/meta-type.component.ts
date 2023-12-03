import { Component, Input } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon.model';
import { EditorOptions } from 'src/app/models/editorOptions.model';

@Component({
  selector: 'app-meta-type',
  templateUrl: './meta-type.component.html',
  styleUrls: ['./meta-type.component.scss', '../pokemon/pokemon.component.scss']
})
export class MetaTypeComponent 
{
  @Input() pokemon!: Pokemon;
  @Input() editorOptions!: EditorOptions;
}
