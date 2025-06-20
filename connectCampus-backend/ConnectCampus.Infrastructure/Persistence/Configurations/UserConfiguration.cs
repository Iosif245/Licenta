using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Entities;
using ConnectCampus.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ConnectCampus.Infrastructure.Persistence.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(u => u.Id);

            builder.HasIndex(u => u.Email)
                .IsUnique();

            builder.Property(u => u.Email)
                .HasMaxLength(320)
                .IsRequired();

            builder.Property(u => u.PasswordHash)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(u => u.CreatedAt)
                .IsRequired();

            builder.Property(u => u.UpdatedAt)
                .IsRequired(false);

            builder.Property(u => u.Role)
                .HasConversion(
                    r => r.Name,
                    n => UserRole.FromName(n)!)
                .IsRequired();
                
            // Two-factor authentication
            builder.Property(u => u.IsTwoFactorEnabled)
                .HasDefaultValue(false)
                .IsRequired();
                
            // Notification preferences
            builder.Property(u => u.EventRemindersEnabled)
                .HasDefaultValue(true)
                .IsRequired();
                
            builder.Property(u => u.MessageNotificationsEnabled)
                .HasDefaultValue(true)
                .IsRequired();
                
            builder.Property(u => u.AssociationUpdatesEnabled)
                .HasDefaultValue(true)
                .IsRequired();
                
            builder.Property(u => u.MarketingEmailsEnabled)
                .HasDefaultValue(false)
                .IsRequired();
                
            // Theme preference - using string conversion
            builder.Property(u => u.PreferredTheme)
                .HasDefaultValue(Theme.System)
                .HasConversion(
                    t => t.Name,
                    n => Theme.FromName(n)!)
                .IsRequired();
        }
    }
} 