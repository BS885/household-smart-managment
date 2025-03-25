using Microsoft.VisualBasic.FileIO;
using SmartManagement.Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.Models
{
    public class TransactionDocument
    {
        [Key]
        public int Id { get; set; }
        public string FileName { get; set; }
        public FileType FileType { get; set; }
        public long Size { get; set; }
        public string S3Key { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsDeleted { get; set; } = false;
        public string Description { get; set; }
    }
}
