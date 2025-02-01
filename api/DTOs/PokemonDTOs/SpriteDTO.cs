using api.Util;
using Newtonsoft.Json.Linq;
using System.Security.Cryptography;

namespace api.DTOs.PokemonDTOs
{
    public class SpriteDTO
    {
        public string? Base { get; set; }
        public string? Shiny { get; set; }
        public string? Female { get; set; }
        public string? ShinyFemale { get; set; }

        private const string urlStart = "https://localhost:7134/images/sprites/pokemon/";
        private const string urlEnd = ".png";
        private const string shiny = "shiny/";
        private const string female = "female/";
        private const string shinyFemale = "shiny/female/";

        public SpriteDTO()
        {

        }

        public SpriteDTO(int dexNumber)
        {
            string dex = dexNumber.ToString();
            string baseUrl = urlStart + dex + urlEnd;
            string shinyUrl = urlStart + shiny + dex + urlEnd;
            string femaleUrl = urlStart + female + dex + urlEnd;
            string shinyFemaleUrl = urlStart + shinyFemale + dex + urlEnd;

            Base = baseUrl;
            Shiny = shinyUrl;
            Female = femaleUrl;
            ShinyFemale = shinyFemaleUrl;
        }
    }
}
