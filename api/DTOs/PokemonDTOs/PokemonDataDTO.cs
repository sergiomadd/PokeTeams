namespace api.DTOs.PokemonDTOs
{
    public class PokemonDataDTO
    {
        public LocalizedText? Name { get; set; }
        public int DexNumber { get; set; }
        public int PokemonId { get; set; }
        public PokeTypesWithEffectivenessDTO? Types { get; set; }
        public List<StatDTO> Stats { get; set; }
        public SpriteDTO? Sprite { get; set; }
        public bool? Gender { get; set; }
        public EvolutionDTO? PreEvolution { get; set; }
        public List<EvolutionDTO?> Evolutions { get; set; }
        public int? FormId { get; set; }
        public List<FormDTO?>? Forms { get; set; }

        public PokemonDataDTO(
            LocalizedText? name, 
            int dexNumber, 
            int pokemonId,
            PokeTypesWithEffectivenessDTO? types, 
            List<StatDTO> stats, 
            SpriteDTO? sprite, 
            bool? gender = false,
            EvolutionDTO? preEvolution = null, 
            List<EvolutionDTO?>? evolutions = null,
            int? formId = null,
            List<FormDTO?>? forms = null)
        {
            Name = name;
            DexNumber = dexNumber;
            PokemonId = pokemonId;
            Types = types;
            Stats = stats;
            Sprite = sprite;
            Gender = gender;
            PreEvolution = preEvolution;
            Evolutions = evolutions ?? new List<EvolutionDTO?>();
            FormId = formId;
            Forms = forms ?? new List<FormDTO?>();
        }
    }
}
