namespace api.Models
{
    public class EditorOptions
    {
        public EditorOption PokemonSpritesGen { get; set; }
        public string typeIconsGen { get; set; }
        public EditorOption ShinyPath { get; set; }
        public bool Gender { get; set; }
        public EditorOption GenderPath { get; set; }
        public bool ShowIVs { get; set; }
        public bool ShowEVs { get; set; }
        public bool ShowNature { get; set; }
        public bool ShowDexNumber { get; set; }
        public bool ShowNickname { get; set; }
        public int MaxLevel { get; set; }
    }
}
