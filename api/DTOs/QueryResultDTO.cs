using api.Util;

namespace api.DTOs
{
    public class QueryResultDTO
    {
        public string Name { get; set; }
        public string? Icon { get; set; }

        public QueryResultDTO(string name, string? icon = null)
        {
            Name = name;
            Icon = Checker.CheckIfFileExist(icon) ? icon : null;
        }
    }
}
