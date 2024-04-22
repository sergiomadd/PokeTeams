namespace api.DTOs.PokemonDTOs
{
    public class PokemonPreviewDTO
    {
        public string? Name { get; set; }
        public int? DexNumber { get; set; }
        public PokeTypesDTO? Types { get; set; }
        public PokeTypeDTO? TeraType { get; set; }
        public SpriteDTO Sprite { get; set; }
    }
}
