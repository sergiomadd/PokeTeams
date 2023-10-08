import { Ability } from "./ability.model"
import { Item } from "./item.model"
import { Move } from "./move.model"
import { Nature } from "./nature.model"


export interface Pokemon 
{
	name: string,
	nickname?: string,
	dexNumber: number,
	types: 
		{
			id: number,
			type: string
		}[],
	teraType?: string,
	item?: Item,
	ability?: Ability,
	nature?: Nature,
	moves?: Move[],
	stats: 
	{
		identifier: string,
		name: string,
		stat: number
	}[],
	ivs?: 
	{
		identifier: string,
		name: string,
		stat: number
	}[],
	evs?: 
	{
		identifier: string,
		name: string,
		stat: number
	}[],
	level?: number,
	shiny?: false,
	gender?: string,
}
  