using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartManagement.Core.DTOs;
using SmartManagement.Core.Enums;
using SmartManagement.Core.services;
using SmartManagement.Service.Services;

namespace SmartManagement.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenseService _expenseService;
        private readonly IUserService _userService;

        public ExpensesController(IExpenseService expenseService, Is3Service S3FileService, IUserService userService)
        {
            _expenseService = expenseService;
            _userService = userService;
        }
       
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddExpense([FromBody] ExpenseDtoReq expenseDto)
        {
            try
            {
                var userId = _userService.GetUserIdFromToken(User);

                var expenseId = await _expenseService.AddExpenseAsync(
                    expenseDto.Date,
                    expenseDto.Category,
                    int.Parse(userId),
                    expenseDto.Description,
                    TransactionType.UnFixedExpense,
                    expenseDto.Sum,
                    null
                );

                return Ok(new { expenseId });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
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
                if (expense.UserId.ToString() != userId)
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

                var filteredExpenses = await _expenseService.GetExpensesByUserIdAsync(int.Parse(userId));
                return Ok(filteredExpenses);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, [FromBody] ExpenseDtoReq expenseDto)
        {
            try
            {
                var expense = await _expenseService.GetExpenseByIdAsync(id);
                if (expense == null)
                {
                    return NotFound();
                }

                var userId = _userService.GetUserIdFromToken(User);
                if (expense.UserId.ToString() != userId)
                {
                    return Forbid("אין לך הרשאה לעדכן הוצאה זו.");
                }

                await _expenseService.UpdateExpenseAsync(
                    id,
                    expenseDto.Date,
                    expenseDto.Category,
                    expenseDto.Description,
                    TransactionType.UnFixedExpense,
                    expenseDto.Sum,
                    null
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
                if (expense.UserId.ToString() != userId)
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
