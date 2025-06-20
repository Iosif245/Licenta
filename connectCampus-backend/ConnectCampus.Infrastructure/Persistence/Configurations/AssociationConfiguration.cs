using System.Text.Json;
using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ConnectCampus.Infrastructure.Persistence.Configurations
{
    public class AssociationConfiguration : IEntityTypeConfiguration<Association>
    {
        public void Configure(EntityTypeBuilder<Association> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(a => a.Slug)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(a => a.Description)
                .IsRequired()
                .HasMaxLength(5000);

            builder.Property(a => a.Logo)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(a => a.CoverImage)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(a => a.Category)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(a => a.Location)
                .HasMaxLength(255);

            builder.Property(a => a.Website)
                .HasMaxLength(255);

            builder.Property(a => a.Email)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(a => a.Phone)
                .HasMaxLength(50);

            builder.Property(a => a.Address)
                .HasMaxLength(500);

            builder.Property(a => a.Facebook)
                .HasMaxLength(255);

            builder.Property(a => a.Twitter)
                .HasMaxLength(255);

            builder.Property(a => a.Instagram)
                .HasMaxLength(255);

            builder.Property(a => a.LinkedIn)
                .HasMaxLength(255);

            // Store tags as JSON with value comparer
            builder.Property(a => a.Tags)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null) ?? new List<string>())
                .HasColumnType("text")
                .Metadata.SetValueComparer(new ValueComparer<List<string>>(
                    (c1, c2) => c1!.SequenceEqual(c2!),
                    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => c.ToList()));

            builder.Property(a => a.CreatedAt)
                .IsRequired();

            builder.Property(a => a.UpdatedAt)
                .IsRequired();

            // Navigation properties
            builder.HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(a => a.AssociationEvents)
                .WithOne(e => e.Association)
                .HasForeignKey(e => e.AssociationId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(a => a.Announcements)
                .WithOne(an => an.Association)
                .HasForeignKey(an => an.AssociationId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(a => a.FollowersCollection)
                .WithOne(f => f.Association)
                .HasForeignKey(f => f.AssociationId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            builder.HasIndex(a => a.Slug)
                .IsUnique();

            builder.HasIndex(a => a.Email)
                .IsUnique();

            builder.HasIndex(a => a.UserId)
                .IsUnique();
        }
    }
} 