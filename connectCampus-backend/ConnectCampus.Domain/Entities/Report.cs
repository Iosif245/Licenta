using System;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Domain.Entities
{
    public class Report : Entity
    {
        public Guid UserId { get; private set; }
        public string Reason { get; private set; }
        public string Description { get; private set; }
        public ReportStatus Status { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? UpdatedAt { get; private set; }
        public Guid? TargetId { get; private set; } // Generic ID for the target entity (event, announcement, etc.)
        public string TargetType { get; private set; } // Type of entity being reported (e.g., "Event", "Announcement")
        
        // Navigation properties
        public virtual User User { get; private set; } = null!;
        
        private Report() : base(Guid.NewGuid())
        {
        }
        
        public Report(
            Guid id,
            Guid userId,
            string reason,
            string description,
            Guid? targetId,
            string targetType) : base(id)
        {
            UserId = userId;
            Reason = reason;
            Description = description;
            Status = ReportStatus.Pending;
            CreatedAt = DateTime.UtcNow;
            TargetId = targetId;
            TargetType = targetType;
        }
        
        public void UpdateStatus(ReportStatus status)
        {
            Status = status;
            UpdatedAt = DateTime.UtcNow;
        }
        
        public void Update(string reason, string description)
        {
            Reason = reason;
            Description = description;
            UpdatedAt = DateTime.UtcNow;
        }
        
        public void Approve()
        {
            Status = ReportStatus.Approved;
            UpdatedAt = DateTime.UtcNow;
        }
        
        public void Reject()
        {
            Status = ReportStatus.Rejected;
            UpdatedAt = DateTime.UtcNow;
        }
    }
} 