using static api.DTOs.PokemonDTOs.MoveDTO;

namespace api.DTOs.PokemonDTOs
{
    public class MovePreviewDTO
    {
        public string Identifier { get; set; }
        public string? Name { get; set; }
        public PokeTypeDTO? PokeType { get; set; }

        public MovePreviewDTO(string identifier, string? name, PokeTypeDTO? pokeType) 
        { 
            Identifier = identifier;
            Name = name;
            PokeType = pokeType;
        }

    }
}
