using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartManagement.Core.DTOs;
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

        [Authorize(Policy = "Category.Manage")]
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


        [Authorize(Policy = "Category.Manage")]
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

        //[Authorize(Policy = "Category.Manage")]
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteCategory(int id)
        //{
        //    try
        //    {
        //        await _categoryService.DeleteCategoryAsync(id);
        //        return Ok(new { message = $"Category with ID {id} deleted successfully." });
        //    }
        //    catch (KeyNotFoundException ex)
        //    {
        //        return NotFound(new { message = ex.Message });
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new { message = "Failed to delete category.", details = ex.Message });
        //    }
        //}

        [Authorize(Policy = "Category.Manage")]
        [HttpPost]
        public async Task<IActionResult> AddCategory([FromBody] CategoryDto category)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Invalid category data.",
                    errors = ModelState
                        .Where(kv => kv.Value.Errors.Any())
                        .ToDictionary(
                            kv => kv.Key,
                            kv => kv.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                        )
                });
            }

            try
            {
                var addedCategory = await _categoryService.AddCategoryAsync(category);
                return Created(string.Empty, new { message = "Category added successfully.", category = addedCategory });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to add category.", details = ex.Message });
            }
        }

        [Authorize(Policy = "Category.Manage")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryDto category)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Invalid category data.",
                    errors = ModelState
                        .Where(kv => kv.Value.Errors.Any())
                        .ToDictionary(
                            kv => kv.Key,
                            kv => kv.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                        )
                });
            }

            try
            {
                var updated = await _categoryService.UpdateCategory(id, category);
                if (updated == null)
                    return NotFound(new { message = "Category not found." });

                return Ok(new { message = "Category updated successfully.", category = updated });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to update category.", details = ex.Message });
            }
        }

    }
}