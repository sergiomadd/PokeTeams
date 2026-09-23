import { Component, effect, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
  formName = toSignal(this.form.controls.name.valueChanges);
  formDesc = toSignal(this.form.controls.desc.valueChanges);
  formColor = toSignal(this.form.controls.color.valueChanges);
  formSubmitted: boolean = false;

  tag = signal<Tag>(
  {
    name: "",
    identifier: "",
    description: "",
    color: 0
  });

  colorPickerOpen: boolean = false;
  tagBackgroundColors = tagBackgroundColors;

  constructor()
  {
    this.resetEditor();

    effect(() =>
    {
      const name = this.formName();
      this.tag.update(tag => ({...tag, name: name ?? "", identifier: name ?? ""}));
    })
    effect(() =>
    {
      const desc = this.formDesc();
      this.tag.update(tag => ({...tag, description: desc ?? ""}));
    })
    effect(() =>
    {
      const color = this.formColor();
      this.tag.update(tag => ({...tag, color: color ?? 0}));
    })
  }

  resetEditor()
  {
    this.tag.set(
    {
      name: this.form.controls.name.value ?? "",
      identifier: "",
      description: this.form.controls.desc.value ?? "",
      color: this.form.controls.color.value ?? 0
    });
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
      const name = this.form.controls.name.value ?? "";
      let tagAvailable: boolean = await this.teamService.checkTagAvailable(name);
      if(!tagAvailable)
      {
        this.form.controls.name.setErrors({ "tagTaken": true });
      }
      else
      {
        this.addEvent.emit(
        {
          ...this.tag(),
          name,
          identifier: name,
          description: this.form.controls.desc.value ?? ""
        });
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
    this.tag.update(tag => ({...tag, color: $event}));
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
