namespace ConnectCampus.Infrastructure.Configuration.Settings;

public class RefreshTokenSettings
{
    public const string SectionName = "RefreshToken";
    public int ExpiryInDays { get; set; }
    public int Length { get; set; }
}