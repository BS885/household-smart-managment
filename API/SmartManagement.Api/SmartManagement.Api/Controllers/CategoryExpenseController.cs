using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartManagement.Core.services;

namespace SmartManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryExpenseController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CategoryExpenseController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
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
        [HttpGet("list")]
        public async Task<IActionResult> GetAllCategoriesListName()
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
    }
}
