using System;
using Microsoft.EntityFrameworkCore.Migrations;
using splat.Models;

namespace splat.Migrations
{
    public partial class AddHours : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CurrentHours",
                columns: table => new
                {
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP(0)"),
                    SundayHours = table.Column<HourRange>(type: "jsonb", nullable: true),
                    MondayHours = table.Column<HourRange>(type: "jsonb", nullable: true),
                    TuesdayHours = table.Column<HourRange>(type: "jsonb", nullable: true),
                    WednesdayHours = table.Column<HourRange>(type: "jsonb", nullable: true),
                    ThursdayHours = table.Column<HourRange>(type: "jsonb", nullable: true),
                    FridayHours = table.Column<HourRange>(type: "jsonb", nullable: true),
                    SaturdayHours = table.Column<HourRange>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CurrentHours", x => x.CreatedAt);
                });

            migrationBuilder.CreateTable(
                name: "DayClosed",
                columns: table => new
                {
                    ClosedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DayClosed", x => x.ClosedOn);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CurrentHours");

            migrationBuilder.DropTable(
                name: "DayClosed");
        }
    }
}
