namespace api.Services.TeamService
{
    public interface ITeamService
    {
        Task<Models.TeamData?> GetTeam(string id);
        Task<string?> Post(TeamData team);
        Task<EditorData?> GetEditorData();
    }
}
