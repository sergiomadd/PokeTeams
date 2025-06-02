import { LocalizedText } from "../misc/localizedText.model"
import { Ability } from "./ability.model"
import { Evolution } from "./evolution.model"
import { Item } from "./item.model"
import { Move } from "./move.model"
import { Nature } from "./nature.model"
import { PokemonForm } from "./pokemonForm.model"
import { Sprite } from "./sprite.model"
import { Stat } from "./stat.model"
import { TypesWithEffectiveness } from "./typeswitheffectiveness.model"
import { TypeWithEffectiveness } from "./typewitheffectiveness.model"

export interface Pokemon 
{
	name?: LocalizedText,
	nickname?: string,
	dexNumber?: number,
	pokemonId?: number,
	preEvolution?: Evolution,
	evolutions: Evolution[],
	formId?: number,
	forms?: PokemonForm[],
	types?: TypesWithEffectiveness,
	teraType?: TypeWithEffectiveness,
	item?: Item,
	ability?: Ability,
	nature?: Nature,
	moves: (Move | undefined)[],
	stats: Stat[],
	ivs: Stat[],
	evs: Stat[],
	level?: number,
	shiny?: boolean,
	gender?: boolean,
	sprite?: Sprite,
	notes?: string
}
  