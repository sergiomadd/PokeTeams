import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Tag } from 'src/app/models/tag.model';


@Component({
  selector: 'app-smart-input',
  templateUrl: './smart-input.component.html',
  styleUrl: './smart-input.component.scss'
})
export class SmartInputComponent 
{
  formBuilder = inject(FormBuilder);

  @Input() label?: string;
  //Pass function for where to get results of input
  @Input() getter?: (args: any) => Promise<Tag[]>
  @Output() selectEvent = new EventEmitter<Tag>();
  results?: Tag[] = [];

  @Input() keepSelected?: boolean;
  keptResult?: Tag;

  @ViewChild('input') input!: ElementRef;
  searchForm = this.formBuilder.group(
  {
    key: [''],
  });

  showOptions: boolean = false;

  ngOnInit()
  {
    this.searchForm.controls.key.valueChanges.subscribe(async (value) => 
    {
      if(value)
      {
        this.search(value);
      }
      else
      {
        this.results = [];
        this.showOptions = false;
      }
    });
  }

  async search(key: string)
  {
    if(this.getter)
    {
      this.showOptions = true;
      this.results = await this.getter(key);
    }
  }

  selectResult(selectedResult: Tag)
  {
    if(this.keepSelected && selectedResult.identifier === "custom")
    {
      this.showOptions = false;
    }
    else if(this.keepSelected)
    {
      this.searchForm.controls.key.setValue(selectedResult.name);
      this.keptResult = selectedResult;
      this.showOptions = false;
    }
    else
    {
      this.showOptions = true;
      this.input.nativeElement.focus();
    }
    this.selectEvent.emit(selectedResult);
  }

  removeSelected()
  {
    this.keptResult = undefined;
    this.searchForm.controls.key.setValue("");
  }

  onFocus()
  {
    this.showOptions = true;
  }

  onBlur()
  {
    this.showOptions = false;
  }
}
