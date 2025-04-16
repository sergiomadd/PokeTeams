import { Gen9IconColorsHex } from "./colors";

export const tagBackgroundColors: string[] = 
[
  Gen9IconColorsHex.normal, Gen9IconColorsHex.rock, Gen9IconColorsHex.ground, Gen9IconColorsHex.dark,
  Gen9IconColorsHex.steel,  Gen9IconColorsHex.flying, Gen9IconColorsHex.ice, Gen9IconColorsHex.water,
  Gen9IconColorsHex.electric, Gen9IconColorsHex.fighting, Gen9IconColorsHex.bug, Gen9IconColorsHex.grass, 
  Gen9IconColorsHex.fire, Gen9IconColorsHex.psychic, Gen9IconColorsHex.poison, Gen9IconColorsHex.ghost, 
];


//white -> true
//black -> false
export const tagTextColors: boolean[] = 
[
  false, false, true, true,
  false, false, false, true,
  false, false, true, true,
  true, false, true, true,
];