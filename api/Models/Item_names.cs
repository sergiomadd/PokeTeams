using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class Item_names
    {
        public int item_id { get; set; }
        public int local_language_id { get; set; }

        [Key]
        public string name { get; set; }
    }
}
