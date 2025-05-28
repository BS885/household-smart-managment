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

        public S3Controller(Is3Service s3Service)
        {
            _s3Service = s3Service;
        }

        [HttpGet("upload-url")]
        public async Task<IActionResult> GetUploadUrl([FromQuery] string fileName, [FromQuery] string contentType, [FromQuery] string s3Key)
            {
            try
            {
                // בדיקה אם שם הקובץ או סוג הקובץ לא נמסרו
                if (string.IsNullOrEmpty(fileName) || string.IsNullOrEmpty(contentType))
                {
                    return BadRequest("Missing file name or content type");
                }

                // קבלת ה-Presigned URL להעלאה
                var url = await _s3Service.GeneratePresignedUrlAsync(s3Key, contentType);

                // החזרת ה-URL להעלאה
                return Ok(new { url });
            }
            catch (Exception ex)
            {
                // טיפול בשגיאות כלשהן
                return StatusCode(500, $"Error generating upload URL: {ex.Message}");
            }
        }

        [HttpGet("download-url/{s3Key}")]
        public async Task<IActionResult> GetDownloadUrl(string s3Key)
        {
            try
            {
                // בדיקה אם שם הקובץ לא נמסר
                if (string.IsNullOrEmpty(s3Key))
                {
                    return BadRequest("Missing file name");
                }

                // קבלת ה-Presigned URL להורדה
                var url = await _s3Service.GetDownloadUrlAsync(s3Key);

                // החזרת ה-URL להורדה
                return Ok(new { downloadUrl = url });
            }
            catch (Exception ex)
            {
                // טיפול בשגיאות כלשהן
                return StatusCode(500, $"Error generating download URL: {ex.Message}");
            }
        }

        [HttpGet("extract-text/{fileName}")]
        public async Task<IActionResult> ExtractTextFromFile(string fileName)
        {
            try
            {
                if (string.IsNullOrEmpty(fileName))
                {
                    return BadRequest("Missing file name");
                }

                var extractedText = await _s3Service.ExtractTextFromFileAsync(fileName);

                return Ok(new
                {
                    fileName,
                    extractedText
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error extracting text from file: {ex.Message}");
            }
        }

    }
}


