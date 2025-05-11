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
        private readonly IExpenseAndIncomeService _expenseService;
        private readonly IUserService _userService;
        private readonly IAiService _aiService;
        public ExpensesController(IExpenseAndIncomeService expenseService, Is3Service S3FileService, IUserService userService, IAiService aiService)
        {
            _expenseService = expenseService;
            _userService = userService;
            _aiService = aiService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddExpense([FromBody] ExpenseAndIncomeDtoReq expenseDto)
        {
        console.log("enter AddExpense");
            try
            {
                var userId = _userService.GetUserIdFromToken(User);
                var category = await _aiService.GetCategoryFromDescription(expenseDto.Description, "expense");
                if (category == null)
                {
                    return BadRequest("Error in AI service");
                }
                var expenseId = await _expenseService.AddExpenseOrIncomeAsync(

                    expenseDto.Date,
                    //expenseDto.Category,
                    category,
                    int.Parse(userId),
                    expenseDto.Description,
                    TransactionType.UnFixedExpense,
                    expenseDto.Sum,
                    expenseDto.file,
                    expenseDto.FileType,
                    expenseDto.FileName,
                    expenseDto.Filesize,
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
                var expense = await _expenseService.GetExpenseOrIncomeByIdAsync(id);
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
                //var type = ((int)TransactionType.UnFixedExpense);
                var userId = _userService.GetUserIdFromToken(User);

                var filteredExpenses = await _expenseService.GetExpensesOrIncomesByUserIdAsync(int.Parse(userId), TransactionType.UnFixedExpense);
                return Ok(filteredExpenses);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, [FromBody] ExpenseAndIncomeDtoReq expenseDto)
        {
            try
            {
                var expense = await _expenseService.GetExpenseOrIncomeByIdAsync(id);
                if (expense == null)
                {
                    return NotFound();
                }

                var userId = _userService.GetUserIdFromToken(User);
                if (expense.UserId.ToString() != userId)
                {
                    return Forbid("אין לך הרשאה לעדכן הוצאה זו.");
                }

                await _expenseService.UpdateExpenseOrIncomeAsync(
                    id,
                    expenseDto.Date,
                    expenseDto.Category,
                    expenseDto.Description,
                    TransactionType.UnFixedExpense,
                    expenseDto.Sum,
                    expenseDto.file,
                    expenseDto.FileType,
                    expenseDto.FileName,
                    expenseDto.Filesize,
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
                var expense = await _expenseService.GetExpenseOrIncomeByIdAsync(id);
                if (expense == null)
                {
                    return NotFound();
                }

                var userId = _userService.GetUserIdFromToken(User);
                if (expense.UserId.ToString() != userId)
                {
                    return Forbid("אין לך הרשאה למחוק הוצאה זו.");
                }

                await _expenseService.DeleteExpenseOrIncomeAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("by-date-category-user")]
        public async Task<IActionResult> GetByDateCategoryAndUser(
            [FromBody] TransactionFilterDto request)
        {
            try
            {
                Console.WriteLine("expenses by-date-category-user " + request.StartDate);
                var userId = _userService.GetUserIdFromToken(User);
                
                var result = await _expenseService.GetTransactionsByDateCategoryAndUserAsync(request.StartDate, request.EndDate, int.Parse(userId), TransactionType.UnFixedExpense, request.CategoryName);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "שגיאה בשרת: " + ex.Message);
            }
        }
        [HttpGet("by-year-user/{year}")]
        public async Task<IActionResult> GetByYearAndUser(int year)
        {
            try
            {
                var userId = _userService.GetUserIdFromToken(User);
                var result = await _expenseService.GetTransactionsAcordingYearAndUserAsync(
                    year,
                    int.Parse(userId),
                    TransactionType.UnFixedExpense
                );
                return Ok(result);
            }
            catch (Exception ex)
            {
                // כדאי להחזיר שגיאה ולא להשאיר את ה-catch ריק
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

    }
}
