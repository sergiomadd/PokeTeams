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
using api.Data;

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
        private readonly ITeamService _pokeTeamService;
        private readonly IEmailService _emailService;
        private readonly IIdentityService _identityService;
        private readonly PokeTeamContext _pokeTeamContext;

        public AuthController(UserManager<User> userManager,
            SignInManager<User> signInManager,
            TokenGenerator tokenGenerator,
            IUserService userService,
            ITeamService teamService,
            IEmailService emailService,
            IIdentityService identityService,
            PokeTeamContext pokeTeamContext
            )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenGenerator = tokenGenerator;
            _userService = userService;
            _pokeTeamService = teamService;
            _emailService = emailService;
            _identityService = identityService;
            _pokeTeamContext = pokeTeamContext;
        }

        [AllowAnonymous]
        [HttpPost("refresh")]
        public async Task<ActionResult> RefreshToken()
        {
            using (var transaction = await _pokeTeamContext.Database.BeginTransactionAsync())
            {
                try
                {
                    HttpContext.Request.Cookies.TryGetValue("refreshToken", out var refreshToken);
                    if (refreshToken == null)
                    {
                        return BadRequest("Refresh Error");
                    }

                    var principal = _tokenGenerator.GetPrincipalFromRefreshToken(refreshToken);
                    if (principal == null)
                    {
                        return BadRequest("Refresh Error");
                    }

                    var username = principal?.Identity?.Name;
                    var user = await _userManager.FindByNameAsync(username);
                    if (user is null || user.RefreshToken == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                    {
                        return BadRequest("Refresh Error");
                    }

                    string newRefreshToken = _tokenGenerator.GenerateRefreshToken(user);
                    user.RefreshToken = newRefreshToken;
                    user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

                    //Needed for back to back refresh requests
                    var result = await _userManager.UpdateAsync(user);
                    if (!result.Succeeded)
                    {
                        await transaction.RollbackAsync();
                        return Conflict("Refresh Conflict");
                    }

                    await transaction.CommitAsync();

                    var newAccessToken = _tokenGenerator.GenerateAccessToken(user);
                    JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = newAccessToken, RefreshToken = newRefreshToken };
                    _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

                    return Ok();
                }
                catch (Exception ex)
                {
                    Printer.Log("Error in refresh: ", ex);
                    await transaction.RollbackAsync();
                    return StatusCode(500, "Internal server error");
                }
            }
        }
        
        [HttpGet, Route("logged")]
        public async Task<ActionResult> GetLoggedUser()
        {
            UserDTO userDTO;
            try
            {
                User? user = await _identityService.GetLoggedUser();
                if (user == null)
                {
                    return BadRequest("No user logged");
                }
                userDTO = await _userService.BuildUserDTO(user, true);
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
                User? user = await _identityService.GetLoggedUser();
                if (user == null)
                {
                    return BadRequest("No user logged");
                }
                emailDTO = new EmailDTO
                {
                    Email = user.Email,
                    EmailConfirmed = user.EmailConfirmed
                };
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
            try
            {

                User? signedUserByEmail = await _userManager.FindByEmailAsync(model.UserNameOrEmail);
                User? signedUserByUserName = await _userManager.FindByNameAsync(model.UserNameOrEmail);
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
            if (logInResult.RequiresTwoFactor)
            {
                return Unauthorized("Two factor authentication is needed");
            }
            if (logInResult.IsLockedOut)
            {
                return Unauthorized("Your account is locked out");
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
        public async Task<ActionResult> SignUp(SignUpDTO model)
        {
            User user;
            try
            {
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
                    return BadRequest("Sign up failed");
                }
                await _signInManager.SignInAsync(user, true);
            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return BadRequest("Sign up error");
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

        [HttpPost, Route("logout")]
        public async Task<ActionResult> LogOut()
        {
            try
            {
                User? user = await _identityService.GetLoggedUser();
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
            if (updateData == null || updateData.NewUserName == null)
            {
                return BadRequest("Wrong data");
            }
            if (!await _userService.UserNameAvailable(updateData.NewUserName))
            {
                return BadRequest("Username already claimed");
            }
            User? user = await _identityService.GetLoggedUser();
            if (user == null)
            {
                return BadRequest("No user logged");
            }
            IdentityResult result = await _userManager.SetUserNameAsync(user, updateData.NewUserName);
            if (result.Errors.ToList().Count > 0)
            {
                return BadRequest("Server error");
            }
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

        [HttpPost, Route("update/email")]
        public async Task<ActionResult> UpdateEmail(UserUpdateDTO updateData)
        {
            if (updateData == null || updateData.NewEmail == null)
            {
                return BadRequest("Wrong data");
            }
            User? newUser = await _userManager.FindByEmailAsync(updateData.NewEmail);
            if (newUser != null)
            {
                return BadRequest("Email already taken");
            }
            User? user = await _identityService.GetLoggedUser();
            if (user == null)
            {
                return BadRequest("No user logged");
            }
            IdentityResult result = await _userManager.SetEmailAsync(user, updateData.NewEmail);
            if (!result.Succeeded)
            {
                return BadRequest("Server error");
            }
            await _userManager.UpdateAsync(user);
            User updatedUser = await _userService.GetUserByUserName(user.UserName);
            var token = _tokenGenerator.GenerateAccessToken(updatedUser);

            JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token };
            _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

            return Ok();
        }

        [HttpGet, Route("code")]
        public async Task<ActionResult> GetEmailConfirmationCode()
        {
            var user = await _identityService.GetLoggedUser();
            string token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var tokenBytes = Encoding.UTF8.GetBytes(token);
            var encodedToken = WebEncoders.Base64UrlEncode(tokenBytes);
            string confirmationLink = $"http://localhost:4200/user/{user.UserName}/emailconfirmation?email={user.Email}&token={encodedToken}";
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

        [HttpPost, Route("update/code")]
        public async Task<ActionResult> ConfirmEmail(UserUpdateDTO updateData)
        {
            User? user = await _identityService.GetLoggedUser();
            if (user == null)
            {
                return BadRequest("No user logged");
            }
            string? email = user.Email;
            string? inputToken = updateData.EmailConfirmationCode;
            if(email == null ||  inputToken == null)
            {
                return BadRequest("Wrong data");
            }
            var decodedTokenBytes = WebEncoders.Base64UrlDecode(inputToken);
            var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);

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
            if (updateData == null || updateData.CurrentPassword == null || updateData.NewPassword == null)
            {
                return BadRequest("Wrong data");
            }
            User? user = await _identityService.GetLoggedUser();
            if (user == null)
            {
                return BadRequest("No user logged");
            }
            IdentityResult result = await _userManager.ChangePasswordAsync(user, updateData.CurrentPassword, updateData.NewPassword);
            if (!result.Succeeded)
            {
                return BadRequest("Server error");
            }
            User updatedUser = await _userService.GetUserByUserName(user.UserName);
            var token = _tokenGenerator.GenerateAccessToken(updatedUser);

            JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token };
            _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

            return Ok();
        }

        [HttpPost, Route("update/name")]
        public async Task<ActionResult> UpdateName(UserUpdateDTO updateData)
        {
            if (updateData == null || updateData.NewName == null)
            {
                return BadRequest("Wrong data");
            }
            User? user = await _identityService.GetLoggedUser();
            if (user == null)
            {
                return BadRequest("No user logged");
            }
            bool result = await _userService.ChangeName(user, updateData.NewName);
            if (!result)
            {
                return BadRequest("Server error");
            }
            User updatedUser = await _userService.GetUserByUserName(user.UserName);
            var token = _tokenGenerator.GenerateAccessToken(updatedUser);

            JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token };
            _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

            return Ok();
        }

        [HttpPost, Route("update/picture")]
        public async Task<ActionResult> UpdatePicture(UserUpdateDTO updateData)
        {
            if (updateData == null || updateData.NewPictureKey == null)
            {
                return BadRequest("Wrong data");
            }
            User? user = await _identityService.GetLoggedUser();
            if (user == null)
            {
                return BadRequest("No user logged");
            }
            user.Picture = updateData.NewPictureKey;
            IdentityResult result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest("Server error");
            }
            User updatedUser = await _userService.GetUserByUserName(user.UserName);
            var token = _tokenGenerator.GenerateAccessToken(updatedUser);

            JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token };
            _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

            return Ok();
        }

        [HttpPost, Route("update/country")]
        public async Task<ActionResult> UpdateCountry(UserUpdateDTO updateData)
        {
            if (updateData == null || updateData.NewCountryCode == null)
            {
                return BadRequest("Wrong data");
            }
            User? user = await _identityService.GetLoggedUser();
            if (user == null)
            {
                return BadRequest("No user logged");
            }
            user.Country = updateData.NewCountryCode;
            IdentityResult result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest("Server error");
            }
            User updatedUser = await _userService.GetUserByUserName(user.UserName);
            var token = _tokenGenerator.GenerateAccessToken(updatedUser);

            JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token };
            _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

            return Ok();
        }

        [HttpPost, Route("update/visibility")]
        public async Task<ActionResult> UpdateVisibility(UserUpdateDTO updateData)
        {
            if (updateData == null || updateData.NewVisibility == null)
            {
                return BadRequest("Wrong data");
            }
            User? user = await _identityService.GetLoggedUser();
            if (user == null)
            {
                return BadRequest("No user logged");
            }
            user.Visibility = (bool)updateData.NewVisibility;
            IdentityResult result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest("Server error");
            }
            User updatedUser = await _userService.GetUserByUserName(user.UserName);
            var token = _tokenGenerator.GenerateAccessToken(updatedUser);

            JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token };
            _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

            return Ok();
        }

        [HttpPost, Route("delete")]
        public async Task<ActionResult> DeleteLoggedUser()
        {
            User? loggedUser = await _identityService.GetLoggedUser();
            if (loggedUser == null)
            {
                return BadRequest("No user logged");
            }
            //for external logins
            /*
            foreach (var login in logins.ToList())
            {
                await _userManager.RemoveLoginAsync(login.UserId, new UserLoginInfo(login.LoginProvider, login.ProviderKey));
            }
            */
            await _pokeTeamService.DeleteUserTeams(loggedUser);
            IdentityResult deleted = await _userManager.DeleteAsync(loggedUser);
            if (!deleted.Succeeded)
            {
                return BadRequest("Couldn't delete user");
            }

            return Ok();
        }

        [HttpGet, Route("own/{teamID}")]
        public async Task<ActionResult> DoesLoggedUserOwnTeam(string teamID)
        {
            User? loggedUser = await _identityService.GetLoggedUser();
            if (loggedUser == null)
            {
                return BadRequest("No user logged");
            }
            Team? team = await _pokeTeamService.GetTeamModel(teamID);
            if(team == null || team.PlayerId == null || team.PlayerId != loggedUser.Id)
            {
                return Unauthorized("Unauthorized");
            }
            return Ok(true);
        }

        //Make so only admin -> remove for production
        /*
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
        */
    }
}
