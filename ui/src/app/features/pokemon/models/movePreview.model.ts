import { LocalizedText } from "src/app/shared/models/localizedText.model";
import { Type } from "./type.model";

export interface MovePreview
{
  identifier: string,
  name: LocalizedText,
  pokeType: Type,
}