using ConnectCampus.Domain.Common;
namespace ConnectCampus.Domain.Entities;

public class Certificate : Entity
{
    public const int MaxNameLength = 100;
    public Guid UserId { get; private set; }
    public string Name { get; private set; }
    public string ImageUrl { get; private set; }
    public CertificateStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // Navigation property
    public User User { get; private set; } = null!;

    private Certificate()
    {
        // Required by EF Core
    }

    public Certificate(
        Guid userId,
        string name,
        string imageUrl,
        DateTime createdAt) : base(Guid.NewGuid())
    {
        UserId = userId;
        Name = name;
        ImageUrl = imageUrl;
        Status = CertificateStatus.Pending;
        CreatedAt = createdAt;
    }

    public void UpdateStatus(CertificateStatus status, DateTime utcNow)
    {
        Status = status;
        UpdatedAt = utcNow;
    }
}

public enum CertificateStatus
{
    Pending,
    Verified,
    Rejected
} 