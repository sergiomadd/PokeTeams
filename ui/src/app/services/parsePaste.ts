import { splitNsName } from '@angular/compiler';
import { PokePaste } from '../models/pokePaste.model';
import { PokePasteData } from '../models/pokePasteData.model';
import { ComponentFactoryResolver } from '@angular/core';

export function parsePaste(paste: string): PokePasteData
{
  console.log("Input paste: ", paste);
  let pokePasteData: PokePasteData = <PokePasteData>{}
  let pokemons = paste.split("\n\n");
  pokePasteData.pokemons = [];
  console.log(paste)

  pokemons.forEach((pokemon) => 
  {
    let pokePaste: PokePaste = <PokePaste>{}; 
    let lines = pokemon.split(/\r?\n|\r|\n/g);
    for(let i=0;i<lines.length;i++)
    {
      let line = lines[i];
      if(line.includes("@"))
      {
        getName(pokePaste, line);
        if(line.split(" @ ")[1].length > 0)
        {
          pokePaste.item = formatValue(line.split(" @ ")[1]);
        }
      }
      if(line.includes(":"))
      {
        if(line.includes("Ability") || line.includes("ability"))
        {
          pokePaste.ability = formatValue(line.split(":").slice(1).join(" "));
        }
        if(line.includes("Level") || line.includes("level"))
        {
          pokePaste.level = Number(formatValue(line.split(":").slice(1).join(" ")));
        }
        if(line.includes("Shiny") || line.includes("shiny"))
        {
          pokePaste.shiny = stringToBool(line.split(":")[1]);
        }
        if(line.includes("EV") || line.includes("Ev") || line.includes("ev"))
        {
          pokePaste.evs = getStats(line, "ev");
        }
        if(line.includes("IV") || line.includes("Iv") || line.includes("iv"))
        {
          pokePaste.ivs = getStats(line, "iv");
        }
        if(line.includes("Tera") || line.includes("tera") || line.includes("Teratype") || line.includes("teratype"))
        {
          pokePaste.teratype = formatValue(line.split(":").slice(1).join(" "), {whiteSpace: true, lowercase: true});
        }
      }
      if(line.includes("Nature") || line.includes("nature"))
      {
        pokePaste.nature = formatValue(lines[4].split(" ").slice(0, -1).join(" "));
      }
    }
    pokePaste.moves = getMoves(lines.slice(lines.length-4, lines.length));
    if(!pokePaste.ivs) { pokePaste.ivs = getStats('', "noiv"); }
    pokePasteData.pokemons.push(pokePaste);
  });

  console.log("Generated paste: ", pokePasteData);
  return pokePasteData;
}

function getName(pokePaste: PokePaste, line: string)
{
  let profile: string = line.split(" @ ")[0];
  //Case 1: Only species name 'Mamoswine'
  if(!profile.includes("("))
  {
    pokePaste.name = formatValue(profile, {whiteSpace: true});
  }
  //Case 2: Species + nickname 'Pickle (Mamoswine)' (only 1 '(')
  else if(profile.includes("(") && profile.split("(").length === 2)
  {
    pokePaste.nickname = formatValue(profile.split("(")[0]);
    pokePaste.name = formatValue(profile.split("(")[1], {rightParen: true, whiteSpace: true});
  }
  //Case 3: Species + nickname + gender 'Pickle (Mamoswine) (F)'  (2 '(')
  else if(profile.includes("(") && profile.split("(").length === 3)
  {
    pokePaste.nickname = formatValue(profile.split("(")[0]);
    pokePaste.name = formatValue(profile.split("(")[1], {rightParen: true, whiteSpace: true});
    pokePaste.gender = formatValue(profile.split("(")[2], {rightParen: true});
  }
  else
  {
    console.log(`Error: Pokemon profile ${profile} format not recognized.`)
  }
}

function getMoves(lines: string[]) : string[]
{
  let moves = [];
  for(let i=0;i<lines.length;i++)
  {
    let move = formatValue(lines[i].split("- ")[1], {});
    moves.push(move);
  }
  return moves;
}

function getStats(line: string, type: string) : string[][]
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

function formatValue(value: string, options?: any): string
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

function stringToBool(string: string) : boolean
{
  if(string === "Yes")
  {
    return true;
  }
  return false;
}