import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { tagBackgroundColors } from 'src/app/core/config/models/tagColors.model';
import { ThemeService } from 'src/app/core/config/services/theme.service';
import { WindowService } from 'src/app/core/layout/mobile/window.service';
import { Tag } from 'src/app/features/team/models/tag.model';
import { TeamService } from 'src/app/features/team/services/team.service';
import { UtilService } from 'src/app/shared/services/util.service';

@Component({
  selector: 'app-tag-editor',
  templateUrl: './tag-editor.component.html',
  styleUrl: './tag-editor.component.scss'
})
export class TagEditorComponent 
{
  formBuilder = inject(FormBuilder);
  themeService = inject(ThemeService);
  teamService = inject(TeamService);
  util = inject(UtilService);
  window = inject(WindowService);

  @Input() visible: boolean = false;
  @Output() addEvent = new EventEmitter<Tag>();
  @Output() closeEvent = new EventEmitter();

  @ViewChild('inputName') nameInputComponent!: ElementRef;
  @ViewChild('colorCode') colorCodeInputComponent!: ElementRef;

  form = this.formBuilder.group(
  {
    name: ['', [Validators.required, Validators.maxLength(16)]],
    desc: ['', [Validators.maxLength(256)]],
    color: ['#f44336']
  });
  formSubmitted: boolean = false;

  tag: Tag = 
  {
    name: "",
    identifier: "",
    description: "",
    color: ""
  };

  colorPickerOpen: boolean = false;
  tagBackgroundColors = tagBackgroundColors;

  ngOnInit()
  {

  }

  async ngAfterContentInit()
  {
    this.resetEditor();

    this.form.controls.name.valueChanges.subscribe(async value => 
      {
        console.log("name ", name)
        this.tag.name = value ?? "";
        this.tag.identifier = value ?? "";
        if(value && !await this.teamService.checkTagAvailable(value))
        {
          this.form.controls.name.setErrors({ "tagTaken": true });
        }
      })
    this.form.controls.desc.valueChanges.subscribe(value => 
      {
        this.tag.description = value ?? "";
      })
    this.form.controls.color.valueChanges.subscribe(value => 
      {
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
      color: this.form.controls.color.value ?? this.tagBackgroundColors[0]
    };
    this.form.controls.name.setValue("");
    this.form.controls.name.markAsUntouched();
    this.form.controls.name.markAsPristine();

    this.form.controls.desc.setValue("");
    this.form.controls.desc.markAsUntouched();
    this.form.controls.desc.markAsPristine();

    this.form.controls.color.setValue(this.tagBackgroundColors[0]);
    this.colorPickerOpen = false;

    this.formSubmitted = false;
  }

  add()
  {
    this.formSubmitted = true;
    if(this.form.valid)
    {
      this.addEvent.emit(this.tag);
      this.resetEditor();
    }
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

  isInvalid(key: string) : boolean
  {
    var control = this.form.get(key);
    return (control?.errors
      && (this.formSubmitted)) 
      ?? false;
  }

  getError(key: string) : string
  {
    let control: AbstractControl | null = this.form.get(key);
    return this.util.getAuthFormError(control);
  }
}
