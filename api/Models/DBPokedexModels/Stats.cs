using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBModels
{
    public class stats
    {
        [Key]
        public int id { get; set; }
        public string identifier { get; set; }
    }
}
