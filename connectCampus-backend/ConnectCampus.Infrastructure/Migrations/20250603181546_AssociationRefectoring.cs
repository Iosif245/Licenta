using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConnectCampus.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AssociationRefectoring : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // These columns were already dropped in the previous migration (UpdateAssociationStructure)
            // so we don't need to drop them again

            migrationBuilder.DropColumn(
                name: "IsFeatured",
                table: "Associations");

            migrationBuilder.DropColumn(
                name: "Members",
                table: "Associations");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Associations");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Re-add the columns that this migration removed
            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                table: "Associations",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Members",
                table: "Associations",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "Rating",
                table: "Associations",
                type: "double precision",
                nullable: true);

            // Re-add the columns that were dropped in the previous migration
            migrationBuilder.AddColumn<List<Guid>>(
                name: "AnnouncementIds",
                table: "Associations",
                type: "uuid[]",
                nullable: false);

            migrationBuilder.AddColumn<List<Guid>>(
                name: "LeadershipIds",
                table: "Associations",
                type: "uuid[]",
                nullable: false);

            migrationBuilder.AddColumn<List<Guid>>(
                name: "PastEventIds",
                table: "Associations",
                type: "uuid[]",
                nullable: false);

            migrationBuilder.AddColumn<List<Guid>>(
                name: "UpcomingEventIds",
                table: "Associations",
                type: "uuid[]",
                nullable: false);
        }
    }
}
