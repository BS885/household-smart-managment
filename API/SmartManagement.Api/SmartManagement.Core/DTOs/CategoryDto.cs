using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.DTOs
{
    public class CategoryDto
    {
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Type is required")]
        [RegularExpression("income|expense", ErrorMessage = "Type must be either 'income' or 'expense'")]
        public string Type { get; set; }

        public string Description { get; set; }
    }
}
