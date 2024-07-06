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
  @Input() keepSelected?: boolean;
  @Input() getter?: (args: any) => Promise<Tag[]>
  @Input() allGetter?: (args?: any) => Promise<Tag[]>
  @Input() allGetterIndex?: number;
  @Output() selectEvent = new EventEmitter<Tag>();

  @ViewChild('input') input!: ElementRef;
  searchForm = this.formBuilder.group(
  {
    key: [''],
  });

  results: Tag[] = [];
  showOptions: boolean = false;
  customQueryResult: Tag = 
  {
    name: "",
    identifier: ""
  }
  selected?: Tag | undefined;

  async ngOnInit()
  {
    this.results[0] = 
    {
      name: "",
      identifier: ""
    }
    this.searchForm.controls.key.valueChanges.subscribe(async (value) => 
    {
      if(value)
      {
        await this.search(value);
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
    this.customQueryResult.name = "Custom: " + key;
    this.customQueryResult.identifier = "custom";
    if(this.getter)
    {
      this.showOptions = true;
      this.results = (await this.getter(key)).concat([this.customQueryResult]);
    }
  }

  selectResult(selectedResult: Tag)
  {
    if(this.keepSelected)
    {
      this.searchForm.controls.key.setValue(selectedResult.name);
    }
    else
    {
      this.searchForm.controls.key.setValue("");
      this.input.nativeElement.focus();
    }
    this.selected = selectedResult;
    this.showOptions = false;
    this.selectEvent.emit(selectedResult);
  }

  removeSelected()
  {
    this.selected = undefined;
    this.searchForm.controls.key.setValue("");
    this.selectEvent.emit(undefined);
  }

  async onFocus()
  {
    this.showOptions = true;
    if(this.allGetter)
    {
      if(this.allGetterIndex)
      {
        this.results = await this.allGetter(this.allGetterIndex);
      }
      else
      {
        this.results = await this.allGetter();
      }
    }
  }

  onBlur()
  {
    this.showOptions = false;
  }
}
