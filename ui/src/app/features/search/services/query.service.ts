import { inject, Injectable } from '@angular/core';
import { PokemonService } from '../../pokemon/services/pokemon.service';
import { Tag } from '../../team/models/tag.model';
import { TeamService } from '../../team/services/team.service';
import { UserService } from '../../user/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class QueryService 
{
  pokemonService = inject(PokemonService);
  userService = inject(UserService);
  teamService = inject(TeamService);
  
  constructor() { }

  //User

  queryUserCallback = async (args: any): Promise<Tag[]> => 
  {
    return (await this.userService.queryUser(args)).map((u): Tag => 
      ({
        name: u.username,
        identifier: u.username,
        icon: u.picture,
        type: "username"
      }));
  }

  //Team
  
  queryTournamentCallback = async (args: any): Promise<Tag[]> => 
  {
    return await this.teamService.queryTournamentsByName(args);
  }

  queryRegulationCallback = async (args: any): Promise<Tag[]> => 
  {
    return (await this.teamService.getAllRegulations())
      .filter(r => 
      {
        return r.name.toLowerCase().includes(args.toLowerCase())
      });
  }
  regulationAllCallback = async (): Promise<Tag[]> => 
  {
    return await this.teamService.getAllRegulations();
  }

  queryTagCallback = async (args: any): Promise<Tag[]> => 
  {
    return (await this.teamService.getAllTags())
      .filter(r => 
      {
        return r.name.toLowerCase().includes(args.toLowerCase())
      });
  }
  tagAllCallback = async (): Promise<Tag[]> => 
  {
    return await this.teamService.getAllTags();
  }

  //Pokemon

  queryPokemonCallback = async (args: any): Promise<Tag[]> => 
  {
    if(args)
    {
      return (await this.pokemonService.queryPokemonsByName(args)).map(p => 
        ({
          name: p.name,
          identifier: p.identifier,
          icon: p.icon,
          type: p.type
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

  queryAbilityCallback = async (args: any): Promise<Tag[]> => 
  {
    if(args)
    {
      return (await this.pokemonService.queryAbilitiesByName(args));
    }
    return [];
  }
  abilityAllCallback = async (): Promise<Tag[]> => 
  {
    return (await this.pokemonService.getAllAbilities());

  }
  pokemonAbilitiesCallback = async (id): Promise<Tag[]> => 
  {
    if(id != undefined)
    {
      return (await this.pokemonService.getPokemonAbilities(id)).map(n => 
        ({
          name: n.name,
          identifier: n.name,
          icon: n.icon
        }));
    }
    return [];
  }

  queryNatureCallback = async (args: any): Promise<Tag[]> => 
  {
    if(args)
    {
      return (await this.pokemonService.queryNaturesByName(args));
    }
    return [];
  }
  naturesAllCallback = async (): Promise<Tag[]> => 
  {
    return (await this.pokemonService.getAllNatures()).map(n => 
      ({
        name: n.name,
        identifier: n.name
      }));
  }

  queryTeratypeCallback = async (args: any): Promise<Tag[]> => 
  {
    if(args)
    {
      return (await this.pokemonService.queryTeraTypesByName(args));
    }
    return [];
  }
  teraTypesAllCallback = async (): Promise<Tag[]> => 
  {
    return (await this.pokemonService.getAllTeraTypes()).map(n => 
      ({
        name: n.name,
        identifier: n.name,
        icon: n.iconPath
      }));
  }
}
