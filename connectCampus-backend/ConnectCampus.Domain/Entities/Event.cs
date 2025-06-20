using System;
using System.Collections.Generic;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Domain.Entities
{
    public class Event : Entity
    {
        public Guid AssociationId { get; private set; }
        public string Title { get; private set; }
        public string Slug { get; private set; }
        public string Description { get; private set; }
        public string CoverImageUrl { get; private set; }
        public DateTime StartDate { get; private set; }
        public DateTime EndDate { get; private set; }
        public string Timezone { get; private set; }
        public string Location { get; private set; }
        public string Category { get; private set; }
        public List<string> Tags { get; private set; }
        public int Capacity { get; private set; }
        public bool IsPublic { get; private set; }
        public bool IsFeatured { get; private set; }
        public bool RegistrationRequired { get; private set; }
        public DateTime? RegistrationDeadline { get; private set; }
        public string RegistrationUrl { get; private set; }
        public decimal? Price { get; private set; }
        public bool IsFree { get; private set; }
        public string PaymentMethod { get; private set; }
        public string ContactEmail { get; private set; }
        public EventStatus Status { get; private set; }
        public int AttendeesCount { get; private set; }
        public int? MaxAttendees { get; private set; }
        public string AssociationName { get; private set; }
        public string AssociationLogo { get; private set; }
        public List<string> Announcements { get; private set; }
        public EventType Type { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }
        
        // Navigation property
        public virtual Association Association { get; private set; }
        
        // For EF Core
        private Event() : base(Guid.NewGuid())
        {
            Tags = new List<string>();
            Announcements = new List<string>();
        }
        
        public Event(
            Guid id,
            Guid associationId,
            string title,
            string coverImageUrl,
            string slug,
            string description,
            DateTime startDate,
            DateTime endDate,
            string timezone,
            string location,
            string category,
            List<string> tags,
            int capacity,
            bool isPublic,
            bool isFeatured,
            bool registrationRequired,
            DateTime? registrationDeadline,
            string registrationUrl,
            decimal? price,
            bool isFree,
            string paymentMethod,
            string contactEmail,
            EventStatus status,
            string associationName,
            string associationLogo,
            EventType type,
            int? maxAttendees = null) : base(id)
        {
            AssociationId = associationId;
            Title = title;
            CoverImageUrl = coverImageUrl;
            Slug = slug;
            Description = description;
            StartDate = startDate;
            EndDate = endDate;
            Timezone = timezone;
            Location = location;
            Category = category;
            Tags = tags ?? new List<string>();
            Capacity = capacity;
            IsPublic = isPublic;
            IsFeatured = isFeatured;
            RegistrationRequired = registrationRequired;
            RegistrationDeadline = registrationDeadline;
            RegistrationUrl = registrationUrl;
            Price = price;
            IsFree = isFree;
            PaymentMethod = paymentMethod;
            ContactEmail = contactEmail;
            Status = status;
            AttendeesCount = 0;
            MaxAttendees = maxAttendees;
            AssociationName = associationName;
            AssociationLogo = associationLogo;
            Announcements = new List<string>();
            Type = type;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Update(
            string title,
            string description,
            DateTime startDate,
            DateTime endDate,
            string timezone,
            string location,
            string category,
            List<string> tags,
            int capacity,
            bool isPublic,
            bool isFeatured,
            bool registrationRequired,
            DateTime? registrationDeadline,
            string registrationUrl,
            decimal? price,
            bool isFree,
            string paymentMethod,
            string contactEmail,
            EventStatus status,
            EventType type,
            int? maxAttendees = null)
        {
            Title = title;
            Description = description;
            StartDate = startDate;
            EndDate = endDate;
            Timezone = timezone;
            Location = location;
            Category = category;
            Tags = tags ?? new List<string>();
            Capacity = capacity;
            IsPublic = isPublic;
            IsFeatured = isFeatured;
            RegistrationRequired = registrationRequired;
            RegistrationDeadline = registrationDeadline;
            RegistrationUrl = registrationUrl;
            Price = price;
            IsFree = isFree;
            PaymentMethod = paymentMethod;
            ContactEmail = contactEmail;
            Status = status;
            MaxAttendees = maxAttendees;
            Type = type;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateAttendeeCount(int count)
        {
            AttendeesCount = count;
            UpdatedAt = DateTime.UtcNow;
        }

        public void AddAnnouncement(string announcement)
        {
            if (!string.IsNullOrWhiteSpace(announcement))
            {
                Announcements.Add(announcement);
                UpdatedAt = DateTime.UtcNow;
            }
        }

        public void UpdateAssociation(string name, string logo)
        {
            AssociationName = name;
            AssociationLogo = logo;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateCoverImage(string coverImageUrl)
        {
            CoverImageUrl = coverImageUrl;
            UpdatedAt = DateTime.UtcNow;
        }

        public void MarkAsCompleted()
        {
            Status = EventStatus.Completed;
            UpdatedAt = DateTime.UtcNow;
        }
    }
} 