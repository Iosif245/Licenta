using ConnectCampus.Domain.Common;

namespace ConnectCampus.Domain.Entities
{
    public class TwoFactorCode : Entity
    {
        public Guid UserId { get; private set; }
        public string Code { get; private set; }
        public DateTime ExpiresAt { get; private set; }
        public bool IsUsed { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? UsedAt { get; private set; }
        
        // Navigation property
        public User User { get; private set; } = null!;
        
        private TwoFactorCode() { } // For EF Core
        
        public TwoFactorCode(Guid userId, string code, DateTime expiresAt) : base(Guid.NewGuid())
        {
            UserId = userId;
            Code = code;
            ExpiresAt = expiresAt;
            IsUsed = false;
            CreatedAt = DateTime.UtcNow;
        }
        
        public bool IsValid()
        {
            return !IsUsed && DateTime.UtcNow <= ExpiresAt;
        }
        
        public void MarkAsUsed()
        {
            IsUsed = true;
            UsedAt = DateTime.UtcNow;
        }
    }
} 