using System;
using System.Collections.Generic;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Domain.Entities
{
    public class AnnouncementComment : Entity
    {
        public Guid AnnouncementId { get; private set; }
        public Guid AuthorId { get; private set; }
        public AuthorType AuthorType { get; private set; }
        public string Content { get; private set; } = null!;
        public Guid? ParentCommentId { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }

        // Navigation properties
        public virtual Announcement Announcement { get; private set; } = null!;
        public virtual Student? Student { get; private set; }
        public virtual Association? Association { get; private set; }
        public virtual AnnouncementComment? ParentComment { get; private set; }
        public virtual ICollection<AnnouncementComment> Replies { get; private set; } = new List<AnnouncementComment>();

        private AnnouncementComment() { } // For EF Core

        public AnnouncementComment(
            Guid announcementId,
            Guid authorId,
            AuthorType authorType,
            string content,
            Guid? parentCommentId = null) : base(Guid.NewGuid())
        {
            AnnouncementId = announcementId;
            AuthorId = authorId;
            AuthorType = authorType;
            Content = content;
            ParentCommentId = parentCommentId;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateContent(string content)
        {
            Content = content;
            UpdatedAt = DateTime.UtcNow;
        }
    }
} 