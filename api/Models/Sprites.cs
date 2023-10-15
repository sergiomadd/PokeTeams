namespace api.Models
{
    public class Sprites
    {
        public SpriteStructure Base { get; set; }
        public SpriteStructure? RedBlue { get; set; }
        public SpriteStructure? Yellow { get; set; }
        public SpriteStructure? Gold { get; set; }
        public SpriteStructure? Silver { get; set; }
        public SpriteStructure? Crystal { get; set; }
        public SpriteStructure? RubySapphire { get; set; }
        public SpriteStructure? FireredLeafgreen { get; set; }
        public SpriteStructure? Emerald { get; set; }
        public SpriteStructure? DiamondPearl { get; set; }
        public SpriteStructure? HeartgoldSoulsilver { get; set; }
        public SpriteStructure? Platinum { get; set; }
        public SpriteStructure? BlackWhite { get; set; }
        public SpriteStructure? BlackWhiteAnimated { get; set; }
        public SpriteStructure? XY { get; set; }
        public SpriteStructure? OmegarubyAlphasapphire { get; set; }
        public SpriteStructure? UltraSunUltraMoon { get; set; }
        public SpriteStructure? SwordShield { get; set; }
        public SpriteStructure? Showdown { get; set; }
        public SpriteStructure? Home { get; set; }
        public SpriteStructure? OfficialArtwork { get; set; }
    }


    public class SpriteStructure
    {
        public string Name { get; set; }
        public string Gen { get; set; }
        public string? Base { get; set; }
        public string? Shiny { get; set; }
        public string? Female { get; set; }
        public string? ShinyFemale { get; set; }

        public SpriteStructure(string name, string gen, string _base = null, string shiny = null, string female = null, string shinyFemale = null)
        {
            Name = name;
            Gen = gen;
            Base = CheckIfFileExist(_base) ? _base : null;
            Shiny = CheckIfFileExist(shiny) ? shiny : null;
            Female = CheckIfFileExist(female) ? female : null;
            ShinyFemale = CheckIfFileExist(shinyFemale) ? shinyFemale : null;
        }

        public bool CheckIfFileExist(string path)
        {
            if(path != null) 
            {
                string relativePath = "/wwwroot/images" + path.Split("images")[1];
                string fullPath = @Directory.GetCurrentDirectory() + relativePath;
                if (File.Exists(fullPath.Replace('/', Path.DirectorySeparatorChar)))
                {
                    return true;
                }
            }
            return false;
        }
    }
}
