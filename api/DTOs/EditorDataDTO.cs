using api.DTOs.PokemonDTOs;

namespace api.DTOs
{
    public class EditorDataDTO
    {
        public List<SpriteDTO> PokemonSpritesPaths { get; set; }
        public List<EditorOptionDTO> TypeIconPaths { get; set; }
        public List<EditorOptionDTO> ShinyPaths { get; set; }
        public List<EditorOptionDTO> MalePaths { get; set; }
        public List<EditorOptionDTO> FemalePaths { get; set; }

        public EditorDataDTO(List<SpriteDTO> pokemonSpritesPaths, List<EditorOptionDTO> typeIconPaths, List<EditorOptionDTO> shinyPaths, List<EditorOptionDTO> malePaths, List<EditorOptionDTO> femalePaths)
        {
            PokemonSpritesPaths = pokemonSpritesPaths;
            TypeIconPaths = typeIconPaths;
            ShinyPaths = shinyPaths;
            MalePaths = malePaths;
            FemalePaths = femalePaths;
        }
    }
}
