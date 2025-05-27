using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartManagement.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUserTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastLogin",
                table: "Users",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 1,
                column: "Description",
                value: "קניות בסופר, משנת יוסף");

            migrationBuilder.UpdateData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 6,
                column: "Description",
                value: "טיולים");

            migrationBuilder.UpdateData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 9,
                column: "Description",
                value: "ארנונה, חשמל, מים, גז, ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastLogin",
                table: "Users");

            migrationBuilder.UpdateData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 1,
                column: "Description",
                value: "קניות בסופר, מסעדות ובתי קפה");

            migrationBuilder.UpdateData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 6,
                column: "Description",
                value: "קולנוע, תיאטרון, טיולים");

            migrationBuilder.UpdateData(
                table: "CategoriesExpenseAndIncome",
                keyColumn: "Id",
                keyValue: 9,
                column: "Description",
                value: "ארנונה, חשמל, מים, גז, אינטרנט");
        }
    }
}
