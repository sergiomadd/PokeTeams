﻿using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBModels
{
    public class stat_names
    {
        [Key]
        public int stat_id { get; set; }
        public int local_language_id { get; set; }
        public string name { get; set; }
    }
}
