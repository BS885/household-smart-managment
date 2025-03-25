using Microsoft.AspNetCore.Mvc;
using SmartManagement.Core.services;

namespace SmartManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class S3Controller : ControllerBase
    {
        private readonly Is3Service _s3Service;

        public S3Controller(Is3Service s3Service)
        {
            _s3Service = s3Service;
        }

        [HttpGet("generate-upload-url/{fileName}")]
        public async Task<IActionResult> GenerateUploadUrl(string fileName, [FromQuery] string contentType)
        {
            
            var url = await _s3Service.GeneratePresignedUrlAsync(fileName, contentType);
            return Ok(new { uploadUrl = url });
        }

        [HttpGet("generate-download-url/{fileName}")]
        public async Task<IActionResult> GenerateDownloadUrl(string fileName)
        {
            Console.WriteLine("enter");
            var url = await _s3Service.GetDownloadUrlAsync(fileName);
            return Ok(new { downloadUrl = url });
        }
    }
}
