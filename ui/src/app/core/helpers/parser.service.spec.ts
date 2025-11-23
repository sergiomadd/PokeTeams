import { TestBed } from '@angular/core/testing';

import { Pokemon } from '../models/pokemon/pokemon.model';
import { PokePaste } from '../models/team/pokePaste.model';
import { ParserService } from './parser.service';

describe('ParserService', () => {
  let service: ParserService;

  const examplePokemonInput = "monito (Garchomp) @ Soul Dew \n Ability: Technician \n  Level: 78 \n Shiny: Yes \n Tera Type: Dark \n EVs: 74 HP / 190 Atk / 91 Def / 48 SpA / 84 SpD / 23 Spe \n  Adamant Nature \n  IVs: 24 HP / 12 Atk / 30 Def / 16 SpA / 23 SpD / 5 Spe \n  - Scary Face \n  - Smack Down \n  - Sunny Day \n  - Sunny Day \n\n"

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('parsePokemon()', () => 
  {
    it('should return empty paste', () => 
    {
      const pokemonInput = "this is no valid paste"
    
      const outputPaste: PokePaste =
      {
        moves: 
        [undefined],
        ivs: 
        [
          ['hp', 31],
          ['attack', 31],
          ['defense', 31],
          ['special-attack', 31],
          ['special-defense', 31],
          ['speed', 31]
        ],
        evs: 
        [
          ['hp', 0],
          ['attack', 0],
          ['defense', 0],
          ['special-attack', 0],
          ['special-defense', 0],
          ['speed', 0]
        ],
        name: "this is no valid paste",
        source: "this is no valid paste"
      } 

      expect(service.parsePokemon(pokemonInput)).toStrictEqual(outputPaste);
    })

    it('should return correct paste', () => 
    {    
      const outputPaste: PokePaste =
      {
        name: "Garchomp",
        nickname: "monito",
        teratype: "dark",
        item: "Soul Dew",
        ability: "Technician",
        nature: "Adamant",
        moves: 
        [
          "Scary Face",
          "Smack Down",
          "Sunny Day",
          "Sunny Day",
        ],
        ivs: 
        [
          ['hp', 24],
          ['attack', 12],
          ['defense', 30],
          ['special-attack', 16],
          ['special-defense', 23],
          ['speed', 5]
        ],
        evs: 
        [
          ['hp', 74],
          ['attack', 190],
          ['defense', 91],
          ['special-attack', 48],
          ['special-defense', 84],
          ['speed', 23]
        ],
        level: 78,
        shiny: true,
        gender: false,
        source: "monito (Garchomp) @ Soul Dew \n Ability: Technician \n  Level: 78 \n Shiny: Yes \n Tera Type: Dark \n EVs: 74 HP / 190 Atk / 91 Def / 48 SpA / 84 SpD / 23 Spe \n  Adamant Nature \n  IVs: 24 HP / 12 Atk / 30 Def / 16 SpA / 23 SpD / 5 Spe \n  - Scary Face \n  - Smack Down \n  - Sunny Day \n  - Sunny Day \n\n"
      } 
      
      expect(service.parsePokemon(examplePokemonInput)).toStrictEqual(outputPaste);
    })
  })

  describe('reverseParsePokemon()', () => 
  {
    it('should return empty string', () => 
    {
      const output = "";
      const pokemon: Pokemon = <Pokemon>{};
      
      expect(service.reverseParsePokemon(pokemon)).toMatch(output);
    })

    it('should return correct paste', () => 
    {
      const output = "monito (Garchomp) @ Soul Dew\nAbility: Technician\nLevel: 78\nShiny: Yes\nTera Type: Dark\nEVs: 74 HP / 190 Atk / 91 Def / 48 SpA / 84 SpD / 23 Spe \nAdamant Nature\nIVs: 24 HP / 12 Atk / 30 Def / 16 SpA / 23 SpD / 5 Spe \n- Scary Face\n- Smack Down\n- Sunny Day\n- Sunny Day\n";
      const pokemon: Pokemon = 
      {
        name: 
        {
          content: "Garchomp",
          language: "en",
          identifier: "Garchomp"
        },
        nickname: "monito",
        evolutions: [],
        item: 
        {
          name: 
          {
            content: "Soul Dew",
            language: "en",
            identifier: "Soul Dew"
          },
          iconPath: "",
          identifier: "",
          language: "en",
          prose: 
          {
            content: "",
            language: "en"
          }
        },
        ability: 
        {
          name: 
          {
            content: "Technician",
            language: "en",
            identifier: "Technician"
          },
          hidden: false,
          identifier: "technician",
          prose:
          {
            content: "",
            language: "en"
          }
        },
        level: 78,
        shiny: true,
        teraType: 
        {
          name: 
          {
            content: "Dark",
            language: "en",
            identifier: "Dark"
          },
          identifier: "dark",
          iconPath: "",
          effectivenessAttack: {},
          effectivenessDefense: {}
        },
        evs: 
        [
          {
            identifier: "hp",
            value: 74
          },
          {
            identifier: "attack",
            value: 190
          },
          {
            identifier: "defense",
            value: 91
          },
          {
            identifier: "special-attack",
            value: 48
          },
          {
            identifier: "special-defense",
            value: 84
          },
          {
            identifier: "speed",
            value: 23
          }
        ],
        nature: 
        {
          name:
          {
            content: "Adamant",
            language: "en",
            identifier: "Adamant"
          },
          decreasedStatIdentifier: "",
          increasedStatIdentifier: ""
        },
        ivs: 
        [
          {
            identifier: "hp",
            value: 24
          },
          {
            identifier: "attack",
            value: 12
          },
          {
            identifier: "defense",
            value: 30
          },
          {
            identifier: "special-attack",
            value: 16
          },
          {
            identifier: "special-defense",
            value: 23
          },
          {
            identifier: "speed",
            value: 5
          }
        ],
        moves: 
        [
          {
            name: 
            {
              content: "Scary Face",
              language: "en",
              identifier: "Scary Face"
            },
            identifier: "scary-face"
          },
          {
            identifier: "smack-down",
            name: 
            {
              content: "Smack Down",
              language: "en",
              identifier: "Smack Down"
            },
          },
          {
            identifier: "sunny-day",
            name: 
            {
              content: "Sunny Day",
              language: "en",
              identifier: "Sunny Day"
            },
          },
          {
            identifier: "sunny-day",
            name: 
            {
              content: "Sunny Day",
              language: "en",
              identifier: "Sunny Day"
            },
          }
        ],
        stats: [],
      };
      
      expect(service.reverseParsePokemon(pokemon)).toMatch(output);
    })
  })

  describe('getName()', () => 
  {
    it('should return only species name', () => 
    {
      const emptyPokePaste: PokePaste = <PokePaste>{};
      const line = "Mamoswine"
      const name = "Mamoswine"

      service.getName(emptyPokePaste, line);

      expect(emptyPokePaste.name).toBe(name);
    })

    it('should return species + nickname', () => 
    {
      const emptyPokePaste: PokePaste = <PokePaste>{};
      const line = "Pickle (Mamoswine)"
      const name = "Mamoswine"
      const nickname = "Pickle";

      service.getName(emptyPokePaste, line);

      expect(emptyPokePaste.name).toBe(name);
      expect(emptyPokePaste.nickname).toBe(nickname);
    })

    it('should return species + gender', () => 
    {
      const emptyPokePaste: PokePaste = <PokePaste>{};
      const line = "Mamoswine (F)"
      const name = "Mamoswine"

      service.getName(emptyPokePaste, line);

      expect(emptyPokePaste.name).toBe(name);
      expect(emptyPokePaste.gender).toBe(true);
    });

    it('should return species + nickname + gender', () => 
    {
      const emptyPokePaste: PokePaste = <PokePaste>{};
      const line = "Pickle (Mamoswine) (F)"
      const name = "Mamoswine"
      const nickname = "Pickle";

      service.getName(emptyPokePaste, line);

      expect(emptyPokePaste.name).toBe(name);
      expect(emptyPokePaste.nickname).toBe(nickname);
      expect(emptyPokePaste.gender).toBe(true);
    });
  })

  describe('getReverseName()', () => 
  {
    it('should return only species name', () => 
    {
      const pokemon: Pokemon = <Pokemon>{};
      pokemon.name = 
      {
        content: "Mamoswine",
        language: "en",
        identifier: "Mamoswine"
      }
      const outputLine = "Mamoswine";

      expect(service.getReverseName(pokemon)).toMatch(outputLine);
    })

    it('should return species name + item', () => 
    {
      const pokemon: Pokemon = <Pokemon>{};
      pokemon.name = 
      {
        content: "Mamoswine",
        language: "en",
        identifier: "Mamoswine"
      }
      pokemon.item =
      {
        name:
        {
          content: "Soul Dew",
          language: "en",
          identifier: "Soul Dew"
        },
        identifier: "soul-dew",
        language: "en",
        iconPath: "",
        prose: 
        {
          content: "",
          language: "en"
        }
      }
      const outputLine = "Mamoswine @ Soul Dew";

      expect(service.getReverseName(pokemon)).toMatch(outputLine);
    })

    it('should return species name + item', () => 
    {
      const pokemon: Pokemon = <Pokemon>{};
      pokemon.name = 
      {
        content: "Mamoswine",
        language: "en",
        identifier: "Mamoswine"
      }
      pokemon.nickname = "monito"
      const outputLine = "monito (Mamoswine)";

      expect(service.getReverseName(pokemon)).toMatch(outputLine);
    })

    it('should return species name + item', () => 
    {
      const pokemon: Pokemon = <Pokemon>{};
      pokemon.name = 
      {
        content: "Mamoswine",
        language: "en",
        identifier: "Mamoswine"
      }
      pokemon.item =
      {
        name:
        {
          content: "Soul Dew",
          language: "en",
          identifier: "Soul Dew"
        },
        identifier: "soul-dew",
        language: "en",
        iconPath: "",
        prose: 
        {
          content: "",
          language: "en"
        }
      }
      pokemon.nickname = "monito"
      const outputLine = "monito (Mamoswine) @ Soul Dew";

      expect(service.getReverseName(pokemon)).toMatch(outputLine);
    })
  })

  describe('getMoves()', () => 
  {
    it('should return no moves', () => 
    {
      const lines = []
      const moves = []

      expect(service.getMoves(lines)).toStrictEqual(moves);
    })

    it('should return correct moves', () => 
    {
      const lines = 
      [
        "- Scary Face",
        "- Smack Down",
        "- Sunny Day",
        "- Sunny Day",
      ]
      const moves = 
      [
        "Scary Face",
        "Smack Down",
        "Sunny Day",
        "Sunny Day",
      ]

      expect(service.getMoves(lines)).toStrictEqual(moves);
    })
  })

  describe('getStats()', () => 
  {
    it('should return default ivs', () => 
    {
      const statType = "noiv";
      const line = "";
      const stats = 
      [
        ['hp', 31],
        ['attack', 31],
        ['defense', 31],
        ['special-attack', 31],
        ['special-defense', 31],
        ['speed', 31]
      ];

      expect(service.getStats(line, statType)).toStrictEqual(stats)
    });

    it('should return default evs', () => 
    {
      const statType = "noev";
      const line = "";
      const stats = 
      [
        ['hp', 0],
        ['attack', 0],
        ['defense', 0],
        ['special-attack', 0],
        ['special-defense', 0],
        ['speed', 0]
      ];

      expect(service.getStats(line, statType)).toStrictEqual(stats)
    });

    it('should return correct ivs', () => 
    {
      const statType = "iv";
      const line = "IVs: 24 HP / 12 Atk / 30 Def / 16 SpA / 23 SpD / 5 Spe";
      const stats = 
      [
        ['hp', 24],
        ['attack', 12],
        ['defense', 30],
        ['special-attack', 16],
        ['special-defense', 23],
        ['speed', 5]
      ];

      expect(service.getStats(line, statType)).toStrictEqual(stats)
    })

    it('should return correct evs', () => 
    {
      const statType = "ev";
      const line = "EVs: 74 HP / 190 Atk / 91 Def / 48 SpA / 84 SpD / 23 Spe";
      const stats = 
      [
        ['hp', 74],
        ['attack', 190],
        ['defense', 91],
        ['special-attack', 48],
        ['special-defense', 84],
        ['speed', 23]
      ];

      expect(service.getStats(line, statType)).toStrictEqual(stats)
    })
  })

  describe('formatValue()', () => 
  {
    it('should format to remove left parenthesis', () => 
    {
      const value = "(test";
      const result = "test";
      
      expect(service.formatValue(value, { leftParen: true })).toBe(result);
    })

    it('should format to remove right parenthesis', () => 
    {
      const value = "test)";
      const result = "test";
      
      expect(service.formatValue(value, { rightParen: true })).toBe(result);
    })

    it('should format to remove both parenthesis', () => 
    {
      const value = "(test)";
      const result = "test";
      
      expect(service.formatValue(value, { leftParen: true, rightParen: true })).toBe(result);
    })

    it('should format to remove white space', () => 
    {
      const value = " test ";
      const result = "test";
      
      expect(service.formatValue(value, { whiteSpace: true })).toBe(result);
    })

    it('should format to remove only one white space', () => 
    {
      const value = " test a";
      const result = "test a";
      
      expect(service.formatValue(value, { onlyOneWhiteSpace: true })).toBe(result);
    })

    it('should format to make it lowercase', () => 
    {
      const value = "TeST";
      const result = "test";
      
      expect(service.formatValue(value, { lowercase: true })).toBe(result);
    })
  })
});
