import { Ability } from "./ability.model"
import { Item } from "./item.model"
import { Move } from "./move.model"
import { Nature } from "./nature.model"
import { Sprite } from "./sprite.model"
import { Stat } from "./stat.model"
import { Type } from "./type.model"


export interface Pokemon 
{
	name: string,
	nickname?: string,
	dexNumber: number,
	types: Type[],
	teraType?: Type,
	item?: Item,
	ability?: Ability,
	nature?: Nature,
	moves?: Move[],
	stats: Stat[],
	ivs?: Stat[],
	evs?: Stat[],
	level?: number,
	shiny?: boolean,
	gender?: string,
	sprites: Sprite[]
}
  