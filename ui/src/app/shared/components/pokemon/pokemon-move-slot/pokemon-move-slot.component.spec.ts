import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Move } from '../../../../core/models/pokemon/move.model';
import { Pokemon } from '../../../../core/models/pokemon/pokemon.model';
import { PokemonMoveSlotComponent, MoveSectionClickEvent } from './pokemon-move-slot.component';

function makeMove(identifier: string, overrides: Partial<Move> = {}): Move
{
  return {
    identifier,
    name: { content: identifier, language: 'en' },
    pokeType: { identifier: 'normal' },
    ...overrides
  } as Move;
}

function makePokemon(): Pokemon
{
  return { evolutions: [], moves: [], stats: [], ivs: [], evs: [] } as unknown as Pokemon;
}

@Component(
{
  template: `
    <ng-template #placeholderError></ng-template>
    <app-pokemon-move-slot
      [move]="move"
      [index]="index"
      [pokemon]="pokemon"
      [tooltipVisible]="tooltipVisible"
      [tooltipTypeVisible]="tooltipTypeVisible"
      [tooltipClassVisible]="tooltipClassVisible"
      [moveEffectShort]="moveEffectShort"
      [moveTarget]="moveTarget"
      [errorSvg]="errorSvg"
      (sectionClick)="lastEvent = $event">
    </app-pokemon-move-slot>
  `,
  standalone: true,
  imports: [PokemonMoveSlotComponent]
})
class HostComponent
{
  @ViewChild('placeholderError', { static: true }) errorTemplate!: TemplateRef<unknown>;

  move = makeMove('tackle');
  index = 0;
  pokemon = makePokemon();
  tooltipVisible = false;
  tooltipTypeVisible = false;
  tooltipClassVisible = false;
  moveEffectShort: unknown[] = [];
  moveTarget: unknown[] = [];
  lastEvent: MoveSectionClickEvent | undefined;

  get errorSvg(): TemplateRef<unknown> | null
  {
    return this.errorTemplate ?? null;
  }
}

describe('PokemonMoveSlotComponent', () =>
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

  it('renders the move name', () =>
  {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('tackle');
  });

  it('emits a "right" sectionClick with this move\'s index when clicked', () =>
  {
    fixture.detectChanges();
    const root = fixture.debugElement.query(By.css('.move'));
    root.parent!.nativeElement.click();
    expect(host.lastEvent).toEqual({ index: 0, type: 'right' });
  });

  it('does not emit a "right" click for an error-identifier move', () =>
  {
    host.move = makeMove('error');
    fixture.detectChanges();
    const root = fixture.debugElement.query(By.css('.move'));
    root.parent!.nativeElement.click();
    expect(host.lastEvent).toBeUndefined();
  });
});
