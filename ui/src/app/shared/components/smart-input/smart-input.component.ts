import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { Tag } from 'src/app/features/team/models/tag.model';
import { User } from 'src/app/features/user/models/user.model';

@Component({
  selector: 'app-smart-input',
  templateUrl: './smart-input.component.html',
  styleUrl: './smart-input.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})

export class SmartInputComponent 
{
  formBuilder = inject(FormBuilder);

  @Input() value?: Tag;
  @Input() label?: string;
  @Input() logged$?: Observable<User | null | undefined>;
  @Input() keepSelected?: boolean;
  @Input() updateOnChange?: boolean;
  @Input() allowCustom?: boolean;
  @Input() allowNew?: boolean;
  @Input() getter?: (args: any) => Promise<Tag[]>
  @Input() allGetter?: (args?: any) => Promise<Tag[]>
  @Input() allGetterIndex?: number;
  @Input() disabled?: boolean;
  @Output() selectEvent = new EventEmitter<Tag>();
  @Output() newEvent = new EventEmitter();
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
        identifier: "new",
        type: "New"
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
        if(this.updateOnChange)
        {
          this.updateEvent.emit(undefined);
        }
        this.results = [];
        this.showOptions = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes["value"])
    {
      this.selected = this.value;
    }
  }

  async search(key: string)
  {
    this.customQueryResult.name = key;
    this.customQueryResult.identifier = "new";
    if(this.getter)
    {
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
      this.searchForm.controls.key.setValue("");
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
    if(!this.updateOnChange && !this.disabled)
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
          if(this.allowCustom)
          {
            this.results = [this.customQueryResult].concat(await this.allGetter());
          }
          else
          {
            this.results = await this.allGetter();
          }
        }
      }
      //this.showOptions = true;
    }
  }

  onBlur()
  {
    this.showOptions = false;
  }

  newClick()
  {
    this.newEvent.emit();
  }
}
