import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { QueryResult } from '../../models/queryResult.model';

@Component({
  selector: 'app-smart-input',
  templateUrl: './smart-input.component.html',
  styleUrl: './smart-input.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})

export class SmartInputComponent 
{
  formBuilder = inject(FormBuilder);

  @Input() value?: QueryResult;
  @Input() label?: string;
  @Input() keepSelected?: boolean = false;
  @Input() disableRemove?: boolean = false;
  @Input() updateOnChange?: boolean;
  @Input() allowCustom?: boolean;
  @Input() allowNew?: boolean;
  @Input() getter?: (args: any) => Observable<QueryResult[]>
  @Input() allGetter?: (args?: any) => Observable<QueryResult[]>
  @Input() allGetterIndex?: number;
  @Input() disabled?: boolean;

  @Output() selectEvent = new EventEmitter<QueryResult>();
  @Output() newEvent = new EventEmitter();
  @Output() updateEvent = new EventEmitter<string>();

  @ViewChild('input') input!: ElementRef;
  @ViewChild('resultsDiv') resultsDiv!: ElementRef;

  @HostListener('document:keydown.arrowup') 
  arrowUp() 
  {
    if(this.input && this.input.nativeElement === document.activeElement
      && this.showOptions)
    {
      this.hoverUp();
    }
  }

  @HostListener('document:keydown.arrowdown') 
  arrowDown() 
  {
    if(this.input && this.input.nativeElement === document.activeElement
      && this.showOptions)
    {
      this.hoverDown();
    }
  }

  searchForm = this.formBuilder.group(
  {
    key: [''],
  });

  selected?: QueryResult | undefined;
  results: QueryResult[] = [];
  showOptions: boolean = false;
  activeResult: number = 0;
  position: number = 0;
  searching: boolean = false;

  customQueryResult: QueryResult = 
  {
    name: "",
    identifier: ""
  }

  async ngOnInit()
  {
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
        this.activeResult = 0;
        this.position = 0;
      }
      else
      {
        if(this.updateOnChange)
        {
          this.updateEvent.emit(undefined);
        }
        if(this.allGetter)
        {
          this.getAllResults();
        }
        else
        {
          this.results = [];
          this.showOptions = false;
        }
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
    if(this.getter)
    {
      this.searching = true;
      this.showOptions = true;
      this.getter(key).subscribe(
        {
          next: (response) => 
          {
            this.results = response;
            if(this.allowCustom)
            {
              this.customQueryResult.name = key;
              this.customQueryResult.identifier = "new";
              this.results = [this.customQueryResult].concat(this.results);
            }
            this.searching = false;
          },
          error: (error) => 
          {
            this.results = [];
            this.searching = false;
            console.log("Error searching ", error)
          }
        }
      )
    }
  }

  selectResult(selectedResult: QueryResult)
  {
    if(this.keepSelected)
    {
      this.selected = selectedResult;
    }
    this.searchForm.controls.key.setValue("");
    this.showOptions = false;
    this.input.nativeElement.blur();
    this.selectEvent.emit(selectedResult);
  }

  removeSelected()
  {
    this.selected = undefined;
    this.searchForm.controls.key.setValue("");
    this.selectEvent.emit(undefined);
  }

  async getAllResults()
  {
    if(this.allGetter)
    {
      if(this.allGetterIndex)
      {
        this.allGetter(this.allGetterIndex).subscribe(
          {
            next: (response) => 
            {
              this.results = response;
              this.results = [this.customQueryResult].concat(this.results);
              this.searching = false;
            },
            error: (error) => 
            {
              this.results = [];
              this.searching = false;
              console.log("Error searching ", error)
            }
          }
        )
      }
      else
      {
        this.allGetter().subscribe(
          {
            next: (response) => 
            {
              this.results = response;
              if(this.allowCustom)
              {
                this.results = [this.customQueryResult].concat(this.results);
              }
              this.searching = false;
            },
            error: (error) => 
            {
              this.results = [];
              console.log("Error searching ", error)
            }
          }
        )
      }
    }
  }

  async onFocus()
  {
    if(!this.disabled)
    {
      if(this.results.length > 0)
      {
        this.showOptions = true;
      }
      else if(this.allGetter)
      {
        this.getAllResults();
        this.showOptions = true;
      }
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

  hoverUp()
  {
    if(this.activeResult > 0)
    {
      this.activeResult--;
    }
    if(this.position > 0)
    {
      this.position--;
    }
    if(this.position === 0)
    {
      this.resultsDiv.nativeElement.scrollBy(0, -38);
    }
  }

  hoverDown()
  {
    if(this.activeResult < this.results.length - 1)
    {
      this.activeResult++;
    }
    if(this.position >= 0 && this.position < 9)
    {
      this.position++;
    }
    if(this.position === 9)
    {
      this.resultsDiv.nativeElement.scrollBy(0, 38);
    }
  }
}
