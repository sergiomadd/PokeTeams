using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    public class Item_prose
    {
        [Key]
        public int item_id { get; set; }
        public int? local_language_id { get; set; }
        public string? short_effect { get; set; }
        public string? effect { get; set; }
    }
}
