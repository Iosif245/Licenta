using System;
using System.Collections.Generic;

namespace ConnectCampus.Api.Models.Students
{
    /// <summary>
    /// Response containing student information
    /// </summary>
    public class StudentResponse
    {
        /// <summary>
        /// Student unique identifier
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Associated user ID
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// Student email address
        /// </summary>
        public string Email { get; set; } = null!;

        /// <summary>
        /// Date when student joined
        /// </summary>
        public DateTime JoinedDate { get; set; }

        /// <summary>
        /// First name
        /// </summary>
        public string FirstName { get; set; } = null!;

        /// <summary>
        /// Last name
        /// </summary>
        public string LastName { get; set; } = null!;

        /// <summary>
        /// Optional biography
        /// </summary>
        public string? Bio { get; set; }

        /// <summary>
        /// URL of the student's avatar image
        /// </summary>
        public string? AvatarUrl { get; set; }

        /// <summary>
        /// University name
        /// </summary>
        public string University { get; set; } = null!;

        /// <summary>
        /// Faculty name
        /// </summary>
        public string Faculty { get; set; } = null!;

        /// <summary>
        /// Specialization
        /// </summary>
        public string Specialization { get; set; } = null!;

        /// <summary>
        /// Current study year
        /// </summary>
        public int StudyYear { get; set; }

        /// <summary>
        /// Education level (Bachelor, Master, PhD)
        /// </summary>
        public string EducationLevel { get; set; } = null!;

        /// <summary>
        /// Optional LinkedIn profile URL
        /// </summary>
        public string? LinkedInUrl { get; set; }

        /// <summary>
        /// Optional GitHub profile URL
        /// </summary>
        public string? GitHubUrl { get; set; }

        /// <summary>
        /// Optional Facebook profile URL
        /// </summary>
        public string? FacebookUrl { get; set; }

        /// <summary>
        /// List of student interests
        /// </summary>
        public List<string> Interests { get; set; } = new List<string>();

        /// <summary>
        /// List of favorite event IDs
        /// </summary>
        public List<Guid> FavoriteEventIds { get; set; } = new List<Guid>();

        /// <summary>
        /// List of registered event IDs
        /// </summary>
        public List<Guid> RegisteredEventIds { get; set; } = new List<Guid>();

        /// <summary>
        /// Creation timestamp
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Last update timestamp
        /// </summary>
        public DateTime UpdatedAt { get; set; }

        /// <summary>
        /// Constructor for mapping from domain entity
        /// </summary>
        public StudentResponse(
            Guid id,
            Guid userId,
            string email,
            DateTime joinedDate,
            string firstName,
            string lastName,
            string? bio,
            string? avatarUrl,
            string university,
            string faculty,
            string specialization,
            int studyYear,
            string educationLevel,
            string? linkedInUrl,
            string? gitHubUrl,
            string? facebookUrl,
            List<string> interests,
            List<Guid> favoriteEventIds,
            List<Guid> registeredEventIds,
            DateTime createdAt,
            DateTime updatedAt)
        {
            Id = id;
            UserId = userId;
            Email = email;
            JoinedDate = joinedDate;
            FirstName = firstName;
            LastName = lastName;
            Bio = bio;
            AvatarUrl = avatarUrl;
            University = university;
            Faculty = faculty;
            Specialization = specialization;
            StudyYear = studyYear;
            EducationLevel = educationLevel;
            LinkedInUrl = linkedInUrl;
            GitHubUrl = gitHubUrl;
            FacebookUrl = facebookUrl;
            Interests = interests;
            FavoriteEventIds = favoriteEventIds;
            RegisteredEventIds = registeredEventIds;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }
    }
} 