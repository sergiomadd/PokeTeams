import { inject, Injectable } from '@angular/core';
import { Tag } from '../models/tag.model';
import { PokemonService } from './pokemon.service';
import { TeamService } from './team.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class QueryService 
{
  pokemonService = inject(PokemonService);
  userService = inject(UserService);
  teamService = inject(TeamService);
  
  constructor() { }

  customQueryResult: Tag = 
  {
    name: "Custom value",
    identifier: "custom"
  }

  //Callbacks for search

  queryUserCallback = async (args: any): Promise<Tag[]> => 
  {
    return (await this.userService.queryUser(args)).map((u): Tag => 
      ({
        name: u.username,
        identifier: u.username,
        icon: u.picture
      })).concat([this.customQueryResult]);
  }

  queryTournamentCallback = async (args: any): Promise<Tag[]> => 
  {
    return (await this.teamService.queryTournamentsByName(args)).map(t => 
      ({
        name: t.name,
        identifier: t.identifier,
        icon: t.icon
      }));
  }

  queryRegulationCallback = async (args: any): Promise<Tag[]> => 
  {
    return (await this.teamService.getAllRegulations())
      .filter(r => 
      {
        return r.name.toLowerCase().includes(args.toLowerCase())
      })
      .map(r =>({
        name: r.name,
        identifier: r.identifier
      }));
  }
  regulationAllCallback = async (): Promise<Tag[]> => 
  {
    return (await this.teamService.getAllRegulations()).map(r => 
      ({
        name: r.name,
        identifier: r.identifier
      }));
  }

  queryPokemonCallback = async (args: any): Promise<Tag[]> => 
  {
    if(args)
    {
      return (await this.pokemonService.queryPokemonsByName(args)).map(p => 
        ({
          name: p.name,
          identifier: p.identifier,
          icon: p.icon
        }));
    }
    return [];
  }

  queryMoveCallback = async (args: any): Promise<Tag[]> => 
  {
    if(args)
    {
      return (await this.pokemonService.queryMovesByName(args));
    }
    return [];
  }

  queryItemCallback = async (args: any): Promise<Tag[]> => 
  {
    if(args)
    {
      return (await this.pokemonService.queryItemsByName(args));
    }
    return [];
  }
}
