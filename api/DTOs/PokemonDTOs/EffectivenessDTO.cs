using api.Models.DBModels;

namespace api.DTOs.PokemonDTOs
{
    public class EffectivenessDTO
    {
        public List<Tuple<string, double>>? AllValues { get; set; }
        public List<PokeTypeWithEffectivenessDTO> DoubleSuperEffective { get; set; }
        public List<PokeTypeWithEffectivenessDTO> SuperEffective { get; set; }
        public List<PokeTypeWithEffectivenessDTO> NotVeryEffective { get; set; }
        public List<PokeTypeWithEffectivenessDTO> DoubleNotVeryEffective { get; set; }
        public List<PokeTypeWithEffectivenessDTO> Inmune { get; set; }

        public EffectivenessDTO(List<Tuple<string, double>> allValues)
        {
            DoubleSuperEffective = new List<PokeTypeWithEffectivenessDTO>();
            SuperEffective = new List<PokeTypeWithEffectivenessDTO>();
            NotVeryEffective = new List<PokeTypeWithEffectivenessDTO>();
            DoubleNotVeryEffective = new List<PokeTypeWithEffectivenessDTO>();
            Inmune = new List<PokeTypeWithEffectivenessDTO>();

            AllValues = allValues;
            if (AllValues != null)
            {
                foreach (var value in AllValues)
                {
                    switch (value.Item2)
                    {
                        case 4:
                            DoubleSuperEffective.Add(new PokeTypeWithEffectivenessDTO(value.Item1, value.Item1));
                            break;
                        case 2:
                            SuperEffective.Add(new PokeTypeWithEffectivenessDTO(value.Item1, value.Item1));
                            break;
                        case 0.5:
                            NotVeryEffective.Add(new PokeTypeWithEffectivenessDTO(value.Item1, value.Item1));
                            break;
                        case 0.25:
                            DoubleNotVeryEffective.Add(new PokeTypeWithEffectivenessDTO(value.Item1, value.Item1));
                            break;
                        case 0:
                            Inmune.Add(new PokeTypeWithEffectivenessDTO(value.Item1, value.Item1));
                            break;
                    }
                }
            }



        }
    }
}
