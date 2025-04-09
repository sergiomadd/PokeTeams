using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models.DBPoketeamModels;
using api.Test.Integration;
using Azure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using NuGet.ContentModel;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Numerics;
using System.Security.Claims;
using System.Text;

namespace api.Test.Controllers
{
    public class TeamControllerTest : IClassFixture<AppInstance>
    {
        private readonly AppInstance _instance;
        private readonly Uri _baseAddres;

        public TeamControllerTest(AppInstance instance)
        {
            _instance = instance;
            _baseAddres = new Uri("http://localhost/api/team/");
        }
        
        //GetTeamDTO

        [Fact]
        public async Task GetTeamDTO_ReturnsUnauthorized_RefreshRequest()
        {
            //Arrange
            var teamID = "test";
            var uri = $"{teamID}";
            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            var cookie = new CookieHeaderValue("refreshToken", "cookieValue");
            client.DefaultRequestHeaders.Add("Cookie", cookie.ToString());

            //Act
            var response = await client.GetAsync(uri);

            //Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task GetTeamDTO_ReturnsBadRequest()
        {
            //Arrange
            var teamID = "testbad";
            var uri = $"{teamID}";
            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;

            //Act
            var response = await client.GetAsync(uri);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        }

        [Fact]
        public async Task GetTeamDTO_ReturnsTeamDTO()
        {
            //Arrange
            var teamID = "test";
            var uri = $"{teamID}";

            using (var scope = _instance.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();

                var entity = new Team { Id = teamID };
                context.Team.Add(entity);
                await context.SaveChangesAsync();
            }

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;

            //Act
            var response = await client.GetAsync(uri);

            //Assert
            response.EnsureSuccessStatusCode();
            var teamResponse = await response.Content.ReadFromJsonAsync<TeamDTO>();
            Assert.NotNull(teamResponse);
            Assert.NotNull(teamResponse.ID);
            Assert.Equal(teamID, teamResponse.ID);
        }

        //GetTeamData

        [Fact]
        public async Task GetTeamData_ReturnsUnauthorized_RefreshRequest()
        {
            //Arrange
            var teamID = "test";
            var uri = $"data/{teamID}";

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            var cookie = new CookieHeaderValue("refreshToken", "cookieValue");
            client.DefaultRequestHeaders.Add("Cookie", cookie.ToString());

            //Act
            var response = await client.GetAsync(uri);

            //Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task GetTeamData_ReturnsBadRequest()
        {
            //Arrange
            var teamID = "testdata";
            var uri = $"data/{teamID}";

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;

            //Act
            var response = await client.GetAsync(uri);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task GetTeamData_ReturnsTeamDataDTO()
        {
            //Arrange
            var teamID = "testdata";
            var uri = $"data/{teamID}";

            using (var scope = _instance.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                await context.Database.MigrateAsync();

                var entity = new Team { Id = teamID };
                context.Team.Add(entity);
                await context.SaveChangesAsync();
            }

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;

            //Act
            var response = await client.GetAsync(uri);

            //Assert
            response.EnsureSuccessStatusCode();
            var teamResponse = await response.Content.ReadFromJsonAsync<TeamDTO>();
            Assert.NotNull(teamResponse);
            Assert.NotNull(teamResponse.ID);
            Assert.Equal(teamID, teamResponse.ID);
        }

        //Save team

        [Fact]
        public async Task SaveTeam_ReturnsUnauthorized_RefreshRequest()
        {
            //Arrange
            var uri = "save";
            TeamDTO? teamDTO = null;
            var body = teamDTO;

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            var cookie = new CookieHeaderValue("refreshToken", "cookieValue");
            client.DefaultRequestHeaders.Add("Cookie", cookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(uri, body);

            //Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task SaveTeam_ReturnsBadRequest_ValidationError()
        {
            //Arrange
            var uri = "save";
            TeamDTO? teamDTO = null;
            var body = teamDTO;

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;

            //Act
            var response = await client.PostAsJsonAsync(uri, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsStringAsync();
            Assert.Equal("Error uploading team", responseString);
        }

        [Fact]
        public async Task SaveTeam_ReturnsBadRequest_SavingError()
        {
            //Arrange
            var uri = "save";
            TeamDTO? teamDTO = new TeamDTO("saveTest", [], null, null, null, null, 0, null, false, [], null);

            var body = teamDTO;

            using (var scope = _instance.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                await context.Database.MigrateAsync();
            }

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            //Act
            var response = await client.PostAsJsonAsync(uri, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("Error saving team", responseString);
        }

        [Fact]
        public async Task SaveTeam_ReturnsOk()
        {
            //Arrange
            var uri = "save";
            var teamId = "saveTest";
            TeamDTO? teamDTO = new TeamDTO("", new List<PokemonDTO> { null }, null, null, null, null, 0, null, false, [], null);
            var body = teamDTO;

            using (var scope = _instance.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                await context.Database.MigrateAsync();

                var entity = new Team { Id = teamId };
                context.Team.Add(entity);
                await context.SaveChangesAsync();
            }

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            //Act
            var response = await client.PostAsJsonAsync(uri, body);

            //Assert
            response.EnsureSuccessStatusCode();
            var teamResponse = await response.Content.ReadAsAsync<string>();
            Assert.NotNull(teamResponse);

            using (var scope = _instance.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                var team = await context.Team.FirstOrDefaultAsync(t => t.Id == teamResponse);
                Assert.NotNull(team);
                Assert.Equal(teamResponse, team.Id);
            }
        }

        //Update

        [Fact]
        public async Task UpdateTeam_ReturnsUnauthorized_NoOwner()
        {
            //Arrange
            var uri = "update";
            User user = _instance.GetTestLoggedUser();
            TeamDTO? teamDTOTeamNull = new TeamDTO("testError", [], null, null, null, null, 0, null, false, [], null);
            TeamDTO? teamDTOPlayerNull = new TeamDTO("noOwn", [], null, null, null, null, 0, null, false, [], null);
            var bodyTeamNull = teamDTOTeamNull;
            var bodyPlayerNull = teamDTOPlayerNull;

            using (var scope = _instance.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                await context.Database.MigrateAsync();

                var team = await context.Team.FirstOrDefaultAsync(t => t.Id == teamDTOPlayerNull.ID);
                if (team == null)
                {
                    var entity = new Team { Id = teamDTOPlayerNull.ID };
                    context.Team.Add(entity);
                    await context.SaveChangesAsync();
                }
            }

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;

            var validJwtToken = _instance.GenerateValidJwtToken(user);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var responseTeamNull = await client.PostAsJsonAsync(uri, bodyTeamNull);
            var responsePlayerNull = await client.PostAsJsonAsync(uri, bodyPlayerNull);

            //Assert
            Assert.Equal(HttpStatusCode.Unauthorized, responseTeamNull.StatusCode);
            Assert.Equal(HttpStatusCode.Unauthorized, responsePlayerNull.StatusCode);
        }

        [Fact]
        public async Task UpdateTeam_ReturnsUnauthorized_LoggedNotOwner()
        {
            //Arrange
            var uri = "update";
            var teamId = "ownNotLog";
            var user = _instance.GetTestLoggedUser();

            TeamDTO? teamDTO = new TeamDTO(teamId, new List<PokemonDTO> { null }, new UserPreviewDTO(user.UserName),
                null, null, null, 0, null, false, [], null);
            var body = teamDTO;

            using (var scope = _instance.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                await context.Database.MigrateAsync();

                var team = await context.Team.FirstOrDefaultAsync(t => t.Id == teamId);
                if (team == null)
                {
                    var entity = new Team { Id = teamId };
                    context.Team.Add(entity);
                    await context.SaveChangesAsync();
                }
            }

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(user);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(uri, body);

            //Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task UpdateTeam_ReturnsBadRequest()
        {
            //Arrange
            var uri = "update";
            var teamId = "testUpdErr";
            var user = _instance.GetTestLoggedUser();

            //New team will return bad request because no pokemons error
            TeamDTO? teamDTO = new TeamDTO(teamId, [], null, null, null, null, 0, null, false, [], null);
            var body = teamDTO;

            using (var scope = _instance.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                await context.Database.MigrateAsync();

                var team = await context.Team.FirstOrDefaultAsync(t => t.Id == teamId);
                if (team == null)
                {
                    var entity = new Team { Id = teamId, PlayerId = user.Id };
                    context.Team.Add(entity);
                    await context.SaveChangesAsync();
                }
            }

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(user);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(uri, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsAsync<string>();
            Assert.Equal("Could not update team", responseString);

        }

        [Fact]
        public async Task UpdateTeam_ReturnsOk()
        {
            //Arrange
            var uri = "update";
            var teamId = "testUpdate";
            var user = _instance.GetTestLoggedUser();

            TeamDTO? teamDTO = new TeamDTO(teamId, new List<PokemonDTO> { null },
                null, null, null, null, 0, null, false, [], null);
            var body = teamDTO;

            using (var scope = _instance.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                await context.Database.MigrateAsync();

                var teamdb = await context.Team.FirstOrDefaultAsync(t => t.Id == teamId);
                if (teamdb == null)
                {
                    var entity = new Team { Id = teamId, PlayerId = user.Id };
                    context.Team.Add(entity);
                    await context.SaveChangesAsync();
                }
            }

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            
            var validJwtToken = _instance.GenerateValidJwtToken(user);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(uri, body);

            //Assert
            response.EnsureSuccessStatusCode();

            var teamResponse = await response.Content.ReadAsAsync<string>();
            Assert.NotNull(teamResponse);

            using (var scope = _instance.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                var team = await context.Team.FirstOrDefaultAsync(t => t.Id == teamResponse);
                Assert.NotNull(team);
                Assert.Equal(teamResponse, team.Id);
            }
        }

        //Delete

        [Fact]
        public async Task DeleteTeam_ReturnsUnauthorized_NoOwner()
        {
            //Arrange
            var uri = "delete";

            TeamIdDTO? teamIdDTONull = null;
            var teamId = "deleteE0";
            TeamIdDTO? teamIdDTO = new TeamIdDTO() { Id = teamId }; 

            var bodyTeamNull = teamIdDTONull;
            var bodyPlayerNull = teamIdDTO;

            using (var scope = _instance.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                await context.Database.MigrateAsync();

                var entity = new Team { Id = teamId };
                context.Team.Add(entity);
                await context.SaveChangesAsync();
            }

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;

            //Act
            var responseTeamNull = await client.PostAsJsonAsync(uri, bodyTeamNull);
            var responsePlayerNull = await client.PostAsJsonAsync(uri, bodyPlayerNull);

            //Assert
            Assert.Equal(HttpStatusCode.Unauthorized, responseTeamNull.StatusCode);
            Assert.Equal(HttpStatusCode.Unauthorized, responsePlayerNull.StatusCode);
        }

        [Fact]
        public async Task DeleteTeam_ReturnsUnauthorized_LoggedNotOwner()
        {
            //Arrange
            var uri = "delete";
            var user = _instance.GetTestLoggedUser();
            var teamId = "deleteE1";
            TeamIdDTO? teamIdDTO = new TeamIdDTO() { Id = teamId };
            var body = teamIdDTO;

            using (var scope = _instance.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                await context.Database.MigrateAsync();

                var entity = new Team { Id = teamId };
                context.Team.Add(entity);
                await context.SaveChangesAsync();
            }

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(user);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(uri, body);

            //Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task DeleteTeam_ReturnsOk()
        {
            //Arrange
            var uri = "delete";
            var teamId = "deleteE3";
            var user = _instance.GetTestLoggedUser();
            TeamDTO? teamDTO = new TeamDTO(teamId, new List<PokemonDTO> { null },
                null, null, null, null, 0, null, false, [], null);
            var body = teamDTO;

            using (var scope = _instance.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                await context.Database.MigrateAsync();

                var entity = new Team { Id = teamId, PlayerId = user.Id };
                context.Team.Add(entity);
                await context.SaveChangesAsync();
            }

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var validJwtToken = _instance.GenerateValidJwtToken(user);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", validJwtToken);
            var accessCookie = new CookieHeaderValue("accessToken", validJwtToken);
            client.DefaultRequestHeaders.Add("Cookie", accessCookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(uri, body);

            //Assert
            response.EnsureSuccessStatusCode();

            var teamResponse = await response.Content.ReadAsAsync<string>();
            Assert.NotNull(teamResponse);
            Assert.Equal("Team successfully deleted", teamResponse);

            using (var scope = _instance.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                var team = await context.Team.FirstOrDefaultAsync(t => t.Id == teamResponse);
                Assert.Null(team);
            }
        }

        //Increment

        [Fact]
        public async Task Increment_ReturnsBadRequest()
        {
            //Arrange
            var uri = "increment";
            var body = new TeamIdDTO { Id = "incrFail" };

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            //Act
            var response = await client.PostAsJsonAsync(uri, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Increment_ReturnsOk()
        {
            //Arrange
            var uri = "increment";
            var body = new TeamIdDTO { Id = "incrSucc" };

            using (var scope = _instance.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                await context.Database.MigrateAsync();

                var entity = new Team { Id = "incrSucc" };
                context.Team.Add(entity);
                await context.SaveChangesAsync();
            }

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            //Act
            var response = await client.PostAsJsonAsync(uri, body);

            //Assert
            response.EnsureSuccessStatusCode();
        }

        //Query

        [Fact]
        public async Task QueryTeams_ReturnsUnauthorized_RefreshRequest()
        {
            //Arrange
            var uri = "query";
            TeamSearchQueryDTO? teamQuery = null;
            var body = teamQuery;

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;
            var cookie = new CookieHeaderValue("refreshToken", "cookieValue");
            client.DefaultRequestHeaders.Add("Cookie", cookie.ToString());

            //Act
            var response = await client.PostAsJsonAsync(uri, body);

            //Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task QueryTeams_ReturnsBadRequest()
        {
            //Arrange
            var uri = "query";
            TeamSearchQueryDTO? teamQuery = null;
            var body = teamQuery;

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;

            //Act
            var response = await client.PostAsJsonAsync(uri, body);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var responseString = await response.Content.ReadAsStringAsync();
            Assert.Equal("Query not found", responseString);
        }

        [Fact]
        public async Task QueryTeams_ReturnsOk()
        {
            //Arrange
            var uri = "query";
            TeamSearchQueryDTO? teamQuery = new TeamSearchQueryDTO()
            {
                Queries = new List<QueryResultDTO>() { 
                    new QueryResultDTO
                    (
                        "Regulation A",
                        "A",
                        null,
                        "regulation"
                    )},
                TeamsPerPage = 5,
                SelectedPage = 1,
                SetOperation = null,
                SortOrder = new SortOrder() { Type = SortType.Date, Way = SortWay.Descending }
            };
            var body = teamQuery;

            using (var scope = _instance.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                await context.Database.MigrateAsync();

                var entityA = new Team { Id = "testQueryA", Regulation = "A", Visibility = true };
                context.Team.Add(entityA);

                var entityB = new Team { Id = "testQueryB", Regulation = "B", Visibility = true };
                context.Team.Add(entityB);

                await context.SaveChangesAsync();
            }

            var client = _instance.CreateClient();
            client.BaseAddress = _baseAddres;

            //Act
            var response = await client.PostAsJsonAsync(uri, body);

            //Assert
            response.EnsureSuccessStatusCode();
            var responseQuery = await response.Content.ReadAsAsync<TeamSearchQueryResponseDTO>();
            Assert.NotNull(responseQuery);
            Assert.Equal(1, responseQuery.TotalTeams);
            Assert.Single<TeamPreviewDTO>(responseQuery.Teams);
            Assert.NotNull(responseQuery.Teams.First());
            Assert.Equal("testQueryA", responseQuery.Teams.First()?.ID);
        }
    }
}
