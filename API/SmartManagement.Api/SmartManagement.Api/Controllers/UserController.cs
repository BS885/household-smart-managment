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
            _logger.LogInformation("enter");

            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId != id)
            {
                _logger.LogInformation("userId" + id);
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
    }
}
