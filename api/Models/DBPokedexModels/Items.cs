using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    public class Items
    {
        [Key]
        public int id { get; set; }
        public string identifier { get; set; }
        public Items(int id, string identifier)
        {
            this.id = id;
            this.identifier = identifier;
        }
    }
}
