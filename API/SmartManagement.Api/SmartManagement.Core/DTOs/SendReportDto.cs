using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.DTOs
{

    public class SendReportDto
    {
        public string Email { get; set; }
        public string Filename { get; set; }
        public string Content { get; set; }
    }
}
