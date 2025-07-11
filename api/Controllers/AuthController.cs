﻿using api.DTOs;
using api.Models.DBPoketeamModels;
using api.Services;
using api.Util;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using api.Data;
using System.Security.Claims;
using Microsoft.AspNetCore.RateLimiting;
using api.Middlewares;
using System.Reflection;
using NuGet.Common;
using Google.Apis.Auth;

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
        private readonly IConfiguration _config;
        private readonly PokeTeamContext _pokeTeamContext;
        private readonly IWebHostEnvironment _env;
        private readonly Printer Printer;
        private readonly IExternalAuthService _externalAuthService;
        private string baseUrl;

        public AuthController(UserManager<User> userManager,
            SignInManager<User> signInManager,
            TokenGenerator tokenGenerator,
            IUserService userService,
            ITeamService teamService,
            IEmailService emailService,
            IIdentityService identityService,
            PokeTeamContext pokeTeamContext,
            IConfiguration config,
            IWebHostEnvironment env,
            Printer printer,
            IExternalAuthService externalAuthService
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
            _config = config;
            _env = env;
            Printer = printer;
            _externalAuthService = externalAuthService;

            baseUrl = "";

            if (_env.IsDevelopment())
            {
                string? baseUrlTemp = _config["ClientBaseUrl"];
                if (baseUrlTemp != null)
                {
                    baseUrl = (string)baseUrlTemp;
                }
            }
            else
            {
                string? baseUrlTemp = _config["BaseUrl"];
                if (baseUrlTemp != null)
                {
                    baseUrl = (string)baseUrlTemp;
                }
            }
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
                        _tokenGenerator.RemoveTokensFromCookie(HttpContext);
                        return BadRequest("Refresh Error");
                    }

                    var principal = _tokenGenerator.GetPrincipalFromRefreshToken(refreshToken);
                    if (principal == null)
                    {
                        _tokenGenerator.RemoveTokensFromCookie(HttpContext);
                        return BadRequest("Refresh Error");
                    }

                    string? username = principal?.Identity?.Name;
                    if (username == null)
                    {
                        return BadRequest("Refresh Error");
                    }
                    var user = await _userManager.FindByNameAsync(username);
                    if (user is null || user.RefreshToken == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                    {
                        _tokenGenerator.RemoveTokensFromCookie(HttpContext);
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
                    _tokenGenerator.RemoveTokensFromCookie(HttpContext);
                    await transaction.RollbackAsync();
                    return BadRequest("Refresh Error");
                }
            }
        }
        
        [HttpGet, Route("logged")]
        public async Task<ActionResult> GetLoggedUser()
        {
            User? user = await _identityService.GetLoggedUser();
            if (user == null)
            {
                return BadRequest("No user logged");
            }
            UserDTO? userDTO = await _userService.BuildUserDTO(user, true);
            if (userDTO == null)
            {
                return BadRequest("Error getting logged user");
            }
            return Ok(userDTO);
        }

        [HttpGet, Route("email")]
        public async Task<ActionResult> GetLoggedUserEmail()
        {
            User? user = await _identityService.GetLoggedUser();
            if (user == null)
            {
                return BadRequest("No user logged");
            }
            EmailDTO emailDTO = new EmailDTO
            {
                Email = user.Email,
                EmailConfirmed = user.EmailConfirmed
            };
            return Ok(emailDTO);
        }

        [AllowAnonymous]
        [EnableRateLimiting("authLimiterBase")]
        [RateLimitResponse("Too many tries, try again in 5 minutes.")]
        [HttpPost, Route("login")]
        public async Task<ActionResult> LogIn(LogInDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Login form not valid");
            }
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
        [EnableRateLimiting("authLimiterHard")]
        [RateLimitResponse("Too many changes, you can only change 1 per day.")]
        [HttpPost, Route("signup")]
        public async Task<ActionResult> SignUp(SignUpDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Signup form not valid");
            }
            User user = new User
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
        [HttpPost("signin-google")]
        public async Task<ActionResult> ExternalLoginGoogle([FromBody] ExternalAuthDTO request)
        {
            if(request == null || request.IdToken == null)
            {
                return BadRequest("Wrong data");
            }

            GoogleJsonWebSignature.Payload? payload = await _externalAuthService.VerifyGoogleToken(request.IdToken);
            if (payload == null)
            {
                return BadRequest("Invalid External Authentication");
            }

            UserLoginInfo info = new UserLoginInfo(request.Provider ?? "", payload.Subject, request.Provider);
            User? user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(payload.Email);
                if(user == null)
                {
                    string usernameBase = payload.Name != null ? payload.Name : payload.Email.Split("@")[0];
                    string uniqueUsername = await GenerateUniqueUsername(Formatter.RemoveDiacritics(usernameBase));
                    user = new User
                    {
                        UserName = uniqueUsername,
                        Email = payload.Email,
                        EmailConfirmed = true,
                        Picture = "snorlax",
                        Visibility = true
                    };

                    var signUpResult = await _userManager.CreateAsync(user);
                    if (!signUpResult.Succeeded)
                    {
                        return BadRequest("Sign up failed");
                    }
                    await _userManager.AddLoginAsync(user, info);
                }
                else
                {
                    await _userManager.AddLoginAsync(user, info);
                }

            }
            if (user == null)
            {
                return BadRequest("Invalid External Authentication");
            }
            await _signInManager.SignInAsync(user, true);

            string token = _tokenGenerator.GenerateAccessToken(user);
            string refreshToken = _tokenGenerator.GenerateRefreshToken(user);

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userManager.UpdateAsync(user);

            JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token, RefreshToken = refreshToken };
            _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

            return Ok();
        }

        private async Task<string> GenerateUniqueUsername(string baseName)
        {
            var username = baseName.ToLower().Replace(" ", "").Replace(".", "");
            var originalUsername = username;
            int suffix = 1;

            while (await _userManager.FindByNameAsync(username) != null)
            {
                username = $"{originalUsername}{suffix}";
                suffix++;
            }

            return username;
        }

        //Add rate limiting
        [AllowAnonymous]
        [EnableRateLimiting("ipEmailLimiter")]
        [RateLimitResponse("Too many requests. Try again tomorrow.")]
        [HttpPost, Route("forgot")]
        public async Task<ActionResult> ForgotPassword(UserUpdateDTO updateData)
        {
            if (updateData == null || updateData.CurrentEmail == null)
            {
                return BadRequest("Wrong data");
            }
            User? user = await _userManager.FindByEmailAsync(updateData.CurrentEmail);
            if (user == null)
            {
                //We return ok regardless to not disclouse email privacy
                return Ok("Recovery email sent");
            }
            string token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var tokenBytes = Encoding.UTF8.GetBytes(token);
            var encodedToken = WebEncoders.Base64UrlEncode(tokenBytes);
            string resetLink = $"{baseUrl}reset?email={updateData.CurrentEmail}&token={encodedToken}";
            string emailTo = updateData.CurrentEmail;
            string subject = "Reset password";
            string message = _emailService.GetResetPasswordBodyHTML(resetLink);

            bool emailSent = await _emailService.SendEmailAsync(emailTo, subject, message);
            if (!emailSent)
            {
                return BadRequest("Error sending email");
            }
            return Ok("Recovery email sent");
        }

        [AllowAnonymous]
        [EnableRateLimiting("authLimiterHard")]
        [RateLimitResponse("Too many changes, you can only change 1 per day.")]
        [HttpPost, Route("update/reset")]
        public async Task<ActionResult> ResetPassword(UserUpdateDTO updateData)
        {
            if (updateData == null || updateData.CurrentEmail == null || updateData.NewPassword == null || updateData.PasswordResetCode == null)
            {
                return BadRequest("Wrong data");
            }
            User? user = await _userManager.FindByEmailAsync(updateData.CurrentEmail);
            if (user == null)
            {
                return BadRequest("Invalid credentials");
            }
            byte[] decodedTokenBytes;
            string decodedToken;
            try
            {
                decodedTokenBytes = WebEncoders.Base64UrlDecode(updateData.PasswordResetCode);
                decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);
            }
            catch (Exception)
            {
                return BadRequest("Error reseting password");
            }
            IdentityResult result = await _userManager.ResetPasswordAsync(user, decodedToken, updateData.NewPassword);
            if (!result.Succeeded)
            {
                if(result.Errors.Any(e => e.Description.Contains("token")))
                {
                    return BadRequest("Password reset window expired, ask for a new email again");
                }
                return BadRequest("Server error");
            }
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
                return BadRequest("Server error, could not log out");
            }
            return Ok();
        }

        [EnableRateLimiting("authLimiterHard")]
        [RateLimitResponse("Too many changes, you can only change 1 per day.")]
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
            User? updatedUser = await _userService.GetUserByUserName(updateData.NewUserName);

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

        [EnableRateLimiting("authLimiterHard")]
        [RateLimitResponse("Too many changes, you can only change 1 per day.")]
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
            if (user == null || user.UserName == null)
            {
                return BadRequest("No user logged");
            }
            IdentityResult result = await _userManager.SetEmailAsync(user, updateData.NewEmail);
            if (!result.Succeeded)
            {
                return BadRequest("Server error");
            }
            await _userManager.UpdateAsync(user);
            User? updatedUser = await _userService.GetUserByUserName(user.UserName);
            var token = _tokenGenerator.GenerateAccessToken(updatedUser);

            JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token };
            _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

            return Ok();
        }

        [EnableRateLimiting("ipEmailLimiter")]
        [RateLimitResponse("Too many requests. Try again tomorrow.")]
        [HttpGet, Route("code")]
        public async Task<ActionResult> GetEmailConfirmationCode()
        {
            var user = await _identityService.GetLoggedUser();
            if (user == null || user.UserName == null)
            {
                return BadRequest("No user logged");
            }
            if (user.Email == null)
            {
                return BadRequest($"No defined email for {user.UserName}");
            }
            if (user.EmailConfirmed)
            {
                return BadRequest($"Email already confirmed for {user.UserName}");
            }
            string token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var tokenBytes = Encoding.UTF8.GetBytes(token);
            var encodedToken = WebEncoders.Base64UrlEncode(tokenBytes);
            string confirmationLink = $"{baseUrl}user/{user.UserName}/emailconfirmation?email={user.Email}&token={encodedToken}";
            string emailTo = user.Email;
            string subject = "Confirm email";
            string message = _emailService.GetConfirmEmailBodyHTML(confirmationLink);

            bool emailSent = await _emailService.SendEmailAsync(emailTo, subject, message);
            if (!emailSent)
            {
                return BadRequest("Error sending email");
            }
            return Ok();
        }

        [EnableRateLimiting("authLimiterSoft")]
        [RateLimitResponse("Too many changes, try again later.")]
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
            byte[] decodedTokenBytes;
            string decodedToken;
            try
            {
                decodedTokenBytes = WebEncoders.Base64UrlDecode(inputToken);
                decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);
            }
            catch(Exception)
            {
                return BadRequest("Error confirming email");
            }
            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
            if (!result.Succeeded)
            {
                return BadRequest("Error confirming email");
            }
            User? updatedUser = await _userService.GetUserByUserName(user.UserName);
            var token = _tokenGenerator.GenerateAccessToken(updatedUser);

            JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token };
            _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

            return Ok();
        }

        [EnableRateLimiting("authLimiterHard")]
        [RateLimitResponse("Too many changes, you can only change 1 per day.")]
        [HttpPost, Route("update/password")]
        public async Task<ActionResult> UpdatePassword(UserUpdateDTO updateData)
        {
            if (updateData == null || updateData.CurrentPassword == null || updateData.NewPassword == null)
            {
                return BadRequest("Wrong data");
            }
            User? user = await _identityService.GetLoggedUser();
            if (user == null || user.UserName == null)
            {
                return BadRequest("No user logged");
            }
            IdentityResult result = await _userManager.ChangePasswordAsync(user, updateData.CurrentPassword, updateData.NewPassword);
            if (!result.Succeeded)
            {
                return BadRequest("Server error");
            }
            User? updatedUser = await _userService.GetUserByUserName(user.UserName);
            var token = _tokenGenerator.GenerateAccessToken(updatedUser);
            JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token };
            _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);
            return Ok();
        }

        [EnableRateLimiting("authLimiterHard")]
        [RateLimitResponse("Too many changes, you can only change 1 per day.")]
        [HttpPost, Route("update/name")]
        public async Task<ActionResult> UpdateName(UserUpdateDTO updateData)
        {
            if (updateData == null || updateData.NewName == null)
            {
                return BadRequest("Wrong data");
            }
            User? user = await _identityService.GetLoggedUser();
            if (user == null || user.UserName == null)
            {
                return BadRequest("No user logged");
            }
            bool result = await _userService.ChangeName(user, updateData.NewName);
            if (!result)
            {
                return BadRequest("Server error");
            }
            User? updatedUser = await _userService.GetUserByUserName(user.UserName);
            var token = _tokenGenerator.GenerateAccessToken(updatedUser);

            JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token };
            _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

            return Ok();
        }

        [EnableRateLimiting("authLimiterSoft")]
        [RateLimitResponse("Too many changes, try again later.")]
        [HttpPost, Route("update/picture")]
        public async Task<ActionResult> UpdatePicture(UserUpdateDTO updateData)
        {
            if (updateData == null || updateData.NewPictureKey == null)
            {
                return BadRequest("Wrong data");
            }
            User? user = await _identityService.GetLoggedUser();
            if (user == null || user.UserName == null)
            {
                return BadRequest("No user logged");
            }
            user.Picture = updateData.NewPictureKey;
            IdentityResult result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest("Server error");
            }
            User? updatedUser = await _userService.GetUserByUserName(user.UserName);
            var token = _tokenGenerator.GenerateAccessToken(updatedUser);

            JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token };
            _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

            return Ok();
        }

        [EnableRateLimiting("authLimiterSoft")]
        [RateLimitResponse("Too many changes, try again later.")]
        [HttpPost, Route("update/country")]
        public async Task<ActionResult> UpdateCountry(UserUpdateDTO updateData)
        {
            if (updateData == null || updateData.NewCountryCode == null)
            {
                return BadRequest("Wrong data");
            }
            User? user = await _identityService.GetLoggedUser();
            if (user == null || user.UserName == null)
            {
                return BadRequest("No user logged");
            }
            user.Country = updateData.NewCountryCode;
            IdentityResult result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest("Server error");
            }
            User? updatedUser = await _userService.GetUserByUserName(user.UserName);
            var token = _tokenGenerator.GenerateAccessToken(updatedUser);

            JwtResponseDTO tokens = new JwtResponseDTO { AccessToken = token };
            _tokenGenerator.SetTokensInsideCookie(tokens, HttpContext);

            return Ok();
        }

        [EnableRateLimiting("authLimiterSoft")]
        [RateLimitResponse("Too many changes, try again later.")]
        [HttpPost, Route("update/visibility")]
        public async Task<ActionResult> UpdateVisibility(UserUpdateDTO updateData)
        {
            if (updateData == null || updateData.NewVisibility == null)
            {
                return BadRequest("Wrong data");
            }
            User? user = await _identityService.GetLoggedUser();
            if (user == null || user.UserName == null)
            {
                return BadRequest("No user logged");
            }
            user.Visibility = (bool)updateData.NewVisibility;
            IdentityResult result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest("Server error");
            }
            User? updatedUser = await _userService.GetUserByUserName(user.UserName);
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
            if(team == null || team.UserId == null || team.UserId != loggedUser.Id)
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
