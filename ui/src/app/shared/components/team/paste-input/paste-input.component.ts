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
import { environment } from 'src/environments/environment';

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
              this.teamEditorService.updatePokemon(pokemon, index, true);
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

  reset()
  {
    this.pasteHolder = "";
    this.pasteBoxForm.controls.paste.setValue("");
    this.pasteBoxFormSubmitted = false;
  }

  loadExamplePaste()
  {
    if(!environment.production)
    {
      this.pasteBoxForm.controls.paste.setValue(this.examplePaste);
      this.load();
      this.team.title = "Example team";
      //Place the same id for all example teams to avoid duplication
      this.team.id = "example";
    }
    else
    {
    /*
    this.testService.getTestForms().subscribe(value => 
      {
        this.pasteHolder = value;
        this.pasteBoxForm.controls.paste.setValue(this.pasteHolder);
      })
    
    */
    this.testService.getTestPaste("testPaste").subscribe(value => 
      {
        this.pasteHolder = value;
        this.pasteBoxForm.controls.paste.setValue(this.pasteHolder);
      })
    }
  }

  examplePaste: string = 
  `Arcanine @ Figy Berry
Ability: Intimidate
EVs: 252 Atk / 4 SpD / 252 Spe
Jolly Nature
- Flare Blitz
- Close Combat
- Extreme Speed
- Protect

Venusaur @ Focus Sash
Ability: Chlorophyll
EVs: 252 SpA / 4 SpD / 252 Spe
Modest Nature
IVs: 0 Atk
- Grass Pledge
- Sleep Powder
- Protect
- Sludge Bomb

Gyarados @ Sitrus Berry
Ability: Intimidate
EVs: 252 Atk / 4 SpD / 252 Spe
Jolly Nature
- Power Whip
- Water Spout
- Bounce
- Protect

Rhyperior @ Weakness Policy
Ability: Solid Rock
EVs: 252 HP / 4 Atk / 252 Def
Relaxed Nature
- Rock Slide
- Drill Run
- Fire Blast
- Protect

Machamp @ Assault Vest
Ability: No Guard
EVs: 248 HP / 252 Atk / 8 SpD
Adamant Nature
- Dynamic Punch
- Rock Slide
- Bullet Punch
- Poison Jab

Tyranitar @ Expert Belt
Ability: Sand Stream
EVs: 252 HP / 252 Atk / 4 SpD
Adamant Nature
- Crunch
- Rock Slide
- Protect
- Superpower
`
examplePasteNotes = 
[
  "Since Intimidate it's kinda the thing for controlling attackers, Arcanine it's the first skill user of this team. With a set intended to maximize his attack specialty not much coverage but the Extreme Speed priority I think its cool to have. Also Protect, LOTS of Protect on this team and a Figy Berry to get some recover.",
  "Officially Venasaur it's not the canonical starter for Blue but since it changes depending on what Red picked I decided to run it. Chlorophyll in case there's a sun team around and built to being annoying with sleep powder and make some havoc with his special attack. Also Protect and a Focus Sash in case I get dumb and someone sweeps it, at least ensuring a try to make the opponents Pokemon go to take a nap.",
  "Another Intimidate on the team to make its more annoying I usually lead with him or with Arcanine. The rest it's a pretty usual moveset for a Gyarados, Waterfall and Bounce gave me quite a good result against frecuent leads like Whimsicott or Torkoal, a Whip to get some coverage and Protect because if I can put protect I will. The Sitrus Berry, like the Fire doggo it's for some recovery.",
  "Intended to Hold some punches and cause some heavy damage if he's able to resist and activate the policy. So far it's the Pokemon I used the least or if its there I use it to lure the other player to pay attention to him. Solid Rock is there to make him have a little more chance to survive and enable it to do damage. Rock slide to hit several targets and because I think it's a great move to have.",
  "Another Bulky dud, some coverage I lack with poison and steel moves. Some extra priority with bullet punch and the assault vest with the intention of making him a Pokemon hard to put down. I use no guard to enable him to hit Dynamic punch at 100% chance and be able to confuse consistently. Again Rock Slide to have more than one option to fire this attack.",
  "The usual Tyranitar we all love/hate. Able to cause some residual damage and with his sand stream and with an expert belt (because I have no idea what else to put on him). Dark Crunch for stab and with some luck breaking some defensive walls. Rock Slide because like I said I think it's a great move, Protect because better safe than sorry and Superpower to do some nasty damage. I usually swap it after a few hits to have a second Sand Stream trigger ready.",
]
}
