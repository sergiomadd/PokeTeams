import { Pipe, PipeTransform } from "@angular/core";
import { ComparePokemon } from "./compare-page/compare-page.component";

@Pipe(
  {
    name: 'marginTopPipe',
    pure: true
  }
)

export class MarginTopPipe implements PipeTransform
{
  transform(statList: ComparePokemon[] | undefined, comparePokemon: ComparePokemon, selectedStatIndex: number, i: number) : string
  {
    console.log(statList)
    if(statList)
    {
      //If prev pokemon is from diff team than prevprev pokemon and prev value == prevprev value and is A col -> do not move
      if(i > 1 && statList[i-1]?.whichTeam !== statList[i-2]?.whichTeam
        && statList[i-1]?.pokemon?.stats![selectedStatIndex]?.value === statList[i-2]?.pokemon?.stats![selectedStatIndex]?.value)
      {
        return '0';
      }
      //If prev is diff team andASS prev prev is same team and prev & prevprev are same value -> do not move cause prev & prevprev are same position
      if((i > 0 && statList[i-1]?.whichTeam !== comparePokemon.whichTeam) 
      && (i > 1 && statList[i-2]?.whichTeam === comparePokemon.whichTeam) 
      && (statList[i-1]?.pokemon?.stats![selectedStatIndex]?.value === statList[i-2].pokemon?.stats![selectedStatIndex]?.value))
      {
        return '0';
      }
      //If prev pokemon is diff team & prev value is same -> push up to match prev height
      if(i > 0 && statList[i-1]?.whichTeam !== comparePokemon.whichTeam 
              && statList[i-1]?.pokemon?.stats![selectedStatIndex]?.value === comparePokemon.pokemon?.stats![selectedStatIndex]?.value)
      {
        console.log(comparePokemon.pokemon?.name?.content)
        return '-2.9em';
      }
      //If next is not from same team & is same value -> do not move
      if(i > 0 && statList[i+1]?.whichTeam !== comparePokemon.whichTeam 
              && statList[i+1]?.pokemon?.stats![selectedStatIndex]?.value === comparePokemon.pokemon?.stats![selectedStatIndex]?.value)
      {
        return '0';
      }
      //Only if none of the above and prev is different team -> move up a bit
      if(i > 0 && statList[i-1]?.whichTeam !== comparePokemon.whichTeam)
      {
        return '-1em';
      }
    }
    return '0';
  }
}