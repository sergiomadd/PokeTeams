using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    public class nature_names
    {
        [Key]
        public int nature_id { get; set; }
        public int local_language_id { get; set; }
        public string name { get; set; }
    }
}
