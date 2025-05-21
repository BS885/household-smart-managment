using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SmartManagement.Core.services;
using Amazon.Textract;
using Amazon.Textract.Model;
using System.Collections.Generic;
using System;
using System.IO;
using System.Threading.Tasks;

namespace SmartManagement.Service.services
{
    public class S3Service : Is3Service
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly ILogger<S3Service> _logger;
        private readonly IAmazonTextract _textractClient;


        public S3Service(IAmazonS3 s3Client, IConfiguration configuration, ILogger<S3Service> logger, IAmazonTextract textractClient)
        {
            _s3Client = s3Client;
            _bucketName = configuration["AWS:BucketName"] ?? throw new InvalidOperationException("Bucket name is missing in configuration.");
            _logger = logger;
            _textractClient = textractClient;
        }

        public async Task<string> GetDownloadUrlAsync(string fileName)
        {
            try
            {
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = fileName,
                    Expires = DateTime.UtcNow.AddMinutes(10)

                };

                string url = await Task.Run(() => _s3Client.GetPreSignedURL(request));
                _logger.LogInformation($"Generated download URL for file: {fileName}");
                return url;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error generating download URL for {fileName}: {ex.Message}");
                throw;
            }
        }

        public async Task DeleteFileAsync(string fileKey)
        {
            try
            {
                var deleteRequest = new DeleteObjectRequest
                {
                    BucketName = _bucketName,
                    Key = fileKey
                };

                await _s3Client.DeleteObjectAsync(deleteRequest);
                _logger.LogInformation($"File deleted from S3: {fileKey} (Bucket: {_bucketName})");
            }
            catch (AmazonS3Exception e)
            {
                _logger.LogError($"AWS S3 error while deleting {fileKey}: {e.Message}");
                throw new Exception("S3 delete failed", e);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unexpected error deleting {fileKey}: {ex.Message}");
                throw;
            }
        }

        public async Task<string> GeneratePresignedUrlAsync(string fileName, string contentType)
        {
            try
            {
               _logger.LogInformation($"Generating presigned URL for file: {fileName} backet Name: {_bucketName}");

                var request = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = fileName,
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.UtcNow.AddMinutes(5),
                    ContentType = contentType
                };

                string url = await  _s3Client.GetPreSignedURLAsync(request);
                _logger.LogInformation($"Generated presigned URL for file: {fileName}");
                return url;
            }
            catch (AmazonS3Exception ex)
            {
                _logger.LogError($"AWS S3 error generating presigned URL for {fileName}: {ex.Message}");
                throw new Exception("S3 presigned URL generation failed", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unexpected error generating presigned URL for {fileName}: {ex.Message}");
                throw;
            }
        }

        public async Task<List<string>> ExtractTextFromFileAsync(string fileName)
        {
            try
            {
                var request = new DetectDocumentTextRequest
                {
                    Document = new Document
                    {
                        S3Object = new Amazon.Textract.Model.S3Object
                        {
                            Bucket = _bucketName,
                            Name = fileName
                        }
                    }
                };

                var response = await _textractClient.DetectDocumentTextAsync(request);

                List<string> lines = new List<string>();

                foreach (var block in response.Blocks)
                {
                    if (block.BlockType == "LINE" && !string.IsNullOrEmpty(block.Text))
                    {
                        lines.Add(block.Text);
                    }
                }

                _logger.LogInformation($"Extracted {lines.Count} lines of text from file: {fileName}");

                return lines;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error extracting text from {fileName}: {ex.Message}");
                throw;
            }
        }

    }
}
