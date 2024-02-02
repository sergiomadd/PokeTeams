import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTeamsComponent } from './user-teams.component';

describe('UserTeamsComponent', () => {
  let component: UserTeamsComponent;
  let fixture: ComponentFixture<UserTeamsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserTeamsComponent]
    });
    fixture = TestBed.createComponent(UserTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
