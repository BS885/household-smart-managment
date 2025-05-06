using Microsoft.AspNetCore.Http;
using SmartManagement.Core.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SmartManagement.Core.Models;
using SmartManagement.Core.services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SmartManagement.Core.Exceptios;
using Microsoft.AspNetCore.Authorization;

namespace SmartManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IAuthService _authService;

        public AuthController(IConfiguration configuration, IAuthService authService)
        {
            _configuration = configuration;
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            try
            {
                var result =await _authService.Login(loginRequest);

                if (result != null)
                {
                    return Ok(new { userLogin = result });
                }

                return Unauthorized(new { Message = "Invalid username or password" });
            }
            catch
            (UserNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Error = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto userRegister)
        {
            try
            {
                var user = await _authService.Register(userRegister);

                return CreatedAtAction(nameof(Register), new { email = user.Email}, user);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error occurred: {ex.Message}");
            }
        }

        [Authorize(Policy= "Users.AddAdmin")]
        [HttpPost("register/Manager")]
        public async Task<IActionResult> RegisterManager([FromBody] RegisterUserDto userRegister)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                userRegister.RoleName = "Admin";
                var user = await _authService.Register(userRegister);

                return CreatedAtAction(nameof(Register), new { email = user.Email }, user);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error occurred: {ex.Message}");
            }
        }
    }
}
