using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPoketeamModels
{
    public class Teams
    {
        [Key]
        public string id { get; set; }
        public string team { get; set; }
    }
}
