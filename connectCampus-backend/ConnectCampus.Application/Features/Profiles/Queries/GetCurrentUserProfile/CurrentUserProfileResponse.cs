using System;

namespace ConnectCampus.Application.Features.Profiles.Queries.GetCurrentUserProfile
{
    /// <summary>
    /// Response containing current user profile information based on role
    /// </summary>
    public class CurrentUserProfileResponse
    {
        /// <summary>
        /// User unique identifier
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// User email address
        /// </summary>
        public string Email { get; set; } = null!;

        /// <summary>
        /// User role (Student or Association)
        /// </summary>
        public string Role { get; set; } = null!;

        /// <summary>
        /// Student profile data (null if user is Association)
        /// </summary>
        public StudentProfileData? StudentProfile { get; set; }

        /// <summary>
        /// Association profile data (null if user is Student)
        /// </summary>
        public AssociationProfileData? AssociationProfile { get; set; }
    }

    /// <summary>
    /// Student-specific profile data
    /// </summary>
    public class StudentProfileData
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string? Bio { get; set; }
        public string? AvatarUrl { get; set; }
        public string University { get; set; } = null!;
        public string Faculty { get; set; } = null!;
        public string Specialization { get; set; } = null!;
        public int StudyYear { get; set; }
        public string EducationLevel { get; set; } = null!;
        public string? LinkedInUrl { get; set; }
        public string? GitHubUrl { get; set; }
        public string? FacebookUrl { get; set; }
        public List<string> Interests { get; set; } = new();
        public DateTime JoinedDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    /// <summary>
    /// Association-specific profile data
    /// </summary>
    public class AssociationProfileData
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Logo { get; set; } = null!;
        public string CoverImage { get; set; } = null!;
        public string Category { get; set; } = null!;
        public int FoundedYear { get; set; }
        public bool IsVerified { get; set; }
        public bool IsFeatured { get; set; }
        public int Members { get; set; }
        public int Events { get; set; }
        public int? UpcomingEventsCount { get; set; }
        public double? Rating { get; set; }
        public int? Followers { get; set; }
        public string? Location { get; set; }
        public string? Website { get; set; }
        public List<string> Tags { get; set; } = new();
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Facebook { get; set; }
        public string? Twitter { get; set; }
        public string? Instagram { get; set; }
        public string? LinkedIn { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
} 