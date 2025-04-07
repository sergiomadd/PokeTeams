using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    public class items
    {
        [Key]
        public int id { get; set; }
        public string identifier { get; set; }
        public items(int id, string identifier)
        {
            this.id = id;
            this.identifier = identifier;
        }
    }
}
