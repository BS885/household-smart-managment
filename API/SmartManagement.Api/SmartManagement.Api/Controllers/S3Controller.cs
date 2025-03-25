using Microsoft.AspNetCore.Mvc;
using SmartManagement.Core.services;

namespace SmartManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class S3Controller : ControllerBase
    {
        private readonly Is3Service _s3Service;


        public S3Controller(Is3Service s3Server)
        {
            _s3Service = s3Server;
        }

        //   שלב 1: קבלת URL להעלאת קובץ ל-S3
        [HttpGet("upload-url")]
        public async Task<IActionResult> GetUploadUrl([FromQuery] string fileName, [FromQuery] string contentType)
        {
            Console.WriteLine("enter....");
            if (string.IsNullOrEmpty(fileName))
                return BadRequest("Missing file name");
            var url = await _s3Service.GeneratePresignedUrlAsync(fileName, contentType);
            return Ok(new { url });
        }

        //   שלב 2: קבלת URL להורדת קובץ מה-S3
        [HttpGet("download-url/{fileName}")]
        public async Task<IActionResult> GetDownloadUrl(string fileName)
        {
            var url = await _s3Service.GetDownloadUrlAsync(fileName);
            return Ok(new { downloadUrl = url });
        }


    }
}

