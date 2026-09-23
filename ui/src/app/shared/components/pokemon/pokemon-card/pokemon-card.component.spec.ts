import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LinkifierService } from '../../../../core/helpers/linkifier.service';
import { PokemonStatService } from '../../../../core/helpers/pokemon-stat.service';
import { CalculatedStats } from '../../../../core/models/pokemon/calculatedStats.model';
import { Move } from '../../../../core/models/pokemon/move.model';
import { Pokemon } from '../../../../core/models/pokemon/pokemon.model';
import { Stat } from '../../../../core/models/pokemon/stat.model';
import { TeamOptions } from '../../../../core/models/team/teamOptions.model';
import { PokemonCardComponent } from './pokemon-card.component';

function makeStat(identifier: string, value: number): Stat
{
  return { identifier, name: { content: identifier, language: 'en' }, value };
}

function makeMove(identifier: string): Move
{
  return {
    identifier,
    name: { content: identifier, language: 'en' },
    effect: { short: { content: `${identifier} short`, language: 'en' }, long: { content: `${identifier} long`, language: 'en' } },
    target: { name: 'target', description: { content: `${identifier} target`, language: 'en' } }
  } as Move;
}

function makePokemon(overrides: Partial<Pokemon> = {}): Pokemon
{
  return {
    evolutions: [],
    moves: [makeMove('move1'), makeMove('move2'), undefined, undefined],
    stats: [makeStat('hp', 1), makeStat('attack', 1)],
    ivs: [makeStat('hp', 0), makeStat('attack', 0)],
    evs: [makeStat('hp', 0), makeStat('attack', 0)],
    ...overrides
  } as Pokemon;
}

const emptyCalculatedStats: CalculatedStats = { base: [], ivs: [], evs: [], natures: [], total: [] };
const teamOptions = {} as TeamOptions;

describe('PokemonCardComponent', () =>
{
  let component: PokemonCardComponent;
  let fixture: ComponentFixture<PokemonCardComponent>;
  let store: MockStore;
  let linkifierService: jest.Mocked<LinkifierService>;

  beforeEach(async () =>
  {
    const linkifierServiceMock = { linkifyProse: jest.fn().mockReturnValue([]) };
    const pokemonStatServiceMock = { calculateStats: jest.fn().mockReturnValue(emptyCalculatedStats) };

    await TestBed.configureTestingModule(
    {
      imports: [PokemonCardComponent, TranslateModule.forRoot()],
      providers:
      [
        provideMockStore({ initialState: { config: { lang: 'en' } } }),
        { provide: LinkifierService, useValue: linkifierServiceMock },
        { provide: PokemonStatService, useValue: pokemonStatServiceMock }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    linkifierService = TestBed.inject(LinkifierService) as jest.Mocked<LinkifierService>;

    fixture = TestBed.createComponent(PokemonCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('teamOptions', teamOptions);
  });

  it('should create', () =>
  {
    fixture.componentRef.setInput('pokemon', makePokemon());
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('renders the stat-bar rows when stats are expanded, without throwing', () =>
  {
    fixture.componentRef.setInput('pokemon', makePokemon(
    {
      dexNumber: 1,
      name: { content: 'Test', language: 'en' }
    }));
    fixture.detectChanges();

    component.setStatsVisible(true);
    expect(() => fixture.detectChanges()).not.toThrow();

    const statRows = fixture.debugElement.queryAll(By.css('.stat'));
    expect(statRows.length).toBe(2);
  });

  describe('clickSection', () =>
  {
    beforeEach(() =>
    {
      fixture.componentRef.setInput('pokemon', makePokemon());
      fixture.detectChanges();
    });

    it('opens the clicked tooltip and closes siblings in the same group', () =>
    {
      component.clickSection(0, 'left');
      expect(component.tooltipLeft()).toEqual([true, false]);

      component.clickSection(1, 'left');
      expect(component.tooltipLeft()).toEqual([false, true]);
    });

    it('closes the tooltip when clicking an already-open entry', () =>
    {
      component.clickSection(0, 'evol');
      expect(component.tooltipEvol()).toEqual([true]);

      component.clickSection(0, 'evol');
      expect(component.tooltipEvol()).toEqual([false]);
    });

    it('closes nested tooltipRightType and tooltipRightClass when closing a "right" entry', () =>
    {
      component.clickSection(0, 'right');
      component.clickSection(0, 'rightType', { stopPropagation: () => {} });
      component.clickSection(0, 'rightClass');
      expect(component.tooltipRight()[0]).toBe(true);
      expect(component.tooltipRightType()[0]).toBe(true);
      expect(component.tooltipRightClass()[0]).toBe(true);

      component.clickSection(0, 'right');
      expect(component.tooltipRight()[0]).toBe(false);
      expect(component.tooltipRightType()[0]).toBe(false);
      expect(component.tooltipRightClass()[0]).toBe(false);
    });
  });

  describe('closeAllProfileTooltips / closeAllTooltips', () =>
  {
    beforeEach(() =>
    {
      fixture.componentRef.setInput('pokemon', makePokemon());
      fixture.detectChanges();
    });

    it('closes all 8 tooltip groups, including tooltipRightClass', () =>
    {
      component.clickSection(0, 'evol');
      component.clickSection(0, 'types');
      component.clickSection(0, 'left');
      component.clickSection(0, 'middle');
      component.clickSection(0, 'right');
      component.clickSection(0, 'rightType', { stopPropagation: () => {} });
      component.clickSection(0, 'rightClass');
      component.clickSection(0, 'stat');

      component.closeAllProfileTooltips();

      expect(component.tooltipEvol()).toEqual([false]);
      expect(component.tooltipTypes().some(Boolean)).toBe(false);
      expect(component.tooltipLeft().some(Boolean)).toBe(false);
      expect(component.tooltipMiddle()).toEqual([false]);
      expect(component.tooltipRight().some(Boolean)).toBe(false);
      expect(component.tooltipRightType().some(Boolean)).toBe(false);
      expect(component.tooltipRightClass().some(Boolean)).toBe(false);
      expect(component.tooltipStats().some(Boolean)).toBe(false);
    });

    it('closeAllTooltips also closes showStats/showNotes and emits triggerNotesEvent(false)', () =>
    {
      component.setStatsVisible(true);
      component.setNotesVisible(true);
      const emitSpy = jest.spyOn(component.triggerNotesEvent, 'emit');

      component.closeAllTooltips();

      expect(component.showStats()).toEqual([false]);
      expect(component.showNotes()).toEqual([false]);
      expect(emitSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('setStatsVisible / setNotesVisible', () =>
  {
    beforeEach(() =>
    {
      fixture.componentRef.setInput('pokemon', makePokemon());
      fixture.detectChanges();
    });

    it('sets showStats/showNotes directly, bypassing the click guards', () =>
    {
      component.setStatsVisible(true);
      expect(component.showStats()).toEqual([true]);

      component.setNotesVisible(true);
      expect(component.showNotes()).toEqual([true]);

      component.setStatsVisible(false);
      expect(component.showStats()).toEqual([false]);
    });
  });

  describe('showStatsStart (bound statically from a parent template)', () =>
  {
    @Component(
    {
      template: `<app-pokemon-card [pokemon]="pokemon" [teamOptions]="teamOptions" [showStatsStart]="true"></app-pokemon-card>`,
      standalone: true,
      imports: [PokemonCardComponent]
    })
    class HostComponent
    {
      pokemon = makePokemon();
      teamOptions = teamOptions;
    }

    it('starts with stats expanded when [showStatsStart]="true" is bound from the parent', async () =>
    {
      const hostFixture = TestBed.createComponent(HostComponent);
      hostFixture.detectChanges();
      const card = hostFixture.debugElement.query(By.directive(PokemonCardComponent)).componentInstance as PokemonCardComponent;
      expect(card.showStats()).toEqual([true]);
    });
  });

  describe('linkify guard (effect-based lifecycle)', () =>
  {
    it('relinks on the first pokemon set', () =>
    {
      fixture.componentRef.setInput('pokemon', makePokemon());
      fixture.detectChanges();

      expect(linkifierService.linkifyProse).toHaveBeenCalled();
    });

    it('does not relink when only ivs/evs change (ability/item/moves references unchanged)', () =>
    {
      const pokemon = makePokemon();
      fixture.componentRef.setInput('pokemon', pokemon);
      fixture.detectChanges();
      linkifierService.linkifyProse.mockClear();

      const updated = { ...pokemon, ivs: [makeStat('hp', 31), makeStat('attack', 31)] };
      fixture.componentRef.setInput('pokemon', updated);
      fixture.detectChanges();

      expect(linkifierService.linkifyProse).not.toHaveBeenCalled();
    });

    it('relinks when a move slot reference changes', () =>
    {
      const pokemon = makePokemon();
      fixture.componentRef.setInput('pokemon', pokemon);
      fixture.detectChanges();
      linkifierService.linkifyProse.mockClear();

      const updated = { ...pokemon, moves: pokemon.moves.map((m, i) => i === 0 ? makeMove('move1-new') : m) };
      fixture.componentRef.setInput('pokemon', updated);
      fixture.detectChanges();

      expect(linkifierService.linkifyProse).toHaveBeenCalled();
    });
  });
});
