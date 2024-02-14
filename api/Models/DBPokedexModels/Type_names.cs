using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace api.Models.DBModels
{
    [PrimaryKey(nameof(type_id), nameof(local_language_id))]

    public class Type_names
    {
        [Key]
        [Column(Order = 1)]
        public int type_id { get; set; }
        [Key]
        [Column(Order = 2)]
        public int local_language_id { get; set; }
        public string name { get; set; }
    }
}
