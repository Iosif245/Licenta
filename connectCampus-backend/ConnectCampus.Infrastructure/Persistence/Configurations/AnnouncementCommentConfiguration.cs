using ConnectCampus.Domain.Entities;
using ConnectCampus.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ConnectCampus.Infrastructure.Persistence.Configurations
{
    public class AnnouncementCommentConfiguration : IEntityTypeConfiguration<AnnouncementComment>
    {
        public void Configure(EntityTypeBuilder<AnnouncementComment> builder)
        {
            builder.HasKey(ac => ac.Id);

            builder.Property(ac => ac.Content)
                .IsRequired()
                .HasMaxLength(1000);

            builder.Property(ac => ac.AuthorType)
                .HasConversion(
                    at => at.Name,
                    name => AuthorType.FromName<AuthorType>(name)!)
                .IsRequired();

            builder.Property(ac => ac.CreatedAt)
                .IsRequired();

            builder.Property(ac => ac.UpdatedAt)
                .IsRequired();

            // Announcement relationship (this is fine)
            builder.HasOne(ac => ac.Announcement)
                .WithMany(a => a.Comments)
                .HasForeignKey(ac => ac.AnnouncementId)
                .OnDelete(DeleteBehavior.Cascade);

            // Self-referencing relationship for replies (this is fine)
            builder.HasOne(ac => ac.ParentComment)
                .WithMany(ac => ac.Replies)
                .HasForeignKey(ac => ac.ParentCommentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Remove polymorphic navigation properties to avoid FK conflicts
            // The AuthorId will reference either Students.Id or Associations.Id based on AuthorType
            // Application logic ensures referential integrity
            builder.Ignore(ac => ac.Student);
            builder.Ignore(ac => ac.Association);

            // Indexes for performance
            builder.HasIndex(ac => ac.AnnouncementId);
            builder.HasIndex(ac => ac.AuthorId);
            builder.HasIndex(ac => ac.ParentCommentId);
        }
    }
} 