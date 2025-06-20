using System;
using System.Collections.Generic;
using System.Linq;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Domain.Entities
{
    public class Student : Entity
    {
        public Guid UserId { get; private set; }
        public string Email { get; private set; }
        public DateTime JoinedDate { get; private set; }
        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public string? Bio { get; private set; }
        public string? AvatarUrl { get; private set; }
        public string University { get; private set; }
        public string Faculty { get; private set; }
        public string Specialization { get; private set; }
        public int StudyYear { get; private set; }
        public EducationLevel EducationLevel { get; private set; }
        public string? LinkedInUrl { get; private set; }
        public string? GitHubUrl { get; private set; }
        public string? FacebookUrl { get; private set; }
        public List<string> Interests { get; private set; } = new List<string>();
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }

        // Navigation properties
        public virtual User User { get; private set; } = null!;
        public virtual ICollection<StudentFavoriteEvent> FavoriteEvents { get; private set; } = new List<StudentFavoriteEvent>();
        public virtual ICollection<StudentEventRegistration> EventRegistrations { get; private set; } = new List<StudentEventRegistration>();

        private Student() { } // For EF Core

        public Student(
            Guid userId,
            string email,
            string firstName,
            string lastName,
            string university,
            string faculty,
            string specialization,
            int studyYear,
            EducationLevel educationLevel) : base(Guid.NewGuid())
        {
            UserId = userId;
            Email = email;
            JoinedDate = DateTime.UtcNow;
            FirstName = firstName;
            LastName = lastName;
            University = university;
            Faculty = faculty;
            Specialization = specialization;
            StudyYear = studyYear;
            EducationLevel = educationLevel;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateProfile(
            string firstName,
            string lastName,
            string? bio,
            string university,
            string faculty,
            string specialization,
            int studyYear,
            EducationLevel educationLevel,
            string? linkedInUrl,
            string? gitHubUrl,
            string? facebookUrl)
        {
            FirstName = firstName;
            LastName = lastName;
            Bio = bio;
            University = university;
            Faculty = faculty;
            Specialization = specialization;
            StudyYear = studyYear;
            EducationLevel = educationLevel;
            LinkedInUrl = linkedInUrl;
            GitHubUrl = gitHubUrl;
            FacebookUrl = facebookUrl;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateAvatar(string? avatarUrl)
        {
            AvatarUrl = avatarUrl;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateInterests(List<string> interests)
        {
            Interests = interests ?? new List<string>();
            UpdatedAt = DateTime.UtcNow;
        }

        public void AddFavoriteEvent(Guid eventId)
        {
            if (FavoriteEvents.All(fe => fe.EventId != eventId))
            {
                var favoriteEvent = new StudentFavoriteEvent(Id, eventId);
                FavoriteEvents.Add(favoriteEvent);
                UpdatedAt = DateTime.UtcNow;
            }
        }

        public void RemoveFavoriteEvent(Guid eventId)
        {
            var favoriteEvent = FavoriteEvents.FirstOrDefault(fe => fe.EventId == eventId);
            if (favoriteEvent != null)
            {
                FavoriteEvents.Remove(favoriteEvent);
                UpdatedAt = DateTime.UtcNow;
            }
        }

        public void RegisterForEvent(Guid eventId)
        {
            if (EventRegistrations.All(er => er.EventId != eventId))
            {
                var registration = new StudentEventRegistration(Id, eventId);
                EventRegistrations.Add(registration);
                UpdatedAt = DateTime.UtcNow;
            }
        }

        public void UnregisterFromEvent(Guid eventId)
        {
            var registration = EventRegistrations.FirstOrDefault(er => er.EventId == eventId);
            if (registration != null)
            {
                EventRegistrations.Remove(registration);
                UpdatedAt = DateTime.UtcNow;
            }
        }
    }
} 