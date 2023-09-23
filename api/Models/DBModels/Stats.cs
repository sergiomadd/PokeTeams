using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    public class Stats
    {
        [Key]
        public int id { get; set; }
        public string identifier { get; set; }
    }
}
