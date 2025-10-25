import { Component, inject } from '@angular/core';
import { SeoService } from '../../../../core/helpers/seo.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html'
})
export class AboutComponent 
{
  seo = inject(SeoService);
  
  ngOnInit()
  {
    this.seo.updateMetaData({
      title: "About",
      description: "Learn about the PokeTeams proyect aim and definion, and an explanation of the features of the website. Also a contact section to report issues.",
      slug: "About",
    });
  }
}
