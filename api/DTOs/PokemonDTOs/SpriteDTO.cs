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
            string? femaleUrl = HasFemaleForm(dexNumber) ? urlStart + female + dex + urlEnd : null;
            string? shinyFemaleUrl = HasFemaleForm(dexNumber) ? urlStart + shinyFemale + dex + urlEnd : null;

            Base = baseUrl;
            Shiny = shinyUrl;
            Female = femaleUrl;
            ShinyFemale = shinyFemaleUrl;
        }

        public bool HasFemaleForm(int dexNumber)
        {
            List<int> femaleForms = new List<int>
            {
                3, 12, 19, 20, 25, 26, 41, 42, 44, 45, 64, 65, 84, 85, 97, 111, 112, 118, 119, 123, 129, 130, 154, 165, 166, 178, 185, 186, 190, 194, 195, 198, 202,
                203, 207, 208, 212, 214, 215, 217, 221, 224, 229, 232, 255, 256, 257, 267, 269, 272, 274, 275, 307, 308, 315, 316, 317, 322, 323, 332, 350, 369, 396, 397, 398, 399,
                400, 401, 402, 403, 404, 405, 407, 415, 417, 418, 419, 424, 443, 444, 445, 449, 450, 453, 454, 456, 457, 459, 460, 461, 464, 465, 473, 521, 592, 593, 668, 678, 876, 916, 10033, 10235
            };
            if(femaleForms.Contains(dexNumber)) { return true; }
            return false;
        }
    }
}
