namespace api.DTOs
{
    public class EditorOptionsDTO
    {
        public EditorOptionDTO PokemonSpritesGen { get; set; }
        public string typeIconsGen { get; set; }
        public EditorOptionDTO ShinyPath { get; set; }
        public bool Gender { get; set; }
        public EditorOptionDTO MalePath { get; set; }
        public EditorOptionDTO FemalePath { get; set; }
        public bool ShowIVs { get; set; }
        public bool ShowEVs { get; set; }
        public bool ShowNature { get; set; }
        public bool ShowDexNumber { get; set; }
        public bool ShowNickname { get; set; }
        public int MaxLevel { get; set; }
    }
}
