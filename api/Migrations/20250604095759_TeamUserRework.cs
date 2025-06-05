using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class TeamUserRework : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Team_AspNetUsers_PlayerId",
                table: "Team");

            migrationBuilder.RenameColumn(
                name: "PlayerId",
                table: "Team",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "AnonPlayer",
                table: "Team",
                newName: "Player");

            migrationBuilder.RenameIndex(
                name: "IX_Team_PlayerId",
                table: "Team",
                newName: "IX_Team_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Team_AspNetUsers_UserId",
                table: "Team",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Team_AspNetUsers_UserId",
                table: "Team");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Team",
                newName: "PlayerId");

            migrationBuilder.RenameColumn(
                name: "Player",
                table: "Team",
                newName: "AnonPlayer");

            migrationBuilder.RenameIndex(
                name: "IX_Team_UserId",
                table: "Team",
                newName: "IX_Team_PlayerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Team_AspNetUsers_PlayerId",
                table: "Team",
                column: "PlayerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
