import { Component, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Tag } from 'src/app/models/tag.model';

@Component({
  selector: 'app-tag-editor',
  templateUrl: './tag-editor.component.html',
  styleUrl: './tag-editor.component.scss'
})
export class TagEditorComponent 
{
  formBuilder = inject(FormBuilder);

  @Output() addEvent = new EventEmitter<Tag>();
  @Output() closeEvent = new EventEmitter();

  @ViewChild('inputName') nameInputComponent!: ElementRef;
  @ViewChild('colorCode') colorCodeInputComponent!: ElementRef;

  form = this.formBuilder.group(
  {
    name: ['', Validators.required],
    desc: [''],
    color: ['#f44336']
  });

  tag: Tag = 
  {
    name: "",
    identifier: "",
    description: "",
    color: ""
  };

  colorPickerOpen: boolean = false;
  colors: string[] = 
  [
    '#f44336', '#e81e63','#9c27b0','#673ab7',
    '#3f51b5', '#2196f3','#03a9f4','#00bcd4',
    '#009688', '#4caf50','#8bc34a','#cddc39',
    '#ffeb3b', '#ffc107','#ff9800','#ff5722',
  ];

  ngOnInit()
  {
  }

  async ngAfterContentInit()
  {
    this.resetEditor();

    this.form.controls.name.valueChanges.subscribe(value => 
      {
        this.tag.name = value ?? "";
        this.tag.identifier = value ?? "";
      })
    this.form.controls.desc.valueChanges.subscribe(value => 
      {
        this.tag.description = value ?? "";
      })
    this.form.controls.color.valueChanges.subscribe(value => 
      {
        this.colorCodeInputComponent.nativeElement.value = value;        
        this.tag = {...this.tag, color: value ?? ""}
      })
  }

  resetEditor()
  {
    this.tag = 
    {
      name: this.form.controls.name.value ?? "",
      identifier: "",
      description: this.form.controls.desc.value ?? "",
      color: this.form.controls.color.value ?? this.colors[0]
    };
    this.form.controls.name.setValue("");
    this.form.controls.desc.setValue("");
    this.form.controls.color.setValue(this.colors[0]);
  }

  add()
  {
    this.addEvent.emit(this.tag);
    this.resetEditor();
  }

  setName(preName: string)
  {
    if(preName)
    {
      this.form.controls.name.setValue(preName);
      this.nameInputComponent.nativeElement.value = preName;        
    }
  }

  close()
  {
    this.closeEvent.emit();
  }

  toggleColorPicker()
  {
    this.colorPickerOpen = !this.colorPickerOpen;
  }

  chooseColor($event)
  {
    this.tag.color = $event;
  }
}
