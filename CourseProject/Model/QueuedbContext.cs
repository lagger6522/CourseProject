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

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=localhost;Initial Catalog=QUEUEDB;Integrated Security=True;Encrypt=False;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Hospital>(entity =>
        {
            entity.HasKey(e => e.HospitalId).HasName("PK__Hospital__38C2E58F1DC49978");

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
            entity.HasKey(e => e.PatientId).HasName("PK__Patients__970EC346AEDD704A");

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
                .HasConstraintName("FK__Patients__UserID__5165187F");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCACA5B69208");

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.MiddleName).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(256);
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .HasDefaultValueSql("('User')");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
