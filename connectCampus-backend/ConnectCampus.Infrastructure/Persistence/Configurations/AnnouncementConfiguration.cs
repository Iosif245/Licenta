using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ConnectCampus.Infrastructure.Persistence.Configurations
{
    public class AnnouncementConfiguration : IEntityTypeConfiguration<Announcement>
    {
        public void Configure(EntityTypeBuilder<Announcement> builder)
        {
            builder.HasKey(a => a.Id);
            
            builder.Property(a => a.Title)
                .IsRequired()
                .HasMaxLength(200);
            
            builder.Property(a => a.Content)
                .IsRequired();
            
            builder.Property(a => a.ImageUrl)
                .HasMaxLength(500);
            
            builder.Property(a => a.PublishedDate)
                .IsRequired();
            
            builder.Property(a => a.CreatedAt)
                .IsRequired();
            
            builder.Property(a => a.UpdatedAt)
                .IsRequired();
            
            // Relationships
            builder.HasOne(a => a.Association)
                .WithMany()
                .HasForeignKey(a => a.AssociationId)
                .OnDelete(DeleteBehavior.Cascade);
            
            builder.HasOne(a => a.Event)
                .WithMany()
                .HasForeignKey(a => a.EventId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
} 