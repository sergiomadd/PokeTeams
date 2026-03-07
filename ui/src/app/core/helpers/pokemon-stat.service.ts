import { Injectable } from '@angular/core';
import { CalculatedStats } from '../models/pokemon/calculatedStats.model';
import { Nature } from '../models/pokemon/nature.model';
import { Pokemon } from '../models/pokemon/pokemon.model';
import { Stat } from '../models/pokemon/stat.model';
import { TeamOptions } from '../models/team/teamOptions.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonStatService
{
  calculateStats(pokemon?: Pokemon | null | undefined, teamOptions?: TeamOptions): CalculatedStats
  {
    let calculatedStats: CalculatedStats = 
    {
      base: [],
      ivs: [],
      evs: [],
      natures: [],
      total: []
    };
    
    if(pokemon?.stats && teamOptions)
    {
      pokemon?.stats.forEach((stat, index) => 
      {
        calculatedStats.base[index] = 
        {
          identifier: stat.identifier,
          name: stat.name,
          value: this.calculateBaseStat(stat, pokemon?.level ? pokemon.level : 50)
        }
        calculatedStats.ivs[index] = 
        {
          identifier: stat.identifier,
          name: stat.name,
          value: this.calculateIV(pokemon?.ivs && pokemon?.ivs.length > 0 ? pokemon.ivs[index].value : 0, pokemon?.level ? pokemon.level : 50)
        }
        calculatedStats.evs[index] = 
        {
          identifier: stat.identifier,
          name: stat.name,
          value: this.calculateEV(pokemon?.evs && pokemon?.evs.length > 0 ? pokemon.evs[index].value : 0, pokemon?.level ? pokemon.level : 50)
        }
        calculatedStats.natures[index] = 
        {
          identifier: stat.identifier,
          name: stat.name,
          value: this.getNatureValue(stat, pokemon?.nature)
        }
        calculatedStats.total[index] = 
        {
          identifier: stat.identifier,
          name: stat.name,
          value: this.calculateStat(
            stat.value, 
            pokemon?.level ? pokemon.level : 50,
            teamOptions?.ivsVisibility ? pokemon?.ivs && pokemon?.ivs.length > 0 ? pokemon.ivs[index].value : 0 : 0,
            teamOptions?.evsVisibility ? pokemon?.evs && pokemon?.evs.length > 0 ? pokemon.evs[index].value : 0 : 0, 
            teamOptions?.naturesVisibility ? pokemon?.nature ? calculatedStats.natures[index].value : 1 : 1,
            stat.identifier === "hp" ? true : false)
        }
      });
    }

    return calculatedStats;
  }
  
  calculateStat(base: number, inlevel: number, iv: number, ev: number, nature: number, hp: boolean) : number
  {
    let level = Number(inlevel)
    let total: number;
    //HP: ((2 * base + iv + (ev/4)) * level) / 100) + level + 10
    if(hp)
    {
      total = Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + level + 10;
    }
    //Rest: ((((2 * base + iv + (ev/4)) * level) / 100) + 5) * nature
    else
    {
      total = Math.floor((Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5) * nature);
    }
    return total;
  }

  //Calculate base stat value at a given level
  calculateBaseStat(baseStat: Stat, level?: number) : number
  {
    return this.calculateStat(baseStat.value, level ? level : 50, 0, 0, 1, baseStat.identifier === "hp" ? true : false);
  }

  calculateIV(iv: number, level?: number) : number
  {
    return Math.floor((iv * (level ? level : 50)) / 100);
  }

  calculateEV(ev: number, level?: number) : number
  {
    return Math.ceil((Math.floor(ev / 4) * (level ? level : 50)) / 100);
  }

  getNatureValue(baseStat?: Stat, nature?: Nature) : number
  {
    let natureValue: number;
    if(baseStat)
    {
      if(nature ? nature.increasedStatIdentifier === baseStat.identifier && nature.decreasedStatIdentifier === baseStat.identifier : false)
      {
        natureValue = 1;
      }
      else if(nature ? nature.increasedStatIdentifier === baseStat.identifier : false)
      {
        natureValue = 1.1;
      }
      else if(nature ? nature.decreasedStatIdentifier === baseStat.identifier : false)
      {
        natureValue = 0.9;
      }
      else
      {
        natureValue = 1;
      }
    }
    else
    {
      natureValue = 1;
    }
    return natureValue;
  }
}
