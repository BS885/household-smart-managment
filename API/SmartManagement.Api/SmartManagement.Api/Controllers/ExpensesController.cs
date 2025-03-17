using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartManagement.Core.DTOs;
using SmartManagement.Core.services;
using SmartManagement.Service.Services;

namespace SmartManagement.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly ExpenseService _expenseService;
        private readonly IS3FileService _S3FileService;
        private readonly IUserService _userService;

        public ExpensesController(ExpenseService expenseService, IS3FileService S3FileService, IUserService userService)
        {
            _expenseService = expenseService;
            _S3FileService = S3FileService;
            _userService = userService;
        }
        [HttpPost]
        public async Task<IActionResult> AddExpense([FromForm] ExpenseDto expenseDto)
        {
            try
            {
                var userId =_userService.GetUserIdFromToken(User);

                if (userId != expenseDto.UserId.ToString())
                {

                    return Forbid("אין לך הרשאה להוסיף הוצאה עבור משתמש זה.");
                }

                var expenseId = await _expenseService.AddExpenseAsync(
                    expenseDto.Date,
                    expenseDto.Category,
                    expenseDto.UserId,
                    expenseDto.Description,
                    expenseDto.TypeTransaction,
                    expenseDto.Sum,
                    expenseDto.FixedExpenseAndIncomeId
                );

                if (expenseDto.File != null)
                {
                    var presignedUrl = await _S3FileService.GetPresignedUrlAsync(expenseDto.File.FileName, expenseDto.File.ContentType);
                    return Ok(new { expenseId, presignedUrl });
                }

                return Ok(new { expenseId });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetExpenseById(int id)
        {
            try
            {
                var expense = await _expenseService.GetExpenseByIdAsync(id);
                if (expense == null)
                {
                    return NotFound();
                }

                var userId = _userService.GetUserIdFromToken(User);
                if (expense.IdUser.ToString() != userId)
                {
                    return Forbid("אין לך הרשאה לצפות בהוצאה זו.");
                }

                return Ok(expense);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllExpensesByIDUser()
        {
            try
            {
                var userId = _userService.GetUserIdFromToken(User);

                var filteredExpenses = _expenseService.GetExpensesByUserIdAsync(int.Parse(userId));
                return Ok(filteredExpenses);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, [FromBody] ExpenseDto expenseDto)
        {
            try
            {
                var expense = await _expenseService.GetExpenseByIdAsync(id);
                if (expense == null)
                {
                    return NotFound();
                }

                var userId = _userService.GetUserIdFromToken(User);
                if (expense.IdUser.ToString() != userId)
                {
                    return Forbid("אין לך הרשאה לעדכן הוצאה זו.");
                }

                await _expenseService.UpdateExpenseAsync(
                    id,
                    expenseDto.Date,
                    expenseDto.Category,
                    expenseDto.Description,
                    expenseDto.TypeTransaction,
                    expenseDto.Sum,
                    expenseDto.FixedExpenseAndIncomeId
                );
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            try
            {
                var expense = await _expenseService.GetExpenseByIdAsync(id);
                if (expense == null)
                {
                    return NotFound();
                }

                var userId = _userService.GetUserIdFromToken(User);
                if (expense.IdUser.ToString() != userId)
                {
                    return Forbid("אין לך הרשאה למחוק הוצאה זו.");
                }

                await _expenseService.DeleteExpenseAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
