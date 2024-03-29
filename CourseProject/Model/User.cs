﻿using System;
using System.Collections.Generic;

namespace CourseProject.Model;

public partial class User
{
    public int UserId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string MiddleName { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Role { get; set; } = null!;

    public string? Specialization { get; set; }

    public int? HospitalId { get; set; }

    public virtual Hospital? Hospital { get; set; }

    public virtual ICollection<Patient> Patients { get; set; } = new List<Patient>();

    public virtual ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
}
