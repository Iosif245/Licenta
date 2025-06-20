using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Infrastructure.Persistence.Configurations;

public class ChatGroupConfiguration : IEntityTypeConfiguration<ChatGroup>
{
    public void Configure(EntityTypeBuilder<ChatGroup> builder)
    {
        builder.ToTable("ChatGroups");
        
        builder.HasKey(cg => cg.Id);
        
        builder.Property(cg => cg.StudentId)
            .IsRequired();
            
        builder.Property(cg => cg.AssociationId)
            .IsRequired();
            
        builder.Property(cg => cg.EventId)
            .IsRequired(false);
            
        builder.Property(cg => cg.CreatedAt)
            .IsRequired();
            
        builder.Property(cg => cg.LastMessageAt)
            .IsRequired(false);
        
        // Configure the relationship with ChatMessage
        builder.HasMany(cg => cg.Messages)
            .WithOne()
            .HasForeignKey(cm => cm.ChatGroupId)
            .OnDelete(DeleteBehavior.Cascade);
            
        // Configure navigation properties
        builder.HasOne(cg => cg.Student)
            .WithMany()
            .HasForeignKey(cg => cg.StudentId)
            .OnDelete(DeleteBehavior.Restrict);
            
        builder.HasOne(cg => cg.Association)
            .WithMany()
            .HasForeignKey(cg => cg.AssociationId)
            .OnDelete(DeleteBehavior.Restrict);
            
        // Create indexes for better performance
        builder.HasIndex(cg => cg.StudentId);
        builder.HasIndex(cg => cg.AssociationId);
        builder.HasIndex(cg => new { cg.StudentId, cg.AssociationId })
            .IsUnique();
    }
} 