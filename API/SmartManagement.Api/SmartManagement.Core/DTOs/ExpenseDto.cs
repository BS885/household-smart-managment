using Microsoft.AspNetCore.Http;
using SmartManagement.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.DTOs
{
    public class ExpenseDto
    {
        public DateTime Date { get; set; }
        public CategoriesIncomeAndExpense Category { get; set; }
        public int UserId { get; set; }
        public string Description { get; set; }
        public TransactionType TypeTransaction { get; set; }
        public decimal Sum { get; set; }
        public int? FixedExpenseAndIncomeId { get; set; }
        public IFormFile File { get; set; }
    }
}
