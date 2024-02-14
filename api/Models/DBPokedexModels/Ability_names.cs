using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    public class Ability_names
    {
        public int ability_id { get; set; }
        public int local_language_id { get; set; }
        [Key]
        public string name { get; set; }
    }
}
