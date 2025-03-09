using System.ComponentModel.DataAnnotations;

namespace api.DTOs
{
    public class SignUpDTO
    {
        [Required(ErrorMessage = "Username is required")]
        [StringLength(32, ErrorMessage = "Username is too long")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [StringLength(256, ErrorMessage = "Email is too long")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(256, ErrorMessage = "Password is too long")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(256, ErrorMessage = "Confirmation password is too long")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match")]
        public string ConfirmPassword { get; set; }
    }
}
