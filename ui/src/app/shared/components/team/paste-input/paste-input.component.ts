import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ParserService } from 'src/app/core/helpers/parser.service';
import { TestService } from 'src/app/core/helpers/test.service';
import { UtilService } from 'src/app/core/helpers/util.service';
import { WindowService } from 'src/app/core/helpers/window.service';
import { Team } from 'src/app/core/models/team/team.model';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { selectLang } from 'src/app/core/store/config/config.selectors';
import { TeamEditorService } from 'src/app/shared/services/team-editor.service';

@Component({
  selector: 'app-paste-input',
  templateUrl: './paste-input.component.html',
  styleUrl: './paste-input.component.scss'
})
export class PasteInputComponent 
{
  pokemonService = inject(PokemonService);
  parser = inject(ParserService);
  teamEditorService = inject(TeamEditorService);
  formBuilder = inject(FormBuilder);
  util = inject(UtilService);
  window = inject(WindowService);
  store = inject(Store);
  testService = inject(TestService);

  selectedLang$: Observable<string> = this.store.select(selectLang);

  pasteBoxFormSubmitted: boolean = false;
  pasteBoxForm = this.formBuilder.group(
    {
      paste: ["", [Validators.required]]
    });
  pasteHolder: string = "";

  team: Team = <Team>{};
  selectedPokemonIndex: number = 0;
  tabs: boolean[] = [true, false];

  constructor()
  {
    
  }

  ngOnInit() 
  {
    this.teamEditorService.selectedTeam$.subscribe((value) => 
    {
      this.team = value;
    })
    this.pasteBoxForm.controls.paste.valueChanges.subscribe(value => 
      {
        if(value && this.pasteBoxFormSubmitted)
        {
          this.pasteBoxFormSubmitted = false;
        }
      })
    this.selectedLang$.subscribe(value =>
      {
        if(this.pasteBoxForm.controls.paste.value)
        {
          this.load();
        }
      });
  }

  async load()
  {
    this.pasteBoxFormSubmitted = true;
    if(this.pasteBoxForm.valid)
    {
      let formData = this.pasteBoxForm.controls.paste.value ?? "";
      let data = this.parser.parsePaste(formData);
      if(data.pokemons && data.pokemons.length > 0)
      {
        this.teamEditorService.updatePokemons([]);
        this.teamEditorService.addPokemonPlaceholders(data.pokemons.length);
        await Promise.all(
          data.pokemons.map(async (pokePaste, index) => 
          {
            const pokemon = await this.pokemonService.buildPokemon(pokePaste);
            if(pokemon) 
            { 
              this.teamEditorService.updatePokemon(pokemon, index);
            }
          })
        )
      }
    }
  }

  selectTab(index)
  {
    for(let i=0;i<this.tabs.length;i++)
    {
      this.tabs[i] = false;
    }
    this.tabs[index] = true;
  }

  isInvalid(key: string) : boolean
  {
    var control = this.pasteBoxForm.get(key);
    let invalid = (control?.errors
      && this.pasteBoxFormSubmitted)
      ?? false;
    return invalid;
  }

  getError(key: string) : string
  {
    let control: AbstractControl | null =  this.pasteBoxForm.get(key);
    return this.util.getAuthFormError(control);
  }

  loadExample()
  {
    /*
    this.testService.getTestForms().subscribe(value => 
      {
        this.pasteHolder = value;
        this.pasteBoxForm.controls.paste.setValue(this.pasteHolder);
      })
    */
    this.testService.getTestPaste("test6").subscribe(value => 
    {
      this.pasteHolder = value;
      this.pasteBoxForm.controls.paste.setValue(this.pasteHolder);
    })
    
  }
}
