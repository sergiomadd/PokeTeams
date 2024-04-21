using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class Pokemon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Pokemons",
                table: "Team");

            migrationBuilder.CreateTable(
                name: "Pokemon",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TeamId = table.Column<string>(type: "nvarchar(10)", nullable: false),
                    DexNumber = table.Column<int>(type: "int", nullable: true),
                    Nickname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Type1Identifier = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Type2Identifier = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TeraTypeIdentifier = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ItemIdentifier = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AbilityIdentifier = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NatureIdentifier = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Move1Identifier = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Move2Identifier = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Move3Identifier = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Move4Identifier = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ivs = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    evs = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Level = table.Column<int>(type: "int", nullable: true),
                    Shiny = table.Column<bool>(type: "bit", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pokemon", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pokemon_Team_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Team",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Pokemon_TeamId",
                table: "Pokemon",
                column: "TeamId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Pokemon");

            migrationBuilder.AddColumn<string>(
                name: "Pokemons",
                table: "Team",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
