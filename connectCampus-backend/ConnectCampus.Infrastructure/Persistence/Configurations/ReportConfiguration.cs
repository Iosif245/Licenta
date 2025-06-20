using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ConnectCampus.Infrastructure.Persistence.Configurations
{
    public class ReportConfiguration : IEntityTypeConfiguration<Report>
    {
        public void Configure(EntityTypeBuilder<Report> builder)
        {
            builder.HasKey(r => r.Id);
            
            builder.Property(r => r.Reason)
                .IsRequired()
                .HasMaxLength(200);
                
            builder.Property(r => r.Description)
                .IsRequired()
                .HasMaxLength(1000);
                
            builder.Property(r => r.Status)
                .IsRequired();
                
            builder.Property(r => r.CreatedAt)
                .IsRequired();
                
            builder.Property(r => r.TargetType)
                .IsRequired()
                .HasMaxLength(50);
                
            // Relationships
            builder.HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
} 