using System;
using System.Collections.Generic;

namespace CourseProject.Model;

public partial class Patient
{
    public int PatientId { get; set; }

    public int UserId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string MiddleName { get; set; } = null!;

    public DateTime BirthDate { get; set; }

    public string Gender { get; set; } = null!;

    public virtual ICollection<Talon> Talons { get; set; } = new List<Talon>();

    public virtual User User { get; set; } = null!;
}
