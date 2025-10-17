import { Component, inject } from '@angular/core';
import { SeoService } from 'src/app/core/helpers/seo.service';

@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    standalone: false
})
export class PrivacyPolicyComponent 
{
  seo = inject(SeoService);
  
  ngOnInit()
  {
    this.seo.updateMetaData({
      title: "Privacy Policy",
      description: "Learn about privacy policy of the PokeTeams website, the information we collect and how its used, your rights and the cookie policies.",
      slug: "privacy-policy",
    });
  }
}
