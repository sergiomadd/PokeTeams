using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    [Keyless]
    public class Types
    {
        public int id { get; set; }
        public string identifier { get; set; }
    }
}
