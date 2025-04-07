using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace api.Models.DBModels
{
    public class type_names
    {
        [Key]
        public int type_id { get; set; }
        public int local_language_id { get; set; }
        public string name { get; set; }
    }
}
