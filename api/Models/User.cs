using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class User : IdentityUser
    {
        [PersonalData]
        public string Name { get; set; }
        [PersonalData]
        public string Country { get; set; }
        [PersonalData]
        public DateTime DateCreated { get; set; }
    }
}
