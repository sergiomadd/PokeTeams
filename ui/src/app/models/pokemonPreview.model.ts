import { MovePreview } from "./movePreview.model";
import { Item } from "./pokemon/item.model";
import { Sprite } from "./pokemon/sprite.model";
import { Type } from "./pokemon/type.model";
import { Types } from "./pokemon/types.model";

export interface PokemonPreview
{
  name?: string,
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