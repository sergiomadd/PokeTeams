using api.DTOs;
using api.Models.DBPoketeamModels;
using api.Services;
using api.Util;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System.Net.Mail;
using System.Net;
using static System.Runtime.InteropServices.JavaScript.JSType;
using NuGet.Common;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using Humanizer;
using api.Migrations;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly TokenGenerator _tokenGenerator;
        private readonly IUserService _userService;
        private readonly IPokeTeamService _pokeTeamService;
        private readonly IEmailService _emailService;
        private readonly IIdentityService _identityService;

        public AuthController(UserManager<User> userManager,
            SignInManager<User> signInManager,
            TokenGenerator tokenGenerator,
            IUserService userService,
            IPokeTeamService teamService,
            IEmailService emailService,
            IIdentityService identityService
            )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenGenerator = tokenGenerator;
            _userService = userService;
            _pokeTeamService = teamService;
            _emailService = emailService;
            _identityService = identityService;
        }

        [AllowAnonymous]
        [HttpPost("Refresh")]
        public async Task<ActionResult> RefreshToken()
        {
            HttpContext.Request.Cookies.TryGetValue("refreshToken", out var refreshToken);

            if (refreshToken == null)
            {
                return BadRequest("Invalid client request");
            }

            var principal = _tokenGenerator.GetPrincipalFromRefreshToken(refreshToken);
            if (principal == null)
            {
                return BadRequest("Invalid client request");
            }
            var username = principal.Identity.Name;
            var user = await _userManager.FindByNameAsync(username);
            if (user is null || user.RefreshToken == null || !user.RefreshToken.Equals(refreshToken) || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return BadRequest("Invalid client request");
            }

            string newRefreshToken = _tokenGenerator.GenerateRefreshToken(user);

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userManager.UpdateAsync(user);

            var newAccessToken = _tokenGenerator.GenerateAccessToken(user);
            JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = newAccessToken, RefreshToken = newRefreshToken };
            _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

            return Ok();
        }

        
        [HttpGet, Route("logged")]
        public async Task<ActionResult> GetLoggedUser()
        {
            Printer.Log("Trying to get logged user...");
            UserDTO userDTO;
            try
            {
                if (User.Identity?.Name != null)
                {
                    User? user = await _userManager.FindByNameAsync(User.Identity.Name);
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
                    return NotFound("No user logged");
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return BadRequest("Getting user error, exception");
            }
            return Ok(userDTO);
        }

        [HttpGet, Route("email")]
        public async Task<ActionResult> GetLoggedUserEmail()
        {
            EmailDTO emailDTO;
            try
            {
                if (User.Identity?.Name != null)
                {
                    User? user = await _userManager.FindByNameAsync(User.Identity.Name);
                    if (user != null)
                    {
                        emailDTO = new EmailDTO
                        {
                            Email = user.Email,
                            EmailConfirmed = user.EmailConfirmed
                        };
                    }
                    else
                    {
                        return Unauthorized("Logged user not found");
                    }
                }
                else
                {
                    return NotFound("No user logged");
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return BadRequest("Getting user error, exception");
            }
            return Ok(emailDTO);
        }

        [AllowAnonymous]
        [HttpPost, Route("login")]
        public async Task<ActionResult> LogIn(LogInDTO model)
        {
            Printer.Log("Trying to log in user...");
            try
            {
                if (model == null || !ModelState.IsValid)
                {
                    return BadRequest("Form invalid");
                }
                User signedUserByEmail = await _userManager.FindByEmailAsync(model.UserNameOrEmail);
                User signedUserByUserName = await _userManager.FindByNameAsync(model.UserNameOrEmail);
                Microsoft.AspNetCore.Identity.SignInResult logInResult = new Microsoft.AspNetCore.Identity.SignInResult();
                if (signedUserByEmail != null)
                {
                    return await PerformLogIn(signedUserByEmail, model);
                }
                else if (signedUserByUserName != null)
                {
                    return await PerformLogIn(signedUserByUserName, model);
                }
                else
                {
                    return BadRequest("User not found");
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return BadRequest("Log in error, exception, Model not valid");
            }
        }

        private async Task<ActionResult> PerformLogIn(User user, LogInDTO model)
        {
            if (await _userManager.CheckPasswordAsync(user, model.Password) == false)
            {
                return Unauthorized("Invalid credentials");
            }
            Microsoft.AspNetCore.Identity.SignInResult logInResult = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, true, lockoutOnFailure: false);
            if (!logInResult.Succeeded)
            {
                return Unauthorized("Log in failed");
            }
            if (logInResult.IsNotAllowed)
            {
                return Unauthorized("You are not allowed");
            }
            if (logInResult.IsLockedOut)
            {
                return Unauthorized("You account is locked");
            }
            string token = _tokenGenerator.GenerateAccessToken(user);
            string refreshToken = _tokenGenerator.GenerateRefreshToken(user);

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userManager.UpdateAsync(user);

            JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token, RefreshToken = refreshToken };
            _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

            return Ok();
        }

        [AllowAnonymous]
        [HttpPost, Route("signup")]
        public async Task<ActionResult> Signup(SignUpDTO model)
        {
            User user;
            Printer.Log("Trying to sign up user...");
            try
            {
                if (model == null || !ModelState.IsValid)
                {
                    return BadRequest("Form invalid");
                }
                user = new User
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    PasswordHash = model.Password,
                    EmailConfirmed = false,
                    Picture = "snorlax",
                    Visibility = true
                };
                var signUpResult = await _userManager.CreateAsync(user, model.Password);
                if (!signUpResult.Succeeded)
                {
                    //var errors = signUpResult.Errors.Select(e => e.Description);
                    //Printer log Identity errors: 
                    return BadRequest("Server error");
                }
                Printer.Log("User successfully generated");
                await _signInManager.SignInAsync(user, true);
                Printer.Log("User signed in");
            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return BadRequest("Signup error, exception, Model not valid");
            }
            string token = _tokenGenerator.GenerateAccessToken(user);
            string refreshToken = _tokenGenerator.GenerateRefreshToken(user);

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(90);
            await _userManager.UpdateAsync(user);

            JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token, RefreshToken = refreshToken };
            _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

            return Ok();
        }

        [HttpGet, Route("logout")]
        public async Task<ActionResult> LogOut()
        {
            Printer.Log("User logged out");
            try
            {
                User? user = await _userManager.FindByNameAsync(_identityService.GetUserName());
                if(user != null)
                {
                    await _userService.DeleteRefreshToken(user);
                }
                await _signInManager.SignOutAsync();
                _tokenGenerator.RemoveTokensFromCookie(HttpContext);
            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return BadRequest("Error: could not log out");
            }
            return Ok();
        }

        [HttpPost, Route("update/username")]
        public async Task<ActionResult> UpdateUserName(UserUpdateDTO updateData)
        {
            if (updateData != null && updateData.CurrentUserName != null && updateData.NewUserName != null)
            {
                User newUser = await _userService.GetUserByUserName(updateData.NewUserName);
                if (newUser != null)
                {
                    return BadRequest("Username already claimed");
                }
                User user = await _userService.GetUserByUserName(updateData.CurrentUserName);
                if (user == null)
                {
                    return NotFound("Couldn't find user");
                }
                IdentityResult result = await _userManager.SetUserNameAsync(user, updateData.NewUserName);
                if (result.Errors.ToList().Count > 0)
                {
                    //var errors = result.Errors.Select(e => e.Description);
                    //Printer log Identity errors: 
                    return BadRequest("Server error");
                }
                //await RefreshLoggedUser(user);
                User updatedUser = await _userService.GetUserByUserName(updateData.NewUserName);

                string token = _tokenGenerator.GenerateAccessToken(user);
                string refreshToken = _tokenGenerator.GenerateRefreshToken(user);

                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
                await _userManager.UpdateAsync(user);

                JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token, RefreshToken = refreshToken };
                _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);
                _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

                return Ok();
            }
            return BadRequest("Wrong data");
        }

        private async Task RefreshLoggedUser(User user)
        {
            await _signInManager.SignOutAsync();
            await _signInManager.SignInAsync(user, true);
        }

        [HttpPost, Route("update/email")]
        public async Task<ActionResult> UpdateEmail(UserUpdateDTO updateData)
        {
            Printer.Log($"Updating email of {updateData.CurrentUserName}");
            if (updateData != null && updateData.CurrentUserName != null && updateData.NewEmail != null)
            {
                User newUser = await _userManager.FindByEmailAsync(updateData.NewEmail);
                if (newUser != null)
                {
                    return BadRequest("Email already taken");
                }
                User user = await _userService.GetUserByUserName(updateData.CurrentUserName);
                if (user == null)
                {
                    return NotFound("Couldn't find user");
                }
                IdentityResult result = await _userManager.SetEmailAsync(user, updateData.NewEmail);
                if (!result.Succeeded)
                {
                    //var errors = signUpResult.Errors.Select(e => e.Description);
                    //Printer log Identity errors: 
                    return BadRequest("Server error");
                }
                await _userManager.UpdateAsync(user);
                User updatedUser = await _userService.GetUserByUserName(user.UserName);
                var token = _tokenGenerator.GenerateAccessToken(updatedUser);

                JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token };
                _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

                return Ok();
            }
            return BadRequest("Wrong data");
        }

        [HttpGet, Route("code")]
        public async Task<ActionResult> GetEmailConfirmationCode()
        {
            Printer.Log($"Getting email verification code");
            if (User.Identity.Name != null)
            {
                var user = await _userManager.FindByNameAsync(User.Identity.Name);
                if (user == null)
                {
                    return NotFound("Couldn't find user");
                }
                string token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var tokenBytes = Encoding.UTF8.GetBytes(token);
                var encodedToken = WebEncoders.Base64UrlEncode(tokenBytes);
                string confirmationLink = $"http://localhost:4200/emailconfirmation?email={user.Email}&token={encodedToken}";
                string emailTo = user.Email;
                string subject = "Confirm email";
                string message = $"Confirmation email link {confirmationLink}";

                bool emailSent = await _emailService.SendEmailAsync(emailTo, subject, message);
                if (!emailSent)
                {
                    return BadRequest("Error sending email");
                }
                return Ok();
            }
            return BadRequest("No user logged");
        }

        [HttpPost, Route("update/code")]
        public async Task<ActionResult> ConfirmEmail(UserUpdateDTO updateData)
        {
            string email = updateData.CurrentEmail;
            string inputToken = updateData.EmailConfirmationCode;
            var decodedTokenBytes = WebEncoders.Base64UrlDecode(inputToken);
            var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return BadRequest("User not found");
            }
            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
            if (!result.Succeeded)
            {
                return BadRequest("Error confirming email");
            }
            User updatedUser = await _userService.GetUserByUserName(user.UserName);
            var token = _tokenGenerator.GenerateAccessToken(updatedUser);

            JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token };
            _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

            return Ok();
        }

        [HttpPost, Route("update/password")]
        public async Task<ActionResult> UpdatePassword(UserUpdateDTO updateData)
        {
            Printer.Log($"Updating password of {updateData.CurrentUserName}");
            if (updateData != null && updateData.CurrentUserName != null
                && updateData.CurrentPassword != null && updateData.NewPassword != null)
            {
                User user = await _userService.GetUserByUserName(updateData.CurrentUserName);
                if (user == null)
                {
                    return NotFound("Couldn't find user");
                }
                IdentityResult result = await _userManager.ChangePasswordAsync(user, updateData.CurrentPassword, updateData.NewPassword);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description);
                    return BadRequest(errors.ToList()[0]);
                }
                User updatedUser = await _userService.GetUserByUserName(user.UserName);
                var token = _tokenGenerator.GenerateAccessToken(updatedUser);

                JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token };
                _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

                return Ok();
            }
            return BadRequest("Wrong data");
        }

        [HttpPost, Route("update/name")]
        public async Task<ActionResult> UpdateName(UserUpdateDTO updateData)
        {
            Printer.Log("Trying to change name of ", updateData.CurrentUserName);
            if (updateData != null && updateData.CurrentUserName != null && updateData.NewName != null)
            {
                User user = await _userService.GetUserByUserName(updateData.CurrentUserName);
                if (user == null)
                {
                    return NotFound("Couldn't find user");
                }
                bool result = await _userService.ChangeName(user, updateData.NewName);
                if (!result)
                {
                    //var errors = signUpResult.Errors.Select(e => e.Description);
                    //Printer log Identity errors: 
                    return BadRequest("Server error");
                }
                User updatedUser = await _userService.GetUserByUserName(user.UserName);
                var token = _tokenGenerator.GenerateAccessToken(updatedUser);

                JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token };
                _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

                return Ok();
            }
            return BadRequest("Wrong data");
        }

        [HttpPost, Route("update/picture")]
        public async Task<ActionResult> UpdatePicture(UserUpdateDTO updateData)
        {
            if (updateData != null && updateData.CurrentUserName != null && updateData.NewPictureKey != null)
            {
                User user = await _userService.GetUserByUserName(updateData.CurrentUserName);
                if (user == null)
                {
                    return NotFound("Couldn't find user");
                }
                user.Picture = updateData.NewPictureKey;
                IdentityResult result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    //var errors = signUpResult.Errors.Select(e => e.Description);
                    //Printer log Identity errors: 
                    return BadRequest("Server error");
                }
                User updatedUser = await _userService.GetUserByUserName(user.UserName);
                var token = _tokenGenerator.GenerateAccessToken(updatedUser);

                JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token };
                _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

                return Ok();
            }
            return BadRequest("Wrong data");
        }

        [HttpPost, Route("update/country")]
        public async Task<ActionResult> UpdateCountry(UserUpdateDTO updateData)
        {
            if (updateData != null && updateData.CurrentUserName != null && updateData.NewCountryCode != null)
            {
                User user = await _userService.GetUserByUserName(updateData.CurrentUserName);
                if (user == null)
                {
                    return NotFound("Couldn't find user");
                }
                user.Country = updateData.NewCountryCode;
                IdentityResult result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    //var errors = signUpResult.Errors.Select(e => e.Description);
                    //Printer log Identity errors: 
                    return BadRequest("Server error");
                }
                User updatedUser = await _userService.GetUserByUserName(user.UserName);
                var token = _tokenGenerator.GenerateAccessToken(updatedUser);

                JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token };
                _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

                return Ok();
            }
            return BadRequest("Wrong data");
        }

        [HttpPost, Route("update/visibility")]
        public async Task<ActionResult> UpdateVisibility(UserUpdateDTO updateData)
        {
            Printer.Log($"Updating visibility of {updateData.CurrentUserName}");
            if (updateData != null && updateData.CurrentUserName != null && updateData.NewVisibility != null)
            {
                User user = await _userService.GetUserByUserName(updateData.CurrentUserName);
                if (user == null)
                {
                    return NotFound("Couldn't find user");
                }
                user.Visibility = (bool)updateData.NewVisibility;
                IdentityResult result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    //var errors = signUpResult.Errors.Select(e => e.Description);
                    //Printer log Identity errors: 
                    return BadRequest("Server error");
                }
                User updatedUser = await _userService.GetUserByUserName(user.UserName);
                var token = _tokenGenerator.GenerateAccessToken(updatedUser);

                JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token };
                _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

                return Ok();
            }
            return BadRequest("Wrong data");
        }

        [HttpPost, Route("delete")]
        public async Task<ActionResult> DeleteLoggedUser()
        {
            Printer.Log("Deleting user...");
            if (User.Identity.Name == null)
            {
                return NotFound("No user is logged");
            }
            User user = await _userManager.FindByNameAsync(User.Identity.Name);
            if (user != null)
            {
                //for external logins
                /*
                foreach (var login in logins.ToList())
                {
                    await _userManager.RemoveLoginAsync(login.UserId, new UserLoginInfo(login.LoginProvider, login.ProviderKey));
                }
                */
                await _pokeTeamService.DeleteUserTeams(user);
                IdentityResult deleted = await _userManager.DeleteAsync(user);
                if (!deleted.Succeeded)
                {
                    return NotFound("Couldn't delete user");
                }
            }
            else
            {
                return NotFound("Couldn't find user");
            }

            return Ok();
        }

        //Make so only admin -> remove for production
        
        [HttpPost, Route("delete/{userName}")]
        public async Task<ActionResult<UserDTO>> DeleteUserByUserName(string userName)
        {
            Printer.Log("Deleting user...");
            User user = await _userService.GetUserByUserName(userName);
            if (user != null)
            {
                await _pokeTeamService.DeleteUserTeams(user);
                IdentityResult deleted = await _userManager.DeleteAsync(user);
                if (!deleted.Succeeded)
                {
                    return NotFound("Couldn't delete user");
                }
            }
            else
            {
                return NotFound("Couldn't find user");
            }
            return Ok();
        }
        
    }
}
