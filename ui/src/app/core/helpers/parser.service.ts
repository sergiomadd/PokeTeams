import { Injectable } from '@angular/core';
import { Pokemon } from '../models/pokemon/pokemon.model';
import { Stat } from '../models/pokemon/stat.model';
import { PokePaste } from '../models/team/pokePaste.model';
import { PokePasteData } from '../models/team/pokePasteData.model';

@Injectable({
  providedIn: 'root'
})
export class ParserService {

  constructor() { }

  parsePaste(paste: string): PokePasteData
  {
    let pokePasteData: PokePasteData = <PokePasteData>{}
    let pokemons = paste.split("\n\n");
    pokePasteData.pokemons = [];
    pokemons.forEach((pokemon) => 
    {
      if(pokemon.trim().length > 0)
      {
        pokePasteData.pokemons.push(this.parsePokemon(pokemon));
      }
    });
    return pokePasteData;
  }

  parsePokemon(pokemon: string): PokePaste
  {
    let pokePaste: PokePaste = <PokePaste>{}; 
    let lines = pokemon.split(/\r?\n|\r|\n/g);
    lines = lines.filter(str => str !== "");
    for(let i=0;i<lines.length;i++)
    {
      let line = lines[i];
      if(line.includes("@"))
      {
        this.getName(pokePaste, line);
        if(line.split(" @ ")[1].length > 0)
        {
          pokePaste.item = this.formatValue(line.split(" @ ")[1]);
        }
      }
      if(line.includes(":"))
      {
        if(line.includes("Ability") || line.includes("ability"))
        {
          pokePaste.ability = this.formatValue(line.split(":").slice(1).join(" "));
        }
        if(line.includes("Level") || line.includes("level"))
        {
          pokePaste.level = Number(this.formatValue(line.split(":").slice(1).join(" ")));
        }
        if(line.includes("Shiny") || line.includes("shiny"))
        {
          pokePaste.shiny = this.stringToBool(this.formatValue(line.split(":")[1], {whiteSpace: true}));
        }
        if(line.includes("EV") || line.includes("Ev") || line.includes("ev"))
        {
          pokePaste.evs = this.getStats(line, "ev");
        }
        if(line.includes("IV") || line.includes("Iv") || line.includes("iv"))
        {
          pokePaste.ivs = this.getStats(line, "iv");
        }
        if(line.includes("Tera") || line.includes("tera") || line.includes("Teratype") || line.includes("teratype"))
        {
          pokePaste.teratype = this.formatValue(line.split(":").slice(1).join(" "), {whiteSpace: true, lowercase: true});
        }
      }
      if(line.includes("Nature") || line.includes("nature"))
      {
        //pokePaste.nature = formatValue(lines[4].split(" ").slice(0, -1).join(" "));
        pokePaste.nature = this.formatValue(line.split("Nature")[0], {whiteSpace: true});
      }
    }
    pokePaste.moves = this.getMoves(lines.slice(lines.length-4, lines.length));
    if(!pokePaste.ivs) { pokePaste.ivs = this.getStats('', "noiv"); }
    pokePaste.source = pokemon;
    return pokePaste;
  }

  reversePaste(pokemons: (Pokemon | null | undefined)[]): string
  {
    let paste: string = "";
    pokemons.forEach(pokemon => 
    {
      if(pokemon)
      {
        paste = paste + this.reverseParsePokemon(pokemon) + "\n"  
      }
    });
    return paste;
  }

  reverseParsePokemon(pokemon: Pokemon): string
  {
    let pokePaste: string = ""
    pokePaste = pokePaste + this.getReverseName(pokemon);
    if(pokemon.ability){ pokePaste = pokePaste + `Ability: ${pokemon.ability.name.content}\n` }
    if(pokemon.level){pokePaste = pokePaste + `Level: ${pokemon.level}\n`}
    if(pokemon.shiny !== undefined)
    {
      if(pokemon.shiny) {pokePaste = pokePaste + `Shiny: Yes\n`}
      else {pokePaste = pokePaste + `Shiny: No\n`}
    }
    if(pokemon.teraType){pokePaste = pokePaste + `Tera Type: ${pokemon.teraType.name.content}\n`}
    if(pokemon.evs)
    {
      let evLine = "EVs:";
      let evs: string[] = []
      pokemon.evs.forEach((ev: Stat) => 
      {
        evs.push(` ${ev.value} ${this.matchStatIdentifierWithShortName(ev.identifier)} `)
      });
      evLine = evLine + evs.join("/") + "\n";
      pokePaste = pokePaste + evLine;
    }
    if(pokemon.nature){pokePaste = pokePaste + `${pokemon.nature.name.content} Nature\n`}
    if(pokemon.ivs)
    {
      let ivLine = "IVs:";
      let ivs: string[] = []
      pokemon.ivs.forEach((iv: Stat) => 
      {
        ivs.push(` ${iv.value} ${this.matchStatIdentifierWithShortName(iv.identifier)} `)
      });
      ivLine = ivLine + ivs.join("/") + "\n";
      pokePaste = pokePaste + ivLine;
    }
    if(pokemon.moves)
    {
      pokemon.moves.forEach(move => 
      {
        pokePaste = pokePaste + `- ${move?.name.content}\n`;
      });
    }
    return pokePaste;
  }

  getReverseName(pokemon: Pokemon) : string
  {
    let line: string = "";
    if(pokemon.nickname && pokemon.item)
    {
      line = `${pokemon.nickname} (${pokemon.name?.content}) @ ${pokemon.item?.name.content}` 
    }
    else if(pokemon.nickname)
    {
      line = `${pokemon.nickname} (${pokemon.name?.content})` 
    }
    else if(pokemon.item)
    {
      line = `${pokemon.name?.content} @ ${pokemon.item.name?.content}` 
    }
    else
    {
      line = `${pokemon.name?.content}` 
    }
    return line + "\n";
  }

  matchStatIdentifierWithShortName(identifier: string)
  {
    let statNames = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"];
    //let statIdentifiers = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];
    switch(identifier)
    {
      case "hp":
        return statNames[0];
      case "atk":
        return statNames[1];
      case "def":
        return statNames[2];
      case "spa":
        return statNames[3];
      case "spd":
        return statNames[4];
      case "spe":
        return statNames[5];
    }
    return ""
  }

  getName(pokePaste: PokePaste, line: string)
  {
    let profile: string = line.split(" @ ")[0];
    //Case 1: Only species name 'Mamoswine'
    if(!profile.includes("("))
    {
      pokePaste.name = this.formatValue(profile);
    }
    //Case 2: Species + nickname 'Pickle (Mamoswine)' {only 1 '('}
    else if(profile.includes("(") && profile.split("(").length === 2)
    {
      pokePaste.nickname = this.formatValue(profile.split("(")[0]);
      pokePaste.name = this.formatValue(profile.split("(")[1], {rightParen: true});
    }
    //Case 3: Species + nickname + gender 'Pickle (Mamoswine) (F)'  {2 '('}
    else if(profile.includes("(") && profile.split("(").length === 3)
    {
      pokePaste.nickname = this.formatValue(profile.split("(")[0]);
      pokePaste.name = this.formatValue(profile.split("(")[1], {rightParen: true});
      let genderString = this.formatValue(profile.split("(")[2], {rightParen: true});
      if(genderString === "female" || genderString === "Female" || genderString === "f" || genderString === "F")
      {
        pokePaste.gender = true;
      }
      else
      {
        pokePaste.gender = false;
      }
    }
    else
    {
      console.log(`Error: Pokemon profile ${profile} format not recognized.`)
    }
  }

  getMoves(lines: string[]) : string[]
  {
    let moves: string[] = [];
    for(let i=0;i<lines.length;i++)
    {
      let move = this.formatValue(lines[i].split("- ")[1], {});
      moves.push(move);
    }
    return moves;
  }



  getStats(line: string, type: string) : string[][]
  {
    let statNames = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"];
    let statIdentifiers = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];

    let stats: any[][] = [];
    if(type === 'noiv')
    {
      for(let i=0;i<statNames.length;i++)
      {
        let stat: (string | number)[] = [];
        stat.push(statIdentifiers[i]);
        stat.push(31);
        stats.push(stat);
      }
      return stats;
    }

    let singleStats = line.split(":")[1].split("/");
    for(let i=0;i<statNames.length;i++)
    {
      let stat: (string | number)[] = [];
      let statIndex = singleStats.findIndex(s => s.includes(statNames[i]));
      if(statIndex != -1)
      {
        stat.push(statIdentifiers[i]);
        stat.push(parseInt(singleStats[statIndex].split(" ")[1]));
      }
      else
      {
        stat.push(statIdentifiers[i]);
        stat.push((type=="ev") ? 0 : 31);
      }
      stats.push(stat);
    }
    return stats;
  }

  formatValue(value: string, options?: any): string
  {
    let newValue: string = value;

    if(options?.leftParen){ newValue = value.replace("(", "") }
    if(options?.rightParen){ newValue = value.replace(")", "") }
    if(options?.whiteSpace){ newValue = newValue.replaceAll(" ", "");}
    if(options?.lowercase){newValue = newValue.toLowerCase();}
    newValue = newValue?.trimStart();
    newValue = newValue?.trimEnd();

    return newValue;
  }

  stringToBool(string: string) : boolean
  {
    if(string === "Yes")
    {
      return true;
    }
    return false;
  }


}
