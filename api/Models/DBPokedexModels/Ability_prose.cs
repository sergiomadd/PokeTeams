using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBModels
{
    public class Ability_prose
    {
        [Key]
        public int ability_id { get; set; }
        public int local_language_id { get; set; }
        public string short_effect { get; set; }
        public string effect { get; set; }
    }
}
