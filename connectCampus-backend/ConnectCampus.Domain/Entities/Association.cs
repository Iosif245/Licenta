using System;
using System.Collections.Generic;
using System.Linq;
using ConnectCampus.Domain.Common;

namespace ConnectCampus.Domain.Entities
{
    public class Association : Entity
    {
        public Guid UserId { get; private set; }
        public string Name { get; private set; }
        public string Slug { get; private set; }
        public string Description { get; private set; }
        public string Logo { get; private set; }
        public string CoverImage { get; private set; }
        public string Category { get; private set; }
        public int FoundedYear { get; private set; }
        public bool IsVerified { get; private set; }
        public int Events { get; private set; }
        public int? UpcomingEventsCount { get; private set; }
        public int? Followers { get; private set; }
        public string? Location { get; private set; }
        public string? Website { get; private set; }
        public List<string> Tags { get; private set; } = new List<string>();
        public string Email { get; private set; }
        public string? Phone { get; private set; }
        public string? Address { get; private set; }
        public string? Facebook { get; private set; }
        public string? Twitter { get; private set; }
        public string? Instagram { get; private set; }
        public string? LinkedIn { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }

        // Navigation properties - replacing ID lists with actual entities
        public virtual User User { get; private set; } = null!;
        public virtual ICollection<Event> AssociationEvents { get; private set; } = new List<Event>();
        public virtual ICollection<Announcement> Announcements { get; private set; } = new List<Announcement>();
        public virtual ICollection<Follow> FollowersCollection { get; private set; } = new List<Follow>();

        private Association() { } // For EF Core

        public Association(
            Guid userId,
            string name,
            string slug,
            string description,
            string logo,
            string coverImage,
            string category,
            int foundedYear,
            string email) : base(Guid.NewGuid())
        {
            UserId = userId;
            Name = name;
            Slug = slug;
            Description = description;
            Logo = logo;
            CoverImage = coverImage;
            Category = category;
            FoundedYear = foundedYear;
            Email = email;
            IsVerified = false;
            Events = 0;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateBasicInfo(
            string name,
            string slug,
            string description,
            string category,
            int foundedYear,
            string email)
        {
            Name = name;
            Slug = slug;
            Description = description;
            Category = category;
            FoundedYear = foundedYear;
            Email = email;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateImages(string logo, string coverImage)
        {
            Logo = logo;
            CoverImage = coverImage;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateContactInfo(
            string? location,
            string? website,
            string? phone,
            string? address,
            string? facebook,
            string? twitter,
            string? instagram,
            string? linkedIn)
        {
            Location = location;
            Website = website;
            Phone = phone;
            Address = address;
            Facebook = facebook;
            Twitter = twitter;
            Instagram = instagram;
            LinkedIn = linkedIn;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateTags(List<string> tags)
        {
            Tags = tags ?? new List<string>();
            UpdatedAt = DateTime.UtcNow;
        }

        public void SetVerification(bool isVerified)
        {
            IsVerified = isVerified;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateStats()
        {
            Events = AssociationEvents.Count;
            UpcomingEventsCount = AssociationEvents.Count(e => e.StartDate > DateTime.UtcNow);
            Followers = FollowersCollection.Count;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateFollowerCount(int followerCount)
        {
            Followers = followerCount >= 0 ? followerCount : 0;
            UpdatedAt = DateTime.UtcNow;
        }

        public void AddEvent(Event eventItem)
        {
            AssociationEvents.Add(eventItem);
            UpdateStats();
        }

        public void RemoveEvent(Event eventItem)
        {
            AssociationEvents.Remove(eventItem);
            UpdateStats();
        }

        public void AddAnnouncement(Announcement announcement)
        {
            Announcements.Add(announcement);
            UpdatedAt = DateTime.UtcNow;
        }

        public void RemoveAnnouncement(Announcement announcement)
        {
            Announcements.Remove(announcement);
            UpdatedAt = DateTime.UtcNow;
        }
    }
} 