import { LocalizedText } from "../misc/localizedText.model";
import { Type } from "./type.model";

export interface MovePreview
{
  identifier: string,
  name: LocalizedText,
  pokeType: Type,
}