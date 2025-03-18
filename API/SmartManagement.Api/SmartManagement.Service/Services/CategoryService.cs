using SmartManagement.Core.Models;
using SmartManagement.Core.Repositories;
using SmartManagement.Core.services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Service.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<CategoryExpenseAndIncome> AddCategoryAsync(string name, string description)
        {
            var category = new CategoryExpenseAndIncome
            {
                Name = name,
                Description = description
            };
            await _categoryRepository.AddAsync(category);
            return category;
        }

        public async Task<IEnumerable<CategoryExpenseAndIncome>> GetAllCategoriesAsync()
        {
            return await _categoryRepository.GetAllAsync();
        }
    }

}