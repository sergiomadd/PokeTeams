using api.Models.DBModels;

namespace api.DTOs.PokemonDTOs
{
    public class EffectivenessDTO
    {
        public List<Tuple<PokeTypeDTO, double>>? AllValues { get; set; }
        public List<PokeTypeDTO> DoubleSuperEffective { get; set; }
        public List<PokeTypeDTO> SuperEffective { get; set; }
        public List<PokeTypeDTO> NotVeryEffective { get; set; }
        public List<PokeTypeDTO> DoubleNotVeryEffective { get; set; }
        public List<PokeTypeDTO> Inmune { get; set; }

        public EffectivenessDTO(List<Tuple<PokeTypeDTO, double>> allValues)
        {
            DoubleSuperEffective = new List<PokeTypeDTO>();
            SuperEffective = new List<PokeTypeDTO>();
            NotVeryEffective = new List<PokeTypeDTO>();
            DoubleNotVeryEffective = new List<PokeTypeDTO>();
            Inmune = new List<PokeTypeDTO>();

            AllValues = allValues;
            if (AllValues != null)
            {
                foreach (var value in AllValues)
                {
                    switch (value.Item2)
                    {
                        case 4:
                            DoubleSuperEffective.Add(value.Item1);
                            break;
                        case 2:
                            SuperEffective.Add(value.Item1);
                            break;
                        case 0.5:
                            NotVeryEffective.Add(value.Item1);
                            break;
                        case 0.25:
                            DoubleNotVeryEffective.Add(value.Item1);
                            break;
                        case 0:
                            Inmune.Add(value.Item1);
                            break;
                    }
                }
            }
        }
    }
}
