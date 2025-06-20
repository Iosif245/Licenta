using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConnectCampus.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAssociationProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Achievements",
                table: "Associations");

            migrationBuilder.DropColumn(
                name: "Gallery",
                table: "Associations");

            migrationBuilder.DropColumn(
                name: "ShortDescription",
                table: "Associations");

            migrationBuilder.DropColumn(
                name: "Subcategories",
                table: "Associations");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Achievements",
                table: "Associations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Gallery",
                table: "Associations",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ShortDescription",
                table: "Associations",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Subcategories",
                table: "Associations",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
