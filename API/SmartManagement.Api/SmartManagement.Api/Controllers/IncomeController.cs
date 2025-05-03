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
    public class IncomesController : ControllerBase
    {
        private readonly IExpenseAndIncomeService _expenseService;
        private readonly IUserService _userService;
        private readonly IAiService _aiService;

        public IncomesController(IExpenseAndIncomeService expenseService, Is3Service S3FileService, IUserService userService,IAiService aiService)
        {
            _expenseService = expenseService;
            _userService = userService;
            _aiService = aiService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddIncome([FromBody] ExpenseAndIncomeDtoReq IncomeDto)
        {
            try
            {
                var userId = _userService.GetUserIdFromToken(User);
                var category = await _aiService.GetCategoryFromDescription(IncomeDto.Description, "Income");
                if (category == null)
                {
                    return BadRequest("Error in AI service");
                }
                var IncomeId = await _expenseService.AddExpenseOrIncomeAsync(

                    IncomeDto.Date,
                    category,
                    int.Parse(userId),
                    IncomeDto.Description,
                    TransactionType.UnFixIncome,
                    IncomeDto.Sum,
                    IncomeDto.file,
                    IncomeDto.FileType,
                    IncomeDto.FileName,
                    IncomeDto.Filesize,
                    null
                );

                return Ok(new { IncomeId });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetIncomeById(int id)
        {
            try
            {
                var income = await _expenseService.GetExpenseOrIncomeByIdAsync(id);
                if (income == null)
                {
                    return NotFound();
                }

                var userId = _userService.GetUserIdFromToken(User);
                if (income.UserId.ToString() != userId)
                {
                    return Forbid("אין לך הרשאה לצפות בהכנסה זו.");
                }

                return Ok(income);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllIncomeByIDUser()
        {
            try
            {
                var tyu = ((int)TransactionType.UnFixIncome);
                var userId = _userService.GetUserIdFromToken(User);

                var filteredExpenses = await _expenseService.GetExpensesOrIncomesByUserIdAsync(int.Parse(userId), TransactionType.UnFixIncome);
                return Ok(filteredExpenses);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateIncome(int id, [FromBody] ExpenseAndIncomeDtoReq IncomeDto)
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
                    return Forbid("אין לך הרשאה לעדכן הכנסה זו.");
                }

                await _expenseService.UpdateExpenseOrIncomeAsync(
                    id,
                    IncomeDto.Date,
                    IncomeDto.Category,
                    IncomeDto.Description,
                    TransactionType.UnFixIncome,
                    IncomeDto.Sum,
                    IncomeDto.file,
                    IncomeDto.FileType,
                    IncomeDto.FileName,
                    IncomeDto.Filesize,
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
        public async Task<IActionResult> DeleteIncome(int id)
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

    }
}
