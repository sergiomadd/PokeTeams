import { defaultType, Type } from "./type.model"

export interface Types
{
  type1?: Type,
  type2?: Type
}

export const defaultTypes: Types = 
{
  type1: defaultType,
  type2: defaultType
}