import { TestBed } from '@angular/core/testing';

import { TeamEditorService } from './team-editor.service';

describe('TeamEditorService', () => {
  let service: TeamEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
