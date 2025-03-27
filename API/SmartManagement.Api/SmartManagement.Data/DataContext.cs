//using Microsoft.EntityFrameworkCore;
//using SmartManagement.Core.Models;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace SmartManagement.Data
//{
//    public class DataContext : DbContext
//    {
//        public DbSet<User> Users { get; set; }
//        public DbSet<Role> Roles { get; set; }
//        public DbSet<UserRole> UserRoles { get; set; }

//        public DbSet<ExpenseAndIncome> ExpensesAndIncomes { get; set; }
//        public DbSet<FixedExpenseAndIncome> FixedExpensesAndIncomes { get; set; }
//        public DbSet<TransactionDocument> TransactionDocuments { get; set; }
//        public DbSet<CategoryExpenseAndIncome> CategoriesExpenseAndIncome { get; set; }

//        public DataContext(DbContextOptions<DataContext> options) : base(options) { }


//        protected override void OnModelCreating(ModelBuilder modelBuilder)
//        {
//            base.OnModelCreating(modelBuilder);

//            modelBuilder.Entity<UserRole>()
//        .HasKey(ur => new { ur.UserId, ur.RoleId });

//            modelBuilder.Entity<UserRole>()
//                .HasOne(ur => ur.User)
//                .WithMany(u => u.UserRoles)
//                .HasForeignKey(ur => ur.UserId);

//            modelBuilder.Entity<UserRole>()
//                .HasOne(ur => ur.Role)
//                .WithMany(r => r.UserRoles)
//                .HasForeignKey(ur => ur.RoleId);

//            modelBuilder.Entity<RolePermission>()
//            .HasKey(rp => new { rp.RoleId, rp.PermissionId });

//            modelBuilder.Entity<RolePermission>()
//                .HasOne(rp => rp.Role)
//                .WithMany(r => r.RolePermissions)
//                .HasForeignKey(rp => rp.RoleId);

//            modelBuilder.Entity<RolePermission>()
//                .HasOne(rp => rp.Permission)
//                .WithMany(p => p.RolePermissions)
//                .HasForeignKey(rp => rp.PermissionId);

//            // הכנסת תפקידים ראשוניים
//            modelBuilder.Entity<Role>().HasData(
//                new Role { RoleId = 1, RoleName = "User" },
//                new Role { RoleId = 2, RoleName = "Admin" }
//            );

//            modelBuilder.Entity<Permission>().HasData(
//            new Permission { Id = 1, Name = "Users.Create", Description = "Create new users" },
//            new Permission { Id = 2, Name = "Users.Delete", Description = "Delete users" },
//            new Permission { Id = 3, Name = "Users.Update", Description = "Edit users" },
//            new Permission { Id = 4, Name = "Users.View", Description = "View user details" },
//            new Permission { Id = 5, Name = "Files.Create", Description = "Create files" },
//            new Permission { Id = 6, Name = "Files.Delete", Description = "Delete files" },
//            new Permission { Id = 7, Name = "Files.Update", Description = "Edit files" },
//            new Permission { Id = 8, Name = "Files.View", Description = "View files" }
//            );
//        }


//    }
//}
using Microsoft.EntityFrameworkCore;
using SmartManagement.Core.Models;
using System;

namespace SmartManagement.Data
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }

        public DbSet<ExpenseAndIncome> ExpensesAndIncomes { get; set; }
        public DbSet<FixedExpenseAndIncome> FixedExpensesAndIncomes { get; set; }
        public DbSet<TransactionDocument> TransactionDocuments { get; set; }
        public DbSet<CategoryExpenseAndIncome> CategoriesExpenseAndIncome { get; set; }

        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // קשר רבים לרבים בין User ל-Role
            modelBuilder.Entity<User>()
                .HasMany(u => u.Roles)
                .WithMany(r => r.Users)
                .UsingEntity(j => j.ToTable("UserRoles")); // טבלת הקשר בין User ל-Role

            // קשר רבים לרבים בין Role ל-Permission
            modelBuilder.Entity<Role>()
                .HasMany(r => r.Permissions)
                .WithMany(p => p.Roles)
                .UsingEntity(j => j.ToTable("RolePermissions")); // טבלת הקשר בין Role ל-Permission

            // הכנסת תפקידים ראשוניים
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleId = 1, RoleName = "User" },
                new Role { RoleId = 2, RoleName = "Admin" }
            );

            // הכנסת הרשאות ראשוניות
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

            // הכנסת קטגוריות כלליות להוצאות והכנסות
            modelBuilder.Entity<CategoryExpenseAndIncome>().HasData(
                // קטגוריות הוצאות
                new CategoryExpenseAndIncome { Id = 1, Name = "אוכל", Description = "קניות בסופר, מסעדות ובתי קפה", ISExpense = true, IsIncome = false },
                new CategoryExpenseAndIncome { Id = 2, Name = "תחבורה", Description = "דלק, תחבורה ציבורית, רכב", ISExpense = true, IsIncome = false },
                new CategoryExpenseAndIncome { Id = 3, Name = "דיור", Description = "שכר דירה, משכנתא, חשבונות בית", ISExpense = true, IsIncome = false },
                new CategoryExpenseAndIncome { Id = 4, Name = "ביגוד והנעלה", Description = "קניית בגדים, נעליים ואביזרים", ISExpense = true, IsIncome = false },
                new CategoryExpenseAndIncome { Id = 5, Name = "בריאות", Description = "ביטוח רפואי, תרופות, טיפולי שיניים", ISExpense = true, IsIncome = false },
                new CategoryExpenseAndIncome { Id = 6, Name = "בילויים ופנאי", Description = "קולנוע, תיאטרון, טיולים", ISExpense = true, IsIncome = false },
                new CategoryExpenseAndIncome { Id = 7, Name = "חינוך", Description = "שכר לימוד, ספרים, קורסים", ISExpense = true, IsIncome = false },
                new CategoryExpenseAndIncome { Id = 8, Name = "מוצרים לבית", Description = "ריהוט, כלי בית, תחזוקה", ISExpense = true, IsIncome = false },
                new CategoryExpenseAndIncome { Id = 9, Name = "תשלומים חודשיים", Description = "ארנונה, חשמל, מים, גז, אינטרנט", ISExpense = true, IsIncome = false },
                new CategoryExpenseAndIncome { Id = 10, Name = "שונות", Description = "הוצאות בלתי צפויות", ISExpense = true, IsIncome = false },

                // קטגוריות הכנסות
                new CategoryExpenseAndIncome { Id = 11, Name = "משכורת", Description = "הכנסה מעבודה חודשית", ISExpense = false, IsIncome = true },
                new CategoryExpenseAndIncome { Id = 12, Name = "הכנסה מעסק", Description = "רווחים מעסק עצמאי", ISExpense = false, IsIncome = true },
                new CategoryExpenseAndIncome { Id = 13, Name = "השקעות", Description = "רווחים מהשקעות במניות, קרנות", ISExpense = false, IsIncome = true },
                new CategoryExpenseAndIncome { Id = 14, Name = "קצבאות", Description = "הכנסות מביטוח לאומי, פנסיה", ISExpense = false, IsIncome = true },
                new CategoryExpenseAndIncome { Id = 15, Name = "הכנסות נוספות", Description = "הכנסות צדדיות, עבודות זמניות", ISExpense = false, IsIncome = true }
            );
        }
    }
}
