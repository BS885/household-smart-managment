using SmartManagement.Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.Models
{
    public class FixedExpenseAndIncome
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int CategoryId { get; set; }
        public TransactionType TypeTransaction { get; set; }
        public decimal Sum { get; set; }
        public int DayOfMonth { get; set; }
        public User User { get; set; }
        public int UserId { get; set; } 
    }
}
