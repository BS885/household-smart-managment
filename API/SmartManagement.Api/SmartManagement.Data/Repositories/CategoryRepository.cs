using Microsoft.EntityFrameworkCore;
using SmartManagement.Core.Models;
using SmartManagement.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Data.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly DataContext _context;

        public CategoryRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<CategoryExpenseAndIncome> AddAsync(CategoryExpenseAndIncome category)
        {
            await _context.CategoriesExpenseAndIncome.AddAsync(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<CategoryExpenseAndIncome> GetByNameAsync(string name)
        {
            return await _context.CategoriesExpenseAndIncome.FirstOrDefaultAsync(c => c.Name == name);
        }

        public async Task<IEnumerable<CategoryExpenseAndIncome>> GetAllAsync(string type)
        {
            return await _context.CategoriesExpenseAndIncome
            .Where(c => (type.ToLower() == "expense" && c.ISExpense) ||
                  (type.ToLower() == "income" && c.IsIncome))
                .ToListAsync();
        }

        public async Task<CategoryExpenseAndIncome> GetByIdAsync(int id)
        {
            return await _context.CategoriesExpenseAndIncome.FirstOrDefaultAsync(c => c.Id == id);

        }

        public async Task UpdateAsync(CategoryExpenseAndIncome category)
        {
            _context.CategoriesExpenseAndIncome.Update(category);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var category = await GetByIdAsync(id);
            if (category != null)
            {
                _context.CategoriesExpenseAndIncome.Remove(category);
                await _context.SaveChangesAsync();
            }
        }
    }
}
