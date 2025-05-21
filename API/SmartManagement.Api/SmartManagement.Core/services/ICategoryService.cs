using SmartManagement.Core.DTOs;
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
        Task<CategoryExpenseAndIncome> AddCategoryAsync(CategoryDto category);
        Task DeleteCategoryAsync(int id);
        Task<CategoryExpenseAndIncome> UpdateCategory(int id, CategoryDto categoryDto);
    }
}
