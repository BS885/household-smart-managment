﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartManagement.Core.services
{
    public interface IAiService
    {
         Task<string> GetCategoryFromDescription(string description, string type);

    }
}
