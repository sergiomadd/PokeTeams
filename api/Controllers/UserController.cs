using Microsoft.AspNetCore.Mvc;
using api.Models.DTOs;
using Microsoft.AspNetCore.Identity;
using api.Util;
using Microsoft.AspNetCore.Server.HttpSys;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using api.Data;
using api.Models.DBPoketeamModels;
using api.Services.UserService;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly UserContext _userContext;
        private readonly IUserService _userService;

        public UserController(UserManager<User> userManager,
            SignInManager<User> signInManager,
            UserContext userContext,
            IUserService userService
            )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _userContext = userContext;
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpGet, Route("get")]
        public async Task<ActionResult<UserDTO>> GetUserByUserName(string userName)
        {
            UserDTO user = await _userService.BuildUserDTO(await _userService.GetUserByUserName(userName));
            if (user == null)
            {
                return NotFound("Couldn't find user");
            }
            return Ok(user);
        }

        [AllowAnonymous]
        [HttpGet, Route("delete")]
        public async Task<ActionResult<UserDTO>> DeleteUserByUserName(string userName)
        {
            bool deleted = await _userService.DeleteUserByUserName(userName);
            if (deleted)
            {
                return NotFound("Couldn't find user");
            }
            return Ok(deleted);
        }

        [AllowAnonymous]
        [HttpGet, Route("logged")]
        public async Task<ActionResult<UserDTO>> Logged()
        {
            Printer.Log("Trying to get user...");
            UserDTO userDTO;
            try
            {
                Printer.Log("User: ", User.Identity.Name);
                if (User.Identity.Name != null)
                {
                    var user = await _userManager.FindByNameAsync(User.Identity.Name);
                    if (user != null)
                    {
                        userDTO = await _userService.BuildUserDTO(await _userService.GetUserByUserName(user.UserName));
                    }
                    else
                    {
                        return Unauthorized("Logged user not found");
                    }
                }
                else
                {
                    return Ok(null);
                }

            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return BadRequest("Getting user error, exception");
            }
            return Ok(userDTO);
        }


        [AllowAnonymous]
        [HttpPost, Route("login")]
        public async Task<ActionResult<IdentityResponseDTO>> LogIn(LogInDTO model)
        {
            Printer.Log("Trying to log in user...");
            try
            {
                if (model == null || !ModelState.IsValid)
                {
                    return BadRequest("Login error, result failed");
                }
                User signedUserByEmail = await _userManager.FindByEmailAsync(model.UserNameOrEmail);
                User signedUserByUserName = await _userManager.FindByNameAsync(model.UserNameOrEmail);
                Microsoft.AspNetCore.Identity.SignInResult logInResult = new Microsoft.AspNetCore.Identity.SignInResult();
                if (signedUserByEmail != null)
                {
                    if (await _userManager.CheckPasswordAsync(signedUserByEmail, model.Password) == false)
                    {
                        return Unauthorized(new IdentityResponseDTO { Errors = new string[] { "Invalid credentials" } });
                    }
                    logInResult = await _signInManager.PasswordSignInAsync(signedUserByEmail.UserName, model.Password, model.RememberMe, lockoutOnFailure: false);
                }
                else if (signedUserByUserName != null)
                {
                    if (await _userManager.CheckPasswordAsync(signedUserByUserName, model.Password) == false)
                    {
                        return Unauthorized(new IdentityResponseDTO { Errors = new string[] { "Invalid credentials" } });
                    }
                    logInResult = await _signInManager.PasswordSignInAsync(signedUserByUserName.UserName, model.Password, model.RememberMe, lockoutOnFailure: false);
                }
                else
                {
                    return Unauthorized(new IdentityResponseDTO { Errors = new string[] { "User not found." } });
                }
                if (!logInResult.Succeeded)
                {
                    return Unauthorized(new IdentityResponseDTO { Errors = new string[] { "Log in failed" } });
                }
                if (logInResult.IsNotAllowed)
                {
                    return Unauthorized(new IdentityResponseDTO { Errors = new string[] { "You are not allowed" } });
                }
                if (logInResult.IsLockedOut)
                {
                    return Unauthorized(new IdentityResponseDTO { Errors = new string[] { "You account is locked" } });
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return BadRequest("Log in error, exception, Model not valid");
            }
            Printer.Log("User successfully loged in.");
            return Ok(new IdentityResponseDTO { Success = true });
        }

        [AllowAnonymous]
        [HttpPost, Route("signup")]
        public async Task<ActionResult<IdentityResponseDTO>> Signup(SignUpDTO model)
        {
            Printer.Log("Trying to sign up user...");
            try
            {
                if (model == null || !ModelState.IsValid)
                {
                    return BadRequest("Signup error, result failed");
                }
                var user = new User
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    PasswordHash = model.Password,
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

        [AllowAnonymous]
        [HttpPost, Route("logout")]
        public async Task LogOut()
        {
            Printer.Log("Loggin out");
            Printer.Log("User: ", User.Identity.Name);
            //CookieAuthenticationDefaults.AuthenticationScheme
            //await _signInManager.SignOutAsync();
            /*
            if(User.Identity.Name != null)
            {
                Printer.Log("user: ", User.Identity.Name);
            }
            if (User.Identity.IsAuthenticated)
            {
                Printer.Log("user logged");
                await _signInManager.SignOutAsync();
                
            }

            foreach (var key in HttpContext.Request.Cookies.Keys)
            {
                Printer.Log("cookie set");
                HttpContext.Response.Cookies.Append(key, "", new CookieOptions() { Expires = DateTime.Now.AddDays(-1) });
            }
            */
            //HttpContext.Response.Cookies.Delete(".AspNetCore.Identity.Application", new CookieOptions { Secure = true });

            await _signInManager.SignOutAsync();
        }
    }
}
