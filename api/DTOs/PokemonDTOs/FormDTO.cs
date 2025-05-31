namespace api.DTOs.PokemonDTOs
{
    public class FormDTO
    {
        public LocalizedText? Name { get; set; }
        public int? DexNumber { get; set; }
        public int? FormId { get; set; }
        public PokeTypesDTO? Types { get; set; }
        public SpriteDTO? Sprite { get; set; }

        //Keep for deserialization
        public FormDTO()
        {

        }

        public FormDTO(
            LocalizedText? name,
            int? dexNumber,
            int? formId,
            PokeTypesDTO? types,
            SpriteDTO? sprite)
        {
            Name = name;
            DexNumber = dexNumber;
            FormId = formId;
            Types = types;
            Sprite = sprite;
        }
    }
}
