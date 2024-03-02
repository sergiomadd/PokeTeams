using Microsoft.AspNetCore.Mvc;
using api.Models.DTOs;
using Microsoft.AspNetCore.Identity;
using api.Util;
using Microsoft.AspNetCore.Authorization;
using api.Data;
using api.Models.DBPoketeamModels;
using api.Services.TeamService;
using Newtonsoft.Json.Linq;
using System.Diagnostics;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IPokeTeamService _pokeTeamService;


        public UserController(UserManager<User> userManager,
            SignInManager<User> signInManager,
            IPokeTeamService teamService
            )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _pokeTeamService = teamService;
        }
        
        [AllowAnonymous]
        [HttpGet, Route("{userName}")]
        public async Task<ActionResult<UserDTO>> GetUserByUserName(string userName)
        {
            User user = await _pokeTeamService.GetUserByUserName(userName);
            if (user == null)
            {
                return NotFound("Couldn't find user");
            }
            UserDTO userDTO = await _pokeTeamService.BuildUserDTO(user ,await UserLoggedIn(user));
            return Ok(userDTO);
        }

        [HttpPost, Route("update/email")]
        public async Task<ActionResult<IdentityResponseDTO>> UpdateUserEmail(UserUpdateDTO updateData)
        {
            Printer.Log($"Updating email of {updateData.CurrentUserName}");
            if (updateData != null && updateData.CurrentUserName != null && updateData.NewEmail != null)
            {
                User newUser = await _userManager.FindByEmailAsync(updateData.NewEmail);
                if (newUser != null)
                {
                    return BadRequest(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Email already claimed" } });
                }
                User user = await _pokeTeamService.GetUserByUserName(updateData.CurrentUserName);
                if (user == null)
                {
                    return NotFound(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Couldn't find user" } });
                }
                IdentityResult result = await _userManager.SetEmailAsync(user, updateData.NewEmail);
                if (result.Errors.ToList().Count > 0)
                {
                    return BadRequest(new IdentityResponseDTO { Success = false, Errors = result.Errors.Select(e => e.Description).ToList() });
                }
                return Ok(new IdentityResponseDTO { Success = true });
            }
            return BadRequest(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Wrong data" } } );
        }

        [HttpPost, Route("update/password")]
        public async Task<ActionResult<IdentityResponseDTO>> UpdateUserPassword(UserUpdateDTO updateData)
        {
            Printer.Log($"Updating password of {updateData.CurrentUserName}");
            if (updateData != null && updateData.CurrentUserName != null 
                && updateData.CurrentPassword != null && updateData.NewPassword != null)
            {
                User user = await _pokeTeamService.GetUserByUserName(updateData.CurrentUserName);
                if (user == null)
                {
                    return NotFound(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Couldn't find user" } });
                }
                IdentityResult result = await _userManager.ChangePasswordAsync(user, updateData.CurrentPassword, updateData.NewPassword);
                if (result.Errors.ToList().Count > 0)
                {
                    return BadRequest(new IdentityResponseDTO { Success = false, Errors = result.Errors.Select(e => e.Description).ToList() });
                }
                return Ok(new IdentityResponseDTO { Success = true });
            }
            return BadRequest(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Wrong data" } });
        }

        [HttpPost, Route("update/username")]
        public async Task<ActionResult<IdentityResponseDTO>> UpdateUserName(UserUpdateDTO updateData)
        {
            if (updateData != null && updateData.CurrentUserName != null && updateData.NewUserName != null)
            {
                User newUser = await _pokeTeamService.GetUserByUserName(updateData.NewUserName);
                if (newUser != null)
                {
                    return BadRequest(new IdentityResponseDTO { Success = false, Errors = new List<string> { "UserName already claimed" } });
                }
                User user = await _pokeTeamService.GetUserByUserName(updateData.CurrentUserName);
                if (user == null)
                {
                    return NotFound(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Couldn't find user" } });
                }
                IdentityResult result = await _userManager.SetUserNameAsync(user, updateData.NewUserName);
                if (result.Errors.ToList().Count > 0)
                {
                    return BadRequest(new IdentityResponseDTO { Success = false, Errors = result.Errors.Select(e => e.Description).ToList() });
                }
                return Ok(new IdentityResponseDTO { Success = true, User = await _pokeTeamService.BuildUserDTO(user, true) });
            }
            return BadRequest(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Wrong data" } });
        }

        [HttpPost, Route("update/name")]
        public async Task<ActionResult<UserDTO>> UpdateName(UserUpdateDTO updateData)
        {
            if (updateData != null && updateData.CurrentUserName != null && updateData.NewName != null)
            {
                User user = await _pokeTeamService.GetUserByUserName(updateData.CurrentUserName);
                if (user == null)
                {
                    return NotFound("Couldn't find user");
                }
                IdentityResponseDTO result = await _pokeTeamService.ChangeName(user, updateData.NewName);
                if (!result.Success)
                {
                    return BadRequest(result);
                }
                return Ok(result);
            }
            return BadRequest(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Wrong data" } });
        }

        [HttpPost, Route("update/picture")]
        public async Task<ActionResult<UserDTO>> UpdatePicture(UserUpdateDTO updateData)
        {
            if (updateData != null && updateData.CurrentUserName != null && updateData.NewName != null)
            {
                User user = await _pokeTeamService.GetUserByUserName(updateData.CurrentUserName);
                if (user == null)
                {
                    return NotFound("Couldn't find user");
                }
                IdentityResponseDTO result = await _pokeTeamService.ChangeName(user, updateData.NewName);
                if (!result.Success)
                {
                    return BadRequest(result);
                }
                return Ok(result);
            }
            return BadRequest(new IdentityResponseDTO { Success = false, Errors = new List<string> { "Wrong data" } });
        }

        [AllowAnonymous]
        [HttpPost, Route("delete")]
        public async Task<ActionResult<UserDTO>> DeleteLoggedUser()
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
        
        [HttpPost, Route("delete/{userName}")]
        public async Task<ActionResult<UserDTO>> DeleteUserByUserName(string userName)
        {
            Printer.Log("Deleting user...");
            User user = await _pokeTeamService.GetUserByUserName(userName);
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
            bool available = await _pokeTeamService.UserNameAvailable(userName);
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
                return Conflict( new IdentityResponseDTO { Success = false, Errors = new List<string> { "Email already taken." } });
            }
            return Ok(new IdentityResponseDTO { Success = true });
        }

        [AllowAnonymous]
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
                        userDTO = await _pokeTeamService.BuildUserDTO(await _pokeTeamService.GetUserByUserName(user.UserName), true);
                        Printer.Log($"Logged user email: {userDTO.Email}");
                    }
                    else
                    {
                        return Unauthorized(new IdentityResponseDTO { Success = false, Errors = new string[] { "Logged user not found" } });
                    }
                }
                else
                {
                    return Ok(new IdentityResponseDTO {Success = false, Errors = new string[] { "No user logged" } });
                }

            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return BadRequest("Getting user error, exception");
            }
            return Ok(new IdentityResponseDTO { User = userDTO, Success = true });
        }

        private async Task<bool> UserLoggedIn(User user)
        {
            try
            {
                if (User.Identity.Name != null)
                {
                    var loggedUser = await _userManager.FindByNameAsync(User.Identity.Name);
                    if (loggedUser != null)
                    {
                        return loggedUser.Id == user.Id;
                    }
                }
            }
            catch (Exception ex)
            {

            }
            return false;
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
            return Ok(new IdentityResponseDTO { User = null, Success = true });
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
                    EmailConfirmed = false,
                    Picture = "blastoise",
                    Country = "es",
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
            return Ok(new IdentityResponseDTO { Success = true });
        }

        [HttpGet, Route("logout")]
        public async Task LogOut()
        {
            await _signInManager.SignOutAsync();
            Printer.Log("User logged out.");
        }
        
    }
}
