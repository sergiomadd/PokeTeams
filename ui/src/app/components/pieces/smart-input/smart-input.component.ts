import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { Tag } from 'src/app/models/tag.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-smart-input',
  templateUrl: './smart-input.component.html',
  styleUrl: './smart-input.component.scss'
})

export class SmartInputComponent 
{
  formBuilder = inject(FormBuilder);

  @Input() label?: string;
  @Input() logged$?: Observable<User | null | undefined>;
  @Input() keepSelected?: boolean;
  @Input() updateOnChange?: boolean;
  @Input() allowCustom?: boolean;
  @Input() getter?: (args: any) => Promise<Tag[]>
  @Input() allGetter?: (args?: any) => Promise<Tag[]>
  @Input() allGetterIndex?: number;
  @Output() selectEvent = new EventEmitter<Tag>();
  @Output() updateEvent = new EventEmitter<string>();

  @ViewChild('input') input!: ElementRef;
  searchForm = this.formBuilder.group(
  {
    key: [''],
  });

  selected?: Tag | undefined;
  results: Tag[] = [];
  showOptions: boolean = false;
  customQueryResult: Tag = 
  {
    name: "",
    identifier: ""
  }

  async ngOnInit()
  {
    if(this.logged$)
    {
      this.logged$.subscribe
      (
        {
          next: (value) => 
          {
            if(value)
            {
              this.selected = 
              {
                name: value?.username ?? "",
                identifier: "user",
                icon: value?.picture
              }
              this.updateEvent.emit(this.selected.name);
            }
            else
            {
              this.selected = undefined
              this.updateEvent.emit(undefined);
            }
          }
        }
      )
    }
    if(this.allowCustom)
    {
      this.results[0] = 
      {
        name: "",
        identifier: ""
      }
    }
    this.searchForm.controls.key.valueChanges.subscribe(async (value) => 
    {
      if(value)
      {
        if(this.updateOnChange)
        {
          this.updateEvent.emit(value);
        }
        else
        {
          await this.search(value);
        }
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
    this.customQueryResult.name = key;
    this.customQueryResult.identifier = "custom";
    if(this.getter)
    {
      console.log("Searching", key)
      this.showOptions = true;
      if(this.allowCustom)
      {
        this.results = [this.customQueryResult].concat(await this.getter(key));
      }
      else
      {
        this.results = await this.getter(key);
      }
    }
  }

  selectResult(selectedResult: Tag)
  {
    if(this.keepSelected)
    {
      this.selected = selectedResult;
    }
    else
    {
      this.input.nativeElement.focus();
    }
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
    if(!this.updateOnChange)
    {
      if(this.allGetter)
      {
        this.showOptions = true;
        if(this.allGetterIndex)
        {
          this.results = await this.allGetter(this.allGetterIndex);
        }
        else
        {
          this.results = await this.allGetter();
        }
      }
      this.showOptions = true;
    }
    console.log(this.searchForm.controls.key.value)
  }

  onBlur()
  {
    this.showOptions = false;
  }
}
