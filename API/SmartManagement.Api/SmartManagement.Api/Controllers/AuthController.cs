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
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            Console.WriteLine("enter");
            try
            {
                LoginResult result = _authService.Login(loginRequest);

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
        public IActionResult Register([FromBody] RegisterUserDto userRegister)
        {
            try
            {
                var user = _authService.Register(userRegister);

                return CreatedAtAction(nameof(Register), new { email = user.Email }, user);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error occurred: {ex.Message}");
            }
        }
    }
}
