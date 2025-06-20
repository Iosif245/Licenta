namespace ConnectCampus.Domain.Common;

/// <summary>
/// Centralized class for managing storage paths and URLs for different types of resources
/// </summary>
public static class StoragePaths
{
    private const string UrlPath = "https://connect-campus.s3.eu-central-1.amazonaws.com";
    
    private static class Folders
    {
        public const string Avatars = "/avatars";
        public const string Covers = "/covers";
        public const string EventsImages = "/eventsImage";
        public const string AnnouncementsImages = "/announcementsImages";
        public const string Certificates = "/certificates";
    }
    
    public static string Avatar(string? existingKey = null)
    {
        if (string.IsNullOrEmpty(existingKey))
        {
            existingKey = Guid.NewGuid().ToString();
            
            return UrlPath + $"{Folders.Avatars}/{existingKey}";
        }

        return existingKey ;
    }
    
    public static string Cover(string? existingKey = null)
    {
        if (string.IsNullOrEmpty(existingKey))
        {
            existingKey = Guid.NewGuid().ToString();
            
            return UrlPath + $"{Folders.Covers}/{existingKey}";
        }
        
        return existingKey;
    }
    
    public static string EventImage(string? existingKey = null)
    {
        if (string.IsNullOrEmpty(existingKey))
        {
            existingKey = Guid.NewGuid().ToString();
            
            return UrlPath + $"{Folders.EventsImages}/{existingKey}";
        }
        
        return existingKey;
    }
    
    public static string AnnouncementImage(string? existingKey = null)
    {
        if (string.IsNullOrEmpty(existingKey))
        {
            existingKey = Guid.NewGuid().ToString();
            
            return UrlPath + $"{Folders.AnnouncementsImages}/{existingKey}";
        }
        
        return existingKey;
    }
    
    public static string Certificate()
    {
        return UrlPath + $"{Folders.Certificates}/{Guid.NewGuid()}";
    }
} 