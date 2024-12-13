using System.ComponentModel.DataAnnotations;

namespace api.DTOs
{
    public class LogInDTO
    {
        [Required(ErrorMessage = "Username or email is required")]
        public string UserNameOrEmail { get; set; }
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}
