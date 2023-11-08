namespace api.Services.TeamService
{
    public interface ITeamService
    {
        Task<string?> GetTeam(string id);
        Task<string?> Post(string team);
    }
}
