﻿using System.Collections.Generic;
using System.Linq;

namespace api.DTOs.PokemonDTOs
{
    public class PokeTypesWithEffectivenessDTO
    {
        public EffectivenessDTO? DualEffectiveness { get; set; }
        public PokeTypeWithEffectivenessDTO? Type1 { get; set; }
        public PokeTypeWithEffectivenessDTO? Type2 { get; set; }

        public PokeTypesWithEffectivenessDTO()
        {

        }

        public PokeTypesWithEffectivenessDTO(PokeTypeWithEffectivenessDTO? type1, PokeTypeWithEffectivenessDTO? type2)
        {
            Type1 = type1;
            Type2 = type2;
            if (Type1 != null && Type2 != null)
            {
                List<Tuple<PokeTypeDTO, double>> allValues = new List<Tuple<PokeTypeDTO, double>>();
                List<Tuple<PokeTypeDTO, double>> summedValues = new List<Tuple<PokeTypeDTO, double>>();
                allValues.AddRange(Type1.EffectivenessDefense.AllValues);
                allValues.AddRange(Type2.EffectivenessDefense.AllValues);
                var group = allValues
                  .GroupBy(x => x.Item1.Identifier)
                  .Where(g => g.Count() > 1);
                foreach (var item in group)
                {
                    double result = item.ToList().Select(tuple => tuple.Item2).Aggregate((a, b) => a * b);
                    summedValues.Add(new(item.ToList()[0].Item1, result));
                }
                foreach (var item in allValues.ToList())
                {
                    if (summedValues.Exists(i => i.Item1.Identifier.Equals(item.Item1.Identifier)))
                    {
                        allValues.Remove(item);
                    }
                }
                allValues.AddRange(summedValues);
                DualEffectiveness = new EffectivenessDTO(allValues.OrderByDescending(n => n.Item2).ToList());
            }
            else
            {
                DualEffectiveness = null;
            }
        }

    }
}
