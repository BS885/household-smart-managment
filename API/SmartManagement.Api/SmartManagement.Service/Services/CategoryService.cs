using AutoMapper;
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

        public CategoryService(ICategoryRepository categoryRepository,IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
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

        public async Task<IEnumerable<CategoryExpenseAndIncome>> GetAllCategoriesAsync(string type)
        {
            return await _categoryRepository.GetAllAsync(type);
        }
        public async Task<IEnumerable<string>> GetAllCategoriesListNameAsync(string type)
        {
            var result= await GetAllCategoriesAsync(type);
           return _mapper.Map<IEnumerable<string>>(result);

        }
    }

}