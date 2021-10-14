using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace splat.Migrations
{
    public partial class ChangeTimestamps : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "SubmittedAt",
                table: "Pickups",
                type: "timestamptz",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP(0)",
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldDefaultValueSql: "CURRENT_TIMESTAMP(0)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "RequestedPickupTime",
                table: "Pickups",
                type: "timestamptz",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "PickupTime",
                table: "Pickups",
                type: "timestamptz",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CanceledTime",
                table: "Pickups",
                type: "timestamptz",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Items",
                type: "timestamptz",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP(0)",
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldDefaultValueSql: "CURRENT_TIMESTAMP(0)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DonatedAt",
                table: "Donations",
                type: "timestamptz",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP(0)",
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldDefaultValueSql: "CURRENT_TIMESTAMP(0)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Categories",
                type: "timestamptz",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP(0)",
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldDefaultValueSql: "CURRENT_TIMESTAMP(0)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "SubmittedAt",
                table: "Pickups",
                type: "timestamp without time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP(0)",
                oldClrType: typeof(DateTime),
                oldType: "timestamptz",
                oldDefaultValueSql: "CURRENT_TIMESTAMP(0)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "RequestedPickupTime",
                table: "Pickups",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamptz");

            migrationBuilder.AlterColumn<DateTime>(
                name: "PickupTime",
                table: "Pickups",
                type: "timestamp without time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamptz",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CanceledTime",
                table: "Pickups",
                type: "timestamp without time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamptz",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Items",
                type: "timestamp without time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP(0)",
                oldClrType: typeof(DateTime),
                oldType: "timestamptz",
                oldDefaultValueSql: "CURRENT_TIMESTAMP(0)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DonatedAt",
                table: "Donations",
                type: "timestamp without time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP(0)",
                oldClrType: typeof(DateTime),
                oldType: "timestamptz",
                oldDefaultValueSql: "CURRENT_TIMESTAMP(0)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Categories",
                type: "timestamp without time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP(0)",
                oldClrType: typeof(DateTime),
                oldType: "timestamptz",
                oldDefaultValueSql: "CURRENT_TIMESTAMP(0)");
        }
    }
}
