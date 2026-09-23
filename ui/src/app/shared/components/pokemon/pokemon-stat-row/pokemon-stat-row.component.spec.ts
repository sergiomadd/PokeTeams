import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CalculatedStats } from '../../../../core/models/pokemon/calculatedStats.model';
import { Pokemon } from '../../../../core/models/pokemon/pokemon.model';
import { Stat } from '../../../../core/models/pokemon/stat.model';
import { TeamOptions } from '../../../../core/models/team/teamOptions.model';
import { PokemonStatRowComponent } from './pokemon-stat-row.component';

function makeStat(identifier: string, value: number): Stat
{
  return { identifier, name: { content: identifier, language: 'en' }, value };
}

const calculatedStats: CalculatedStats =
{
  base: [makeStat('hp', 50)],
  ivs: [makeStat('hp', 31)],
  evs: [makeStat('hp', 4)],
  natures: [],
  total: [makeStat('hp', 120)]
};

function makePokemon(overrides: Partial<Pokemon> = {}): Pokemon
{
  return {
    evolutions: [],
    moves: [],
    stats: [makeStat('hp', 1)],
    ivs: [makeStat('hp', 31)],
    evs: [makeStat('hp', 4)],
    level: 50,
    calculatedStats,
    ...overrides
  } as Pokemon;
}

@Component(
{
  template: `<app-pokemon-stat-row
    [pokemon]="pokemon"
    [teamOptions]="teamOptions"
    [stat]="stat"
    [index]="index"
    [tooltipVisible]="tooltipVisible"
    [compareTeam]="compareTeam"
    (statClick)="clicks = clicks + 1">
  </app-pokemon-stat-row>`,
  standalone: true,
  imports: [PokemonStatRowComponent]
})
class HostComponent
{
  pokemon = makePokemon();
  teamOptions = { showIVs: true, showEVs: true, showNature: true, ivsVisibility: true, evsVisibility: true, naturesVisibility: true } as TeamOptions;
  stat = makeStat('hp', 1);
  index = 0;
  tooltipVisible = false;
  compareTeam: string | undefined = undefined;
  clicks = 0;
}

describe('PokemonStatRowComponent', () =>
{
  let host: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () =>
  {
    await TestBed.configureTestingModule(
    {
      imports: [HostComponent, TranslateModule.forRoot()],
      providers: [provideMockStore({ initialState: { config: { lang: 'en' } } })]
    }).compileComponents();

    TestBed.inject(MockStore);
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
  });

  it('should create', () =>
  {
    fixture.detectChanges();
    expect(host).toBeTruthy();
  });

  it('renders the stat code and total value', () =>
  {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('120');
  });

  it('emits statClick when the row is clicked', () =>
  {
    fixture.detectChanges();
    const row = fixture.debugElement.query(By.css('.no-pad.section'));
    row.nativeElement.click();
    expect(host.clicks).toBe(1);
  });

  it('renders three stat bars (base/iv/ev) when teamOptions enables all of them', () =>
  {
    fixture.detectChanges();
    const bars = fixture.debugElement.queryAll(By.css('.bar'));
    expect(bars.length).toBe(3);
  });
});
