import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../../../core/helpers/theme.service';
import { UtilService } from '../../../../core/helpers/util.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { TeamService } from '../../../../core/services/team.service';
import { ChipComponent } from '../chip/chip.component';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { TagEditorComponent } from './tag-editor.component';

@Component({
  template: `
    <app-tag-editor
      [visible]="visible"
      (addEvent)="onAdd($event)"
      (closeEvent)="onClose()"
    ></app-tag-editor>
  `,
  standalone: true,
  imports: [TagEditorComponent, ColorPickerComponent, ChipComponent]
})
class HostComponent 
{
  visible = true;
  addedTag: any = null;
  closed = false;

  onAdd(tag: any) 
  {
    this.addedTag = tag;
  }

  onClose() 
  {
    this.closed = true;
  }
}

class MockThemeService
{
  
}

class MockUtilService
{
  getAuthFormError = jest.fn();
}

class MockWindowService
{
  isTabletLandscapeOrLess = jest.fn();
}

class MockTeamService
{
  checkTagAvailable = jest.fn();
}

describe('TagEditorComponent', () => 
{
  let host: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  let themeService: ThemeService;
  let teamService: TeamService;
  let util: UtilService;
  let window: WindowService;

  beforeEach(async () => 
  {
    await TestBed.configureTestingModule(
    {
      imports: [HostComponent, TranslateModule.forRoot()],
      providers: 
      [
        { provide: ThemeService, useClass: MockThemeService },
        { provide: UtilService, useClass: MockUtilService },
        { provide: WindowService, useClass: MockWindowService },
        { provide: TeamService, useClass: MockTeamService },
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(HostComponent);

    themeService = TestBed.inject(ThemeService);    
    teamService = TestBed.inject(TeamService);    
    util = TestBed.inject(UtilService);    
    window = TestBed.inject(WindowService);    


    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should show the editor when visible=true', () => 
  {
    const editor = fixture.debugElement.query(By.css('.tag-editor'));
    expect(editor.nativeElement.classList).toContain('tag-editor-visible');
  });

  it('should toggle color picker', () => 
  {
    const toggleBtn = fixture.debugElement.query(By.css('button.button-secondary'));
    const editorComp = fixture.debugElement.query(By.directive(TagEditorComponent)).componentInstance;

    expect(editorComp.colorPickerOpen).toBe(false);

    toggleBtn.nativeElement.click();
    fixture.detectChanges();

    expect(editorComp.colorPickerOpen).toBe(true);
  });

  it('should call closeEvent on close button click', () => 
  {
    const closeBtn = fixture.debugElement.query(By.css('button.close'));
    closeBtn.nativeElement.click();
    fixture.detectChanges();

    expect(host.closed).toBe(true);
  });

  it('should add a tag when form is valid', async () => 
  {
    const editorComp = fixture.debugElement.query(By.directive(TagEditorComponent)).componentInstance;

    editorComp.form.controls['name'].setValue('Test Tag');
    editorComp.form.controls['desc'].setValue('Test Description');

    jest.spyOn(editorComp.teamService, 'checkTagAvailable').mockReturnValue(Promise.resolve(true));

    await editorComp.add();

    expect(host.addedTag).toBeTruthy();
    expect(host.addedTag.name).toBe('Test Tag');
  });

  it('should mark name as error when tag is taken', async () => 
  {
    const editorComp = fixture.debugElement.query(By.directive(TagEditorComponent)).componentInstance;

    editorComp.form.controls['name'].setValue('Duplicate Tag');

    jest.spyOn(editorComp.teamService, 'checkTagAvailable').mockReturnValue(Promise.resolve(false));

    await editorComp.add();
    fixture.detectChanges();

    expect(editorComp.form.controls['name'].errors).toEqual({ tagTaken: true });
  });

  it('should reset the editor', () => 
  {
    const editorComp = fixture.debugElement.query(By.directive(TagEditorComponent)).componentInstance;

    editorComp.form.controls['name'].setValue('Test');
    editorComp.form.controls['desc'].setValue('Desc');
    editorComp.colorPickerOpen = true;

    editorComp.resetEditor();

    expect(editorComp.form.controls['name'].value).toBe('');
    expect(editorComp.form.controls['desc'].value).toBe('');
    expect(editorComp.colorPickerOpen).toBe(false);
  });
});
