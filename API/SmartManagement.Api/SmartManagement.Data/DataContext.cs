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
        public DbSet<ExpenseAndIncome> ExpensesAndIncomes { get; set; }
        public DbSet<FixedExpenseAndIncome> FixedExpensesAndIncomes { get; set; }
        public DbSet<TransactionDocument> TransactionDocuments { get; set; }

        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    }
}