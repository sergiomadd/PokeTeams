using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddTournament : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TournamentName",
                table: "Team");

            migrationBuilder.AddColumn<string>(
                name: "TournamentNormalizedName",
                table: "Team",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Tournament",
                columns: table => new
                {
                    NormalizedName = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CountryCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Official = table.Column<bool>(type: "bit", nullable: false),
                    RegulationIdentifier = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tournament", x => x.NormalizedName);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Team_TournamentNormalizedName",
                table: "Team",
                column: "TournamentNormalizedName");

            migrationBuilder.AddForeignKey(
                name: "FK_Team_Tournament_TournamentNormalizedName",
                table: "Team",
                column: "TournamentNormalizedName",
                principalTable: "Tournament",
                principalColumn: "NormalizedName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Team_Tournament_TournamentNormalizedName",
                table: "Team");

            migrationBuilder.DropTable(
                name: "Tournament");

            migrationBuilder.DropIndex(
                name: "IX_Team_TournamentNormalizedName",
                table: "Team");

            migrationBuilder.DropColumn(
                name: "TournamentNormalizedName",
                table: "Team");

            migrationBuilder.AddColumn<string>(
                name: "TournamentName",
                table: "Team",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
