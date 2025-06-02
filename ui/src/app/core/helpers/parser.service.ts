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
    this.getName(pokePaste, lines[0]);
    for(let i=0;i<lines.length;i++)
    {
      let line = lines[i];
      if(line.includes("@") && line.split(" @ ")[1].length > 0)
      {
        pokePaste.item = this.formatValue(line.split(" @ ")[1]);
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
    if(!pokePaste.evs) { pokePaste.evs = this.getStats('', "noev"); }
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
    if(pokemon.shiny)
    {
      if(pokemon.shiny) {pokePaste = pokePaste + `Shiny: Yes\n`}
    }
    if(pokemon.teraType){pokePaste = pokePaste + `Tera Type: ${pokemon.teraType.name.content}\n`}
    if(pokemon.evs && pokemon.evs.some(e => e.value > 0))
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
    if(pokemon.ivs && pokemon.ivs.some(i => i.value > 0 && i.value !== 31))
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
    let name: string | undefined = pokemon.formId ? pokemon.name?.content.split(" ").join("-") : pokemon.name?.content
    if(pokemon.nickname && pokemon.item)
    {
      line = `${pokemon.nickname} (${name}) @ ${pokemon.item?.name.content}` 
    }
    else if(pokemon.nickname)
    {
      line = `${pokemon.nickname} (${name})` 
    }
    else if(pokemon.item)
    {
      line = `${name} @ ${pokemon.item.name?.content}` 
    }
    else
    {
      line = `${name}` 
    }
    return line + "\n";
  }

  matchStatIdentifierWithShortName(identifier: string)
  {
    let statNames = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"];
    let statIdentifiers = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];
    switch(identifier)
    {
      case statIdentifiers[0]:
        return statNames[0];
      case statIdentifiers[1]:
        return statNames[1];
      case statIdentifiers[2]:
        return statNames[2];
      case statIdentifiers[3]:
        return statNames[3];
      case statIdentifiers[4]:
        return statNames[4];
      case statIdentifiers[5]:
        return statNames[5];
    }
    return ""
  }

  getName(pokePaste: PokePaste, line: string)
  {
    let profile: string;
    profile = line.split(" @ ")[0]
    console.log("profile ", profile)
    //Only species name 'Mamoswine'
    if(!profile.includes("("))
    {
      pokePaste.name = this.formatValue(profile, {onlyOneWhiteSpace: true});
    }
    //Species + nickname 'Pickle (Mamoswine)' {only 1 '('}
    //OR Species + gender 'Mamoswine (F)' {only 1 '('}
    else if(profile.includes("(") && profile.split("(").length === 2)
    {
      let genderString = this.formatValue(profile.split("(")[1], {rightParen: true});
      console.log(genderString);
      if(genderString === "female" || genderString === "Female" || genderString === "f" || genderString === "F")
      {
        pokePaste.gender = true;
        pokePaste.name = this.formatValue(profile.split("(")[0], {rightParen: true});
      }
      else if(genderString === "male" || genderString === "Male" || genderString === "m" || genderString === "M")
      {
        pokePaste.gender = false;
        pokePaste.name = this.formatValue(profile.split("(")[0], {rightParen: true});
      }
      else
      {
        pokePaste.nickname = this.formatValue(profile.split("(")[0]);
        pokePaste.name = this.formatValue(profile.split("(")[1], {rightParen: true});
        pokePaste.gender = false;
      }
    }
    //Species + nickname + gender 'Pickle (Mamoswine) (F)'  {2 '('}
    else if(profile.includes("(") && profile.split("(").length === 3)
    {
      pokePaste.nickname = this.formatValue(profile.split("(")[0]);
      pokePaste.name = this.formatValue(profile.split("(")[1], {rightParen: true});
      let genderString = this.formatValue(profile.split("(")[2], {rightParen: true});
      if(genderString === "female" || genderString === "Female" || genderString === "f" || genderString === "F")
      {
        pokePaste.gender = true;
      }
      else if(genderString === "male" || genderString === "Male" || genderString === "m" || genderString === "M")
      {
        pokePaste.gender = false;
      }
      else
      {
        pokePaste.gender = false;
      }
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

    if(type === 'noev')
    {
      for(let i=0;i<statNames.length;i++)
      {
        let stat: (string | number)[] = [];
        stat.push(statIdentifiers[i]);
        stat.push(0);
        stats.push(stat);
      }
      return stats;
    }

    let singleStats = line.split(":")[1].split("/");
    for(let i=0; i<statNames.length; i++)
    {
      let stat: (string | number)[] = [];
      //Get index incase missing stats => HP / {NONE} / DEF
      let statIndex = singleStats.findIndex(s => s.includes(statNames[i]));
      if(statIndex != -1)
      {
        stat.push(statIdentifiers[i]);
        stat.push(parseInt(singleStats[statIndex].split(" ")[1].trim()));
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
    if(options?.onlyOneWhiteSpace)
    {
      let wordList = newValue.split(" ");
      wordList = wordList.filter(w => w !== "" && w !== " ");
      newValue = wordList.join(" ");
    }
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
