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

  //MAKE RESULT OBSERVABLE -> behavior subject
  @Input() label?: string;
  @Input() keepSelected?: boolean;
  @Input() showAll?: boolean;
  @Input() getter?: (args: any) => Promise<Tag[]>
  @Input() allGetter?: () => Promise<Tag[]>
  @Output() selectEvent = new EventEmitter<Tag>();


  @ViewChild('input') input!: ElementRef;
  searchForm = this.formBuilder.group(
  {
    key: [''],
  });

  results?: Tag[] = [];
  showOptions: boolean = false;

  selected?: Tag | undefined;

  async ngOnInit()
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
    if(this.showAll && this.allGetter)
    {
      this.results = await this.allGetter();
    }
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
    if(this.keepSelected)
    {
      this.searchForm.controls.key.setValue(selectedResult.name);
      this.selected = selectedResult;
    }
    else
    {
      this.searchForm.controls.key.setValue("");
      this.input.nativeElement.focus();
    }
    this.showOptions = false;
    this.selectEvent.emit(selectedResult);
  }

  removeSelected()
  {
    this.selected = undefined;
    this.searchForm.controls.key.setValue("");
  }

  async onFocus()
  {
    this.showOptions = true;
    if(this.showAll && this.allGetter)
    {
      this.results = await this.allGetter();
    }
  }

  onBlur()
  {
    this.showOptions = false;
  }
}
