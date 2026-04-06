import { TestBed } from '@angular/core/testing';

import { I18nService } from '../../core/helpers/i18n.service';
import { Pokemon } from '../../core/models/pokemon/pokemon.model';
import { Team } from '../../core/models/team/team.model';
import { PokemonService } from '../../core/services/pokemon.service';
import { TeamEditorService } from './team-editor.service';

class MockI18nService 
{
  translate = {
    instant: (key: string) => key
  };
}

class MockPokemonService
{

}

describe('TeamEditorService', () => {
  let service: TeamEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: 
      [
        { provide: I18nService, useClass: MockI18nService },
        { provide: PokemonService, useClass: MockPokemonService },
      ]
    });
    service = TestBed.inject(TeamEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initiate with empty team', () => 
  {
    let currentTeam: Team | undefined;

    const emptyTeam: Team = 
    {
      id: '',
      pokemons: [],
      options: 
      {
        ivsVisibility: true,
        evsVisibility: true,
        naturesVisibility: true,
        showIVs: true,
        showEVs: true,
        showNature: true,
        showNickname: true,
        maxStat: 0
      },
      player: undefined,
      user: undefined,
      title: undefined,
      tournament: undefined,
      regulation: undefined,
      viewCount: 0,
      date: "",
      visibility: true,
      tags: []
    }

    service.selectedTeam$.subscribe(value => 
    {
      currentTeam = value
    })

    expect(currentTeam).toStrictEqual(emptyTeam);
  })

  describe("setTeam()", () => 
  {
    it('should set the team to new one', () => 
    {
      let currentTeam: Team | undefined;

      const newTeam: Team = 
      {
        id: 'newSetTeam',
        pokemons: [],
        options: 
        {
          ivsVisibility: true,
          evsVisibility: true,
          naturesVisibility: true,
          showIVs: true,
          showEVs: true,
          showNature: true,
          showNickname: true,
          maxStat: 0
        },
        title: "New test team",
        viewCount: 0,
        date: "",
        visibility: true,
        tags: []
      }

      service.selectedTeam$.subscribe(value => 
      {
        currentTeam = value
      })

      service.setTeam(newTeam);

      expect(currentTeam).toStrictEqual(newTeam);
    })
  })

  describe("addPokemon()", () => 
  {
    it('should add the correct pokemon', () => 
    {
      let currentTeam: Team | undefined;

      service.selectedTeam$.subscribe(value => 
      {
        currentTeam = value
      })

      const newPokemon: Pokemon = 
      {
        name: 
        {
          content: "Garchomp",
          language: "en",
          identifier: "Garchomp"
        },
        nickname: "monito",
        evolutions: [],
        level: 78,
        shiny: true,
        evs: [],
        ivs: [],
        moves: [],
        stats: []
      };
      
      expect(currentTeam?.pokemons.length).toBe(0);

      const newPokemons: Pokemon[] = [newPokemon]

      service.addPokemon(newPokemon);

      expect(currentTeam?.pokemons.length).toBe(1);
      expect(currentTeam?.pokemons).toStrictEqual(newPokemons);
    })

    it('should add an undefined pokemon', () => 
    {
      let currentTeam: Team | undefined;

      service.selectedTeam$.subscribe(value => 
      {
        currentTeam = value
      })

      const newPokemon: Pokemon = 
      {
        name: 
        {
          content: "Garchomp",
          language: "en",
          identifier: "Garchomp"
        },
        nickname: "monito",
        evolutions: [],
        level: 78,
        shiny: true,
        evs: [],
        ivs: [],
        moves: [],
        stats: []
      };

      expect(currentTeam?.pokemons.length).toBe(0);

      const newPokemons: (Pokemon | undefined)[] = [newPokemon, newPokemon, undefined]

      service.addPokemon(newPokemon);
      service.addPokemon(newPokemon);
      service.addPokemon(undefined);

      expect(currentTeam?.pokemons.length).toBe(3);
      expect(currentTeam?.pokemons).toStrictEqual(newPokemons);
    })
  })

  describe("deletePokemon()", () => 
  {
    it('should delete the correct pokemon and return true', () => 
    {
      let currentTeam: Team | undefined;

      service.selectedTeam$.subscribe(value => 
      {
        currentTeam = value
      })

      const pokemon1: Pokemon = 
      {
        name: 
        {
          content: "Garchomp",
          language: "en",
          identifier: "Garchomp"
        },
        nickname: "pokemon 1",
        evolutions: [],
        level: 78,
        shiny: true,
        evs: [],
        ivs: [],
        moves: [],
        stats: []
      };

      const pokemon2: Pokemon = 
      {
        name: 
        {
          content: "Pikachu",
          language: "en",
          identifier: "Pikachu"
        },
        nickname: "pokemon 2",
        evolutions: [],
        level: 34,
        shiny: false,
        evs: [],
        ivs: [],
        moves: [],
        stats: []
      };


      expect(currentTeam?.pokemons.length).toBe(0);

      service.addPokemon(pokemon1);
      service.addPokemon(pokemon2);
      service.addPokemon(undefined);

      const pokemons: (Pokemon | undefined)[] = [pokemon1, pokemon2, undefined]

      expect(currentTeam?.pokemons.length).toBe(3);
      expect(currentTeam?.pokemons).toStrictEqual(pokemons);

      const deleted = service.deletePokemon(1);

      const pokemonsAfterDelete: (Pokemon | undefined)[] = [pokemon1, undefined]

      expect(currentTeam?.pokemons.length).toBe(2);
      expect(currentTeam?.pokemons).toStrictEqual(pokemonsAfterDelete);
      expect(deleted).toBe(true);
    })

    it('should not delete any pokemon and return false', () => 
    {
      let currentTeam: Team | undefined;

      service.selectedTeam$.subscribe(value => 
      {
        currentTeam = value
      })

      const pokemon1: Pokemon = 
      {
        name: 
        {
          content: "Garchomp",
          language: "en",
          identifier: "Garchomp"
        },
        nickname: "pokemon 1",
        evolutions: [],
        level: 78,
        shiny: true,
        evs: [],
        ivs: [],
        moves: [],
        stats: []
      };

      const pokemon2: Pokemon = 
      {
        name: 
        {
          content: "Pikachu",
          language: "en",
          identifier: "Pikachu"
        },
        nickname: "pokemon 2",
        evolutions: [],
        level: 34,
        shiny: false,
        evs: [],
        ivs: [],
        moves: [],
        stats: []
      };


      expect(currentTeam?.pokemons.length).toBe(0);

      service.addPokemon(pokemon1);
      service.addPokemon(pokemon2);
      service.addPokemon(undefined);


      const pokemons: (Pokemon | undefined)[] = [pokemon1, pokemon2, undefined]

      expect(currentTeam?.pokemons.length).toBe(3);
      expect(currentTeam?.pokemons).toStrictEqual(pokemons);

      const deleted = service.deletePokemon(2);

      const pokemonsAfterDelete: (Pokemon | undefined)[] = [pokemon1, pokemon2, undefined]

      expect(currentTeam?.pokemons.length).toBe(3);
      expect(currentTeam?.pokemons).toStrictEqual(pokemonsAfterDelete);
      expect(deleted).toBe(false);
    })
  })

  describe("updatePokemon()", () => 
  {
    it('should update the correct pokemon with another pokemon', () => 
    {
      let currentTeam: Team | undefined;

      service.selectedTeam$.subscribe(value => 
      {
        currentTeam = value
      })

      const pokemon: Pokemon = 
      {
        name: 
        {
          content: "Garchomp",
          language: "en",
          identifier: "Garchomp"
        },
        nickname: "pokemon 1",
        evolutions: [],
        level: 78,
        shiny: true,
        evs: [],
        ivs: [],
        moves: [],
        stats: []
      };

      const updatedPokemon: Pokemon = 
      {
        name: 
        {
          content: "Pikachu",
          language: "en",
          identifier: "Pikachu"
        },
        nickname: "pokemon 2",
        evolutions: [],
        level: 34,
        shiny: false,
        evs: [],
        ivs: [],
        moves: [],
        stats: []
      };

      expect(currentTeam?.pokemons.length).toBe(0);

      service.addPokemon(pokemon);
      service.addPokemon(pokemon);
      service.addPokemon(undefined);

      const pokemons: (Pokemon | undefined)[] = [pokemon, pokemon, undefined]

      expect(currentTeam?.pokemons.length).toBe(3);
      expect(currentTeam?.pokemons).toStrictEqual(pokemons);

      service.updatePokemon(updatedPokemon, 1);

      const pokemonsAfterDelete: (Pokemon | undefined)[] = [pokemon, updatedPokemon, undefined]

      expect(currentTeam?.pokemons.length).toBe(3);
      expect(currentTeam?.pokemons).toStrictEqual(pokemonsAfterDelete);
      expect(currentTeam?.pokemons[1]).toStrictEqual(updatedPokemon);
    })

    it('should update undefined with a pokemon', () => 
    {
      let currentTeam: Team | undefined;

      service.selectedTeam$.subscribe(value => 
      {
        currentTeam = value
      })

      const pokemon: Pokemon = 
      {
        name: 
        {
          content: "Garchomp",
          language: "en",
          identifier: "Garchomp"
        },
        nickname: "pokemon 1",
        evolutions: [],
        level: 78,
        shiny: true,
        evs: [],
        ivs: [],
        moves: [],
        stats: []
      };

      const updatedPokemon: Pokemon = 
      {
        name: 
        {
          content: "Pikachu",
          language: "en",
          identifier: "Pikachu"
        },
        nickname: "pokemon 2",
        evolutions: [],
        level: 34,
        shiny: false,
        evs: [],
        ivs: [],
        moves: [],
        stats: []
      };

      expect(currentTeam?.pokemons.length).toBe(0);

      service.addPokemon(pokemon);
      service.addPokemon(updatedPokemon);
      service.addPokemon(undefined);

      const pokemons: (Pokemon | undefined)[] = [pokemon, updatedPokemon, undefined]

      expect(currentTeam?.pokemons.length).toBe(3);
      expect(currentTeam?.pokemons).toStrictEqual(pokemons);

      service.updatePokemon(updatedPokemon, 2);

      const pokemonsAfterDelete: (Pokemon | undefined)[] = [pokemon, updatedPokemon, updatedPokemon]

      expect(currentTeam?.pokemons.length).toBe(3);
      expect(currentTeam?.pokemons).toStrictEqual(pokemonsAfterDelete);
      expect(currentTeam?.pokemons[2]).toStrictEqual(updatedPokemon);
    })

    it('should update correct pokemon with undefined', () => 
    {
      let currentTeam: Team | undefined;

      service.selectedTeam$.subscribe(value => 
      {
        currentTeam = value
      })

      const pokemon: Pokemon = 
      {
        name: 
        {
          content: "Garchomp",
          language: "en",
          identifier: "Garchomp"
        },
        nickname: "pokemon 1",
        evolutions: [],
        level: 78,
        shiny: true,
        evs: [],
        ivs: [],
        moves: [],
        stats: []
      };

      const updatedPokemon: Pokemon = 
      {
        name: 
        {
          content: "Pikachu",
          language: "en",
          identifier: "Pikachu"
        },
        nickname: "pokemon 2",
        evolutions: [],
        level: 34,
        shiny: false,
        evs: [],
        ivs: [],
        moves: [],
        stats: []
      };

      expect(currentTeam?.pokemons.length).toBe(0);

      service.addPokemon(pokemon);
      service.addPokemon(updatedPokemon);
      service.addPokemon(undefined);

      const pokemons: (Pokemon | undefined)[] = [pokemon, updatedPokemon, undefined]

      expect(currentTeam?.pokemons.length).toBe(3);
      expect(currentTeam?.pokemons).toStrictEqual(pokemons);

      service.updatePokemon(undefined, 0);

      const pokemonsAfterDelete: (Pokemon | undefined)[] = [undefined, updatedPokemon, undefined]

      expect(currentTeam?.pokemons.length).toBe(3);
      expect(currentTeam?.pokemons).toStrictEqual(pokemonsAfterDelete);
      expect(currentTeam?.pokemons[0]).toBe(undefined);
    })
  })
});
