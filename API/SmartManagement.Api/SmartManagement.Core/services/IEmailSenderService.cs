﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.services
{
    public interface IEmailSenderService
    {
        Task SendEmailAsync(string toEmail, string subject, string bodyHtml);
    }
}
