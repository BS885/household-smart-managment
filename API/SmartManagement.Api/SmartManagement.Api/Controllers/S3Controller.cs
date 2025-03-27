using Microsoft.AspNetCore.Mvc;
using SmartManagement.Core.services;
using System;
using System.Threading.Tasks;

namespace SmartManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class S3Controller : ControllerBase
    {
        private readonly Is3Service _s3Service;

        // קונסטרקטור - Dependency Injection של השירות
        public S3Controller(Is3Service s3Service)
        {
            _s3Service = s3Service;
        }

        // שלב 1: קבלת URL להעלאת קובץ ל-S3
        [HttpGet("upload-url")]
        public async Task<IActionResult> GetUploadUrl([FromQuery] string fileName, [FromQuery] string contentType)
            {
            try
            {
                // בדיקה אם שם הקובץ או סוג הקובץ לא נמסרו
                if (string.IsNullOrEmpty(fileName) || string.IsNullOrEmpty(contentType))
                {
                    return BadRequest("Missing file name or content type");
                }

                // קבלת ה-Presigned URL להעלאה
                var url = await _s3Service.GeneratePresignedUrlAsync(fileName, contentType);

                // החזרת ה-URL להעלאה
                return Ok(new { url });
            }
            catch (Exception ex)
            {
                // טיפול בשגיאות כלשהן
                return StatusCode(500, $"Error generating upload URL: {ex.Message}");
            }
        }

        // שלב 2: קבלת URL להורדת קובץ מה-S3
        [HttpGet("download-url/{fileName}")]
        public async Task<IActionResult> GetDownloadUrl(string fileName)
        {
            try
            {
                // בדיקה אם שם הקובץ לא נמסר
                if (string.IsNullOrEmpty(fileName))
                {
                    return BadRequest("Missing file name");
                }

                // קבלת ה-Presigned URL להורדה
                var url = await _s3Service.GetDownloadUrlAsync(fileName);

                // החזרת ה-URL להורדה
                return Ok(new { downloadUrl = url });
            }
            catch (Exception ex)
            {
                // טיפול בשגיאות כלשהן
                return StatusCode(500, $"Error generating download URL: {ex.Message}");
            }
        }
    }
}


