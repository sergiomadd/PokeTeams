using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBModels
{
    [Keyless]
    public class Item_prose
    {
        public int item_id { get; set; }
        public int local_language_id { get; set; }
        public string? short_effect { get; set; }
        public string? effect { get; set; }
    }
}
