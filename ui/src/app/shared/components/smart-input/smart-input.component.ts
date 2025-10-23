import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, input, model, output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { ThemeService } from '../../../core/helpers/theme.service';
import { QueryItem } from '../../../core/models/misc/queryResult.model';

@Component({
    selector: 'app-smart-input',
    templateUrl: './smart-input.component.html',
    styleUrl: './smart-input.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: false
})

export class SmartInputComponent 
{
  formBuilder = inject(FormBuilder);
  theme = inject(ThemeService);

  readonly value = input<QueryItem>();
  readonly label = input<string>();
  readonly keepSelected = input<boolean | undefined>(false);
  readonly disableSearch = input<boolean | undefined>(false);
  readonly disableRemove = input<boolean | undefined>(false);
  readonly updateOnChange = input<boolean>();
  readonly allowCustom = input<boolean>();
  readonly customType = input<string>();
  readonly allowNew = input<boolean>();
  readonly error = input<boolean | undefined>(false);
  readonly getter = input<(args: any) => Observable<QueryItem[]>>();
  readonly allGetter = input<(args?: any) => Observable<QueryItem[]>>();
  readonly allGetterIndex = input<number>();
  disabled = model<boolean>();
  readonly autoTab = input<boolean | undefined>(true);
  readonly searchWithEmpty = input<boolean | undefined>(false);

  readonly selectEvent = output<QueryItem | undefined>();
  readonly newEvent = output();
  readonly updateEvent = output<string | undefined>();

  @ViewChild('smartInput') smartInput!: ElementRef;
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

  @HostListener('document:click', ['$event', '$event.target'])
  onDocumentClicked(event: MouseEvent, targetElement: HTMLElement) 
  {
    if (targetElement && document.body.contains(targetElement) 
      && !this.smartInput.nativeElement.contains(targetElement)) 
    {
      this.showOptions = false;
    }
  }

  searchForm = this.formBuilder.group(
  {
    key: [''],
  });

  selected?: QueryItem | undefined;
  results: QueryItem[] = [];
  showOptions: boolean = false;
  activeResult: number = 0;
  position: number = 0;
  searching: boolean = false;

  customQueryResult!: QueryItem

  async ngOnInit()
  {
    this.customQueryResult = 
    {
      name: "",
      identifier: "",
      type: this.customType() ?? "new"
    }
    this.searchForm.controls.key.valueChanges.subscribe(async (value) => 
    {
      if(value)
      {
        if(this.allowCustom())
        {
          this.results[0] = 
          {
            name: "",
            identifier: "new",
            type: this.customType() ?? "new"
          }
        }          
        if(this.updateOnChange())
        {
          this.updateEvent.emit(value);
        }
        else
        {
          await this.search(value);
        }
        if(this.disableSearch()){return;}
        this.activeResult = 0;
        this.position = 0;
      }
      else
      {
        if(this.updateOnChange())
        {
          this.updateEvent.emit(undefined);
        }
        if(this.disableSearch()){return;}
        if(this.allGetter())
        {
          this.getAllResults();
        }
        else
        {
          if(this.searchWithEmpty())
          {
            await this.search(value);
          }
          this.results = [];
          this.showOptions = false;
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes["value"] && changes["value"].currentValue?.name !== changes["value"].previousValue?.name)
    {
      this.selected = this.value();
    }
  }

  async search(key: string | null)
  {
    const getter = this.getter();
    if(getter)
    {
      this.searching = true;
      this.showOptions = true;
      getter(key).subscribe(
        {
          next: (response) => 
          {
            this.results = response;
            if(this.allowCustom() && key)
            {
              this.customQueryResult.name = key;
              this.customQueryResult.identifier = key;
              this.results = [this.customQueryResult].concat(this.results);
            }
            this.searching = false;
          },
          error: (error) => 
          {
            this.results = [];
            this.searching = false;
          }
        }
      )
    }
  }

  selectResult(selectedResult: QueryItem)
  {
    if(this.keepSelected())
    {
      this.selected = selectedResult;
    }
    this.searchForm.controls.key.setValue("");
    this.showOptions = false;
    this.input.nativeElement.blur();
    this.selectEvent.emit(selectedResult);
    this.focusNext();
  }

  removeSelected()
  {
    this.selected = undefined;
    this.searchForm.controls.key.setValue("");
    setTimeout(() => 
    {
      if (this.input) 
      {
        this.input.nativeElement.focus();
      }
    });
    this.selectEvent.emit(undefined);
  }

  async getAllResults()
  {
    const allGetter = this.allGetter();
    if(allGetter)
    {
      this.searching = true;
      const allGetterIndex = this.allGetterIndex();
      if(allGetterIndex)
      {
        allGetter(allGetterIndex).subscribe(
          {
            next: (response) => 
            {
              this.results = response;
              if(this.allowCustom())
              {
                this.results = [this.customQueryResult].concat(this.results);
              }
              this.searching = false;
            },
            error: (error) => 
            {
              this.results = [];
              this.searching = false;
            }
          }
        )
      }
      else
      {
        allGetter().subscribe(
          {
            next: (response) => 
            {
              this.results = response;
              if(this.allowCustom())
              {
                this.results = [this.customQueryResult].concat(this.results);
              }
              this.searching = false;
            },
            error: (error) => 
            {
              this.results = [];
            }
          }
        )
      }
    }
  }

  setInputValue(value: string)
  {
    this.searchForm.controls.key.setValue(value);
  }

  async onFocus()
  {
    if(!this.disabled() && !this.disableSearch())
    {
      if((this.results.length > 0 && (this.allowCustom() || this.results.length > 1)) 
        || this.searchForm.controls.key.value)
      {
        this.showOptions = true;
      }
      else if(this.allGetter())
      {
        this.getAllResults();
        this.showOptions = true;
      }
    }
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

  focusNext(): void 
  {
    if(this.autoTab())
    {
      const smartInputComponent = this.smartInput.nativeElement.parentElement;
      let next = smartInputComponent?.nextElementSibling as HTMLElement | null;
      const input = next?.querySelector('input') as HTMLInputElement | null;
      if(input)
      {
        input.focus();
      }
      else
      {
        //Ability input wrapper case
        let next = smartInputComponent?.parentElement.parentElement.nextElementSibling as HTMLElement | null;
        const input = next?.querySelector('input') as HTMLInputElement | null;
        if(input)
        {
          input.focus();
        }
        //Tag wrapper case
        else
        {
          let next = smartInputComponent?.parentElement.nextElementSibling as HTMLElement | null;
          const input = next?.querySelector('input') as HTMLInputElement | null;
          if(input)
          {
            input.focus();
          }
        }
      }
    }
    else
    {
      if(!this.keepSelected())
      {
        this.input.nativeElement.focus();
      }
    }
  }
}
