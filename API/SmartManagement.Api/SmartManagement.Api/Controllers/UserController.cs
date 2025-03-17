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
        public UserController(IUserService userService)
        {

            _userService = userService;
        }

       
        [HttpPut("{id}")]
        [Authorize]
        public IActionResult UpdateProfile([FromBody] UpdateUserDto updateProfileDto, string id)
        {
            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId != id)
            {

                return Forbid("token not valid");
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
