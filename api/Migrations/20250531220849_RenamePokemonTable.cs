using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class RenamePokemonTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Pokemon");

            migrationBuilder.CreateTable(
                name: "TeamPokemon",
                columns: table => new
                {
                    TeamPokemonId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TeamId = table.Column<string>(type: "character varying(10)", nullable: false),
                    PokemonId = table.Column<int>(type: "integer", nullable: false),
                    FormId = table.Column<int>(type: "integer", nullable: true),
                    Nickname = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: true),
                    TeraTypeIdentifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    ItemIdentifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    AbilityIdentifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    NatureIdentifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Move1Identifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Move2Identifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Move3Identifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Move4Identifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Level = table.Column<int>(type: "integer", nullable: true),
                    Shiny = table.Column<bool>(type: "boolean", nullable: true),
                    Gender = table.Column<bool>(type: "boolean", nullable: true),
                    Notes = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: true),
                    IV_hp = table.Column<int>(type: "integer", nullable: true),
                    IV_atk = table.Column<int>(type: "integer", nullable: true),
                    IV_def = table.Column<int>(type: "integer", nullable: true),
                    IV_spa = table.Column<int>(type: "integer", nullable: true),
                    IV_spd = table.Column<int>(type: "integer", nullable: true),
                    IV_spe = table.Column<int>(type: "integer", nullable: true),
                    EV_hp = table.Column<int>(type: "integer", nullable: true),
                    EV_atk = table.Column<int>(type: "integer", nullable: true),
                    EV_def = table.Column<int>(type: "integer", nullable: true),
                    EV_spa = table.Column<int>(type: "integer", nullable: true),
                    EV_spd = table.Column<int>(type: "integer", nullable: true),
                    EV_spe = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamPokemon", x => x.TeamPokemonId);
                    table.ForeignKey(
                        name: "FK_TeamPokemon_Team_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Team",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TeamPokemon_TeamId",
                table: "TeamPokemon",
                column: "TeamId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TeamPokemon");

            migrationBuilder.CreateTable(
                name: "Pokemon",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TeamId = table.Column<string>(type: "character varying(10)", nullable: false),
                    AbilityIdentifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    EV_atk = table.Column<int>(type: "integer", nullable: true),
                    EV_def = table.Column<int>(type: "integer", nullable: true),
                    EV_hp = table.Column<int>(type: "integer", nullable: true),
                    EV_spa = table.Column<int>(type: "integer", nullable: true),
                    EV_spd = table.Column<int>(type: "integer", nullable: true),
                    EV_spe = table.Column<int>(type: "integer", nullable: true),
                    FormId = table.Column<int>(type: "integer", nullable: true),
                    Gender = table.Column<bool>(type: "boolean", nullable: true),
                    IV_atk = table.Column<int>(type: "integer", nullable: true),
                    IV_def = table.Column<int>(type: "integer", nullable: true),
                    IV_hp = table.Column<int>(type: "integer", nullable: true),
                    IV_spa = table.Column<int>(type: "integer", nullable: true),
                    IV_spd = table.Column<int>(type: "integer", nullable: true),
                    IV_spe = table.Column<int>(type: "integer", nullable: true),
                    ItemIdentifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Level = table.Column<int>(type: "integer", nullable: true),
                    Move1Identifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Move2Identifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Move3Identifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Move4Identifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    NatureIdentifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Nickname = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: true),
                    Notes = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: true),
                    PokemonId = table.Column<int>(type: "integer", nullable: false),
                    Shiny = table.Column<bool>(type: "boolean", nullable: true),
                    TeraTypeIdentifier = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true)
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
    }
}
