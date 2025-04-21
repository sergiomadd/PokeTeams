using api.Models.DBModels;

namespace api.DTOs.PokemonDTOs
{
    public class EvolutionDTO
    {
        public LocalizedText? Name { get; set; }
        public int? DexNumber { get; set; }
        public PokeTypesDTO? Types { get; set; }
        public SpriteDTO? Sprite { get; set; }
        public EvolutionDTO? PreEvolution { get; set; }
        public List<EvolutionDTO?> Evolutions { get; set; }

        //Keep for deserialization
        public EvolutionDTO()
        {

        }

        public EvolutionDTO(
            LocalizedText? name, 
            int dexNumber, 
            PokeTypesDTO? types, 
            List<StatDTO> stats, 
            SpriteDTO? sprite, 
            EvolutionDTO? preEvolution = null, 
            List<EvolutionDTO?>? evolutions = null)
        {
            Name = name;
            DexNumber = dexNumber;
            Types = types;
            Sprite = sprite;
            PreEvolution = preEvolution;
            Evolutions = evolutions ?? new List<EvolutionDTO?>();
        }
    }
}
