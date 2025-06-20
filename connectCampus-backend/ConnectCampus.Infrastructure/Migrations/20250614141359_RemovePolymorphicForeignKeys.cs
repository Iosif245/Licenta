using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConnectCampus.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemovePolymorphicForeignKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnnouncementComments_Associations_AuthorId",
                table: "AnnouncementComments");

            migrationBuilder.DropForeignKey(
                name: "FK_AnnouncementComments_Students_AuthorId",
                table: "AnnouncementComments");

            migrationBuilder.DropForeignKey(
                name: "FK_AnnouncementLikes_Associations_AuthorId",
                table: "AnnouncementLikes");

            migrationBuilder.DropForeignKey(
                name: "FK_AnnouncementLikes_Students_AuthorId",
                table: "AnnouncementLikes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddForeignKey(
                name: "FK_AnnouncementComments_Associations_AuthorId",
                table: "AnnouncementComments",
                column: "AuthorId",
                principalTable: "Associations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AnnouncementComments_Students_AuthorId",
                table: "AnnouncementComments",
                column: "AuthorId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AnnouncementLikes_Associations_AuthorId",
                table: "AnnouncementLikes",
                column: "AuthorId",
                principalTable: "Associations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AnnouncementLikes_Students_AuthorId",
                table: "AnnouncementLikes",
                column: "AuthorId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
