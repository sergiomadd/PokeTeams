import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentEditorComponent } from './tournament-editor.component';

describe('TournamentEditorComponent', () => {
  let component: TournamentEditorComponent;
  let fixture: ComponentFixture<TournamentEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TournamentEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TournamentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
