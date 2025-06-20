using ConnectCampus.Domain.Common;
namespace ConnectCampus.Domain.Entities;

public class RefreshToken : Entity
{
    public Guid UserId { get; private set; }
    public string Token { get; private set; } = string.Empty;
    public DateTime ExpiresAt { get; private set; }

    public User? User { get; private set; }

    private RefreshToken() { }

    public RefreshToken(
        Guid userId,
        string token,
        DateTime expiresAt) : base(Guid.NewGuid())
    {
        UserId = userId;
        Token = token;
        ExpiresAt = expiresAt;
    }

    public void Update(string token, DateTime expiresAt)
    {
        Token = token;
        ExpiresAt = expiresAt;
    }
}