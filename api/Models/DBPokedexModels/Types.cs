using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    public class types
    {
        [Key]
        public int id { get; set; }
        public string identifier { get; set; }
    }
}
