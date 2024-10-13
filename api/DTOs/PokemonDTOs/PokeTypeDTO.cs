namespace api.DTOs.PokemonDTOs
{
    public class PokeTypeDTO
    {
        public string Identifier { get; set; }
        public string Name { get; set; }
        public string IconPath { get; set; }
        public bool Teratype { get; set; }

        public PokeTypeDTO(string identifier, string name, bool teraType = false)
        {
            Identifier = identifier;
            Name = name;
            Teratype = teraType ? teraType : false;
            var pathStart = "https://localhost:7134/images/sprites/types/generation-ix/";
            if (teraType)
            {
                pathStart = "https://localhost:7134/images/sprites/teratypes/";
            }

            IconPath = $"{pathStart}{identifier}.png";
        }
    }
}
