namespace ConnectCampus.Infrastructure.Configuration.Settings;

public class S3Settings
{
    public const string SettingsKey = "S3";

    public string BucketName { get; set; } = string.Empty;
    
    public string BucketLink { get; set; } = string.Empty;
}
