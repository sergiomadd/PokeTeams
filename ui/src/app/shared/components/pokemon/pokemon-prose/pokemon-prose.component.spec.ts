import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProcessedString } from '../../../../core/models/misc/processedString.model';
import { PokemonProseComponent } from './pokemon-prose.component';

@Component({
  template: `<app-pokemon-prose [chunks]="chunks" [iconClass]="iconClass"></app-pokemon-prose>`,
  standalone: true,
  imports: [PokemonProseComponent]
})
class HostComponent
{
  chunks: ProcessedString[] = [];
  iconClass = 'icon-s';
}

describe('PokemonProseComponent', () =>
{
  let host: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () =>
  {
    await TestBed.configureTestingModule(
    {
      imports: [HostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
  });

  it('should create', () =>
  {
    fixture.detectChanges();
    expect(host).toBeTruthy();
  });

  it('renders text chunks as plain text', () =>
  {
    host.chunks = [{ type: 'text', value: 'hello world' }];
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('hello world');
  });

  it('renders link chunks as anchors with the chunk path as href', () =>
  {
    host.chunks = [{ type: 'link', value: 'click me', path: '/somewhere' }];
    fixture.detectChanges();
    const anchor = fixture.debugElement.query(By.css('a'));
    expect(anchor).toBeTruthy();
    expect(anchor.nativeElement.getAttribute('href')).toBe('/somewhere');
    expect(anchor.nativeElement.textContent).toContain('click me');
  });

  it('renders img chunks with the provided iconClass', () =>
  {
    host.iconClass = 'icon';
    host.chunks = [{ type: 'img', value: 'alt text', path: 'icon.png' }];
    fixture.detectChanges();
    const img = fixture.debugElement.query(By.css('img'));
    expect(img).toBeTruthy();
    expect(img.nativeElement.getAttribute('src')).toBe('icon.png');
    expect(img.nativeElement.getAttribute('alt')).toBe('alt text');
    expect(img.nativeElement.classList).toContain('icon');
  });
});
