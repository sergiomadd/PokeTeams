import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTableComponent } from './team-table.component';

describe('TeamTableComponent', () => {
  let component: TeamTableComponent;
  let fixture: ComponentFixture<TeamTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TeamTableComponent]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
