import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentPreviewComponent } from './tournament-preview.component';

describe('TournamentPreviewComponent', () => {
  let component: TournamentPreviewComponent;
  let fixture: ComponentFixture<TournamentPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TournamentPreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TournamentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
