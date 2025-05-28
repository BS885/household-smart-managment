using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.services
{
    public interface Is3Service
    {
        Task<string> GetDownloadUrlAsync(string s3Key);

        Task DeleteFileAsync(string fileKey);

        Task<string> GeneratePresignedUrlAsync(string fileName, string contentType);

        Task<List<string>> ExtractTextFromFileAsync(string fileName);


    }
}