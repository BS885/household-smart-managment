using AutoMapper;
using Microsoft.Extensions.Logging;
using SmartManagement.Core.DTOs;
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
        private readonly IMapper _mapper;
        private readonly ILogger<CategoryService> _logger;

        public CategoryService(ICategoryRepository categoryRepository, IMapper mapper, ILogger<CategoryService> logger)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<CategoryExpenseAndIncome> AddCategoryAsync(CategoryDto categoryAdd)
        {
            bool isIncome = (categoryAdd.Type == "income");
            bool isExpense = !isIncome;

            var category = new CategoryExpenseAndIncome
            {
                Name = categoryAdd.Name,
                Description = categoryAdd.Description,
                IsIncome = isIncome,
                ISExpense = isExpense
            };
            var categorAdded = await _categoryRepository.AddAsync(category);
            return categorAdded;
        }

        public async Task DeleteCategoryAsync(int id)
        {
            try
            {
                await _categoryRepository.DeleteAsync(id);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Delete failed: Category with ID {Id} not found.", id);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting category with ID {Id}.", id);
                throw new ApplicationException("An error occurred while deleting the category.", ex);
            }
        }

        public async Task<CategoryExpenseAndIncome> UpdateCategory(int id, CategoryDto categoryDto)
        {
            try
            {
                var category = await _categoryRepository.UpdateAsync(id, categoryDto);
                if (category == null)
                {
                    throw new KeyNotFoundException($"Category with ID {id} not found.");
                }

                return category;
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogError($"Update failed: {ex.Message}", ex);

                throw new ApplicationException($"Update failed: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError("An unexpected error occurred while updating the category.", ex);

                throw new ApplicationException("An unexpected error occurred while updating the category.", ex);
            }
        }


        public async Task<IEnumerable<CategoryExpenseAndIncome>> GetAllCategoriesAsync(string type)
        {
            return await _categoryRepository.GetAllAsync(type);
        }

        public async Task<IEnumerable<string>> GetAllCategoriesListNameAsync(string type)
        {
            var result = await GetAllCategoriesAsync(type);
            return _mapper.Map<IEnumerable<string>>(result);

        }
    }

}