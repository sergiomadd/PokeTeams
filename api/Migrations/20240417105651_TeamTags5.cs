using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class TeamTags5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Teams_AspNetUsers_PlayerId",
                table: "Team");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamTag_Teams_TeamsId",
                table: "TeamTag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Teams",
                table: "Team");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Team",
                table: "Team",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Team_AspNetUsers_PlayerId",
                table: "Team",
                column: "PlayerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamTag_Team_TeamsId",
                table: "TeamTag",
                column: "TeamsId",
                principalTable: "Team",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Team_AspNetUsers_PlayerId",
                table: "Team");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamTag_Team_TeamsId",
                table: "TeamTag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Team",
                table: "Team");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Teams",
                table: "Team",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_AspNetUsers_PlayerId",
                table: "Team",
                column: "PlayerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamTag_Teams_TeamsId",
                table: "TeamTag",
                column: "TeamsId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
