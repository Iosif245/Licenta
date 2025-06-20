using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ConnectCampus.Infrastructure.Persistence.Configurations
{
    public class PasswordResetTokenConfiguration : IEntityTypeConfiguration<PasswordResetToken>
    {
        public void Configure(EntityTypeBuilder<PasswordResetToken> builder)
        {
            builder.HasKey(prt => prt.Id);

            builder.Property(prt => prt.Token)
                .IsRequired()
                .HasMaxLength(256);

            builder.Property(prt => prt.ExpiresAt)
                .IsRequired();

            builder.Property(prt => prt.IsUsed)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(prt => prt.CreatedAt)
                .IsRequired();

            // Relationships
            builder.HasOne(prt => prt.User)
                .WithMany()
                .HasForeignKey(prt => prt.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            builder.HasIndex(prt => prt.Token)
                .IsUnique();

            builder.HasIndex(prt => new { prt.UserId, prt.IsUsed });
        }
    }
} 