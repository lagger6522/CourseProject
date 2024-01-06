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

    public virtual DbSet<Clinic> Clinics { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=DESKTOP-IHVPCAN\\POLYCLINICS;Initial Catalog=QUEUEDB;Integrated Security=True;Connect Timeout=30;Encrypt=False;Trust Server Certificate=False;Application Intent=ReadWrite;Multi Subnet Failover=False");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Clinic>(entity =>
        {
            entity.HasKey(e => e.ClinicId).HasName("PK__Clinics__3347C2DDA74BDC05");

            entity.Property(e => e.AddressCity).HasMaxLength(50);
            entity.Property(e => e.AddressHouse).HasMaxLength(10);
            entity.Property(e => e.AddressStreet).HasMaxLength(50);
            entity.Property(e => e.ClinicName).HasMaxLength(100);
            entity.Property(e => e.RegistrationNumber).HasMaxLength(50);
            entity.Property(e => e.Schedule).HasMaxLength(200);
            entity.Property(e => e.Type).HasMaxLength(50);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCAC400CCF1A");

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(100);
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(50);
            entity.Property(e => e.Password)
                .IsRequired()
                .HasMaxLength(256);
            entity.Property(e => e.Patronymic)
                .IsRequired()
                .HasMaxLength(50);
            entity.Property(e => e.Role)
                .IsRequired()
                .HasMaxLength(50)
                .HasDefaultValueSql("('User')");
            entity.Property(e => e.Surname)
                .IsRequired()
                .HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
