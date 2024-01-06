using System;
using System.Collections.Generic;

namespace CourseProject.Model;

public partial class Clinic
{
    public int ClinicId { get; set; }

    public string ClinicName { get; set; }

    public string AddressCity { get; set; }

    public string AddressStreet { get; set; }

    public string AddressHouse { get; set; }

    public string RegistrationNumber { get; set; }

    public string Schedule { get; set; }

    public string Type { get; set; }

    public int? ChiefDoctorId { get; set; }
}
