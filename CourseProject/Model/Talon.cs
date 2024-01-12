using System;
using System.Collections.Generic;

namespace CourseProject.Model;

public partial class Talon
{
    public int TalonId { get; set; }

    public int PatientId { get; set; }

    public DateTime OrderDate { get; set; }

    public TimeSpan OrderTime { get; set; }

    public int ScheduleDayId { get; set; }

    public virtual Patient Patient { get; set; } = null!;

    public virtual Schedule ScheduleDay { get; set; } = null!;
}
