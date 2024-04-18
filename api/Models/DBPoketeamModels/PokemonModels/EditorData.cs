namespace api.Models.DBPoketeamModels.Pokemon
{
    public class EditorData
    {
        public List<Sprite> PokemonSpritesPaths { get; set; }
        public List<EditorOption> TypeIconPaths { get; set; }
        public List<EditorOption> ShinyPaths { get; set; }
        public List<EditorOption> MalePaths { get; set; }
        public List<EditorOption> FemalePaths { get; set; }

        public EditorData(List<Sprite> pokemonSpritesPaths, List<EditorOption> typeIconPaths, List<EditorOption> shinyPaths, List<EditorOption> malePaths, List<EditorOption> femalePaths)
        {
            PokemonSpritesPaths = pokemonSpritesPaths;
            TypeIconPaths = typeIconPaths;
            ShinyPaths = shinyPaths;
            MalePaths = malePaths;
            FemalePaths = femalePaths;
        }
    }
}
