using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartManagement.Data.Migrations
{
    /// <inheritdoc />
    public partial class addS3_key2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "S3_key",
                table: "TransactionDocuments",
                newName: "S3_Key");

            migrationBuilder.AlterColumn<string>(
                name: "S3_Key",
                table: "TransactionDocuments",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "S3_Key",
                table: "TransactionDocuments",
                newName: "S3_key");

            migrationBuilder.UpdateData(
                table: "TransactionDocuments",
                keyColumn: "S3_key",
                keyValue: null,
                column: "S3_key",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "S3_key",
                table: "TransactionDocuments",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
