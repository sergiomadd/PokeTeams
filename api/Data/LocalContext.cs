using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models.DBPoketeamModels;
using api.Util;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Newtonsoft.Json;
using System;
using System.Drawing.Imaging;
using System.Text;

namespace api.Data
{
    public class LocalContext : DbContext
    {
        public LocalContext() : base()
        {

        }
        public LocalContext(DbContextOptions<LocalContext> option) : base(option)
        {

        }

        public EditorDataDTO GetEditorData()
        {
            var json = File.ReadAllText("Data/Local/IconPaths.json");
            EditorDataDTO editorData = JsonConvert.DeserializeObject<EditorDataDTO>(json);
            //editorData.PokemonSpritesPaths = GetSprite(25);
            return editorData;
        }
    }
}
