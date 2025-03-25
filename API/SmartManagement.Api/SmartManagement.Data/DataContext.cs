using Microsoft.EntityFrameworkCore;
using SmartManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Data
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        public DbSet<ExpenseAndIncome> ExpensesAndIncomes { get; set; }
        public DbSet<FixedExpenseAndIncome> FixedExpensesAndIncomes { get; set; }
        public DbSet<TransactionDocument> TransactionDocuments { get; set; }
        public DbSet<CategoryExpenseAndIncome> CategoriesExpenseAndIncome { get; set; }

        public DataContext(DbContextOptions<DataContext> options) : base(options) { }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRole>()
        .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);

            modelBuilder.Entity<RolePermission>()
            .HasKey(rp => new { rp.RoleId, rp.PermissionId });

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Role)
                .WithMany(r => r.RolePermissions)
                .HasForeignKey(rp => rp.RoleId);

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Permission)
                .WithMany(p => p.RolePermissions)
                .HasForeignKey(rp => rp.PermissionId);

            // הכנסת תפקידים ראשוניים
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleId = 1, RoleName = "User" },
                new Role { RoleId = 2, RoleName = "Admin" }
            );

            modelBuilder.Entity<Permission>().HasData(
            new Permission { Id = 1, Name = "Users.Create", Description = "Create new users" },
            new Permission { Id = 2, Name = "Users.Delete", Description = "Delete users" },
            new Permission { Id = 3, Name = "Users.Update", Description = "Edit users" },
            new Permission { Id = 4, Name = "Users.View", Description = "View user details" },
            new Permission { Id = 5, Name = "Files.Create", Description = "Create files" },
            new Permission { Id = 6, Name = "Files.Delete", Description = "Delete files" },
            new Permission { Id = 7, Name = "Files.Update", Description = "Edit files" },
            new Permission { Id = 8, Name = "Files.View", Description = "View files" }
            );
        }


    }
}