import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PaginationComponent } from './pagination.component';

@Component({
  template: `
    <app-pagination
      [itemsPerPage]="itemsPerPage"
      [totalItems]="totalItems"
      (pageChanged)="changePage($event)">
    </app-pagination>
  `,
  imports: [PaginationComponent],
  standalone: true
})
class HostComponent
{
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 100;

  pageChanged: number | null = null;
  changePage(page: number)
  {
    this.pageChanged = page;
  }
}

//Helper functions
function getButtons(fixture: ComponentFixture<any>) 
{
  return fixture.debugElement.queryAll(By.css('button.page'));
}

describe('PaginationComponent', () => 
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });
  
  it('should select page 1 by default', () => 
  {
    const firstPage = fixture.debugElement.query(
      By.css('button.page.selected')
    );

    expect(firstPage.nativeElement.textContent.trim()).toBe('1');
  });

  it('should emit pageChanged when clicking a page', () => 
  {
    const page2 = fixture.debugElement.queryAll(
      By.css('button.page')
    ).find(btn => btn.nativeElement.textContent.trim() === '2');

    page2!.nativeElement.click();
    fixture.detectChanges();

    expect(host.pageChanged).toBe(2);
  });

  it('should go to next page when clicking >', () => 
  {
    const nextButton = fixture.debugElement.queryAll(
      By.css('button.page')
    ).find(btn => btn.nativeElement.textContent.trim() === '>');

    nextButton!.nativeElement.click();
    fixture.detectChanges();

    expect(host.pageChanged).toBe(2);
  });

  it('should disable previous button on first page', () => 
  {
    const prevButton = fixture.debugElement.queryAll(
      By.css('button.page')
    ).find(btn => btn.nativeElement.textContent.trim() === '<');

    expect(prevButton!.nativeElement.disabled).toBe(true);
  });

  it('should disable next button on last page', () => 
  {
    host.itemsPerPage = 10;
    host.totalItems = 10; // only 1 page
    fixture.detectChanges();

    const nextButton = fixture.debugElement.queryAll(
      By.css('button.page')
    ).find(btn => btn.nativeElement.textContent.trim() === '>');

    expect(nextButton!.nativeElement.disabled).toBe(true);
  });

  it('should update selected class after page change', () => 
  {
    const page3 = fixture.debugElement.queryAll(
      By.css('button.page')
    ).find(btn => btn.nativeElement.textContent.trim() === '3');

    page3!.nativeElement.click();
    fixture.detectChanges();

    const selected = fixture.debugElement.query(
      By.css('button.page.selected')
    );

    expect(selected.nativeElement.textContent.trim()).toBe('3');
  });
});
