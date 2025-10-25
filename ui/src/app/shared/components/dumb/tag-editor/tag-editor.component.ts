import { Component, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeService } from '../../../../core/helpers/theme.service';
import { UtilService } from '../../../../core/helpers/util.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { tagBackgroundColors } from '../../../../core/models/misc/tagColors.model';
import { Tag } from '../../../../core/models/team/tag.model';
import { TeamService } from '../../../../core/services/team.service';
import { NgClass } from '@angular/common';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { ChipComponent } from '../chip/chip.component';
import { TranslatePipe } from '@ngx-translate/core';
import { GetTagTextColorPipe } from '../../../pipes/color-pipes/getTagTextColor.pipe';

@Component({
    selector: 'app-tag-editor',
    templateUrl: './tag-editor.component.html',
    styleUrl: './tag-editor.component.scss',
    imports: [NgClass, ColorPickerComponent, FormsModule, ReactiveFormsModule, ChipComponent, TranslatePipe, GetTagTextColorPipe]
})
export class TagEditorComponent 
{
  formBuilder = inject(FormBuilder);
  themeService = inject(ThemeService);
  teamService = inject(TeamService);
  util = inject(UtilService);
  window = inject(WindowService);
  theme = inject(ThemeService);

  readonly visible = input<boolean>(false);
  readonly addEvent = output<Tag>();
  readonly closeEvent = output();

  readonly nameInputComponent = viewChild.required<ElementRef>('inputName');
  readonly colorCodeInputComponent = viewChild.required<ElementRef>('colorCode');

  form = this.formBuilder.group(
  {
    name: ['', [Validators.required, Validators.maxLength(16)]],
    desc: ['', [Validators.maxLength(256)]],
    color: [0]
  });
  formSubmitted: boolean = false;

  tag: Tag = 
  {
    name: "",
    identifier: "",
    description: "",
    color: 0
  };

  colorPickerOpen: boolean = false;
  tagBackgroundColors = tagBackgroundColors;

  async ngAfterContentInit()
  {
    this.resetEditor();

    this.form.controls.name.valueChanges.subscribe(async value => 
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
        this.tag = {...this.tag, color: value ?? 0}
      })
  }

  resetEditor()
  {
    this.tag = 
    {
      name: this.form.controls.name.value ?? "",
      identifier: "",
      description: this.form.controls.desc.value ?? "",
      color: this.form.controls.color.value ?? 0
    };
    this.form.controls.name.setValue("");
    this.form.controls.name.markAsUntouched();
    this.form.controls.name.markAsPristine();

    this.form.controls.desc.setValue("");
    this.form.controls.desc.markAsUntouched();
    this.form.controls.desc.markAsPristine();

    this.form.controls.color.setValue(0);
    this.colorPickerOpen = false;

    this.formSubmitted = false;
  }

  async add()
  {
    this.formSubmitted = true;
    if(this.form.valid)
    {
      let tagAvailable: boolean = await this.teamService.checkTagAvailable(this.tag.name);
      if(!tagAvailable)
      {
        this.form.controls.name.setErrors({ "tagTaken": true });
      }
      else
      {
        this.addEvent.emit(this.tag);
        this.resetEditor();
      }
    }
  }

  setName(preName: string)
  {
    if(preName)
    {
      this.form.controls.name.setValue(preName);
      this.nameInputComponent().nativeElement.value = preName;        
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
