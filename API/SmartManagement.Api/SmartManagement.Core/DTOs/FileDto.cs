using SmartManagement.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.DTOs
{
    public class FileDto
    {
        public string NameFile { get; set; }
        public string TypeFile { get; set; }
        public string S3_Key { get; set; }
        public long Size { get; set; }
    }
}
