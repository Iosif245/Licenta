using System;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Domain.Entities
{
    public class AnnouncementLike : Entity
    {
        public Guid AnnouncementId { get; private set; }
        public Guid AuthorId { get; private set; }
        public AuthorType AuthorType { get; private set; }
        public DateTime CreatedAt { get; private set; }

        // Navigation properties
        public virtual Announcement Announcement { get; private set; } = null!;
        public virtual Student? Student { get; private set; }
        public virtual Association? Association { get; private set; }

        private AnnouncementLike() { } // For EF Core

        public AnnouncementLike(
            Guid announcementId,
            Guid authorId,
            AuthorType authorType) : base(Guid.NewGuid())
        {
            AnnouncementId = announcementId;
            AuthorId = authorId;
            AuthorType = authorType;
            CreatedAt = DateTime.UtcNow;
        }
    }
} 