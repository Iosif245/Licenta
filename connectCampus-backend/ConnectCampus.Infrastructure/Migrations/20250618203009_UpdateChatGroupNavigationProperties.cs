using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConnectCampus.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateChatGroupNavigationProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddForeignKey(
                name: "FK_ChatGroups_Associations_AssociationId",
                table: "ChatGroups",
                column: "AssociationId",
                principalTable: "Associations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ChatGroups_Students_StudentId",
                table: "ChatGroups",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatGroups_Associations_AssociationId",
                table: "ChatGroups");

            migrationBuilder.DropForeignKey(
                name: "FK_ChatGroups_Students_StudentId",
                table: "ChatGroups");
        }
    }
}
