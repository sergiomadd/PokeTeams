using api.Data;
using api.Models.DBModels;
using api.Models.DBPoketeamModels;
using System;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace api.Services.TeamService
{
    public class TeamService : ITeamService
    {
        private readonly PoketeamContext _context;
        private readonly LocalContext _localContext;

        private static Random random = new Random();

        public TeamService(PoketeamContext dataContext, LocalContext localContext)
        {
            _context = dataContext;
            _localContext = localContext;
        }

        public async Task<string?> GetTeam(string id)
        {
            Teams? team = await _context.Teams.FindAsync(id);
            if (team != null)
            {
                return team.team;
            }
            return null;
        }

        //change input string to team model?
        public async Task<string?> Post(Team inputTeam)
        {
            string id = GenerateId(10);
            Teams? team = await _context.Teams.FindAsync(id);
            //loop maybe too ineficent? seek another way to get unused ids?
            while(team != null)
            {
                id = GenerateId(10);
                team = await _context.Teams.FindAsync(id);
            }
            var options = new JsonSerializerOptions{ IncludeFields = false };
            var teamString = JsonSerializer.Serialize(inputTeam, options);
            Teams newTeam = new Teams
            {
                id = id,
                team = teamString
            };
            await _context.Teams.AddAsync(newTeam);
            await _context.SaveChangesAsync();
            return id;
        }

        public string GenerateId(int length)
        {
            const string chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public async Task<EditorData?> GetEditorData()
        {
            EditorData editorData = _localContext.GetEditorData();
            
            return editorData;
        }

    }
}
