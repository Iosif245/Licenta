using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ConnectCampus.Infrastructure.Persistence.Configurations
{
    public class EventConfiguration : IEntityTypeConfiguration<Event>
    {
        public void Configure(EntityTypeBuilder<Event> builder)
        {
            builder.HasKey(e => e.Id);

            builder.Property(e => e.Id)
                .ValueGeneratedNever();

            builder.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(e => e.Slug)
                .IsRequired()
                .HasMaxLength(120);

            builder.HasIndex(e => e.Slug)
                .IsUnique();

            builder.Property(e => e.Description)
                .IsRequired();

            builder.Property(a => a.CoverImageUrl)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(e => e.StartDate)
                .IsRequired();

            builder.Property(e => e.EndDate)
                .IsRequired();

            builder.Property(e => e.Timezone)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(e => e.Location)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(e => e.Category)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(e => e.Tags)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList())
                .HasMaxLength(500);

            builder.Property(e => e.RegistrationUrl)
                .HasMaxLength(2000);

            builder.Property(e => e.Price)
                .HasPrecision(10, 2);

            builder.Property(e => e.PaymentMethod)
                .HasMaxLength(50);

            builder.Property(e => e.ContactEmail)
                .HasMaxLength(100);

            builder.Property(e => e.AssociationName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(e => e.AssociationLogo)
                .HasMaxLength(2000);

            builder.Property(e => e.Announcements)
                .HasConversion(
                    v => string.Join('|', v),
                    v => v.Split('|', StringSplitOptions.RemoveEmptyEntries).ToList())
                .HasMaxLength(4000);

            // Relationships
            builder.HasOne(e => e.Association)
                .WithMany()
                .HasForeignKey(e => e.AssociationId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
} 