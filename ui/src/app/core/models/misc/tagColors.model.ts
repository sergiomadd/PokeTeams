import { Gen9IconColors } from "./colors";

export const tagBackgroundColors: string[] = 
[
  Gen9IconColors.normal, Gen9IconColors.rock, Gen9IconColors.ground, Gen9IconColors.dark,
  Gen9IconColors.steel,  Gen9IconColors.flying, Gen9IconColors.ice, Gen9IconColors.water,
  Gen9IconColors.electric, Gen9IconColors.fighting, Gen9IconColors.bug, Gen9IconColors.grass, 
  Gen9IconColors.fire, Gen9IconColors.psychic, Gen9IconColors.poison, Gen9IconColors.ghost, 
];


//white -> true
//black -> false
export const tagTextColors: boolean[] = 
[
  false, false, true, true,
  false, false, false, true,
  false, false, true, true,
  false, false, true, true,
];