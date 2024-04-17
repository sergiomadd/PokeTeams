using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class TeamTags4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TagTeam_Tag_TagsIdentifier",
                table: "TagTeam");

            migrationBuilder.DropForeignKey(
                name: "FK_TagTeam_Teams_TeamsId",
                table: "TagTeam");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TagTeam",
                table: "TagTeam");

            migrationBuilder.RenameTable(
                name: "TagTeam",
                newName: "TeamTag");

            migrationBuilder.RenameIndex(
                name: "IX_TagTeam_TeamsId",
                table: "TeamTag",
                newName: "IX_TeamTag_TeamsId");

            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "Tag",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Tag",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TeamTag",
                table: "TeamTag",
                columns: new[] { "TagsIdentifier", "TeamsId" });

            migrationBuilder.AddForeignKey(
                name: "FK_TeamTag_Tag_TagsIdentifier",
                table: "TeamTag",
                column: "TagsIdentifier",
                principalTable: "Tag",
                principalColumn: "Identifier",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamTag_Teams_TeamsId",
                table: "TeamTag",
                column: "TeamsId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeamTag_Tag_TagsIdentifier",
                table: "TeamTag");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamTag_Teams_TeamsId",
                table: "TeamTag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TeamTag",
                table: "TeamTag");

            migrationBuilder.DropColumn(
                name: "Color",
                table: "Tag");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Tag");

            migrationBuilder.RenameTable(
                name: "TeamTag",
                newName: "TagTeam");

            migrationBuilder.RenameIndex(
                name: "IX_TeamTag_TeamsId",
                table: "TagTeam",
                newName: "IX_TagTeam_TeamsId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TagTeam",
                table: "TagTeam",
                columns: new[] { "TagsIdentifier", "TeamsId" });

            migrationBuilder.AddForeignKey(
                name: "FK_TagTeam_Tag_TagsIdentifier",
                table: "TagTeam",
                column: "TagsIdentifier",
                principalTable: "Tag",
                principalColumn: "Identifier",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TagTeam_Teams_TeamsId",
                table: "TagTeam",
                column: "TeamsId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
