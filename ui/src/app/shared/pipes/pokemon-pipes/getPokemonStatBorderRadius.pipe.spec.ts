import { Pokemon } from "../../../core/models/pokemon/pokemon.model";
import { TeamOptions } from "../../../core/models/team/teamOptions.model";
import { GetPokemonStatBorderRadiusPipe } from "./getPokemonStatBorderRadius.pipe";

describe('GetPokemonStatBorderRadiusPipe', () =>
{
  let pipe: GetPokemonStatBorderRadiusPipe;
  let emptyPokemon: Pokemon;

  beforeEach(() => 
  {
    pipe = new GetPokemonStatBorderRadiusPipe();
    emptyPokemon = 
    {
      evolutions: [],
      evs: [],
      ivs: [],
      moves: [],
      stats: []
    }
  });

  it('should return empty string when type is not handled', () => 
  {
    expect(pipe.transform(emptyPokemon, 0, 'wrong')).toBe('');
  });

  describe('Target type is base', () =>
  {
    it('should return 15px for all sides', () => 
    {
      expect(pipe.transform(emptyPokemon, 0, 'base')).toBe('15px');
    });

    it('should return 15px for all sides when no showIVs or showEVs', () => 
    {
      const pokemon: Pokemon = 
      {
        evolutions: [],
        evs: [{ identifier: "atk", value: 5 }],
        ivs: [{ identifier: "atk", value: 5 }],
        moves: [],
        stats: [{ identifier: "atk", value: 10 }],
      }

      const teamOptions: TeamOptions = 
      {
        evsVisibility: false,
        ivsVisibility: false,
        naturesVisibility: false,
        maxStat: 1,
        showNickname: false,
        showIVs: false,
        showEVs: false
      }

      expect(pipe.transform(pokemon, 0, 'base', teamOptions)).toBe('15px');
    });

    it('should return 15px for all sides when ivs == 0 and evs == 0', () => 
    {
      const pokemon: Pokemon = 
      {
        evolutions: [],
        evs: [{ identifier: "atk", value: 0 }],
        ivs: [{ identifier: "atk", value: 0 }],
        moves: [],
        stats: [{ identifier: "atk", value: 10 }],
      }

      const teamOptions: TeamOptions = 
      {
        evsVisibility: false,
        ivsVisibility: false,
        naturesVisibility: false,
        maxStat: 1,
        showNickname: false,
        showIVs: true,
        showEVs: true
      }

      expect(pipe.transform(pokemon, 0, 'base', teamOptions)).toBe('15px');
    });

    it('should return 15px for only left side when showIVs', () =>
    {
      const pokemon: Pokemon = 
      {
        evolutions: [],
        evs: [{ identifier: "atk", value: 0 }],
        ivs: [{ identifier: "atk", value: 5 }],
        moves: [],
        stats: [{ identifier: "atk", value: 10 }],
      }

      const teamOptions: TeamOptions = 
      {
        evsVisibility: false,
        ivsVisibility: false,
        naturesVisibility: false,
        maxStat: 1,
        showNickname: false,
        showIVs: true,
        showEVs: false
      }

      expect(pipe.transform(pokemon, 0, 'base', teamOptions)).toBe('15px 0 0 15px');
    });

    it('should return 15px for only left side when showEVs', () =>
    {
      const pokemon: Pokemon = 
      {
        evolutions: [],
        evs: [{ identifier: "atk", value: 5 }],
        ivs: [{ identifier: "atk", value: 0 }],
        moves: [],
        stats: [{ identifier: "atk", value: 10 }],
      }

      const teamOptions: TeamOptions = 
      {
        evsVisibility: false,
        ivsVisibility: false,
        naturesVisibility: false,
        maxStat: 1,
        showNickname: false,
        showIVs: false,
        showEVs: true
      }

      expect(pipe.transform(pokemon, 0, 'base', teamOptions)).toBe('15px 0 0 15px');
    });

    it('should return 15px for only left side when ivs != 0', () =>
    {
      const pokemon: Pokemon = 
      {
        evolutions: [],
        evs: [{ identifier: "atk", value: 0 }],
        ivs: [{ identifier: "atk", value: 5 }],
        moves: [],
        stats: [{ identifier: "atk", value: 10 }],
      }

      const teamOptions: TeamOptions = 
      {
        evsVisibility: false,
        ivsVisibility: false,
        naturesVisibility: false,
        maxStat: 1,
        showNickname: false,
        showIVs: true,
        showEVs: false
      }

      expect(pipe.transform(pokemon, 0, 'base', teamOptions)).toBe('15px 0 0 15px');
    });

    it('should return 15px for only left side when evs != 0', () =>
    {
      const pokemon: Pokemon = 
      {
        evolutions: [],
        evs: [{ identifier: "atk", value: 5 }],
        ivs: [{ identifier: "atk", value: 0 }],
        moves: [],
        stats: [{ identifier: "atk", value: 10 }],
      }

      const teamOptions: TeamOptions = 
      {
        evsVisibility: false,
        ivsVisibility: false,
        naturesVisibility: false,
        maxStat: 1,
        showNickname: false,
        showIVs: false,
        showEVs: true
      }

      expect(pipe.transform(pokemon, 0, 'base', teamOptions)).toBe('15px 0 0 15px');
    });
  });

  describe('Target type is iv', () =>
  {
    it('should return 15px for only right side when no showEVs', () =>
    {
      const pokemon: Pokemon = 
      {
        evolutions: [],
        evs: [{ identifier: "atk", value: 5 }],
        ivs: [{ identifier: "atk", value: 0 }],
        moves: [],
        stats: [{ identifier: "atk", value: 10 }],
      }

      const teamOptions: TeamOptions = 
      {
        evsVisibility: false,
        ivsVisibility: false,
        naturesVisibility: false,
        maxStat: 1,
        showNickname: false,
        showIVs: false,
        showEVs: false
      }

      expect(pipe.transform(pokemon, 0, 'iv', teamOptions)).toBe('0 15px 15px 0');
    })

    it('should return 15px for only right side when evs == 0', () =>
    {
      const pokemon: Pokemon = 
      {
        evolutions: [],
        evs: [{ identifier: "atk", value: 0 }],
        ivs: [{ identifier: "atk", value: 0 }],
        moves: [],
        stats: [{ identifier: "atk", value: 10 }],
      }

      const teamOptions: TeamOptions = 
      {
        evsVisibility: false,
        ivsVisibility: false,
        naturesVisibility: false,
        maxStat: 1,
        showNickname: false,
        showIVs: false,
        showEVs: true
      }

      expect(pipe.transform(pokemon, 0, 'iv', teamOptions)).toBe('0 15px 15px 0');
    })

    it('should return 0 when evs != 0', () =>
    {
      const pokemon: Pokemon = 
      {
        evolutions: [],
        evs: [{ identifier: "atk", value: 5 }],
        ivs: [{ identifier: "atk", value: 0 }],
        moves: [],
        stats: [{ identifier: "atk", value: 10 }],
      }

      const teamOptions: TeamOptions = 
      {
        evsVisibility: false,
        ivsVisibility: false,
        naturesVisibility: false,
        maxStat: 1,
        showNickname: false,
        showIVs: false,
        showEVs: true
      }

      expect(pipe.transform(pokemon, 0, 'iv', teamOptions)).toBe('0');
    })

    it('should return 0 when showEVs', () =>
    {
      const pokemon: Pokemon = 
      {
        evolutions: [],
        evs: [{ identifier: "atk", value: 5 }],
        ivs: [{ identifier: "atk", value: 0 }],
        moves: [],
        stats: [{ identifier: "atk", value: 10 }],
      }

      const teamOptions: TeamOptions = 
      {
        evsVisibility: false,
        ivsVisibility: false,
        naturesVisibility: false,
        maxStat: 1,
        showNickname: false,
        showIVs: false,
        showEVs: true,
      }

      expect(pipe.transform(pokemon, 0, 'iv', teamOptions)).toBe('0');
    })
  });
})