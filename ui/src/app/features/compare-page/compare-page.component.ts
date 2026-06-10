import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { ParserService } from '../../core/helpers/parser.service';
import { PokemonStatService } from '../../core/helpers/pokemon-stat.service';
import { ThemeService } from '../../core/helpers/theme.service';
import { UtilService } from '../../core/helpers/util.service';
import { WindowService } from '../../core/helpers/window.service';
import { LocalizedText } from '../../core/models/misc/localizedText.model';
import { CalculatedStats } from '../../core/models/pokemon/calculatedStats.model';
import { Sprite } from '../../core/models/pokemon/sprite.model';
import { Stat } from '../../core/models/pokemon/stat.model';
import { Team } from '../../core/models/team/team.model';
import { TeamOptions } from '../../core/models/team/teamOptions.model';
import { PokemonService } from '../../core/services/pokemon.service';
import { TeamService } from '../../core/services/team.service';
import { selectLang } from '../../core/store/config/config.selectors';
import { SwitchComponent } from '../../shared/components/dumb/switch/switch.component';
import { TooltipComponent } from '../../shared/components/dumb/tooltip/tooltip.component';
import { TeamBattleComponent } from '../../shared/components/team/team-battle/team-battle.component';
import { GetStatColorPipe } from '../../shared/pipes/color-pipes/getStatColor.pipe';
import { GetStatCodePipe } from '../../shared/pipes/converters/getStatCode.pipe';
import { GetStatShortIdentifierPipe } from '../../shared/pipes/converters/getStatShortIdentifier.pipe';
import { GetFormControlErrorPipe } from '../../shared/pipes/getFormControlError.pipe';
import { IsFormFieldInvalidPipe } from '../../shared/pipes/isFormFieldInvalid.pipe';
import { MarginTopPipe } from '../../shared/pipes/margin-top.pipe';

export interface ComparePokemon
{
  dexNumber?: number,
  pokemonName?: LocalizedText,
  sprite?: Sprite,
  stats?: CalculatedStats,
  sourceIndex: number,
  whichTeam: string
}

@Component({
    selector: 'app-compare-page',
    templateUrl: './compare-page.component.html',
    styleUrl: './compare-page.component.scss',
    imports: [NgClass, NgTemplateOutlet, NgStyle, FormsModule, ReactiveFormsModule, SwitchComponent, TeamBattleComponent, TooltipComponent, TranslatePipe, IsFormFieldInvalidPipe, GetFormControlErrorPipe, GetStatColorPipe, GetStatCodePipe, GetStatShortIdentifierPipe, MarginTopPipe]
})
export class ComparePageComponent 
{
  formBuilder = inject(FormBuilder);
  teamService = inject(TeamService);
  window = inject(WindowService);
  theme = inject(ThemeService);
  util = inject(UtilService);
  parser = inject(ParserService);
  pokemonService = inject(PokemonService);
  activatedRoute = inject(ActivatedRoute);
  pokemonStatService = inject(PokemonStatService);
  store = inject(Store);

  routeParams = toSignal(this.activatedRoute.queryParamMap)
  selectedLang = this.store.selectSignal(selectLang);

  teamA = signal<Team | undefined>(undefined);
  teamB = signal<Team | undefined>(undefined);
  teamAId = signal<string | undefined>(undefined);
  teamBId = signal<string | undefined>(undefined);
  teamASelectedIndex = signal<number[]>([]);
  teamBSelectedIndex = signal<number[]>([]);

  teamANotFound = signal<boolean>(false);
  teamALoading = signal<boolean>(false);
  showPasteAInput = signal<boolean>(false);
  shrinkPasteAInput = signal<boolean>(false);
  teamAForm = this.formBuilder.group(
    {
      idA: ["", [Validators.maxLength(64)]],
      pasteA: ["", [Validators.maxLength(2048)]]
    }, { updateOn: "blur" }
  )
  formIdA = toSignal(
    this.teamAForm.controls.idA.valueChanges,
    {
      initialValue: this.teamAForm.controls.idA.value
    }
  );
  formPasteA = toSignal(
    this.teamAForm.controls.pasteA.valueChanges,
    {
      initialValue: this.teamAForm.controls.pasteA.value
    }
  );

  teamBNotFound = signal<boolean>(false);
  teamBLoading = signal<boolean>(false);
  showPasteBInput = signal<boolean>(false);
  shrinkPasteBInput = signal<boolean>(false);
  teamBForm = this.formBuilder.group(
    {
      idB: ["", [Validators.maxLength(64)]],
      pasteB: ["", [Validators.maxLength(2048)]]
    }, { updateOn: "blur" }
  )
  formIdB = toSignal(
    this.teamBForm.controls.idB.valueChanges,
    {
      initialValue: this.teamBForm.controls.idB.value
    }
  );
  formPasteB = toSignal(
    this.teamBForm.controls.pasteB.valueChanges,
    {
      initialValue: this.teamBForm.controls.pasteB.value
    }
  );

  statSelectors: Stat[] = 
  [
    {
      identifier: "hp",
      value: 0
    },
    {
      identifier: "attack",
      value: 0
    },
    {
      identifier: "defense",
      value: 0
    },
    {
      identifier: "special-attack",
      value: 0
    },
    {
      identifier: "special-defense",
      value: 0
    },
    {
      identifier: "speed",
      value: 0
    }
  ]; 
  selectedStatIndex: number = 5;
  selectedStat: Stat = this.statSelectors[this.selectedStatIndex];
  statList = signal<ComparePokemon[] | undefined>(undefined);

  constructor()
  {
    effect(() =>
    {
      const params = this.routeParams();

      //this.teamAId.set(params?.get('teamAId') ?? undefined)
      const teamAId = params?.get('teamAId') ?? undefined
      this.teamAId.set(teamAId);
      if(teamAId)
      {
        this.getTeamA(teamAId);
        const url = `https://poketeams.com/${teamAId}`;
        this.teamAForm.controls.idA.setValue(url, { emitEvent: false });
      }
      else
      {
        this.teamANotFound.set(false);
        this.teamALoading.set(false);
        this.teamA.set(undefined)
      }

      //this.teamBId.set(params?.get('teamBId') ?? undefined);
      const teamBId = params?.get('teamBId') ?? undefined
      this.teamBId.set(teamBId);
      if(teamBId)
      {
        this.getTeamB(teamBId);
        const url = `https://poketeams.com/${teamBId}`;
        this.teamBForm.controls.idB.setValue(url, { emitEvent: false });
      }
      else
      {
        this.teamBNotFound.set(false);
        this.teamBLoading.set(false);
        this.teamB.set(undefined);
      }

      this.calculateStatList(this.selectedStatIndex);
    })

    effect(() => 
    {
      const id = this.tryGetTeamId(this.formIdA())
      this.teamAId.set(id);
      if(id && this.teamAForm.controls.idA.valid)
      {
        this.getTeamA(id);
      }
      else
      {
        this.teamANotFound.set(false);
        this.teamALoading.set(false);
        this.teamA.set(undefined);
        this.calculateStatList(this.selectedStatIndex);
      }
    });

    effect(() => 
    {
      const id = this.tryGetTeamId(this.formIdB())
      this.teamBId.set(id);
      if(id && this.teamBForm.controls.idB.valid)
      {
        this.getTeamB(id);
      }
      else
      {
        this.teamBNotFound.set(false);
        this.teamBLoading.set(false);
        this.teamB.set(undefined);
        this.calculateStatList(this.selectedStatIndex);
      }
    });

    effect(async () => 
    {
      const pasteA = this.formPasteA();
      if(pasteA && this.teamAForm.controls.pasteA.valid)
      {
        this.teamA.set(
        {
          ...this.teamA(),
          id: "",
          pokemons: [],
          options: <TeamOptions>{},
          viewCount: 0,
          date: "",
          visibility: true
        } as Team);
        this.teamANotFound.set(false);
        this.teamALoading.set(true);
        let formData = pasteA;
        let data = this.parser.parsePaste(formData);
        if(data.pokemons && data.pokemons.length > 0)
        {
          this.teamA.update(team => ({
            ...team,
            id: "",
            pokemons: Array(data.pokemons.length).fill(undefined),
            options: <TeamOptions>{},
            viewCount: 0,
            date: "",
            visibility: true
          }));
          const pokemons = await Promise.all(
            data.pokemons.map(p => this.pokemonService.buildPokemon(p))
          );

          this.teamA.update(team => ({
            ...team,
            pokemons: pokemons.filter(Boolean),
            id: "",
            options: <TeamOptions>{},
            viewCount: 0,
            date: "",
            visibility: true
          }));
          this.teamALoading.set(false);
        }
        else
        {
          this.teamA.set(undefined);
          this.teamANotFound.set(true);
          this.teamALoading.set(false);
        }
      }
    });

    effect(async () => 
    {
      const pasteB = this.formPasteB();
      if(pasteB && this.teamBForm.controls.pasteB.valid)
      {
        this.teamB.set(
        {
          ...this.teamB(),
          id: "",
          pokemons: [],
          options: <TeamOptions>{},
          viewCount: 0,
          date: "",
          visibility: true
        } as Team);
        this.teamBNotFound.set(false);
        this.teamBLoading.set(true);
        let formData = pasteB;
        let data = this.parser.parsePaste(formData);
        if(data.pokemons && data.pokemons.length > 0)
        {
          this.teamB.update(team => ({
            ...team,
            id: "",
            pokemons: Array(data.pokemons.length).fill(undefined),
            options: <TeamOptions>{},
            viewCount: 0,
            date: "",
            visibility: true
          }));
          const pokemons = await Promise.all(
            data.pokemons.map(p => this.pokemonService.buildPokemon(p))
          );

          this.teamB.update(team => ({
            ...team,
            pokemons: pokemons.filter(Boolean),
            id: "",
            options: <TeamOptions>{},
            viewCount: 0,
            date: "",
            visibility: true
          }));
          this.teamBLoading.set(false);
        }
        else
        {
          this.teamB.set(undefined);
          this.teamBNotFound.set(true);
          this.teamBLoading.set(false);
        }
      }
    });

    effect(() => 
    {
      this.selectedLang(); //Dependency only
      const teamAId = this.teamAId()
      const teamBId = this.teamBId()
      if(teamAId)
      {
        this.getTeamA(teamAId);
      }
      if(teamBId)
      {
        this.getTeamB(teamBId);
      }
    })
  }

  getTeamA(id: string)
  {
    this.teamANotFound.set(false);
    this.teamALoading.set(true);
    this.teamService.getTeam(id).subscribe(
      {
        next: (response) =>
        {
          if(response)
          {
            this.teamA.set(response);
            this.teamALoading.set(false);
            this.calculateStatList(this.selectedStatIndex);
          }
        },
        error: (err) => 
        {
          console.log("Team A not found", err)
          this.teamA.set(undefined);
          this.teamANotFound.set(true);
          this.teamALoading.set(false);
          this.calculateStatList(this.selectedStatIndex);
        },
      }
    )
  }

  getTeamB(id: string)
  {
    this.teamBNotFound.set(false);
    this.teamBLoading.set(true);
    this.teamService.getTeam(id).subscribe(
      {
        next: (response) =>
        {
          if(response)
          {
            this.teamB.set(response);
            this.teamBLoading.set(false);
            this.calculateStatList(this.selectedStatIndex);
          }
        },
        error: (err) => 
        {
          console.log("Team B not found", err)
          this.teamB.set(undefined);
          this.teamBNotFound.set(true);
          this.teamBLoading.set(false);
          this.calculateStatList(this.selectedStatIndex);
        },
      }
    )
  }

  tryGetTeamId(value): string | undefined
  {
    if(!value) { return undefined; }
    //Is link
    if(value.includes("/"))
    {
      return value.split("/")[value.split("/").length-1];
    }
    return value;
  }

  initOptions(team: Team)
  {
    if(team)
    {
      team.options.showIVs = true;
      team.options.showEVs = true;
      team.options.showNature = true;
    }
  }

  calculateStatList(statIndex: number)
  {
    this.teamA.update(team => 
    {
      if (!team) return team;
      return {
        ...team,
        pokemons: team.pokemons.map(pokemon => 
        {
          if (!pokemon) { return pokemon; }
          return {
            ...pokemon,
            calculatedStats: this.pokemonStatService.calculateStats(pokemon, team.options)
          };
        })
      }
    });
    this.teamB.update(team => 
    {
      if (!team) return team;
      return {
        ...team,
        pokemons: team.pokemons.map(pokemon => 
        {
          if (!pokemon) { return pokemon; }
          return {
            ...pokemon,
            calculatedStats: this.pokemonStatService.calculateStats(pokemon, team.options)
          };
        })
      }
    });
    
    if((this.teamA()?.pokemons || this.teamB()?.pokemons) && statIndex !== undefined)
    {
      const statListA: ComparePokemon[] | undefined =  this.teamA()?.pokemons.map((pokemon, index) => (
      {
        dexNumber: pokemon?.dexNumber,
        pokemonName: pokemon?.name,
        sprite: pokemon?.sprite,
        stats: pokemon?.calculatedStats,
        whichTeam: "A",
        sourceIndex: index
      }));
      const statListB: ComparePokemon[] | undefined =  this.teamB()?.pokemons.map((pokemon, index) => (
      {
        dexNumber: pokemon?.dexNumber,
        pokemonName: pokemon?.name,
        sprite: pokemon?.sprite,
        stats: pokemon?.calculatedStats,
        whichTeam: "B",
        sourceIndex: index
      }));

      if(!statListA && statListB)
      {
        this.statList.set([...this.handleMismatch(this.sortByStatIndex(statListB?.concat(statListA ?? []), statIndex, false), statIndex)]);
      }
      else
      {
        this.statList.set([...this.handleMismatch(this.sortByStatIndex(statListA?.concat(statListB ?? []), statIndex, false), statIndex)]);
      }
    }
    else
    {
      this.statList.set(undefined);
    }
  }

  sortByStatIndex(statList: ComparePokemon[] | undefined, statIndex: number, ascending: boolean = true): any[] 
  {
    if(statList)
    {
      return statList.sort((a, b) => 
      {
        const valA = a?.stats?.total?.[statIndex]?.value ?? 0;
        const valB = b?.stats?.total?.[statIndex]?.value ?? 0;
        
        return ascending ? valA - valB : valB - valA;
      });
    }
    return [];
  }
  
  //Needed to handle multiple pokemons with same stat value
  //StatList is sorted already
  handleMismatch(statList: ComparePokemon[] | undefined, statIndex: number): any[] 
  {
    if(statList)
    {
      //Gets an array of arrays of the pokemons with the same values
      let result: ComparePokemon[] = [];
      let groups: ComparePokemon[][] = [];
      let i: number = -1;
      let j: number = 0;
      for (const pokemon of statList) 
      {
        if(groups[i] && groups[i].some(p => p.stats?.total?.[statIndex]?.value === pokemon?.stats?.total?.[statIndex]?.value))
        {
          j++;
          groups[i][j] = pokemon;
        }
        else
        {
          i++;
          j = 0;
          groups[i] = [pokemon];
        }
      }
      //Mismatch the teams so that same value pokemons come after different team pokemon
      for (const group of groups) 
      {
        group.sort((a, b) => 
        {
          const valA = a?.sourceIndex ?? 0;
          const valB = b?.sourceIndex ?? 0;

          return valB - valA ;
        });
      }
      //Turn 2D into 1D array
      for (const group of groups) 
      {
        result = result.concat(group);
      }
      return result;
    }
    return [];
  }

  selectIndexes(indexes: number[], whichTeam: string)
  {
    if(indexes)
    {
      if(whichTeam === 'A')
      {
        this.teamASelectedIndex.set([...indexes]);
      }
      else if(whichTeam === 'B')
      {
        this.teamBSelectedIndex.set([...indexes]);
      }
    }
  }

  selectStat(index: number)
  {
    this.selectedStatIndex = index;
    this.selectedStat = this.statSelectors[index];
    this.calculateStatList(this.selectedStatIndex);
  }

  toggleAInputs()
  {
    this.showPasteAInput.update(value => !value);
  }

  toggleBInputs()
  {
    this.showPasteBInput.update(value => !value);
  }

  toggleAPasteInput()
  {
    this.shrinkPasteAInput.update(value => !value);
  }

  toggleBPasteInput()
  {
    this.shrinkPasteBInput.update(value => !value);
  }
}