using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ConnectCampus.Infrastructure.Persistence.Configurations
{
    public class StudentEventRegistrationConfiguration : IEntityTypeConfiguration<StudentEventRegistration>
    {
        public void Configure(EntityTypeBuilder<StudentEventRegistration> builder)
        {
            builder.HasKey(ser => ser.Id);

            builder.Property(ser => ser.RegisteredAt)
                .IsRequired();

            builder.Property(ser => ser.IsAttended)
                .IsRequired()
                .HasDefaultValue(false);

            // Relationships
            builder.HasOne(ser => ser.Student)
                .WithMany(s => s.EventRegistrations)
                .HasForeignKey(ser => ser.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(ser => ser.Event)
                .WithMany()
                .HasForeignKey(ser => ser.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique constraint to prevent duplicate registrations
            builder.HasIndex(ser => new { ser.StudentId, ser.EventId })
                .IsUnique();
        }
    }
} 