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
        Task<IEnumerable<CategoryExpenseAndIncome>> GetAllCategoriesAsync(string type);
        Task<IEnumerable<string>> GetAllCategoriesListNameAsync(string type);
        Task<CategoryExpenseAndIncome> AddCategoryAsync(string name, string description);
    }
}
