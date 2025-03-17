using Microsoft.VisualBasic.FileIO;
using SmartManagement.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.Models
{
    public class TransactionDocument
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime UploadDate { get; set; }
        public string FileUrl { get; set; }
        public FileType FileType { get; set; }
        public string FileName { get; set; }
        public bool IsDeleted { get; set; }
    }
}
