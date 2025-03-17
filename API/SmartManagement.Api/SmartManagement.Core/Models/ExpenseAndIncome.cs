using SmartManagement.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.Models
{
    public class ExpenseAndIncome
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public CategoriesIncomeAndExpense Category { get; set; }
        public int IdUser { get; set; }
        public int? IdFile { get; set; }
        public string Description { get; set; }
        public TransactionType TypeTransaction { get; set; }
        public decimal Sum { get; set; }
        public int? FixedExpenseAndIncomeId { get; set; }
    }
}
