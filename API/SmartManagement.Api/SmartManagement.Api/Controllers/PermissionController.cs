using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using SmartManagement.Core.DTOs;
using SmartManagement.Core.services;

namespace SmartManagement.Api.Controllers
{
    [ApiController]
    [Authorize(Policy = "Roles.Permission")]
    [Route("api/[controller]")]
    public class PermissionController : ControllerBase
    {
        private readonly IPermissionService _permissionService;
        private readonly ILogger<PermissionController> _logger;

        public PermissionController(IPermissionService permissionService, ILogger<PermissionController> logger)
        {
            _permissionService = permissionService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<PermissionDto>> AddPermission([FromBody] PermissionDto dto)
        {
            try
            {
                var result = await _permissionService.AddPermissionAsync(dto.Name, dto.Description);
                return Created("created Permission in successfully ", result);
            }
            catch (ApplicationException ex)
            {
                _logger.LogWarning(ex, "Custom error occurred while adding a permission.");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding a permission.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<PermissionDto>>> GetAll()
        {
            try
            {
                var result = await _permissionService.GetAllPermissionsAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting all permissions.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PermissionDto>> GetPermissionById(int id)
        {
            try
            {
                var result = await _permissionService.GetPermissionByIdAsync(id);
                if (result == null)
                    return NotFound();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while getting permission with ID {id}.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _permissionService.DeletePermissionAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while deleting permission with ID {id}.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpGet("role-has-permission")]
        public async Task<ActionResult<bool>> RoleHasPermission([FromQuery] int roleId, [FromQuery] string permissionName)
        {
            var result = await _permissionService.RoleHasPermissionAsync(roleId, permissionName);
            return Ok(result);
        }

        [HttpGet("by-role/{roleId}")]
        public async Task<ActionResult<IEnumerable<PermissionDto>>> GetPermissionsByRoleId(int roleId)
        {
            var result = await _permissionService.GetPermissionsByRoleIdAsync(roleId);
            return Ok(result);
        }

        [HttpPost("add-to-role")]
        public async Task<IActionResult> AddPermissionToRole([FromQuery] string roleName, [FromQuery] string permissionName)
        {
            try
            {
                await _permissionService.AddPermissionToRoleAsync(roleName, permissionName);
                return Ok($"the {permissionName} add to {roleName}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while adding permission {permissionName} to role {roleName}.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }
    }
}
