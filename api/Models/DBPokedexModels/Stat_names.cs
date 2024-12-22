using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBModels
{
    [Keyless]
    public class Stat_names
    {
        public int stat_id { get; set; }
        public int local_language_id { get; set; }
        public string name { get; set; }
    }
}
