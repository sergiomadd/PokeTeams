import { TestBed } from '@angular/core/testing';
import { Move } from '../../core/models/pokemon/move.model';
import { PokemonPreview } from '../../core/models/pokemon/pokemonPreview.model';
import { TeamPreviewData } from '../../core/models/team/teamPreviewData.model';
import { TeamPreviewToCompare } from '../../core/models/team/teamPreviewToCompare.model';
import { TeamCompareService } from './team-compare.service';

describe('TeamCompareService', () => {
  let service: TeamCompareService;

  // Mock data
  const mockMoveA: Move = {
    identifier: 'thunderbolt',
    name: {
      content: 'Thunderbolt',
      language: 'en'
    },
    pokeType: {
      identifier: 'electric',
      name: {
        content: 'Electric',
        language: 'en'
      },
      iconPath: '',
      effectivenessAttack: {},
      effectivenessDefense: {}
    },
    damageClass: {
      name: 'special',
      description: 'Special Attack',
      iconPath: '/icons/special.png'
    },
    power: 90,
    pp: 15,
    accuracy: 100,
    priority: 0
  };

  const mockMoveB: Move = {
    identifier: 'fire-blast',
    name: {
      content: 'Fire Blast',
      language: 'en'
    },
    pokeType: {
      identifier: 'fire',
      name: {
        content: 'Fire',
        language: 'en'
      },
      iconPath: '',
      effectivenessAttack: {},
      effectivenessDefense: {}
    },
    damageClass: {
      name: 'special',
      description: 'Special Attack',
      iconPath: '/icons/special.png'
    },
    power: 110,
    pp: 5,
    accuracy: 85,
    priority: 0
  };

  const mockPokemon1: PokemonPreview = {
    name: {
      content: 'Pikachu',
      language: 'en'
    },
    dexNumber: 25,
    types: {
      type1: {
        identifier: 'electric',
        name: {
          content: 'Electric',
          language: 'en'
        },
        iconPath: ''
      }
    },
    sprite: {},
    shiny: false,
    gender: 'male'
  };

  const mockPokemon2: PokemonPreview = {
    name: {
      content: 'Charizard',
      language: 'en'
    },
    dexNumber: 6,
    types: {
      type1: {
        identifier: 'fire',
        name: {
          content: 'Fire',
          language: 'en'
        },
        iconPath: ''
      },
      type2: {
        identifier: 'flying',
        name: {
          content: 'Flying',
          language: 'en'
        },
        iconPath: ''
      }
    },
    sprite: {},
    shiny: false,
    gender: 'male'
  };

  const mockTeamData1: TeamPreviewData = {
    id: 'team-1',
    pokemonIDs: [25, 6, 143],
    options: {
      ivsVisibility: false,
      evsVisibility: false,
      maxStat: 0,
      naturesVisibility: false,
      showNickname: false
    },
    title: 'Team Alpha',
    viewCount: 150,
    visibility: true,
    date: '2024-01-15'
  };

  const mockTeamData2: TeamPreviewData = {
    id: 'team-2',
    pokemonIDs: [94, 212, 448],
    options: {
      ivsVisibility: false,
      evsVisibility: false,
      maxStat: 0,
      naturesVisibility: false,
      showNickname: false
    },
    title: 'Team Beta',
    viewCount: 200,
    visibility: true,
    date: '2024-01-20'
  };

  const mockTeamData3: TeamPreviewData = {
    id: 'team-3',
    pokemonIDs: [445, 350, 130],
    options: {
      ivsVisibility: false,
      evsVisibility: false,
      maxStat: 0,
      naturesVisibility: false,
      showNickname: false
    },
    title: 'Team Gamma',
    viewCount: 75,
    visibility: true,
    date: '2024-01-25'
  };

  const mockTeam1: TeamPreviewToCompare = {
    teamData: mockTeamData1,
    pokemonPreviews: [mockPokemon1, mockPokemon2]
  };

  const mockTeam2: TeamPreviewToCompare = {
    teamData: mockTeamData2,
    pokemonPreviews: [mockPokemon1]
  };

  const mockTeam3: TeamPreviewToCompare = {
    teamData: mockTeamData3,
    pokemonPreviews: [mockPokemon2]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamCompareService]
    });
    service = TestBed.inject(TeamCompareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Move A management', () => {
    it('should initialize with undefined move A', (done) => {
      service.selectedMoveA$.subscribe(move => {
        expect(move).toBeUndefined();
        done();
      });
    });

    it('should set move A', (done) => {
      service.setMoveA(mockMoveA);
      
      service.selectedMoveA$.subscribe(move => {
        expect(move).toEqual(mockMoveA);
        expect(move?.identifier).toBe('thunderbolt');
        expect(move?.name.content).toBe('Thunderbolt');
        done();
      });
    });

    it('should update move A to a different move', (done) => {
      const values: (Move | undefined)[] = [];
      
      service.selectedMoveA$.subscribe(move => {
        values.push(move);
        if (values.length === 3) {
          expect(values[0]).toBeUndefined(); // initial
          expect(values[1]?.identifier).toBe('thunderbolt');
          expect(values[2]?.identifier).toBe('fire-blast');
          done();
        }
      });
      
      service.setMoveA(mockMoveA);
      service.setMoveA(mockMoveB);
    });

    it('should clear move A by setting to undefined', (done) => {
      service.setMoveA(mockMoveA);
      service.setMoveA(undefined);
      
      service.selectedMoveA$.subscribe(move => {
        expect(move).toBeUndefined();
        done();
      });
    });

    it('should preserve move type information', (done) => {
      service.setMoveA(mockMoveA);
      
      service.selectedMoveA$.subscribe(move => {
        expect(move?.pokeType?.identifier).toBe('electric');
        expect(move?.pokeType?.name.content).toBe('Electric');
        expect(move?.pokeType?.effectivenessAttack).toEqual({});
        expect(move?.pokeType?.effectivenessDefense).toEqual({});
        done();
      });
    });

    it('should preserve move damage class', (done) => {
      service.setMoveA(mockMoveA);
      
      service.selectedMoveA$.subscribe(move => {
        expect(move?.damageClass?.name).toBe('special');
        expect(move?.damageClass?.description).toBe('Special Attack');
        done();
      });
    });
  });

  describe('Move B management', () => {
    it('should initialize with undefined move B', (done) => {
      service.selectedMoveB$.subscribe(move => {
        expect(move).toBeUndefined();
        done();
      });
    });

    it('should set move B', (done) => {
      service.setMoveB(mockMoveB);
      
      service.selectedMoveB$.subscribe(move => {
        expect(move).toEqual(mockMoveB);
        expect(move?.identifier).toBe('fire-blast');
        expect(move?.power).toBe(110);
        done();
      });
    });

    it('should update move B to a different move', (done) => {
      const values: (Move | undefined)[] = [];
      
      service.selectedMoveB$.subscribe(move => {
        values.push(move);
        if (values.length === 3) {
          expect(values[0]).toBeUndefined(); // initial
          expect(values[1]?.identifier).toBe('fire-blast');
          expect(values[2]?.identifier).toBe('thunderbolt');
          done();
        }
      });
      
      service.setMoveB(mockMoveB);
      service.setMoveB(mockMoveA);
    });

    it('should clear move B by setting to undefined', (done) => {
      service.setMoveB(mockMoveB);
      service.setMoveB(undefined);
      
      service.selectedMoveB$.subscribe(move => {
        expect(move).toBeUndefined();
        done();
      });
    });

    it('should preserve move stats', (done) => {
      service.setMoveB(mockMoveB);
      
      service.selectedMoveB$.subscribe(move => {
        expect(move?.power).toBe(110);
        expect(move?.pp).toBe(5);
        expect(move?.accuracy).toBe(85);
        expect(move?.priority).toBe(0);
        done();
      });
    });
  });

  describe('Teams to compare management', () => {
    it('should initialize with empty teams array', (done) => {
      service.teamsToCompare$.subscribe(teams => {
        expect(teams).toEqual([]);
        done();
      });
    });

    it('should add first team successfully', (done) => {
      const result = service.addTeamsToCompare(mockTeam1);
      
      expect(result).toBe(true);
      
      service.teamsToCompare$.subscribe(teams => {
        expect(teams.length).toBe(1);
        expect(teams[0]).toEqual(mockTeam1);
        expect(teams[0].teamData.id).toBe('team-1');
        expect(teams[0].teamData.title).toBe('Team Alpha');
        expect(teams[0].pokemonPreviews.length).toBe(2);
        done();
      });
    });

    it('should add second team successfully', (done) => {
      service.addTeamsToCompare(mockTeam1);
      const result = service.addTeamsToCompare(mockTeam2);
      
      expect(result).toBe(true);
      
      service.teamsToCompare$.subscribe(teams => {
        expect(teams.length).toBe(2);
        expect(teams[0].teamData.id).toBe('team-1');
        expect(teams[1].teamData.id).toBe('team-2');
        expect(teams[0].pokemonPreviews.length).toBe(2);
        expect(teams[1].pokemonPreviews.length).toBe(1);
        done();
      });
    });

    it('should not add third team when limit reached', (done) => {
      service.addTeamsToCompare(mockTeam1);
      service.addTeamsToCompare(mockTeam2);
      const result = service.addTeamsToCompare(mockTeam3);
      
      expect(result).toBe(false);
      
      service.teamsToCompare$.subscribe(teams => {
        expect(teams.length).toBe(2);
        expect(teams.find(t => t.teamData.id === 'team-3')).toBeUndefined();
        done();
      });
    });

    it('should verify team data structure after adding', (done) => {
      service.addTeamsToCompare(mockTeam1);
      
      service.teamsToCompare$.subscribe(teams => {
        const team = teams[0];
        expect(team.teamData.pokemonIDs).toEqual([25, 6, 143]);
        expect(team.teamData.options.ivsVisibility).toBe(false);
        expect(team.teamData.options.evsVisibility).toBe(false);
        expect(team.teamData.options.naturesVisibility).toBe(false);
        expect(team.teamData.options.showNickname).toBe(false);
        expect(team.teamData.options.maxStat).toBe(0);
        expect(team.teamData.viewCount).toBe(150);
        expect(team.teamData.visibility).toBe(true);
        done();
      });
    });

    it('should verify Pokemon data in team', (done) => {
      service.addTeamsToCompare(mockTeam1);
      
      service.teamsToCompare$.subscribe(teams => {
        const pikachu = teams[0].pokemonPreviews[0];
        const charizard = teams[0].pokemonPreviews[1];
        
        expect(pikachu.name?.content).toBe('Pikachu');
        expect(pikachu.dexNumber).toBe(25);
        expect(pikachu.types?.type1?.identifier).toBe('electric');
        expect(pikachu.shiny).toBe(false);
        expect(pikachu.gender).toBe('male');
        
        expect(charizard.name?.content).toBe('Charizard');
        expect(charizard.dexNumber).toBe(6);
        expect(charizard.types?.type1?.identifier).toBe('fire');
        expect(charizard.types?.type2?.identifier).toBe('flying');
        done();
      });
    });

    it('should remove team by id successfully', (done) => {
      service.addTeamsToCompare(mockTeam1);
      service.addTeamsToCompare(mockTeam2);
      
      const result = service.removeTeamsToCompare('team-1');
      
      expect(result).toBe(true);
      
      service.teamsToCompare$.subscribe(teams => {
        expect(teams.length).toBe(1);
        expect(teams[0].teamData.id).toBe('team-2');
        expect(teams[0].teamData.title).toBe('Team Beta');
        done();
      });
    });

    it('should remove team from middle of array', (done) => {
      service.addTeamsToCompare(mockTeam1);
      service.addTeamsToCompare(mockTeam2);
      
      service.removeTeamsToCompare('team-1');
      service.addTeamsToCompare(mockTeam3);
      
      const result = service.removeTeamsToCompare('team-2');
      
      expect(result).toBe(true);
      
      service.teamsToCompare$.subscribe(teams => {
        expect(teams.length).toBe(1);
        expect(teams[0].teamData.id).toBe('team-3');
        expect(teams[0].teamData.title).toBe('Team Gamma');
        done();
      });
    });

    it('should return false when removing non-existent team', () => {
      service.addTeamsToCompare(mockTeam1);
      
      const result = service.removeTeamsToCompare('non-existent-id');
      
      expect(result).toBe(false);
    });

    it('should maintain team order after removal', (done) => {
      service.addTeamsToCompare(mockTeam1);
      service.addTeamsToCompare(mockTeam2);
      service.removeTeamsToCompare('team-2');
      
      service.teamsToCompare$.subscribe(teams => {
        expect(teams.length).toBe(1);
        expect(teams[0].teamData.id).toBe('team-1');
        done();
      });
    });

    it('should allow adding team after removing one', (done) => {
      service.addTeamsToCompare(mockTeam1);
      service.addTeamsToCompare(mockTeam2);
      service.removeTeamsToCompare('team-1');
      const result = service.addTeamsToCompare(mockTeam3);
      
      expect(result).toBe(true);
      
      service.teamsToCompare$.subscribe(teams => {
        expect(teams.length).toBe(2);
        expect(teams[0].teamData.id).toBe('team-2');
        expect(teams[1].teamData.id).toBe('team-3');
        done();
      });
    });

    it('should not mutate original array when adding team', () => {
      service.addTeamsToCompare(mockTeam1);
      const firstSnapshot = [...service['teamsToCompareSubject$'].getValue()];
      
      service.addTeamsToCompare(mockTeam2);
      const secondSnapshot = [...service['teamsToCompareSubject$'].getValue()];
      
      expect(firstSnapshot.length).toBe(1);
      expect(secondSnapshot.length).toBe(2);
    });

    it('should not mutate original array when removing team', () => {
      service.addTeamsToCompare(mockTeam1);
      service.addTeamsToCompare(mockTeam2);
      const beforeRemoval = [...service['teamsToCompareSubject$'].getValue()];
      
      service.removeTeamsToCompare('team-1');
      const afterRemoval = [...service['teamsToCompareSubject$'].getValue()];
      
      expect(beforeRemoval.length).toBe(2);
      expect(afterRemoval.length).toBe(1);
    });
  });

  describe('Observable emissions', () => {
    it('should emit updates for all observables independently', (done) => {
      let emissionCount = 0;
      const expectedEmissions = 6; // 3 initial + 3 updates
      
      const subscription1 = service.selectedMoveA$.subscribe(() => {
        emissionCount++;
        checkComplete();
      });
      
      const subscription2 = service.selectedMoveB$.subscribe(() => {
        emissionCount++;
        checkComplete();
      });
      
      const subscription3 = service.teamsToCompare$.subscribe(() => {
        emissionCount++;
        checkComplete();
      });
      
      function checkComplete() {
        if (emissionCount === expectedEmissions) {
          subscription1.unsubscribe();
          subscription2.unsubscribe();
          subscription3.unsubscribe();
          done();
        }
      }
      
      service.setMoveA(mockMoveA);
      service.setMoveB(mockMoveB);
      service.addTeamsToCompare(mockTeam1);
    });
  });

  describe('Edge cases', () => {
    it('should handle setting same move twice', (done) => {
      const emissions: (Move | undefined)[] = [];
      
      const subscription = service.selectedMoveA$.subscribe(move => {
        emissions.push(move);
      });
      
      service.setMoveA(mockMoveA);
      service.setMoveA(mockMoveA);
      
      setTimeout(() => {
        expect(emissions.length).toBe(3); // initial undefined + 2 emissions
        expect(emissions[1]?.identifier).toBe('thunderbolt');
        expect(emissions[2]?.identifier).toBe('thunderbolt');
        subscription.unsubscribe();
        done();
      }, 100);
    });

    it('should handle adding same team twice', () => {
      service.addTeamsToCompare(mockTeam1);
      service.addTeamsToCompare(mockTeam1);
      
      const teams = service['teamsToCompareSubject$'].getValue();
      expect(teams.length).toBe(2);
      expect(teams[0].teamData.id).toBe('team-1');
      expect(teams[1].teamData.id).toBe('team-1');
    });

    it('should handle setting teratype at high index', (done) => {
      service.setTeratypeSelectedIndexA(10, true);
      
      service.teratypeEnabledIndexesAObservable$.subscribe(indexes => {
        expect(indexes[10]).toBe(true);
        expect(indexes.length).toBe(11);
        done();
      });
    });

    it('should handle empty pokemon previews array in team', (done) => {
      const emptyTeam: TeamPreviewToCompare = {
        teamData: mockTeamData1,
        pokemonPreviews: []
      };
      
      service.addTeamsToCompare(emptyTeam);
      
      service.teamsToCompare$.subscribe(teams => {
        expect(teams[0].pokemonPreviews).toEqual([]);
        expect(teams[0].pokemonPreviews.length).toBe(0);
        done();
      });
    });
  });
});