import { TestBed } from '@angular/core/testing';

import { Nature } from '../models/pokemon/nature.model';
import { Pokemon } from '../models/pokemon/pokemon.model';
import { Stat } from '../models/pokemon/stat.model';
import { TeamOptions } from '../models/team/teamOptions.model';
import { PokemonStatService } from './pokemon-stat.service';

describe('PokemonStatService', () => 
{
  let service: PokemonStatService;

  beforeEach(() => 
  {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonStatService);
  });

  it('should be created', () => 
  {
    expect(service).toBeTruthy();
  });

  describe('calculateStats()', () => 
  {
  
    const baseStats: Stat[] = [
      { identifier: 'hp', value: 100 },
      { identifier: 'atk', value: 80 }
    ];
  
    const pokemon: Pokemon = {
      stats: baseStats,
      level: 50,
      ivs: [
        { identifier: 'hp', value: 16 },
        { identifier: 'atk', value: 8 }
      ],
      evs: [
        { identifier: 'hp', value: 252 },
        { identifier: 'atk', value: 100 }
      ],
      nature: {
        name: 
        {
          content: "test",
          language: "es"
        },
        increasedStatIdentifier: 'atk',
        decreasedStatIdentifier: 'hp'
      },
      moves: [],
      evolutions: []
    };
  
    const teamOptions: TeamOptions = 
    {
      ivsVisibility: true,
      evsVisibility: true,
      naturesVisibility: true,
      showNickname: false,
      maxStat: 0
    };
  
    it('should return empty CalculatedStats if pokemon or teamOptions is undefined', () => {
      let result = service.calculateStats(undefined, undefined);
      expect(result).toEqual({ base: [], ivs: [], evs: [], natures: [], total: [] });
  
      result = service.calculateStats(null, undefined);
      expect(result).toEqual({ base: [], ivs: [], evs: [], natures: [], total: [] });
  
      result = service.calculateStats({} as Pokemon, undefined);
      expect(result).toEqual({ base: [], ivs: [], evs: [], natures: [], total: [] });
    });
  
    it('should calculate stats correctly when all inputs are provided', () => {
      const result = service.calculateStats(pokemon, teamOptions);
  
      // base
      expect(result.base[0].identifier).toBe('hp');
      expect(result.base[1].identifier).toBe('atk');
  
      // IVs
      expect(result.ivs[0].value).toBe(service.calculateIV(16, 50));
      expect(result.ivs[1].value).toBe(service.calculateIV(8, 50));
  
      // EVs
      expect(result.evs[0].value).toBe(service.calculateEV(252, 50));
      expect(result.evs[1].value).toBe(service.calculateEV(100, 50));
  
      // Natures
      expect(result.natures[0].value).toBe(service.getNatureValue(baseStats[0], pokemon.nature));
      expect(result.natures[1].value).toBe(service.getNatureValue(baseStats[1], pokemon.nature));
  
      // Total stats
      expect(result.total[0].value).toBe(
        service.calculateStat(
          baseStats[0].value,
          50,
          16,
          252,
          service.getNatureValue(baseStats[0], pokemon.nature),
          true
        )
      );
      expect(result.total[1].value).toBe(
        service.calculateStat(
          baseStats[1].value,
          50,
          8,
          100,
          service.getNatureValue(baseStats[1], pokemon.nature),
          false
        )
      );
    });
  });
  

  describe('calculateStat()', () => 
  {
    it.each([
      // [base, level, iv, ev, nature, hp, expected]
      // Values from Level 78 Garchomp from bulbapedia stat page
      [108, 78, 24, 74, 1, true, 289],   // HP
      [130, 78, 12, 190, 1.1, false, 278], // Atk
      [95, 78, 30, 91, 1, false, 193],   // Def
      [80, 78, 16, 48 , 0.9, false, 135],  // SpA
      [85, 78, 23, 84, 1, false, 171], // SpD
      [102, 78, 5, 23, 1, false, 171], // Spe
    ])(
      'should return %i for base=%i, level=%i, iv=%i, ev=%i, nature=%i, hp=%s',
      (base, level, iv, ev, nature, hp, expected) => {
        const result = service.calculateStat(base, level, iv, ev, nature, hp);
        expect(result).toBe(expected);
      }
    );
  })

  describe('calculateBaseStat()', () => 
  {
    it.each([
      // Values from Level 78 Garchomp
      [{ identifier: 'hp', value: 108 }, undefined, 168],  // HP, default level 50
      [{ identifier: 'atk', value: 130 }, undefined, 135], // non-HP, default level 50
      [{ identifier: 'hp', value: 108 }, 78, 256],          // HP, level 78
      [{ identifier: 'atk', value: 130 }, 78, 207],         // non-HP, level 78   
    ])("should return %i for baseStat=%o with level=%o", (baseStat, level, expected) => 
    {
      expect(service.calculateBaseStat(baseStat, level)).toBe(expected);
    })
  })

  describe('calculateIV()', () => 
  {
    it.each([
      [0, 1, 0],
      [8, 1, 0],
      [16, 1, 0],
      [31, 1, 0],
      [0, 50, 0],
      [8, 50, 4],
      [16, 50, 8],
      [31, 50, 15],
      [0, 100, 0],
      [8, 100, 8],
      [16, 100, 16],
      [31, 100, 31],
    ])('should return %i for IV=%i, level=%i', (iv, level, expected) => {
      expect(service.calculateIV(iv, level)).toBe(expected);
    });
  });

  describe("calculateEV()", () =>
  {
    it.each([
      [0, 1, 0],
      [100, 1, 1],
      [252, 1, 1],
      [0, 50, 0],
      [100, 50, 13],
      [252, 50, 32],
      [0, 100, 0],
      [100, 100, 25],
      [252, 100, 63],
    ])('should return %i for EV=%i at level=%i', (ev, level, expected) => {
      const result = service.calculateEV(ev, level);
      expect(result).toBe(expected);
    });
  })

  describe("getNatureValue()", () =>
  {
    const baseStatAtk: Stat = 
    {
      identifier: "atk",
      value: 0
    }

    const natureNeutral: Nature = 
    {
      name: 
      {
        content: "test",
        language: "en"
      },
      increasedStatIdentifier: "hp",
      decreasedStatIdentifier: "hp"
    }

    const natureIncreasing: Nature = 
    {
      name: 
      {
        content: "test",
        language: "en"
      },
      increasedStatIdentifier: "atk",
      decreasedStatIdentifier: "def"
    }

    const natureDecreasing: Nature = 
    {
      name: 
      {
        content: "test",
        language: "en"
      },
      increasedStatIdentifier: "hp",
      decreasedStatIdentifier: "atk"
    }

    const natureBoth: Nature = 
    {
      name: 
      {
        content: "test",
        language: "en"
      },
      increasedStatIdentifier: "atk",
      decreasedStatIdentifier: "atk"
    }

    it("should return 1 for undefined nature", () => 
    {
      expect(service.getNatureValue(baseStatAtk, undefined)).toBe(1);
    })

    it("should return 1 for neutral nature", () => 
    {
      expect(service.getNatureValue(baseStatAtk, natureNeutral)).toBe(1);
    })

    it("should return 1.1 for increasing nature", () => 
    {
      expect(service.getNatureValue(baseStatAtk, natureIncreasing)).toBe(1.1);
    })

    it("should return 0.9 for decreasing nature", () => 
    {
      expect(service.getNatureValue(baseStatAtk, natureDecreasing)).toBe(0.9);
    })

    it("should return 1 for both increasing and decreasing nature", () => 
    {
      expect(service.getNatureValue(baseStatAtk, natureBoth)).toBe(1);
    })
  })
});
