namespace api.Util
{
    public static class Checker
    {
        public static bool CheckIfFileExist(string path)
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
