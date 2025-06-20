using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConnectCampus.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateChatConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "IsRead",
                table: "ChatMessages",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "ChatMessages",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_ChatGroupId_IsRead",
                table: "ChatMessages",
                columns: new[] { "ChatGroupId", "IsRead" });

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_SenderId",
                table: "ChatMessages",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_SentAt",
                table: "ChatMessages",
                column: "SentAt");

            migrationBuilder.CreateIndex(
                name: "IX_ChatGroups_AssociationId",
                table: "ChatGroups",
                column: "AssociationId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatGroups_StudentId",
                table: "ChatGroups",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatGroups_StudentId_AssociationId",
                table: "ChatGroups",
                columns: new[] { "StudentId", "AssociationId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ChatMessages_ChatGroupId_IsRead",
                table: "ChatMessages");

            migrationBuilder.DropIndex(
                name: "IX_ChatMessages_SenderId",
                table: "ChatMessages");

            migrationBuilder.DropIndex(
                name: "IX_ChatMessages_SentAt",
                table: "ChatMessages");

            migrationBuilder.DropIndex(
                name: "IX_ChatGroups_AssociationId",
                table: "ChatGroups");

            migrationBuilder.DropIndex(
                name: "IX_ChatGroups_StudentId",
                table: "ChatGroups");

            migrationBuilder.DropIndex(
                name: "IX_ChatGroups_StudentId_AssociationId",
                table: "ChatGroups");

            migrationBuilder.AlterColumn<bool>(
                name: "IsRead",
                table: "ChatMessages",
                type: "boolean",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "ChatMessages",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000);
        }
    }
}
