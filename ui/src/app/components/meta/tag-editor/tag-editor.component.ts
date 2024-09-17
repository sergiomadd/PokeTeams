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

  @ViewChild('colorCode') colorCodeInputComponent!: ElementRef;

  form = this.formBuilder.group(
  {
    name: ['', Validators.required],
    desc: [''],
    color: ['#000000']
  });

  tag: Tag = 
  {
    name: "",
    identifier: "",
    description: "",
    color: ""
  };

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
      color: this.form.controls.color.value ?? "#000000"
    };
    this.form.controls.name.setValue("");
    this.form.controls.desc.setValue("");
    this.form.controls.color.setValue("#000000");
  }

  add()
  {
    this.addEvent.emit(this.tag);
    this.resetEditor();
  }
}
