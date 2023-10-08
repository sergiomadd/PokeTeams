import { PokePaste } from '../models/pokePaste.model';
import { PokePasteData } from '../models/pokePasteData.model';

export function parsePaste(paste: string): PokePasteData
{
  let pokePasteData: PokePasteData = <PokePasteData>{}

  console.log("Input paste: ", paste);

  let pokemons = paste.split("\n\n");
  console.log('pokemons', pokemons);
  pokePasteData.pokemons = [];

  pokemons.forEach((pokemon, index) => 
  {
    let pokePaste: PokePaste = <PokePaste>{}; 

    let lines = pokemon.split(/\r?\n|\r|\n/g);
    console.log('lines', lines);
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
          pokePaste.ability = formatValue(line.split(" ").slice(1).join(" "));
        }
        if(line.includes("Level") || line.includes("level"))
        {
          pokePaste.level = Number(formatValue(line.split(" ").slice(1).join(" ")));
        }
        if(line.includes("Shiny") || line.includes("shiny"))
        {
          pokePaste.shiny = stringToBool(line.split(" ")[1]);
        }
        if(line.includes("EV") || line.includes("Ev") || line.includes("ev"))
        {
          pokePaste.evs = getStats(line, "ev");
        }
        if(line.includes("IV") || line.includes("Iv") || line.includes("iv"))
        {
          pokePaste.ivs = getStats(line, "iv");
        }
        if(line.includes("Tera") || line.includes("tera"))
        {
          pokePaste.teratype = formatValue(line.split(" ").slice(1).join(" "));
        }
      }
      if(line.includes("Nature") || line.includes("nature"))
      {
        pokePaste.nature = formatValue(lines[4].split(" ").slice(0, -1).join(" "));
      }
    }
    pokePaste.moves = getMoves(lines.slice(lines.length-4, lines.length));

    pokePasteData.pokemons.push(pokePaste);
  });


  console.log("Generated paste: ", pokePasteData);
  return pokePasteData;
}

function getName(pokePaste: PokePaste, line: string)
{
  //Handle Exception: "Type: Null"
  let profile = line.split(" @ ")[0];
  //Case 1: Only species name
  if(!profile.includes("("))
  {
    pokePaste.name = formatValue(profile);
  }
  else if(profile.includes("(") && profile.split("(").length === 2)
  {
    pokePaste.nickname = formatValue(profile.split("(")[0]);
    pokePaste.name = formatValue(profile.split("(")[1]);
  }
  else if(profile.includes("(") && profile.split("(").length === 3)
  {
    pokePaste.nickname = formatValue(profile.split("(")[0]);
    pokePaste.name = formatValue(profile.split("(")[1]);
    pokePaste.gender = formatValue(profile.split("(")[2]);
  }
  else
  {
    console.log(`Error: Pokemon profile ${profile} format not recognized. Too many parenthesis`)
  }
}

function getMoves(lines: string[]) : object[]
{
  let moves = [];
  for(let i=0;i<lines.length;i++)
  {
    let move = 
    {
      id: i,
      name: formatValue(lines[i].split("- ")[1]),
    };
    moves.push(move);
  }
  return moves;
}

function getStats(line: string, type: string) : any[]
{
  let statNames = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"];
  let temp = line.split(":")[1].split("/");
  console.log(temp);
  let list = [];
  for(let i=0;i<temp.length;i++)
  {
    let stat = temp[i].split(" ");
    let ev = 
    {
      name: stat[2],
      value: parseInt(stat[1])
    }
    list.push(ev);
  }
  for(let i=0;i<statNames.length;i++)
  {
    if(!list.find(e => e.name === statNames[i]))
    {
      let ev = 
      {
        name: statNames[i],
        value: type=="ev" ? 0 : 31
      }
      list.push(ev);
    }
  }
  list = sortStats(list);
  return list;
}

function sortStats(stats: any[]) : (string | undefined)[]
{
  let statNames = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"];
  let sortedStats = [];
  for(let i=0;i<statNames.length;i++)
  {
    sortedStats.push(stats.find(e => e.name === statNames[i]));
  }
  return sortedStats;
}

function formatValue(value: string)
{
  let newValue = value?.replace("(", "");
  newValue = newValue?.replace(")", "");
  newValue = newValue?.replaceAll(" ", "-");
  newValue = newValue?.toLowerCase();
  if(newValue?.slice(-1) === '-')
  {
    newValue = newValue.slice(0, newValue.length-1);
  }
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