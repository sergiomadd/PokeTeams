namespace api.Models
{
    public class Sprite
    {
        public string Name { get; set; }
        public string? Gen { get; set; }
        public string? Base { get; set; }
        public string? Shiny { get; set; }
        public string? Female { get; set; }
        public string? ShinyFemale { get; set; }

        public Sprite()
        {

        }

        public Sprite(string name, string _base = null, string shiny = null, string female = null, string shinyFemale = null)
        {
            Name = GetName(name);
            Gen = GetGeneration(name);
            Base = CheckIfFileExist(_base) ? _base : null;
            Shiny = CheckIfFileExist(shiny) ? shiny : null;
            Female = CheckIfFileExist(female) ? female : null;
            ShinyFemale = CheckIfFileExist(shinyFemale) ? shinyFemale : null;
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
            return "Base";
        }

        public string GetGeneration(string key)
        {
            if (key.Contains("/"))
            {
                return key.Split("/")[1];
            }
            return null;
        }


        public bool CheckIfFileExist(string path)
        {
            if (path != null)
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
