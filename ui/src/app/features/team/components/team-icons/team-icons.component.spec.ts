import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamIconsComponent } from './team-icons.component';

describe('TeamIconsComponent', () => {
  let component: TeamIconsComponent;
  let fixture: ComponentFixture<TeamIconsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamIconsComponent]
    });
    fixture = TestBed.createComponent(TeamIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
