using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SmartManagement.Core.services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Service.services
{
    public class S3Service : Is3Service
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly ILogger<S3Service> _logger;
        public S3Service(IAmazonS3 s3Client, IConfiguration configuration, ILogger<S3Service> logger)
        {
            var accessKey = configuration["AWS:AccessKey"];
            var secretKey = configuration["AWS:SecretKey"];
            var region = configuration["AWS:Region"];

            var credentials = new Amazon.Runtime.BasicAWSCredentials(accessKey, secretKey);
            var config = new AmazonS3Config { RegionEndpoint = Amazon.RegionEndpoint.GetBySystemName(region) };

            _s3Client = new AmazonS3Client(credentials, config);
            _bucketName = configuration["AWS:BucketName"];
            _logger = logger;
        }

        public async Task<string> GetDownloadUrlAsync(string fileName)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                Expires = DateTime.UtcNow.AddMinutes(10)
            };
            _logger.LogInformation("get Download Url");
            return _s3Client.GetPreSignedURL(request);
        }

        public async Task<string> UploadFileAsync(IFormFile file, string fileName)
        {
            try
            {
                using (var newMemoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(newMemoryStream);
                    newMemoryStream.Position = 0;

                    var uploadRequest = new PutObjectRequest
                    {
                        BucketName = _bucketName,
                        Key = fileName,
                        InputStream = newMemoryStream,
                        ContentType = file.ContentType
                    };

                    await _s3Client.PutObjectAsync(uploadRequest);
                    _logger.LogInformation($"Uploading file: {fileName}");
                    return $"https://{_bucketName}.s3.amazonaws.com/{fileName}";
                }
            }
            catch (AmazonS3Exception e)
            {
                _logger.LogError($"Error uploading to S3: {e.Message}");
                throw ;
            }
        }

        public async Task DeleteFileAsync(string fileKey)
        {
            var deleteRequest = new DeleteObjectRequest
            {
                BucketName = _bucketName,
                Key = fileKey
            };
            _logger.LogInformation($"Delete {deleteRequest.BucketName}");
            await _s3Client.DeleteObjectAsync(deleteRequest);
        }

        public async Task<string> GeneratePresignedUrlAsync(string fileName, string contentType)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(10),
                ContentType = contentType
            };
            return _s3Client.GetPreSignedURL(request);
        }
    }
}
