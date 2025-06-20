using System;
using System.Collections.Generic;
using ConnectCampus.Domain.Common;

namespace ConnectCampus.Domain.Entities
{
    public class Announcement : Entity
    {
        public Guid AssociationId { get; private set; }
        public Guid? EventId { get; private set; }
        public string Title { get; private set; }
        public string Content { get; private set; }
        public string? ImageUrl { get; private set; }
        public DateTime PublishedDate { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }

        // Navigation properties
        public virtual Association Association { get; private set; } = null!;
        public virtual Event? Event { get; private set; }
        public virtual ICollection<AnnouncementLike> Likes { get; private set; } = new List<AnnouncementLike>();
        public virtual ICollection<AnnouncementComment> Comments { get; private set; } = new List<AnnouncementComment>();

        // For EF Core
        private Announcement() : base(Guid.NewGuid())
        {
        }

        public Announcement(
            Guid id,
            Guid associationId,
            string title,
            string content,
            string? imageUrl = null,
            Guid? eventId = null) : base(id)
        {
            AssociationId = associationId;
            EventId = eventId;
            Title = title;
            Content = content;
            ImageUrl = imageUrl;
            PublishedDate = DateTime.UtcNow;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Update(
            string title,
            string content,
            string? imageUrl)
        {
            Title = title;
            Content = content;
            ImageUrl = imageUrl;
            UpdatedAt = DateTime.UtcNow;
        }
    }
} 