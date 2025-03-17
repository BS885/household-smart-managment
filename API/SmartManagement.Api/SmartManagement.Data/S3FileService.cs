using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SmartManagement.Core.services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Intrinsics.X86;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Data
{
    public class S3FileService : IS3FileService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly IConfiguration _configuration;
        private readonly ILogger _logger;

        public S3FileService(IAmazonS3 s3Client, IConfiguration configuration, ILogger<S3FileService> logger)
        {
            _s3Client = s3Client;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<string> GetPresignedUrlAsync(string fileName, string fileType)
        {
            try
            {
                var bucketName = _configuration["AWS:BucketName"];

                if (string.IsNullOrEmpty(bucketName))
                {
                    _logger.LogError("שם Bucket לא הוגדר בקונפיגורציה.");
                    throw new Exception("שם Bucket לא הוגדר בקונפיגורציה.");
                }

                var request = new GetPreSignedUrlRequest
                {
                    BucketName = bucketName,
                    Key = fileName,
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.UtcNow.AddMinutes(5),
                    ContentType = fileType
                };

                string url = await _s3Client.GetPreSignedURLAsync(request);
                if (string.IsNullOrEmpty(url)) {
                    _logger.LogInformation("url created to file");
                }
                return url;
            }
            catch (AmazonS3Exception ex)
            {
                _logger.LogError($"שגיאת S3: {ex.Message}");
                throw new Exception($"שגיאת S3: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError($"שגיאה ביצירת Presigned URL: {ex.Message}");
                throw new Exception($"שגיאה ביצירת Presigned URL: {ex.Message}", ex);
            }
        }
    }
}
