using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBModels
{
    [PrimaryKey(nameof(stat_id), nameof(local_language_id))]
    public class Stat_names
    {
        [Key]
        [Column(Order = 1)]
        public int stat_id { get; set; }
        [Key]
        [Column(Order = 2)]
        public int local_language_id { get; set; }
        public string name { get; set; }
    }
}
