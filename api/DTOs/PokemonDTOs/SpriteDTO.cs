using api.Util;

namespace api.DTOs.PokemonDTOs
{
    public class SpriteDTO
    {
        public string Name { get; set; }
        public string? Gen { get; set; }
        public string? Base { get; set; }
        public string? Shiny { get; set; }
        public string? Female { get; set; }
        public string? ShinyFemale { get; set; }

        public SpriteDTO()
        {

        }

        public SpriteDTO(string name, string _base = null, string shiny = null, string female = null, string shinyFemale = null)
        {
            Name = GetName(name);
            Gen = GetGeneration(name);
            Base = Checker.CheckIfFileExist(_base) ? _base : null;
            Shiny = Checker.CheckIfFileExist(shiny) ? shiny : null;
            Female = Checker.CheckIfFileExist(female) ? female : null;
            ShinyFemale = Checker.CheckIfFileExist(shinyFemale) ? shinyFemale : null;
        }

        public string GetName(string key)
        {
            if (key.Length > 0 && key.Contains("/"))
            {
                string[] path = key.Split("/");
                if (path.Length > 3)
                {
                    List<string> nameList = path[2].Split("-").ToList();
                    List<string> tempList = new List<string>();
                    foreach (string name in nameList)
                    {
                        tempList.Add(char.ToUpper(name[0]) + name.Substring(1));
                    }
                    return string.Join("/", tempList);
                }
                else
                {
                    List<string> nameList = path[1].Split("-").ToList();
                    List<string> tempList = new List<string>();
                    foreach (string name in nameList)
                    {
                        tempList.Add(char.ToUpper(name[0]) + name.Substring(1));
                    }
                    return string.Join(" ", tempList);
                }
            }
            return "PokeAPI";
        }

        public string GetGeneration(string key)
        {
            if (key.Contains("/"))
            {
                return key.Split("/")[1];
            }
            return null;
        }
    }
}
