using System;
using System.Collections.Generic;

namespace CourseProject.Model;

public partial class Hospital
{
    public int HospitalId { get; set; }

    public string ClinicName { get; set; } = null!;

    public string City { get; set; } = null!;

    public string Street { get; set; } = null!;

    public string HouseNumber { get; set; } = null!;

    public string RegistrationNumber { get; set; } = null!;

    public string WorkingHours { get; set; } = null!;

    public string ClinicType { get; set; } = null!;
}
