using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    [Keyless]
    public class Ability_names
    {
        public int ability_id { get; set; }
        public int local_language_id { get; set; }
        public string name { get; set; }
    }
}
