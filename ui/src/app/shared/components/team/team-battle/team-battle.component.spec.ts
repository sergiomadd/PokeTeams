import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamBattleComponent } from './team-battle.component';

describe('TeamBattleComponent', () => {
  let component: TeamBattleComponent;
  let fixture: ComponentFixture<TeamBattleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TeamBattleComponent]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamBattleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
