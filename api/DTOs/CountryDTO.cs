using api.Models.DBPoketeamModels;

namespace api.DTOs
{
    public class CountryDTO
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string IconPath { get; set; }

        public CountryDTO(Country country, string iconPath) 
        {
            Name = country.Name;
            Code = country.Code;
            IconPath = iconPath;
        }
    }

    /*
    public class CountryInsertDTO
    {
        public string country { get; set; }
        public string abbreviation { get; set; }
    }
    */
}
