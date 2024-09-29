import { Component, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Tag } from 'src/app/models/tag.model';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-tag-editor',
  templateUrl: './tag-editor.component.html',
  styleUrl: './tag-editor.component.scss'
})
export class TagEditorComponent 
{
  formBuilder = inject(FormBuilder);
  themeService = inject(ThemeService);

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
      color: this.form.controls.color.value ?? this.themeService.tagBackgroundColors[0]
    };
    this.form.controls.name.setValue("");
    this.form.controls.desc.setValue("");
    this.form.controls.color.setValue(this.themeService.tagBackgroundColors[0]);
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
