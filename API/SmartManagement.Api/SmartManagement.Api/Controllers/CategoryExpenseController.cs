using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartManagement.Core.services;

namespace SmartManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [Authorize]
        [HttpGet("Expense")]
        public async Task<IActionResult> GetAllExpenseCategories()
        {
            try
            {
                var categories = await _categoryService.GetAllCategoriesAsync("Expense");
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpGet("Expense/list")]
        public async Task<IActionResult> GetAllExpenseCategoriesListName()
        {
            try
            {
                var categories = await _categoryService.GetAllCategoriesListNameAsync("Expense");
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [Authorize]
        [HttpGet("Income")]
        public async Task<IActionResult> GetAllIncomeCategories()
        {
            try
            {
                var categories = await _categoryService.GetAllCategoriesAsync("Income");
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpGet("Income/list")]
        public async Task<IActionResult> GetAllIncomeCategoriesListName()
        {
            try
            {
                var categories = await _categoryService.GetAllCategoriesListNameAsync("Income");
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
