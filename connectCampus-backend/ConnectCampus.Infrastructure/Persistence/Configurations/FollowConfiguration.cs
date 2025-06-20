using ConnectCampus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ConnectCampus.Infrastructure.Persistence.Configurations
{
    public class FollowConfiguration : IEntityTypeConfiguration<Follow>
    {
        public void Configure(EntityTypeBuilder<Follow> builder)
        {
            // Primary key
            builder.HasKey(f => f.Id);
            
            // Auto-increment ID
            builder.Property(f => f.Id)
                .ValueGeneratedOnAdd();

            // Configure properties
            builder.Property(f => f.CreatedAt)
                .IsRequired();

            // Configure relationship with Student
            builder.HasOne(f => f.Student)
                .WithMany()
                .HasForeignKey(f => f.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure relationship with Association
            builder.HasOne(f => f.Association)
                .WithMany(a => a.FollowersCollection)
                .HasForeignKey(f => f.AssociationId)
                .OnDelete(DeleteBehavior.Cascade);

            // Create unique index to prevent duplicate follows
            builder.HasIndex(f => new { f.StudentId, f.AssociationId }).IsUnique();
            
            // Index for faster lookups
            builder.HasIndex(f => f.AssociationId);
            builder.HasIndex(f => f.StudentId);
        }
    }
} 