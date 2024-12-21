namespace api.DTOs.PokemonDTOs
{
    public class PokemonPreviewDTO
    {
        public LocalizedText? Name { get; set; }
        public int? DexNumber { get; set; }
        public PokeTypesDTO? Types { get; set; }
        public PokeTypeDTO? TeraType { get; set; }
        public SpriteDTO Sprite { get; set; }
        public bool? Shiny { get; set; }
        public bool? Gender { get; set; }
        public List<MovePreviewDTO> Moves { get; set; }
        public ItemDTO? Item { get; set; }
        public LocalizedText? AbilityName { get; set; }
        public Lang Lang { get; set; }
    }
}
