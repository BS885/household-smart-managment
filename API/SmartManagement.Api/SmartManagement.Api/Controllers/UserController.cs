using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartManagement.Core.DTOs;
using SmartManagement.Core.Exceptios;
using SmartManagement.Core.services;
using System.Security.Claims;

namespace SmartManagement.Api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;
        public UserController(IUserService userService, ILogger<UserController> logger)
        {

            _userService = userService;
            _logger = logger;
        }


        [HttpPut("{id}")]
        [Authorize(Policy = "Users.Update")]
        public IActionResult UpdateProfile([FromBody] UpdateUserDto updateProfileDto, string id)
        {

            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId != id)
            {
                _logger.LogInformation("UpdateProfile userId" + id);

                return Unauthorized("token not valid");
            }
            try
            {
                _userService.UpdateUser(
                     int.Parse(id),
                     updateProfileDto.Name,
                     updateProfileDto.Address,
                     updateProfileDto.City,
                     updateProfileDto.Phone
                 );

                return Ok("user update successfully");
            }
            catch (UserNotFoundException)
            {
                return NotFound("User not found");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Policy = "Roles.Permission")]
        [HttpPost("update-role")]
        public async Task<IActionResult> UpdateUserRole([FromBody] UpdateUserRoleDto request)
        {
            try
            {

                var updatedUser = await _userService.UpdateRoleToUserAsync(request);
                return Ok(updatedUser);
            }
            catch (UserNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update user role");
                return StatusCode(500, "An error occurred while updating the user's role.");
            }
        }

        [Authorize(Policy = "Roles.Permission")]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                _logger.LogInformation("Getting all users");

                var users = await _userService.GetUsers(); // קריאה לשירות
                return Ok(users); // מחזיר 200 OK עם הנתונים
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get all users");
                return StatusCode(500, "An error occurred while retrieving users.");
            }
        }
    }
}
