using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPoketeamModels
{
    public class Team
    {
        [Key]
        public string id { get; set; }
        public string options { get; set; }
    }
}
