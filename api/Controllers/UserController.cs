using Microsoft.AspNetCore.Mvc;
using api.Models.DTOs;
using Microsoft.AspNetCore.Identity;
using api.Util;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public UserController(UserManager<User> userManager,
            SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        //[AllowAnonymous]
        //[ValidateAntiForgeryToken]
        [HttpPost, Route("signup")]
        public async Task<IActionResult> Signup(SignUpDTO model)
        {
            Printer.Log("Trying to sign up user...");
            try
            {
                if(model == null || !ModelState.IsValid)
                {
                    return BadRequest("Signup error, result failed");
                }
                var user = new User
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    PasswordHash = model.Password,
                    DateCreated = DateTime.Now,
                    EmailConfirmed = false
                };
                var signUpResult = await _userManager.CreateAsync(user, model.Password);
                if (!signUpResult.Succeeded)
                {
                    var errors = signUpResult.Errors.Select(e => e.Description);
                    return BadRequest(new IdentityResponseDTO { Errors = errors });
                }
                Printer.Log("User successfully generated.");
                await _signInManager.SignInAsync(user, true);
                Printer.Log("User signed in.");
            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return BadRequest("Signup error, exception, Model not valid");
            }
            return Ok();
        }

        //[AllowAnonymous]
        //[ValidateAntiForgeryToken]
        [HttpPost, Route("login")]
        public async Task<IActionResult> LogIn(LogInDTO model)
        {
            Printer.Log("Trying to log in user...");
            try
            {
                if (model == null || !ModelState.IsValid)
                {
                    return BadRequest("Login error, result failed");
                }

                User signedUserByEmail = await _userManager.FindByEmailAsync(model.UserNameOrEmail);
                Microsoft.AspNetCore.Identity.SignInResult logInResult = new Microsoft.AspNetCore.Identity.SignInResult();
                if (signedUserByEmail != null)
                {
                    logInResult = await _signInManager.PasswordSignInAsync(signedUserByEmail.UserName, model.Password, model.RememberMe, lockoutOnFailure: false);
                }
                else
                {
                    User signedUserByUserName = await _userManager.FindByNameAsync(model.UserNameOrEmail);
                    if (signedUserByUserName != null)
                    {
                        logInResult = await _signInManager.PasswordSignInAsync(signedUserByUserName.UserName, model.Password, model.RememberMe, lockoutOnFailure: false);
                    }
                }

                if (!logInResult.Succeeded)
                {
                    return BadRequest(new IdentityResponseDTO { Errors = new string[] { "Log in failed" } });
                }
                if (logInResult.IsNotAllowed)
                {
                    return BadRequest(new IdentityResponseDTO { Errors = new string[] { "You are not allowed" } });
                }
                if (logInResult.IsLockedOut)
                {
                    return BadRequest(new IdentityResponseDTO { Errors = new string[] { "You account is locked" } });
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return BadRequest("Log in error, exception, Model not valid");
            }
            Printer.Log("User successfully loged in.");
            return Ok();
        }
    }
}
