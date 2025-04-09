using api.Models.DBPoketeamModels;

namespace api.DTOs
{
    public class CountryDTO
    {
        public string name { get; set; }
        public string code { get; set; }
        public string Icon { get; set; }

        public CountryDTO(Country country) 
        {
            name = country.Name;
            code = country.Code;
            Icon = $"https://localhost:7134/images/sprites/flags/{country.Code}.svg";
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
