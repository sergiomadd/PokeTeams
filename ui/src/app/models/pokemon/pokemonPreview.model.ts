import { Sprite } from "./sprite.model";
import { TypesWithEffectiveness } from "./typeswitheffectiveness.model";
import { TypeWithEffectiveness } from "./typewitheffectiveness.model";

export interface PokemonPreview
{
  name?: string,
	dexNumber?: number,
	types?: TypesWithEffectiveness,
	teraType?: TypeWithEffectiveness,
	sprite?: Sprite
}