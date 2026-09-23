import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Pokemon } from '../../../../core/models/pokemon/pokemon.model';
import { TypeWithEffectiveness } from '../../../../core/models/pokemon/typewitheffectiveness.model';
import { PokemonTypeBadgesComponent, TypeBadgeClickEvent } from './pokemon-type-badges.component';

function makeType(identifier: string): TypeWithEffectiveness
{
  return {
    identifier,
    name: { content: identifier, language: 'en' },
    iconPath: '',
    effectivenessAttack: undefined as unknown as TypeWithEffectiveness['effectivenessAttack'],
    effectivenessDefense: undefined as unknown as TypeWithEffectiveness['effectivenessDefense']
  };
}

function makePokemon(): Pokemon
{
  return {
    evolutions: [],
    moves: [],
    stats: [],
    ivs: [],
    evs: [],
    teraType: makeType('fire'),
    types: { type1: makeType('grass'), type2: undefined, dualEffectiveness: undefined }
  } as unknown as Pokemon;
}

@Component(
{
  template: `
    <ng-template #placeholderError></ng-template>
    <app-pokemon-type-badges
      [pokemon]="pokemon"
      [tooltipTeraVisible]="tooltipTeraVisible"
      [tooltipType1Visible]="tooltipType1Visible"
      [teratypeEnabled]="teratypeEnabled"
      [errorSvg]="errorSvg"
      (sectionClick)="lastEvent = $event">
    </app-pokemon-type-badges>
  `,
  standalone: true,
  imports: [PokemonTypeBadgesComponent]
})
class HostComponent
{
  @ViewChild('placeholderError', { static: true }) errorTemplate!: TemplateRef<unknown>;

  pokemon = makePokemon();
  tooltipTeraVisible = false;
  tooltipType1Visible = false;
  teratypeEnabled = false;
  lastEvent: TypeBadgeClickEvent | undefined;

  get errorSvg(): TemplateRef<unknown> | null
  {
    return this.errorTemplate ?? null;
  }
}

describe('PokemonTypeBadgesComponent', () =>
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

  it('emits a "types" sectionClick with index 0 when the tera-type badge is clicked', () =>
  {
    fixture.detectChanges();
    const sections = fixture.debugElement.queryAll(By.css('.section'));
    sections[0].nativeElement.click();
    expect(host.lastEvent).toEqual({ index: 0, type: 'types' });
  });

  it('emits a "types" sectionClick with index 1 when the type1 badge is clicked', () =>
  {
    fixture.detectChanges();
    const sections = fixture.debugElement.queryAll(By.css('.section'));
    sections[1].nativeElement.click();
    expect(host.lastEvent).toEqual({ index: 1, type: 'types' });
  });

  it('does not render a tera-type badge when the pokemon has none', () =>
  {
    host.pokemon = { ...host.pokemon, teraType: undefined } as Pokemon;
    fixture.detectChanges();
    const sections = fixture.debugElement.queryAll(By.css('.section'));
    expect(sections.length).toBe(1);
  });
});
