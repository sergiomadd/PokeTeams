import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamViewPageComponent } from './team-view-page.component';

describe('TeamViewPageComponent', () => {
  let component: TeamViewPageComponent;
  let fixture: ComponentFixture<TeamViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeamViewPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
