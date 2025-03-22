using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class Item_names
    {
        [Key]
        public int item_id { get; set; }
        public int local_language_id { get; set; }
        public string? name { get; set; }
    }
}
