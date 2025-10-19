import { Pipe, PipeTransform } from "@angular/core";
import { Type } from "../../../core/models/pokemon/type.model";

@Pipe(
  {
    name: 'shouldBeInMiddlePipe',
    pure: true,
    standalone: false
}
)

export class ShouldBeInMiddlePipe implements PipeTransform
{
  transform(index: number, types?: Type[]): boolean | undefined
  {
    return types && types.length > 2 && index % 2 === 0;
  }
}