using System;
using ConnectCampus.Domain.Common;

namespace ConnectCampus.Domain.Entities
{
    public class StudentFavoriteEvent : Entity
    {
        public Guid StudentId { get; private set; }
        public Guid EventId { get; private set; }
        public DateTime CreatedAt { get; private set; }

        // Navigation properties
        public virtual Student Student { get; private set; } = null!;
        public virtual Event Event { get; private set; } = null!;

        private StudentFavoriteEvent() { } // For EF Core

        public StudentFavoriteEvent(
            Guid studentId,
            Guid eventId) : base(Guid.NewGuid())
        {
            StudentId = studentId;
            EventId = eventId;
            CreatedAt = DateTime.UtcNow;
        }
    }
} 