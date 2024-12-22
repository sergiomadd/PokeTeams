using Microsoft.EntityFrameworkCore;

namespace api.Models.DBModels
{
    [Keyless]
    public class Items
    {
        public int Id { get; set; }
        public string Identifier { get; set; }
        public Items(int id, string identifier)
        {
            Id = id;
            Identifier = identifier;
        }
    }
}
