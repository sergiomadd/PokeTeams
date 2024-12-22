using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace api.Models.DBModels
{
    [Keyless]
    public class Move_effect_prose
    {
        public int move_effect_id { get; set; }
        public int local_language_id { get; set; }
        public string short_effect { get; set; }
        public string effect { get; set; }
    }
}
