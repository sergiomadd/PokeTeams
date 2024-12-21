import { LocalizedText } from "src/app/shared/models/localizedText.model";
import { Item } from "./item.model";
import { MovePreview } from "./movePreview.model";
import { Sprite } from "./sprite.model";
import { Type } from "./type.model";
import { Types } from "./types.model";

export interface PokemonPreview
{
  name?: LocalizedText,
	dexNumber?: number,
	types?: Types,
	teraType?: Type,
	sprite?: Sprite,
	shiny?: boolean,
	gender?: string,
	item?: Item,
	abilityName?: string,
	moves?: MovePreview[],
}