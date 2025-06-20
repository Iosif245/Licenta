using System;
using ConnectCampus.Domain.Common;

namespace ConnectCampus.Domain.Entities
{
    public class PasswordResetToken : Entity
    {
        public Guid UserId { get; private set; }
        public string Token { get; private set; } = string.Empty;
        public DateTime ExpiresAt { get; private set; }
        public bool IsUsed { get; private set; }
        public DateTime CreatedAt { get; private set; }

        // Navigation property
        public virtual User User { get; private set; } = null!;

        private PasswordResetToken() { } // For EF Core

        public PasswordResetToken(
            Guid userId,
            string token,
            DateTime expiresAt) : base(Guid.NewGuid())
        {
            UserId = userId;
            Token = token;
            ExpiresAt = expiresAt;
            IsUsed = false;
            CreatedAt = DateTime.UtcNow;
        }

        public bool IsValid()
        {
            return !IsUsed && DateTime.UtcNow < ExpiresAt;
        }

        public void MarkAsUsed()
        {
            IsUsed = true;
        }
    }
} 