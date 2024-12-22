using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBModels
{
    [Keyless]
    public class Natures
    {
        public int id { get; set; }
        public string identifier { get; set; }
        public int decreased_stat_id { get; set; }
        public int increased_stat_id { get; set; }
    }
}
