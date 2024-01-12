using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace CourseProject.Model;

public partial class QueuedbContext : DbContext
{
    public QueuedbContext()
    {
    }

    public QueuedbContext(DbContextOptions<QueuedbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Hospital> Hospitals { get; set; }

    public virtual DbSet<Patient> Patients { get; set; }

    public virtual DbSet<Schedule> Schedules { get; set; }

    public virtual DbSet<Talon> Talons { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=localhost;Initial Catalog=QUEUEDB;Integrated Security=True;Encrypt=False;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Hospital>(entity =>
        {
            entity.HasKey(e => e.HospitalId).HasName("PK__Hospital__38C2E58FB7C82324");

            entity.Property(e => e.HospitalId).HasColumnName("HospitalID");
            entity.Property(e => e.City).HasMaxLength(50);
            entity.Property(e => e.ClinicName).HasMaxLength(100);
            entity.Property(e => e.ClinicType).HasMaxLength(20);
            entity.Property(e => e.HouseNumber).HasMaxLength(10);
            entity.Property(e => e.RegistrationNumber).HasMaxLength(20);
            entity.Property(e => e.Street).HasMaxLength(50);
            entity.Property(e => e.WorkingHours).HasMaxLength(100);
        });

        modelBuilder.Entity<Patient>(entity =>
        {
            entity.HasKey(e => e.PatientId).HasName("PK__Patients__970EC346ABD2F3F0");

            entity.Property(e => e.PatientId).HasColumnName("PatientID");
            entity.Property(e => e.BirthDate).HasColumnType("date");
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.Gender).HasMaxLength(10);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.MiddleName).HasMaxLength(50);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Patients)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Patients__UserID__5070F446");
        });

        modelBuilder.Entity<Schedule>(entity =>
        {
            entity.HasKey(e => e.ScheduleId).HasName("PK__Schedule__9C8A5B69CFB92730");

            entity.Property(e => e.ScheduleId).HasColumnName("ScheduleID");
            entity.Property(e => e.DayOfWeek).HasMaxLength(20);
            entity.Property(e => e.DoctorId).HasColumnName("DoctorID");

            entity.HasOne(d => d.Doctor).WithMany(p => p.Schedules)
                .HasForeignKey(d => d.DoctorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Schedules__Docto__5535A963");
        });

        modelBuilder.Entity<Talon>(entity =>
        {
            entity.HasKey(e => e.TalonId).HasName("PK__Talon__E54CEA3FBF52AD11");

            entity.ToTable("Talon");

            entity.Property(e => e.TalonId).HasColumnName("TalonID");
            entity.Property(e => e.OrderDate).HasColumnType("date");
            entity.Property(e => e.PatientId).HasColumnName("PatientID");
            entity.Property(e => e.ScheduleDayId).HasColumnName("ScheduleDayID");

            entity.HasOne(d => d.Patient).WithMany(p => p.Talons)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Talon__PatientID__60A75C0F");

            entity.HasOne(d => d.ScheduleDay).WithMany(p => p.Talons)
                .HasForeignKey(d => d.ScheduleDayId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Talon__ScheduleD__619B8048");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCACAECD75F8");

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.HospitalId).HasColumnName("HospitalID");
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.MiddleName).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(256);
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .HasDefaultValueSql("('User')");
            entity.Property(e => e.Specialization).HasMaxLength(100);

            entity.HasOne(d => d.Hospital).WithMany(p => p.Users)
                .HasForeignKey(d => d.HospitalId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_Users_Hospitals");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
