import { Ability } from "./ability.model"
import { Item } from "./item.model"
import { Move } from "./move.model"
import { Nature } from "./nature.model"
import { Sprite } from "./sprite.model"
import { Stat } from "./stat.model"
import { TypesWithEffectiveness } from "./typeswitheffectiveness.model"
import { TypeWithEffectiveness } from "./typewitheffectiveness.model"


export interface Pokemon 
{
	name?: string,
	nickname?: string,
	dexNumber?: number,
	preEvolution?: Pokemon,
	evolutions?: Pokemon[],
	types?: TypesWithEffectiveness,
	teraType?: TypeWithEffectiveness,
	item?: Item,
	ability?: Ability,
	nature?: Nature,
	moves?: (Move | undefined)[],
	stats?: Stat[],
	ivs?: Stat[],
	evs?: Stat[],
	level?: number,
	shiny?: boolean,
	gender?: string,
	sprite?: Sprite
}
  