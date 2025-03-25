using SmartManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.Repositories
{
    public interface ICategoryRepository
    {
        Task<CategoryExpenseAndIncome> AddAsync(CategoryExpenseAndIncome category);
        Task<CategoryExpenseAndIncome> GetByNameAsync(string name);
        Task<IEnumerable<CategoryExpenseAndIncome>> GetAllAsync(string type);
        Task<CategoryExpenseAndIncome> GetByIdAsync(int id);
        Task UpdateAsync(CategoryExpenseAndIncome category);
        Task DeleteAsync(int id);
    }
}
