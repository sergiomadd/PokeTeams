using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPoketeamModels
{
    public class Country
    {
        [Key]
        public string NormalizedName { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
    }
}
