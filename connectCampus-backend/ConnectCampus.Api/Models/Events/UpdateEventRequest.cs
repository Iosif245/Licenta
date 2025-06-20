using System;
using System.Collections.Generic;
using ConnectCampus.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Api.Models.Events
{
    public class UpdateEventRequest
    {
        /// <summary>
        /// The title of the event
        /// </summary>
        public string Title { get; set; } = null!;
        
        /// <summary>
        /// The description of the event
        /// </summary>
        public string Description { get; set; } = null!;
        
        /// <summary>
        /// Cover image file for the event
        /// </summary>
        public IFormFile? CoverImage { get; set; }
        
        /// <summary>
        /// URL to the existing event cover image (used when no new file is uploaded)
        /// </summary>
        public string? CoverImageUrl { get; set; }
        
        /// <summary>
        /// Start date and time of the event
        /// </summary>
        public DateTime StartDate { get; set; }
        
        /// <summary>
        /// End date and time of the event
        /// </summary>
        public DateTime EndDate { get; set; }
        
        /// <summary>
        /// Timezone of the event (e.g. "Europe/Bucharest")
        /// </summary>
        public string Timezone { get; set; } = null!;
        
        /// <summary>
        /// Physical or virtual location of the event
        /// </summary>
        public string Location { get; set; } = null!;
        
        /// <summary>
        /// Main category of the event
        /// </summary>
        public string Category { get; set; } = null!;
        
        /// <summary>
        /// Tags related to the event
        /// </summary>
        public List<string>? Tags { get; set; }
        
        /// <summary>
        /// Maximum number of attendees
        /// </summary>
        public int Capacity { get; set; }
        
        /// <summary>
        /// Whether the event is public or private
        /// </summary>
        public bool IsPublic { get; set; }
        
        /// <summary>
        /// Whether the event is featured
        /// </summary>
        public bool IsFeatured { get; set; }
        
        /// <summary>
        /// Whether registration is required to attend
        /// </summary>
        public bool RegistrationRequired { get; set; }
        
        /// <summary>
        /// Deadline for registration
        /// </summary>
        public DateTime? RegistrationDeadline { get; set; }
        
        /// <summary>
        /// External registration URL, if applicable
        /// </summary>
        public string? RegistrationUrl { get; set; }
        
        /// <summary>
        /// Price of the event
        /// </summary>
        public decimal? Price { get; set; }
        
        /// <summary>
        /// Whether the event is free
        /// </summary>
        public bool IsFree { get; set; }
        
        /// <summary>
        /// Payment method for paid events
        /// </summary>
        public string? PaymentMethod { get; set; }
        
        /// <summary>
        /// Contact email for the event
        /// </summary>
        public string? ContactEmail { get; set; }
        
        /// <summary>
        /// Event status
        /// </summary>
        public EventStatus Status { get; set; }
        
        /// <summary>
        /// Maximum number of attendees (null for unlimited)
        /// </summary>
        public int? MaxAttendees { get; set; }
        
        /// <summary>
        /// Type of event
        /// </summary>
        public EventType Type { get; set; }
    }
} 