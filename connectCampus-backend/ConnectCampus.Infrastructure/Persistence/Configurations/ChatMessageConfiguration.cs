using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Infrastructure.Persistence.Configurations;

public class ChatMessageConfiguration : IEntityTypeConfiguration<ChatMessage>
{
    public void Configure(EntityTypeBuilder<ChatMessage> builder)
    {
        builder.ToTable("ChatMessages");
        
        builder.HasKey(cm => cm.Id);
        
        builder.Property(cm => cm.ChatGroupId)
            .IsRequired();
            
        builder.Property(cm => cm.SenderId)
            .IsRequired();
            
        builder.Property(cm => cm.Content)
            .IsRequired()
            .HasMaxLength(2000);
            
        builder.Property(cm => cm.SentAt)
            .IsRequired();
            
        builder.Property(cm => cm.IsRead)
            .IsRequired()
            .HasDefaultValue(false);
        
        // Create indexes for better performance
        builder.HasIndex(cm => cm.ChatGroupId);
        builder.HasIndex(cm => cm.SenderId);
        builder.HasIndex(cm => cm.SentAt);
        builder.HasIndex(cm => new { cm.ChatGroupId, cm.IsRead });
    }
} 