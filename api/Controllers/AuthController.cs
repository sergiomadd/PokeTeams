using api.DTOs;
using api.Models.DBPoketeamModels;
using api.Services;
using api.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly TokenGenerator _tokenGenerator;
        private readonly IUserService _userService;
        private readonly IPokeTeamService _pokeTeamService;

        public AuthController(UserManager<User> userManager,
            SignInManager<User> signInManager,
            TokenGenerator tokenGenerator,
            IUserService userService,
            IPokeTeamService teamService
            )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenGenerator = tokenGenerator;
            _userService = userService;
            _pokeTeamService = teamService;
        }

        [HttpGet, Route("logged")]
        public async Task<ActionResult<IdentityResponseDTO>> GetLoggedUser()
        {
            Printer.Log("Trying to get logged user...");
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
                        return Unauthorized(new IdentityResponseDTO { Success = false, Errors = new string[] { "Logged user not found" } });
                    }
                }
                else
                {
                    return NotFound(new IdentityResponseDTO { Success = false, Errors = new string[] { "No user logged" } });
                }

            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return BadRequest("Getting user error, exception");
            }
            return Ok(new IdentityResponseDTO { User = userDTO, Success = true });
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
                    return BadRequest(new IdentityResponseDTO { Errors = new string[] { "Form invalid" } });
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
                    var token = _tokenGenerator.GenerateToken(signedUserByUserName);
                    return await PerformLogIn(signedUserByUserName, model);
                }
                else
                {
                    return BadRequest(new IdentityResponseDTO { Errors = new string[] { "User not found." } });
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return BadRequest(new IdentityResponseDTO { Errors = new string[] { "Log in error, exception, Model not valid" } });
            }
        }

        private async Task<ActionResult> PerformLogIn(User user, LogInDTO model)
        {
            if (await _userManager.CheckPasswordAsync(user, model.Password) == false)
            {
                return Unauthorized(new IdentityResponseDTO { Errors = new string[] { "Invalid credentials" } });
            }
            Microsoft.AspNetCore.Identity.SignInResult logInResult = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, model.RememberMe, lockoutOnFailure: false);
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
            Printer.Log("User successfully loged in.");
            var token = _tokenGenerator.GenerateToken(user);
            return Ok(new JwtResponseDTO { Token = token });
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
                    return BadRequest(new IdentityResponseDTO { Errors = new string[] { "Form invalid" } });
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
            var token = _tokenGenerator.GenerateToken(user);
            return Ok(new JwtResponseDTO { Token = token });
        }

        [HttpGet, Route("logout")]
        public async Task LogOut()
        {
            Printer.Log("User logged out.");
            await _signInManager.SignOutAsync();
        }

        [HttpPost, Route("update/username")]
        public async Task<ActionResult> UpdateUserName(UserUpdateDTO updateData)
        {
            if (updateData != null && updateData.CurrentUserName != null && updateData.NewUserName != null)
            {
                User newUser = await _userService.GetUserByUserName(updateData.NewUserName);
                if (newUser != null)
                {
                    return BadRequest(new IdentityResponseDTO { Success = false, Errors = new List<string> { "UserName already claimed" } });
                }
                User user = await _userService.GetUserByUserName(updateData.CurrentUserName);
                if (user == null)
                {
                    return NotFound(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Couldn't find user" } });
                }
                IdentityResult result = await _userManager.SetUserNameAsync(user, updateData.NewUserName);
                if (result.Errors.ToList().Count > 0)
                {
                    return BadRequest(new IdentityResponseDTO { Success = false, Errors = result.Errors.Select(e => e.Description).ToList() });
                }
                //await RefreshLoggedUser(user);
                User updatedUser = await _userService.GetUserByUserName(updateData.NewUserName);
                var token = _tokenGenerator.GenerateToken(updatedUser);
                return Ok(new JwtResponseDTO { Token = token });
            }
            return BadRequest(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Wrong data" } });
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
                    return BadRequest(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Email already claimed" } });
                }
                User user = await _userService.GetUserByUserName(updateData.CurrentUserName);
                if (user == null)
                {
                    return NotFound(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Couldn't find user" } });
                }
                IdentityResult result = await _userManager.SetEmailAsync(user, updateData.NewEmail);
                if (result.Errors.ToList().Count > 0)
                {
                    return BadRequest(new IdentityResponseDTO { Success = false, Errors = result.Errors.Select(e => e.Description).ToList() });
                }
                await _userManager.UpdateAsync(user);
                User updatedUser = await _userService.GetUserByUserName(user.UserName);
                var token = _tokenGenerator.GenerateToken(updatedUser);
                return Ok(new JwtResponseDTO { Token = token });
            }
            return BadRequest(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Wrong data" } });
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
                    return NotFound(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Couldn't find user" } });
                }
                IdentityResult result = await _userManager.ChangePasswordAsync(user, updateData.CurrentPassword, updateData.NewPassword);
                if (result.Errors.ToList().Count > 0)
                {
                    return BadRequest(new IdentityResponseDTO { Success = false, Errors = result.Errors.Select(e => e.Description).ToList() });
                }
                User updatedUser = await _userService.GetUserByUserName(user.UserName);
                var token = _tokenGenerator.GenerateToken(updatedUser);
                return Ok(new JwtResponseDTO { Token = token });
            }
            return BadRequest(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Wrong data" } });
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
                    return NotFound(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Couldn't find user" } });
                }
                IdentityResponseDTO result = await _userService.ChangeName(user, updateData.NewName);
                if (result.Errors.ToList().Count > 0)
                {
                    return BadRequest(new IdentityResponseDTO { Success = false, Errors = result.Errors });
                }
                User updatedUser = await _userService.GetUserByUserName(user.UserName);
                var token = _tokenGenerator.GenerateToken(updatedUser);
                return Ok(new JwtResponseDTO { Token = token });
            }
            return BadRequest(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Wrong data" } });
        }

        [HttpPost, Route("update/picture")]
        public async Task<ActionResult> UpdatePicture(UserUpdateDTO updateData)
        {
            if (updateData != null && updateData.CurrentUserName != null && updateData.NewPictureKey != null)
            {
                User user = await _userService.GetUserByUserName(updateData.CurrentUserName);
                if (user == null)
                {
                    return NotFound(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Couldn't find user" } });
                }
                user.Picture = updateData.NewPictureKey;
                IdentityResult result = await _userManager.UpdateAsync(user);
                if (result.Errors.ToList().Count > 0)
                {
                    return BadRequest(new IdentityResponseDTO { Success = false, Errors = result.Errors.Select(e => e.Description).ToList() });
                }
                User updatedUser = await _userService.GetUserByUserName(user.UserName);
                var token = _tokenGenerator.GenerateToken(updatedUser);
                return Ok(new JwtResponseDTO { Token = token });
            }
            return BadRequest(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Wrong data" } });
        }

        [HttpPost, Route("update/country")]
        public async Task<ActionResult> UpdateCountry(UserUpdateDTO updateData)
        {
            if (updateData != null && updateData.CurrentUserName != null && updateData.NewCountryCode != null)
            {
                User user = await _userService.GetUserByUserName(updateData.CurrentUserName);
                if (user == null)
                {
                    return NotFound(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Couldn't find user" } });
                }
                user.Country = updateData.NewCountryCode;
                IdentityResult result = await _userManager.UpdateAsync(user);
                if (result.Errors.ToList().Count > 0)
                {
                    return BadRequest(new IdentityResponseDTO { Success = false, Errors = result.Errors.Select(e => e.Description).ToList() });
                }
                User updatedUser = await _userService.GetUserByUserName(user.UserName);
                var token = _tokenGenerator.GenerateToken(updatedUser);
                return Ok(new JwtResponseDTO { Token = token });
            }
            return BadRequest(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Wrong data" } });
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
                    return NotFound(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Couldn't find user" } });
                }
                user.Visibility = (bool)updateData.NewVisibility;
                IdentityResult result = await _userManager.UpdateAsync(user);
                if (result.Errors.ToList().Count > 0)
                {
                    return BadRequest(new IdentityResponseDTO { Success = false, Errors = result.Errors.Select(e => e.Description).ToList() });
                }
                User updatedUser = await _userService.GetUserByUserName(user.UserName);
                var token = _tokenGenerator.GenerateToken(updatedUser);
                return Ok(new JwtResponseDTO { Token = token });
            }
            return BadRequest(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Wrong data" } });
        }

        [HttpPost, Route("delete")]
        public async Task<ActionResult> DeleteLoggedUser()
        {
            Printer.Log("Deleting user...");
            if (User.Identity.Name == null)
            {
                return NotFound(new IdentityResponseDTO { Success = false, Errors = new List<string> { "No user logged" } });
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
                    return NotFound(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Couldn't delete user" } });
                }
            }
            else
            {
                return NotFound(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Couldn't find user" } });
            }

            return Ok(new IdentityResponseDTO { Success = true });
        }

        //Make so only admin
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
                    return NotFound(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Couldn't delete user" } });
                }
            }
            else
            {
                return NotFound(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Couldn't find user" } });
            }

            return Ok(new IdentityResponseDTO { Success = true });
        }

        [AllowAnonymous]
        [HttpGet, Route("check/username/{userName}")]
        public async Task<ActionResult<IdentityResponseDTO>> UserNameAvailable(string userName)
        {
            Printer.Log($"Checking availability of {userName}");
            bool available = await _userService.UserNameAvailable(userName);
            if (!available)
            {
                return Conflict(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Username already taken." } });
            }
            return Ok(new IdentityResponseDTO { Success = true });
        }

        [AllowAnonymous]
        [HttpGet, Route("check/email/{email}")]
        public async Task<ActionResult<IdentityResponseDTO>> EmailAvailable(string email)
        {
            User user = await _userManager.FindByEmailAsync(email);
            if (user != null)
            {
                return Conflict(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Email already taken." } });
            }
            return Ok(new IdentityResponseDTO { Success = true });
        }
    }
}
