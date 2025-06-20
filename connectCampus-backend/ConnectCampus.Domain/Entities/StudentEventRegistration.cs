using System;
using ConnectCampus.Domain.Common;

namespace ConnectCampus.Domain.Entities
{
    public class StudentEventRegistration : Entity
    {
        public Guid StudentId { get; private set; }
        public Guid EventId { get; private set; }
        public DateTime RegisteredAt { get; private set; }
        public bool IsAttended { get; private set; }

        // Navigation properties
        public virtual Student Student { get; private set; } = null!;
        public virtual Event Event { get; private set; } = null!;

        private StudentEventRegistration() { } // For EF Core

        public StudentEventRegistration(
            Guid studentId,
            Guid eventId) : base(Guid.NewGuid())
        {
            StudentId = studentId;
            EventId = eventId;
            RegisteredAt = DateTime.UtcNow;
            IsAttended = false;
        }

        public void MarkAsAttended()
        {
            IsAttended = true;
        }
    }
} 