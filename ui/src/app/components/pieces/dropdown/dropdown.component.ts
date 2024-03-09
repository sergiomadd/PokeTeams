import { Component, EventEmitter, Input, Output, SimpleChange, SimpleChanges, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common'

export interface DropdownOption
{
  name: string,
  code?: string,
  icon?: string
}


@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent 
{
  formBuilder = inject(FormBuilder);

  @Input() options?: DropdownOption[];
  @Input() selectedOption?: DropdownOption;
  @Input() disable?: boolean;
  
  @Output() selectEvent = new EventEmitter<DropdownOption>();

  showOptions?: boolean = false;
  showInput?: boolean = false;
  filteredOptions?: DropdownOption[] = [];

  form = this.formBuilder.group(
    {
      value: [this.selectedOption?.name],
    });

  ngOnInit()
  {
    this.filteredOptions = this.options;
    this.form.controls.value.valueChanges.subscribe((value) => 
    {
      if(value && value != null)
      {
        this.filteredOptions = this.options?.filter(o => o.name.toLocaleLowerCase().includes(value));
        if(!this.showOptions) { this.showOptions = !this.showOptions; }
      }
      else
      {
        this.filteredOptions = this.options;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['options'])
    {
      this.filteredOptions = this.options;
    }
  }

  onFocus()
  {
    if(!this.showOptions) { this.showOptions = !this.showOptions; }
  }

  onBlur()
  {
    if(this.showOptions) { this.showOptions = !this.showOptions; }
  }

  clearForm()
  {
    this.form.controls.value.setValue('');
  }

  onClickBody()
  {
    this.showInput = !this.showInput;
  }

  onClickArrow()
  {
    this.showOptions = !this.showOptions;
  }

  onSelect(option)
  {
    this.selectEvent.emit(option);
    this.onClickArrow();
    this.form.controls.value.setValue('');
  }
}