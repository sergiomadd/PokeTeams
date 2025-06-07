import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

interface MetaDataConfig
{
  title?: string,
  description?: string,
  image?: string,
  slug?: string,
  keywords?: string
}

@Injectable({
  providedIn: 'root'
})
export class SeoService 
{
  constructor(private meta: Meta, private title: Title) {}

  updateMetaData(config?: MetaDataConfig)
  {
    const baseUrl = 'https://poketeams.com';

    //Angular doesnt auto remove tags when navigating with router
    this.meta.removeTag("name='description'");
    this.meta.removeTag("property='og:title'");
    this.meta.removeTag("property='og:description'");
    this.meta.removeTag("name='twitter:title'");
    this.meta.removeTag("name='twitter:description'");

    this.title.setTitle(config?.title || 'PokeTeams');

    this.meta.updateTag({ name: 'description', content: config?.description || '' });
    this.meta.updateTag({ name: 'keywords', content: config?.keywords || 'Pokemon, Pokepastes, VGC, PokeTeam, Team' });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: config?.title || 'PokeTeams' });
    this.meta.updateTag({ property: 'og:description', content: config?.description || 'PokeTeams is an free and open source website aimed at helping players learn and play with a specific pokemon team. It also allows for saving and sharing your pokemon teams, letting you have your pokepastes stored all in the same place.' });
    this.meta.updateTag({ property: 'og:image', content: config?.image || 'https://poketeams.com/assets/img/logo.png' });
    this.meta.updateTag({ property: 'og:url', content: `${baseUrl}/${config?.slug || ''}` });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config?.title || 'PokeTeams' });
    this.meta.updateTag({ name: 'twitter:description', content: config?.description || 'PokeTeams is an free and open source website aimed at helping players learn and play with a specific pokemon team. It also allows for saving and sharing your pokemon teams, letting you have your pokepastes stored all in the same place.' });
    this.meta.updateTag({ name: 'twitter:image', content: config?.image || 'https://poketeams.com/assets/img/logo.png' });
  }
}
