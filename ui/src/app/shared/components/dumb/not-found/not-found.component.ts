import { Component, inject, input } from '@angular/core';
import { WindowService } from '../../../../core/helpers/window.service';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss',
    imports: [NgClass, RouterLink, TranslatePipe]
})
export class NotFoundComponent 
{
  window = inject(WindowService);

  readonly resourceName = input<string>();
}
