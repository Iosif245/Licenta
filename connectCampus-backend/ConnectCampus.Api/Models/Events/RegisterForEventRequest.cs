using System;
using System.ComponentModel.DataAnnotations;

namespace ConnectCampus.Api.Models.Events
{
    public class RegisterForEventRequest
    {
        /// <summary>
        /// The ID of the student registering for the event
        /// </summary>
        [Required]
        public Guid StudentId { get; set; }
    }
} 