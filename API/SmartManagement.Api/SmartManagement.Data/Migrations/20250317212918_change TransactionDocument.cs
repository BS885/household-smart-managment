using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartManagement.Data.Migrations
{
    /// <inheritdoc />
    public partial class changeTransactionDocument : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UploadDate",
                table: "TransactionDocuments",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "FileUrl",
                table: "TransactionDocuments",
                newName: "S3Key");

            migrationBuilder.AddColumn<int>(
                name: "FolderId",
                table: "TransactionDocuments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "Size",
                table: "TransactionDocuments",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "TransactionDocuments",
                type: "datetime(6)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FolderId",
                table: "TransactionDocuments");

            migrationBuilder.DropColumn(
                name: "Size",
                table: "TransactionDocuments");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "TransactionDocuments");

            migrationBuilder.RenameColumn(
                name: "S3Key",
                table: "TransactionDocuments",
                newName: "FileUrl");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "TransactionDocuments",
                newName: "UploadDate");
        }
    }
}
