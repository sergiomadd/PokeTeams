import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, ElementRef, HostListener, inject, input, model, output, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ThemeService } from '../../../core/helpers/theme.service';
import { QueryItem } from '../../../core/models/misc/queryResult.model';
import { GetTagBgColorPipe } from '../../pipes/color-pipes/getTagBgColor.pipe';
import { GetTagTextColorPipe } from '../../pipes/color-pipes/getTagTextColor.pipe';

@Component({
    selector: 'app-smart-input',
    templateUrl: './smart-input.component.html',
    styleUrl: './smart-input.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [FormsModule, ReactiveFormsModule, NgClass, NgStyle, TranslatePipe, GetTagBgColorPipe, GetTagTextColorPipe]
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

  readonly smartInput = viewChild.required<ElementRef>('smartInput');
  readonly input = viewChild.required<ElementRef>('input');
  readonly resultsDiv = viewChild.required<ElementRef>('resultsDiv');

  @HostListener('document:keydown.arrowup') 
  arrowUp() 
  {
    const inputValue = this.input();
    if(inputValue && inputValue.nativeElement === document.activeElement
      && this.showOptions())
    {
      this.hoverUp();
    }
  }

  @HostListener('document:keydown.arrowdown') 
  arrowDown() 
  {
    const inputValue = this.input();
    if(inputValue && inputValue.nativeElement === document.activeElement
      && this.showOptions())
    {
      this.hoverDown();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClicked(event: MouseEvent) 
  {
    const targetElement = event.target as HTMLElement | null;
    if (targetElement && document.body.contains(targetElement) 
      && !this.smartInput().nativeElement.contains(targetElement))
    {
      this.showOptions.set(false);
    }
  }

  searchForm = this.formBuilder.group(
  {
    key: [''],
  });
  formKey = toSignal(this.searchForm.controls.key.valueChanges);

  selected = signal<QueryItem | undefined>(undefined);
  results = signal<QueryItem[]>([]);
  showOptions = signal<boolean>(false);
  activeResult = signal<number>(0);
  position = signal<number>(0);
  searching = signal<boolean>(false);

  customQueryResult!: QueryItem

  constructor()
  {
    this.customQueryResult =
    {
      name: "",
      identifier: "",
      type: this.customType() ?? "new"
    }

    let previousValueName: string | undefined;
    effect(() =>
    {
      const value = this.value();
      if(value?.name !== previousValueName)
      {
        this.selected.set(value);
        previousValueName = value?.name;
      }
    });

    effect(() =>
    {
      const value = this.formKey();
      if(value === undefined) { return; }
      if(value)
      {
        if(this.allowCustom())
        {
          this.results.update(results =>
          {
            const updated = [...results];
            updated[0] =
            {
              name: "",
              identifier: "new",
              type: this.customType() ?? "new"
            }
            return updated;
          });
        }
        if(this.updateOnChange())
        {
          this.updateEvent.emit(value);
        }
        else
        {
          this.search(value);
        }
        if(this.disableSearch()){return;}
        this.activeResult.set(0);
        this.position.set(0);
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
            this.search(value);
          }
          this.results.set([]);
          this.showOptions.set(false);
        }
      }
    });
  }

  async search(key: string | null)
  {
    const getter = this.getter();
    if(getter)
    {
      this.searching.set(true);
      this.showOptions.set(true);
      getter(key).subscribe(
        {
          next: (response) =>
          {
            this.results.set(response);
            if(this.allowCustom() && key)
            {
              this.customQueryResult.name = key;
              this.customQueryResult.identifier = key;
              this.results.update(results => [this.customQueryResult].concat(results));
            }
            this.searching.set(false);
          },
          error: (error) =>
          {
            this.results.set([]);
            this.searching.set(false);
          }
        }
      )
    }
  }

  selectResult(selectedResult: QueryItem)
  {
    if(this.keepSelected())
    {
      this.selected.set(selectedResult);
    }
    this.searchForm.controls.key.setValue("");
    this.showOptions.set(false);
    this.input().nativeElement.blur();
    this.selectEvent.emit(selectedResult);
    this.focusNext();
  }

  removeSelected()
  {
    this.selected.set(undefined);
    this.searchForm.controls.key.setValue("");
    setTimeout(() =>
    {
      const inputValue = this.input();
      if (inputValue)
      {
        inputValue.nativeElement.focus();
      }
    });
    this.selectEvent.emit(undefined);
  }

  async getAllResults()
  {
    const allGetter = this.allGetter();
    if(allGetter)
    {
      this.searching.set(true);
      const allGetterIndex = this.allGetterIndex();
      if(allGetterIndex)
      {
        allGetter(allGetterIndex).subscribe(
          {
            next: (response) =>
            {
              this.results.set(response);
              if(this.allowCustom())
              {
                this.results.update(results => [this.customQueryResult].concat(results));
              }
              this.searching.set(false);
            },
            error: (error) =>
            {
              this.results.set([]);
              this.searching.set(false);
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
              this.results.set(response);
              if(this.allowCustom())
              {
                this.results.update(results => [this.customQueryResult].concat(results));
              }
              this.searching.set(false);
            },
            error: (error) =>
            {
              this.results.set([]);
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
      const results = this.results();
      if((results.length > 0 && (this.allowCustom() || results.length > 1))
        || this.searchForm.controls.key.value)
      {
        this.showOptions.set(true);
      }
      else if(this.allGetter())
      {
        this.getAllResults();
        this.showOptions.set(true);
      }
    }
  }

  newClick()
  {
    this.newEvent.emit();
  }

  hoverUp()
  {
    if(this.activeResult() > 0)
    {
      this.activeResult.update(activeResult => activeResult - 1);
    }
    if(this.position() > 0)
    {
      this.position.update(position => position - 1);
    }
    if(this.position() === 0)
    {
      this.resultsDiv().nativeElement.scrollBy(0, -38);
    }
  }

  hoverDown()
  {
    if(this.activeResult() < this.results().length - 1)
    {
      this.activeResult.update(activeResult => activeResult + 1);
    }
    if(this.position() >= 0 && this.position() < 9)
    {
      this.position.update(position => position + 1);
    }
    if(this.position() === 9)
    {
      this.resultsDiv().nativeElement.scrollBy(0, 38);
    }
  }

  focusNext(): void 
  {
    if(this.autoTab())
    {
      const smartInputComponent = this.smartInput().nativeElement.parentElement;
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
        this.input().nativeElement.focus();
      }
    }
  }
}
