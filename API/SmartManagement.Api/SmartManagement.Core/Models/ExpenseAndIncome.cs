using SmartManagement.Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.Models
{
    public class ExpenseAndIncome
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public CategoryExpenseAndIncome Category { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
        public TransactionDocument? TransactionDocument { get; set; }
        public string Description { get; set; }
        public TransactionType TypeTransaction { get; set; }
        public decimal Sum { get; set; }
        public FixedExpenseAndIncome? FixedExpenseAndIncome { get; set; }
        public int? FixedExpenseAndIncomeId { get; set; }

    }
}
