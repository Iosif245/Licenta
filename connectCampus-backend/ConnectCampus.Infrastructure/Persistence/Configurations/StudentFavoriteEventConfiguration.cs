using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ConnectCampus.Infrastructure.Persistence.Configurations
{
    public class StudentFavoriteEventConfiguration : IEntityTypeConfiguration<StudentFavoriteEvent>
    {
        public void Configure(EntityTypeBuilder<StudentFavoriteEvent> builder)
        {
            builder.HasKey(sfe => sfe.Id);

            builder.Property(sfe => sfe.CreatedAt)
                .IsRequired();

            // Relationships
            builder.HasOne(sfe => sfe.Student)
                .WithMany(s => s.FavoriteEvents)
                .HasForeignKey(sfe => sfe.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(sfe => sfe.Event)
                .WithMany()
                .HasForeignKey(sfe => sfe.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique constraint to prevent duplicate favorites
            builder.HasIndex(sfe => new { sfe.StudentId, sfe.EventId })
                .IsUnique();
        }
    }
} 