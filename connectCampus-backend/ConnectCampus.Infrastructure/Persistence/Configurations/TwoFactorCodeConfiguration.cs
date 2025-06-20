using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ConnectCampus.Infrastructure.Persistence.Configurations
{
    public class TwoFactorCodeConfiguration : IEntityTypeConfiguration<TwoFactorCode>
    {
        public void Configure(EntityTypeBuilder<TwoFactorCode> builder)
        {
            builder.HasKey(t => t.Id);

            builder.Property(t => t.Code)
                .IsRequired()
                .HasMaxLength(6);

            builder.Property(t => t.ExpiresAt)
                .IsRequired();

            builder.Property(t => t.IsUsed)
                .IsRequired();

            builder.Property(t => t.CreatedAt)
                .IsRequired();

            builder.Property(t => t.UsedAt);

            // Relationship with User
            builder.HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Index for quick code lookup
            builder.HasIndex(t => t.Code)
                .IsUnique();

            // Index for user-based queries
            builder.HasIndex(t => t.UserId);

            // Index for cleanup of expired codes
            builder.HasIndex(t => t.ExpiresAt);
        }
    }
} 