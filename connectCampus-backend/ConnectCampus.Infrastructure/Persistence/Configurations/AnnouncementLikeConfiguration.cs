using ConnectCampus.Domain.Entities;
using ConnectCampus.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ConnectCampus.Infrastructure.Persistence.Configurations
{
    public class AnnouncementLikeConfiguration : IEntityTypeConfiguration<AnnouncementLike>
    {
        public void Configure(EntityTypeBuilder<AnnouncementLike> builder)
        {
            builder.HasKey(al => al.Id);

            builder.Property(al => al.AuthorType)
                .HasConversion(
                    at => at.Name,
                    name => AuthorType.FromName<AuthorType>(name)!)
                .IsRequired();

            builder.Property(al => al.CreatedAt)
                .IsRequired();

            // Announcement relationship (this is fine)
            builder.HasOne(al => al.Announcement)
                .WithMany(a => a.Likes)
                .HasForeignKey(al => al.AnnouncementId)
                .OnDelete(DeleteBehavior.Cascade);

            // Remove polymorphic navigation properties to avoid FK conflicts
            // The AuthorId will reference either Students.Id or Associations.Id based on AuthorType
            // Application logic ensures referential integrity
            builder.Ignore(al => al.Student);
            builder.Ignore(al => al.Association);

            // Unique index to prevent duplicate likes
            builder.HasIndex(al => new { al.AnnouncementId, al.AuthorId, al.AuthorType })
                .IsUnique();

            // Index for performance
            builder.HasIndex(al => al.AuthorId);
        }
    }
} 