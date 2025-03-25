using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.services
{
    
    public interface IS3FileService
    {
         Task<string> GetPresignedUrlAsync(string fileName, string fileType);
    }
}
