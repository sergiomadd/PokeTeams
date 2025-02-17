using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class TeamOptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Options",
                table: "Team");

            migrationBuilder.AddColumn<bool>(
                name: "EVsVisibility",
                table: "Team",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IVsVisibility",
                table: "Team",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "NaturesVisibility",
                table: "Team",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EVsVisibility",
                table: "Team");

            migrationBuilder.DropColumn(
                name: "IVsVisibility",
                table: "Team");

            migrationBuilder.DropColumn(
                name: "NaturesVisibility",
                table: "Team");

            migrationBuilder.AddColumn<string>(
                name: "Options",
                table: "Team",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
