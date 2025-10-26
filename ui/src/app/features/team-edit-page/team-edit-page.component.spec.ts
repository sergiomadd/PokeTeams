import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamEditPageComponent } from './team-edit-page.component';

describe('TeamEditPageComponent', () => {
  let component: TeamEditPageComponent;
  let fixture: ComponentFixture<TeamEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TeamEditPageComponent]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
