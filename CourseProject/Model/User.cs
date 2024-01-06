using System;
using System.Collections.Generic;

namespace CourseProject.Model;

public partial class User
{
    public int UserId { get; set; }

    public string Password { get; set; }

    public string Email { get; set; }

    public string Role { get; set; }

    public virtual ICollection<Patient> Patients { get; set; } = new List<Patient>();
}
