import { Type } from "./pokemon/type.model";

export interface MovePreview
{
  identifier: string,
  name: string,
  pokeType: Type,
}