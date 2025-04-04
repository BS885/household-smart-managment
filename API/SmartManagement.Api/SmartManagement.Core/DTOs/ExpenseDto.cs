﻿using Microsoft.AspNetCore.Http;
using SmartManagement.Core.Enums;
using SmartManagement.Core.Models;
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
        public CategoryExpenseAndIncome Category { get; set; }
        public int UserId { get; set; }
        public string Description { get; set; }
        public TransactionType TypeTransaction { get; set; }
        public decimal Sum { get; set; }
        public int? FixedExpenseAndIncomeId { get; set; }
    }
}
