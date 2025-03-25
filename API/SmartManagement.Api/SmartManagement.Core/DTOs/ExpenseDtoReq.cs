using Microsoft.AspNetCore.Http;
using SmartManagement.Core.Enums;
using SmartManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.DTOs
{
    public class ExpenseDtoReq
    {
        public DateTime Date { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
        public decimal Sum { get; set; }
    }
}
