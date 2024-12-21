using static api.DTOs.PokemonDTOs.MoveDTO;

namespace api.DTOs.PokemonDTOs
{
    public class MovePreviewDTO
    {
        public string Identifier { get; set; }
        public LocalizedText? Name { get; set; }
        public PokeTypeDTO? PokeType { get; set; }
        public Lang Lang { get; set; }

        public MovePreviewDTO(string identifier, LocalizedText? name, PokeTypeDTO? pokeType) 
        { 
            Identifier = identifier;
            Name = name;
            PokeType = pokeType;
        }

    }
}
