using System;
using ConnectCampus.Domain.Entities;
using ConnectCampus.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Text.Json;

namespace ConnectCampus.Infrastructure.Persistence.Configurations
{
    public class StudentConfiguration : IEntityTypeConfiguration<Student>
    {
        public void Configure(EntityTypeBuilder<Student> builder)
        {
            builder.HasKey(s => s.Id);

            builder.Property(s => s.Email)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(s => s.FirstName)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(s => s.LastName)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(s => s.Bio)
                .HasMaxLength(500);

            builder.Property(s => s.AvatarUrl)
                .HasMaxLength(255);

            builder.Property(s => s.University)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(s => s.Faculty)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(s => s.Specialization)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(s => s.EducationLevel)
                .HasConversion(
                    el => el.Name,
                    name => EducationLevel.FromName<EducationLevel>(name)!)
                .IsRequired();

            builder.Property(s => s.LinkedInUrl)
                .HasMaxLength(255);

            builder.Property(s => s.GitHubUrl)
                .HasMaxLength(255);

            builder.Property(s => s.FacebookUrl)
                .HasMaxLength(255);

            // Store interests as JSON
            builder.Property(s => s.Interests)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>());

            // Navigation properties
            builder.HasMany(s => s.FavoriteEvents)
                .WithOne(fe => fe.Student)
                .HasForeignKey(fe => fe.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(s => s.EventRegistrations)
                .WithOne(er => er.Student)
                .HasForeignKey(er => er.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            // Create index on frequently queried fields
            builder.HasIndex(s => s.Email).IsUnique();
            builder.HasIndex(s => s.UserId).IsUnique();
        }
    }
} 