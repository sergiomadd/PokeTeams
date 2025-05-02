using api.Data;
using api.DTOs;
using api.Models.DBPoketeamModels;
using api.Test.Integration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using api.DTOs.PokemonDTOs;
using System.Net.Http;
using System.Globalization;

namespace api.Test.Controllers
{
    public class AuthControllerTest
    {
        private readonly Uri _baseAddres;

        public AuthControllerTest()
        {
            _baseAddres = new Uri("http://localhost/api/auth/");
        }

        //RefreshToken

        [Fact]
        public async Task RefreshToken_ReturnsBadRequest_NoRefreshToken()
        {
            //Arrange
            var _instance = new AppInstance();
            var uri = "refresh";
            var user = _instance.GetTestAuthLoggedUser();

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            //Act
            var response = await client.PostAsync(uri, null);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("Refresh Error", responseString);
        }

        [Fact]
        public async Task RefreshToken_ReturnsBadRequest_NoPrincipal()
        {
            //Arrange
            var _instance = new AppInstance();
            var uri = "refresh";
            var user = _instance.GetTestAuthLoggedUser();

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "a9sdnfujansdfasd");
            var refreshCookie = new CookieHeaderValue("refreshToken", "a9sdnfujansdfasd");
            client.DefaultRequestHeaders.Add("Cookie", refreshCookie.ToString());

            //Act
            var response = await client.PostAsync(uri, null);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("Refresh Error", responseString);
        }

        [Fact]
        public async Task RefreshToken_ReturnsBadRequest_NoUser()
        {
            //Arrange
            var _instance = new AppInstance();
            var uri = "refresh";
            var user = _instance.GetTestAuthLoggedUser();

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var noUser = new User() { UserName = "NotFound" };

            var validJwtToken = _instance.GenerateValidJwtToken(noUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var refreshCookie = new CookieHeaderValue("refreshToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", refreshCookie.ToString());

            //Act
            var response = await client.PostAsync(uri, null);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("Refresh Error", responseString);
        }

        [Fact]
        public async Task RefreshToken_ReturnsOk()
        {
            //Arrange
            var _instance = new AppInstance();
            var uri = "refresh";
            var user = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var validJwtToken = _instance.GenerateValidJwtToken(user);
            user.RefreshToken = validJwtToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await userManager.CreateAsync(user);

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var refreshCookie = new CookieHeaderValue("refreshToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", refreshCookie.ToString());

            //Act
            var response = await client.PostAsync(uri, null);

            //Assert
            response.EnsureSuccessStatusCode();

            //Format: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YWJhZDZmOC01YTIzLTRiMjYtYmY1Yy0xNjMwZTdiNzYyZjIiLCJzdWIiOiJ0ZXN0QXV0aCIsInVuaXF1ZV9uYW1lIjoidGVzdEF1dGhVc2VyTmFtZSIsIm5iZiI6MTc0Mzg0NjkzOCwiZXhwIjoxNzQ0NDUxNzM4LCJpYXQiOjE3NDM4NDY5MzgsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcxMzQvIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo0MjAwLyJ9.1Re2OTI-eSMN1Ca1unzGsTkZMntiOuN_aDfH1lUIJKE; expires=Sat, 12 Apr 2025 09:55:38 GMT; path=/; secure; samesite=none; httponly'
            string newAccessToken = response.Headers.GetValues("Set-Cookie").ToList()[0].Split(";")[0].Split("=")[1];
            string newRefreshToken = response.Headers.GetValues("Set-Cookie").ToList()[1].Split(";")[0].Split("=")[1];
            Assert.NotNull(newAccessToken);
            Assert.NotNull(newRefreshToken);
            Assert.NotEqual(newRefreshToken, validJwtToken);

        }

        //GetLoggedUser

        [Fact]
        public async Task GetLoggedUser_ReturnsBadRequest()
        {
            //Arrange
            var _instance = new AppInstance();
            var uri = "logged";

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.GetAsync(uri);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("No user logged", responseString);
        }

        [Fact]
        public async Task GetLoggedUser_ReturnsOk()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "logged";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.GetAsync(request);

            //Assert
            response.EnsureSuccessStatusCode();
            var responseObject = await response.Content.ReadFromJsonAsync<UserDTO>();
            Assert.NotNull(responseObject);
            Assert.Equal(authUser.UserName, responseObject.Username);
        }

        //GetLoggedUserEmail

        [Fact]
        public async Task GetLoggedUserEmail_ReturnsBadRequest()
        {
            //Arrange
            var _instance = new AppInstance();
            var uri = "email";

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.GetAsync(uri);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("No user logged", responseString);
        }

        [Fact]
        public async Task GetLoggedUserEmail_ReturnsOk()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "email";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.GetAsync(request);

            //Assert
            response.EnsureSuccessStatusCode();
            var responseObject = await response.Content.ReadFromJsonAsync<EmailDTO>();
            Assert.NotNull(responseObject);
            Assert.Equal(authUser.Email, responseObject.Email);
            Assert.False(responseObject.EmailConfirmed);
        }

        //Login


        [Fact]
        public async Task LogIn_ReturnsBadRequest_Invalid()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "login";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            string password = "loginTestPassword";
            await userManager.AddPasswordAsync(authUser, password);

            LogInDTO body = new LogInDTO()
            {
                UserNameOrEmail = authUser.UserName,
                Password = "wrongPassword"
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("Invalid credentials", responseString);
        }

        [Fact]
        public async Task LogIn_ReturnsBadRequest_UserNotFound()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "login";

            LogInDTO body = new LogInDTO()
            {
                UserNameOrEmail = "noUser",
                Password = "wrongPassword"
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("User not found", responseString);
        }

        [Fact]
        public async Task LogIn_ReturnsOk()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "login";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            string password = "loginTestPassword";
            await userManager.AddPasswordAsync(authUser, password);

            LogInDTO body = new LogInDTO()
            {
                UserNameOrEmail = authUser.UserName,
                Password = password
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("TestScheme");

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            response.EnsureSuccessStatusCode();
            string? accessCookie = response.Headers.GetValues("Set-Cookie").FirstOrDefault(c => c.Contains("accessToken"));
            string? refreshCookie = response.Headers.GetValues("Set-Cookie").FirstOrDefault(c => c.Contains("refreshToken"));
            Assert.NotNull(accessCookie);
            Assert.NotNull(refreshCookie);
            string? newAccessToken = accessCookie.Split(";")[0].Split("=")[1];
            string? newRefreshToken = refreshCookie.Split(";")[0].Split("=")[1];
            Assert.NotNull(newAccessToken);
            Assert.NotNull(newRefreshToken);

            using (scope)
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                var user = await context.User.FirstOrDefaultAsync(u => u.UserName == authUser.UserName);
                Assert.NotNull(user);
                await context.User.Entry(user).ReloadAsync();
                Assert.NotNull(user.RefreshToken);
                Assert.Equal(newRefreshToken, user.RefreshToken);
            }
        }

        //SignUp

        [Fact]
        public async Task SignUp_ReturnsBadRequest()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "signup";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            string password = "signupTestPassword";

            SignUpDTO body = new SignUpDTO()
            {
                UserName = authUser.UserName,
                Email = authUser.Email,
                Password = password,
                ConfirmPassword = password
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("Sign up failed", responseString);
        }

        [Fact]
        public async Task SignUp_ReturnsOk()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "signup";
            var authUser = _instance.GetTestAuthLoggedUser();

            string password = "signupTestPassword";

            SignUpDTO body = new SignUpDTO()
            {
                UserName = authUser.UserName,
                Email = authUser.Email,
                Password = password,
                ConfirmPassword = password
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            response.EnsureSuccessStatusCode();
            string newAccessToken = response.Headers.GetValues("Set-Cookie").ToList()[1].Split(";")[0].Split("=")[1];
            string newRefreshToken = response.Headers.GetValues("Set-Cookie").ToList()[2].Split(";")[0].Split("=")[1];
            Assert.NotNull(newAccessToken);
            Assert.NotNull(newRefreshToken);

            using (var scope = _instance.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                var user = await context.User.FirstOrDefaultAsync(u => u.UserName == authUser.UserName);
                Assert.NotNull(user);
                await context.User.Entry(user).ReloadAsync();
                Assert.NotNull(user.RefreshToken);
                Assert.Equal(newRefreshToken, user.RefreshToken);
            }
        }

        //LogOut

        [Fact]
        public async Task LogOut_ReturnsOk()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "logout";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            string password = "loginTestPassword";
            await userManager.AddPasswordAsync(authUser, password);

            LogInDTO body = new LogInDTO()
            {
                UserNameOrEmail = authUser.UserName,
                Password = password
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessRequestCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessRequestCookie.ToString());

            //Act
            var logInPre = await client.PostAsJsonAsync("login", body);
            var response = await client.PostAsync(request, null);

            //Assert
            response.EnsureSuccessStatusCode();
            using (scope)
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                var user = await context.User.FirstOrDefaultAsync(u => u.UserName == authUser.UserName);
                Assert.NotNull(user);
                await context.User.Entry(user).ReloadAsync();
                Assert.Null(user.RefreshToken);
            }
        }

        //UpdateUserName

        [Fact]
        public async Task UpdateUserName_ReturnsBadRequest_WrongData()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/username";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewUserName = null
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("Wrong data", responseString);
        }

        [Fact]
        public async Task UpdateUserName_ReturnsBadRequest_UsernameTaken()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/username";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewUserName = "testUserName"
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("Username already claimed", responseString);
        }

        [Fact]
        public async Task UpdateUserName_ReturnsBadRequest_NoUserLogged()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/username";

            string newUserName = "testAuthUserName2";
            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewUserName = newUserName
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("No user logged", responseString);
        }

        [Fact]
        public async Task UpdateUserName_ReturnsOk()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/username";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            string newUserName = "testAuthUserName2";
            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewUserName = newUserName
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            response.EnsureSuccessStatusCode();

            var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
            var user = await context.User.FirstOrDefaultAsync(u => u.UserName == newUserName);
            Assert.NotNull(user);
        }

        //UpdateEmail

        [Fact]
        public async Task UpdateEmail_ReturnsBadRequest_WrongData()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/email";

            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewEmail = null
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("Wrong data", responseString);
        }

        [Fact]
        public async Task UpdateEmail_ReturnsBadRequest_EmailTaken()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/email";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewEmail = "testAuth@gmail.com"
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("Email already taken", responseString);
        }

        [Fact]
        public async Task UpdateEmail_ReturnsBadRequest_NoUserLogged()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/email";

            string newEmail = "testAuth2@gmail.com";
            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewEmail = newEmail
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("No user logged", responseString);
        }

        [Fact]
        public async Task UpdateEmail_ReturnsOk()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/email";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            string newEmail = "testAuth2@gmail.com";
            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewEmail = newEmail
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            response.EnsureSuccessStatusCode();

            var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
            var user = await context.User.FirstOrDefaultAsync(u => u.UserName == authUser.UserName);
            await context.User.Entry(user).ReloadAsync();
            Assert.NotNull(user);
            Assert.NotNull(user.Email);
            Assert.Equal(newEmail, user.Email);
        }

        //GetEmailConfirmationCode

        [Fact]
        public async Task GetEmailConfirmationCode_ReturnsBadRequest_NoUserLogged()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "code";

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.GetAsync(request);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("No user logged", responseString);
        }

        [Fact]
        public async Task GetEmailConfirmationCode_ReturnsBadRequest_NoEmail()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "code";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            authUser.Email = null;
            await userManager.CreateAsync(authUser);

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.GetAsync(request);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal($"No defined email for {authUser.UserName}", responseString);
        }

        [Fact]
        public async Task GetEmailConfirmationCode_ReturnsBadRequest_EmailConfirmed()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "code";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            authUser.EmailConfirmed = true;
            await userManager.CreateAsync(authUser);

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.GetAsync(request);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal($"Email already confirmed for {authUser.UserName}", responseString);
        }

        [Fact]
        public async Task GetEmailConfirmationCode_ReturnsOk()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "code";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.GetAsync(request);

            //Assert
            response.EnsureSuccessStatusCode();
        }

        //ConfirmEmail

        [Fact]
        public async Task ConfirmEmail_ReturnsBadRequest_WrongData()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/code";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            string token = await userManager.GenerateEmailConfirmationTokenAsync(authUser);
            var tokenBytes = Encoding.UTF8.GetBytes(token);
            var encodedToken = WebEncoders.Base64UrlEncode(tokenBytes);

            UserUpdateDTO body = new UserUpdateDTO()
            {
                EmailConfirmationCode = null
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("Wrong data", responseString);
        }

        [Fact]
        public async Task ConfirmEmail_ReturnsBadRequest_NoUserLogged()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/code";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            string token = await userManager.GenerateEmailConfirmationTokenAsync(authUser);
            var tokenBytes = Encoding.UTF8.GetBytes(token);
            var encodedToken = WebEncoders.Base64UrlEncode(tokenBytes);

            UserUpdateDTO body = new UserUpdateDTO()
            {
                EmailConfirmationCode = encodedToken
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("No user logged", responseString);
        }

        [Fact]
        public async Task ConfirmEmail_ReturnsBadRequest_ConfirmError()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/code";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            string token = await userManager.GenerateEmailConfirmationTokenAsync(authUser);
            var tokenBytes = Encoding.UTF8.GetBytes(token);
            var encodedToken = WebEncoders.Base64UrlEncode(tokenBytes);

            UserUpdateDTO body = new UserUpdateDTO()
            {
                EmailConfirmationCode = "wrongToken"
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("Error confirming email", responseString);
        }

        [Fact]
        public async Task ConfirmEmail_ReturnsOk()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/code";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            string token = await userManager.GenerateEmailConfirmationTokenAsync(authUser);
            var tokenBytes = Encoding.UTF8.GetBytes(token);
            var encodedToken = WebEncoders.Base64UrlEncode(tokenBytes);

            UserUpdateDTO body = new UserUpdateDTO()
            {
                EmailConfirmationCode = encodedToken
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            response.EnsureSuccessStatusCode();
        }

        //UpdatePassword

        [Fact]
        public async Task UpdatePassword_ReturnsBadRequest_WrongData()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/password";

            UserUpdateDTO body = new UserUpdateDTO()
            {
                CurrentPassword = null,
                NewPassword = null
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("Wrong data", responseString);
        }

        [Fact]
        public async Task UpdatePassword_ReturnsBadRequest_NoUserLogged()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/password";

            UserUpdateDTO body = new UserUpdateDTO()
            {
                CurrentPassword = "NotFound",
                NewPassword = "NotFound"
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("No user logged", responseString);
        }

        [Fact]
        public async Task UpdatePassword_ReturnsOk()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/password";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            string currentPassword = "firstTestPassword";
            string newPassword = "authTestPassword";
            await userManager.AddPasswordAsync(authUser, currentPassword);

            UserUpdateDTO body = new UserUpdateDTO()
            {
                CurrentPassword = currentPassword,
                NewPassword = newPassword
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            response.EnsureSuccessStatusCode();

            var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
            var user = await context.User.FirstOrDefaultAsync(u => u.UserName == authUser.UserName);
            await context.User.Entry(user).ReloadAsync();
            Assert.NotNull(user);
            Assert.NotNull(user.PasswordHash);
            var newPasswordHash = userManager.PasswordHasher.VerifyHashedPassword(authUser, user.PasswordHash, newPassword);
            Assert.Equal(PasswordVerificationResult.Success, newPasswordHash);
        }

        //UpdateName

        [Fact]
        public async Task UpdateName_ReturnsBadRequest_WrongData()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/name";

            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewName = null
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("Wrong data", responseString);
        }

        [Fact]
        public async Task UpdateName_ReturnsBadRequest_NoUserLogged()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/name";

            string newName = "Auth Test Name";
            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewName = newName
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("No user logged", responseString);
        }

        [Fact]
        public async Task UpdateName_ReturnsOk()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/name";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            string newName = "Auth Test Name";
            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewName = newName
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            response.EnsureSuccessStatusCode();

            var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
            var user = await context.User.FirstOrDefaultAsync(u => u.UserName == authUser.UserName);
            await context.User.Entry(user).ReloadAsync();
            Assert.NotNull(user);
            Assert.NotNull(user.Name);
            Assert.Equal(newName, user.Name);
        }

        //UpdatePicture

        [Fact]
        public async Task UpdatePicture_ReturnsBadRequest_WrongData()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/picture";

            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewPictureKey = null
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("Wrong data", responseString);
        }

        [Fact]
        public async Task UpdatePicture_ReturnsBadRequest_NoUserLogged()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/picture";

            string newPicture = "bulbasaur";
            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewPictureKey = newPicture
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("No user logged", responseString);
        }

        [Fact]
        public async Task UpdatePicture_ReturnsOk()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/picture";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            string newPicture = "bulbasaur";
            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewPictureKey = newPicture
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            response.EnsureSuccessStatusCode();

            var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
            var user = await context.User.FirstOrDefaultAsync(u => u.UserName == authUser.UserName);
            await context.User.Entry(user).ReloadAsync();
            Assert.NotNull(user);
            Assert.NotNull(user.Picture);
            Assert.Equal(newPicture, user.Picture);
        }

        //UpdateCountry

        [Fact]
        public async Task UpdateCountry_ReturnsBadRequest_WrongData()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/country";

            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewCountryCode = null
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("Wrong data", responseString);
        }

        [Fact]
        public async Task UpdateCountry_ReturnsBadRequest_NoUserLogged()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/country";

            string newCountry = "es";
            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewCountryCode = newCountry
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("No user logged", responseString);
        }

        [Fact]
        public async Task UpdateCountry_ReturnsOk()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/country";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            string newCountry = "es";
            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewCountryCode = newCountry
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            response.EnsureSuccessStatusCode();

            var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
            var user = await context.User.FirstOrDefaultAsync(u => u.UserName == authUser.UserName);
            await context.User.Entry(user).ReloadAsync();
            Assert.NotNull(user);
            Assert.NotNull(user.Country);
            Assert.Equal(newCountry, user.Country);
        }

        //UpdateVisibility

        [Fact]
        public async Task UpdateVisibility_ReturnsBadRequest_WrongData()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/visibility";

            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewVisibility = null
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("Wrong data", responseString);
        }

        [Fact]
        public async Task UpdateVisibility_ReturnsBadRequest_NoUserLogged()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/visibility";

            bool newVisibility = true;
            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewVisibility = newVisibility
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("No user logged", responseString);
        }

        [Fact]
        public async Task UpdateVisibility_ReturnsOk()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "update/visibility";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            bool newVisibility = true;
            UserUpdateDTO body = new UserUpdateDTO()
            {
                NewVisibility = newVisibility
            };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(request, body);

            //Assert
            response.EnsureSuccessStatusCode();

            var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
            var user = await context.User.FirstOrDefaultAsync(u => u.UserName == authUser.UserName);
            await context.User.Entry(user).ReloadAsync();
            Assert.NotNull(user);
            Assert.NotNull(user.Visibility);
            Assert.Equal(newVisibility, user.Visibility);
        }

        //DeleteLoggedUser

        [Fact]
        public async Task DeleteLoggedUser_ReturnsBadRequest()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "delete";

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsync(request, null);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("No user logged", responseString);
        }

        [Fact]
        public async Task DeleteLoggedUser_ReturnsOk()
        {
            //Arrange
            var _instance = new AppInstance();
            var request = "delete";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsync(request, null);

            //Assert
            response.EnsureSuccessStatusCode();

            var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
            var user = await context.User.FirstOrDefaultAsync(u => u.UserName == authUser.UserName);
            Assert.Null(user);
        }

        //DoesLoggedUserOwnTeam

        [Fact]
        public async Task DoesLoggedUserOwnTeam_ReturnsBadRequest_NoUserLogged()
        {
            //Arrange
            var _instance = new AppInstance();
            var teamID = "testOwn";
            var uri = $"own/{teamID}";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            string? body = teamID;

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(null);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.GetAsync(uri);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("No user logged", responseString);
        }

        [Fact]
        public async Task DoesLoggedUserOwnTeam_ReturnsUnauthorized()
        {
            //Arrange
            var _instance = new AppInstance();
            var teamID = "testOwn";
            var uri = $"own/{teamID}";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            using (scope)
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                await context.Database.MigrateAsync();

                var entity = new Team { Id = teamID };
                context.Team.Add(entity);
                await context.SaveChangesAsync();
            }

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.GetAsync(uri);

            //Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("Unauthorized", responseString);
        }

        [Fact]
        public async Task DoesLoggedUserOwnTeam_ReturnsOk()
        {
            //Arrange
            var _instance = new AppInstance();
            var teamID = "testOwn";
            var uri = $"own/{teamID}";
            var authUser = _instance.GetTestAuthLoggedUser();
            var scope = _instance.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            await userManager.CreateAsync(authUser);

            using (scope)
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                await context.Database.MigrateAsync();

                var entity = new Team { Id = teamID, PlayerId = authUser.Id };
                context.Team.Add(entity);
                await context.SaveChangesAsync();
            }

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(authUser);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.GetAsync(uri);

            //Assert
            response.EnsureSuccessStatusCode();
            var teamResponse = await response.Content.ReadAsAsync<bool>();
            Assert.True(teamResponse);
        }
    }
}
