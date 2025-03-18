using SmartManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.services
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryExpenseAndIncome>> GetAllCategoriesAsync();
        Task<CategoryExpenseAndIncome> AddCategoryAsync(string name, string description);
    }
}
