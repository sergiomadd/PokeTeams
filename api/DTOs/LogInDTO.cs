using System.ComponentModel.DataAnnotations;

namespace api.DTOs
{
    public class LogInDTO
    {
        [Required(ErrorMessage = "Username or email is required")]
        [StringLength(256, ErrorMessage = "Name or email is too long")]
        public string UserNameOrEmail { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(256, ErrorMessage = "Password is too long")]
        public string Password { get; set; }
    }
}
