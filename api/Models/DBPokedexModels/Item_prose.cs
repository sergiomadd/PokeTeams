using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBModels
{
    [PrimaryKey(nameof(item_id), nameof(local_language_id))]
    public class Item_prose
    {
        [Key]
        [Column(Order = 1)]
        public int item_id { get; set; }
        [Key]
        [Column(Order = 2)]
        public int? local_language_id { get; set; }
        public string? short_effect { get; set; }
        public string? effect { get; set; }
    }
}
