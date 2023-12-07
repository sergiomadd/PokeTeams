namespace api.Models
{
    public class EditorData
    {
        public List<Sprite> PokemonSpritesPaths { get; set; }
        public List<EditorOption> TypeIconPaths { get; set; }
        public List<EditorOption> ShinyPaths { get; set; }
        public List<EditorOption> GenderPaths { get; set; }

        public EditorData(List<Sprite> pokemonSpritesPaths, List<EditorOption> typeIconPaths, List<EditorOption> shinyPaths, List<EditorOption> genderPaths) 
        {
            PokemonSpritesPaths = pokemonSpritesPaths;
            TypeIconPaths = typeIconPaths;
            ShinyPaths = shinyPaths;
            GenderPaths = genderPaths;
        }
    }
}
